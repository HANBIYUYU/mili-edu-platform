export default function Footer() {
  return (
    <footer
      style={{
        background: '#2C3E33',
        padding: '60px 24px 40px',
      }}
    >
      <div className="container" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#FAF9F6',
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            <img src="/logo.png" alt="米粒支教社" style={{ height: 54, width: 'auto', marginBottom: 12 }} /><br />米粒支教社
          </div>

          <p
            style={{
              fontSize: 14,
              color: '#8A9E8F',
              marginBottom: 32,
            }}
          >
            点亮每一颗微光，汇聚成改变世界的力量
          </p>

          {/* 快捷链接 */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              marginBottom: 40,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { label: '关于我们', href: '#about' },
              { label: '示范课程', href: '#videos' },
              { label: '推普资料', href: '#materials' },
              { label: '儿童画展', href: '#gallery' },
              { label: '联系我们', href: '#contact' },
            ].map(
              ({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    fontSize: 14,
                    color: '#8A9E8F',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLAnchorElement).style.color = '#6BAF92';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLAnchorElement).style.color = '#8A9E8F';
                  }}
                >
                  {label}
                </a>
              )
            )}
          </div>

          {/* 分割线 */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              height: 1,
              background: 'rgba(138, 158, 143, 0.2)',
              marginBottom: 24,
            }}
          />

          {/* 版权 */}
          <div
            style={{
              fontSize: 13,
              color: '#5A7A6A',
            }}
          >
            © 2026 米粒支教社 · 保留所有权利
          </div>

          <a
            href="/admin/login"
            style={{
              fontSize: 12,
              color: '#5A7A6A',
              textDecoration: 'none',
              marginTop: 12,
              opacity: 0.5,
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLAnchorElement).style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLAnchorElement).style.opacity = '0.5';
            }}
          >
            管理入口
          </a>
        </div>
      </div>
    </footer>
  );
}
