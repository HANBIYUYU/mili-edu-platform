# 大文件分片上传（/api/upload-chunk）端到端验证 —— 生产环境
# 用法：pwsh -File scripts/verify-direct-upload.ps1 [-BaseUrl https://mili-edu.cn] [-SizeMb 130]
param([string]$BaseUrl = 'https://mili-edu.cn', [int]$SizeMb = 130)

$ErrorActionPreference = 'Stop'
$dir = Join-Path $env:TEMP 'mili-chunk-verify'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$jar = Join-Path $dir 'cookies.txt'
$json = Join-Path $dir 'body.json'

# 1) 登录
$loginBody = @{ username = 'admin'; password = 'mili2026' } | ConvertTo-Json
$resp = Invoke-WebRequest -Uri "$BaseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType 'application/json' -UseBasicParsing -TimeoutSec 30
$token = [regex]::Match($resp.Headers['Set-Cookie'], 'token=([^;]+)').Groups[1].Value
if (-not $token) { throw '登录失败（密码可能已改）' }
$hostName = ([uri]$BaseUrl).Host
[IO.File]::WriteAllLines($jar, @('# Netscape HTTP Cookie File', "$hostName`tFALSE`t/`tFALSE`t0`ttoken`t$token"))
Write-Output '[1] 登录 OK'

# 2) init
$total = $SizeMb * 1024 * 1024
[IO.File]::WriteAllText($json, (@{ dir = 'videos'; name = 'verify-chunk.mp4'; size = $total } | ConvertTo-Json))
$init = curl.exe -s -b $jar -H "Content-Type: application/json" --data-binary "@$json" "$BaseUrl/api/upload-chunk/init"
$io = $init | ConvertFrom-Json
$key = $io.data.key
$uploadId = $io.data.uploadId
$count = [int]$io.data.count
Write-Output ('[2] init OK 片数=' + $count + ' key=' + $key)

# 3) 上传各片（服务端要求：非尾片等长 = chunkSize）
$chunkSize = [int]$io.data.chunkSize
$parts = @()
for ($n = 1; $n -le $count; $n++) {
  $thisSize = if ($n -eq $count) { $total - ($n - 1) * $chunkSize } else { $chunkSize }
  $f = Join-Path $dir ("part$n.bin")
  [IO.File]::WriteAllBytes($f, (New-Object byte[] $thisSize))
  $r = curl.exe -s -b $jar -F "file=@$f" -F "key=$key" -F "uploadId=$uploadId" -F "partNumber=$n" "$BaseUrl/api/upload-chunk/part"
  $etag = ($r | ConvertFrom-Json).data.etag
  $parts += @{ partNumber = $n; etag = $etag }
  Write-Output ("[3] 片 $n/$count 完成")
}

# 4) complete
[IO.File]::WriteAllText($json, (@{ key = $key; uploadId = $uploadId; parts = $parts } | ConvertTo-Json -Depth 5))
$done = curl.exe -s -b $jar -H "Content-Type: application/json" --data-binary "@$json" "$BaseUrl/api/upload-chunk/complete"
Write-Output ('[4] complete -> ' + $done)

# 5) 公网 Range 206
$hdr = curl.exe -s -D - -o NUL -H 'Range: bytes=0-99' "$BaseUrl/api/files/$key"
$is206 = (($hdr | Select-String -Pattern '^HTTP/1.1 206')) -ne $null
$cr = (($hdr | Select-String -Pattern '^content-range:').Line)
Write-Output ('[5] range206=' + $is206 + ' | ' + $cr)

# 6) 清理
[IO.File]::WriteAllText($json, (@{ key = $key } | ConvertTo-Json))
$del = curl.exe -s -b $jar -X DELETE -H "Content-Type: application/json" --data-binary "@$json" "$BaseUrl/api/media"
Write-Output ('[6] cleanup -> ' + $del)

Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
Write-Output 'CHUNK UPLOAD VERIFY DONE'
