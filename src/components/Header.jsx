export default function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="site-header">
      <div className="brand"><span className="brand-mark">✦</span> 행운연구소</div>
      <div className="header-actions">
        <div className="badge">LOTTO 6/45</div>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`${isDark ? '화이트' : '다크'} 모드로 전환`}
          aria-pressed={isDark}
        >
          <span className="theme-icon" aria-hidden="true">◐</span>
          <span>{isDark ? '화이트 모드' : '다크 모드'}</span>
        </button>
      </div>
    </header>
  )
}
