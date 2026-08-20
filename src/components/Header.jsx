export default function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="행운연구소 홈">
        행운연구소<span className="brand-dot">.</span>
      </a>
      <nav className="site-nav" aria-label="주요 메뉴">
        <a href="#draw">번호 뽑기</a>
        <a href="#how">작동 원리</a>
      </nav>
      <div className="header-actions">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`${isDark ? '화이트' : '다크'} 모드로 전환`}
          aria-pressed={isDark}
        >
          <span className="theme-icon" aria-hidden="true">◐</span>
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
        <a className="header-cta" href="#draw">번호 뽑기</a>
      </div>
    </header>
  )
}
