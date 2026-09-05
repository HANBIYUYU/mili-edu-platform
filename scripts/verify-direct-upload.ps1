# 大文件直传（S3 Multipart）端到端验证 —— 需先注入 R2_ENDPOINT / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
# 用法：pwsh -File scripts/verify-direct-upload.ps1 [-BaseUrl https://mili-edu.cn]
param([string]$BaseUrl = 'https://mili-edu.cn')

$ErrorActionPreference = 'Stop'
$mp4 = Join-Path $env:TEMP 'r2-direct-verify.mp4'
$jar = Join-Path $env:TEMP 'mili-direct-cookies.txt'
$json = Join-Path $env:TEMP 'mili-direct.json'
if (Test-Path $jar) { Remove-Item $jar -Force }

# 造一个 ~6MB 的假 mp4（S3 multipart 单片最小 5MB，满足验证）
if (-not (Test-Path $mp4)) {
  $head = [Text.Encoding]::ASCII.GetBytes('ftypisom')
  $bytes = New-Object byte[] (6 * 1024 * 1024)
  [Array]::Copy($head, $bytes, 8)
  [IO.File]::WriteAllBytes($mp4, $bytes)
}

# 1) 登录
$loginBody = @{ username = 'admin'; password = 'mili2026' } | ConvertTo-Json
$resp = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json' -UseBasicParsing -TimeoutSec 30
$token = [regex]::Match($resp.Headers['Set-Cookie'], 'token=([^;]+)').Groups[1].Value
if (-not $token) { throw '登录失败（密码可能已改，请改用实际管理员密码）' }
$hostName = ([uri]$BaseUrl).Host
[IO.File]::WriteAllLines($jar, @('# Netscape HTTP Cookie File', "$hostName`tFALSE`t/`tFALSE`t0`ttoken`t$token"))
Write-Output '[1] 登录 OK'

# 2) 配置桶 CORS（浏览器直传必需）
$cors = curl.exe -s -b $jar -X POST "$BaseUrl/api/upload-large/setup-cors"
Write-Output ('[2] CORS 配置 -> ' + $cors)

# 3) 发起 Multipart
[IO.File]::WriteAllText($json, (@{ dir = 'videos'; name = 'verify-direct.mp4'; size = 6 * 1024 * 1024 } | ConvertTo-Json))
$init = curl.exe -s -b $jar -H "Content-Type: application/json" --data-binary "@$json" "$BaseUrl/api/upload-large/init"
$initObj = $init | ConvertFrom-Json
$key = $initObj.data.key
$uploadId = $initObj.data.uploadId
$part1 = $initObj.data.parts[0]
Write-Output ('[3] init OK key=' + $key + ' uploadId=' + $uploadId.Substring(0, 16) + '… 片数=' + $initObj.data.partCount)

# 4) 用预签名 URL 直传第 1 片（模拟浏览器分片 PUT）
$putHdr = curl.exe -s -D - -o NUL -X PUT -H "Content-Type: video/mp4" --data-binary "@$mp4" $part1.url
$status = (($putHdr | Select-String -Pattern '^HTTP/1.1' | Select-Object -First 1).Line)
$etagLine = ($putHdr | Select-String -Pattern '^etag:').Line
Write-Output ('[4] 分片 PUT -> ' + $status + ' | ' + $etagLine)
$etag = (($etagLine -split ':')[1]).Trim().Trim('"')

# 5) 合并
[IO.File]::WriteAllText($json, (@{ key = $key; uploadId = $uploadId; parts = @(@{ number = 1; etag = $etag }) } | ConvertTo-Json -Depth 5))
$done = curl.exe -s -b $jar -H "Content-Type: application/json" --data-binary "@$json" "$BaseUrl/api/upload-large/complete"
Write-Output ('[5] complete -> ' + $done)

# 6) 公网可读（Range 206）
$code = curl.exe -s -o NUL -w '%{http_code}' -H 'Range: bytes=0-9' "$BaseUrl/api/files/$key"
Write-Output ('[6] 公网读取 http=' + $code + '（期望 206）')

# 7) 清理对象
[IO.File]::WriteAllText($json, (@{ key = $key } | ConvertTo-Json))
$del = curl.exe -s -b $jar -X DELETE -H "Content-Type: application/json" --data-binary "@$json" "$BaseUrl/api/media"
Write-Output ('[7] cleanup -> ' + $del)

Remove-Item $jar, $json -Force -ErrorAction SilentlyContinue
Write-Output 'DIRECT UPLOAD VERIFY DONE'
