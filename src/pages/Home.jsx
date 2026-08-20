import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import LottoResult from '../components/LottoResult.jsx'
import GenerateButton from '../components/GenerateButton.jsx'
import { generateLotto } from '../utils/generateLotto.js'

export default function Home() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [gameCount, setGameCount] = useState(5)
  const [excluded, setExcluded] = useState(new Set())
  const [excludeInput, setExcludeInput] = useState('')
  const [results, setResults] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)
  const drawTimer = useRef(null)

  useEffect(() => () => {
    clearTimeout(toastTimer.current)
    clearTimeout(drawTimer.current)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('lucky-lab-theme', theme)
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#141613' : '#f7f4ee'
  }, [theme])

  function showToast(message) {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1800)
  }

  function runDraw() {
    setIsDrawing(true)
    clearTimeout(drawTimer.current)
    drawTimer.current = setTimeout(() => {
      setResults(Array.from({ length: gameCount }, () => generateLotto(excluded)))
      setIsDrawing(false)
    }, 650)
  }

  function addExcluded() {
    const value = Number(excludeInput)
    if (!Number.isInteger(value) || value < 1 || value > 45) return showToast('1부터 45 사이의 숫자를 입력해 주세요.')
    if (excluded.has(value)) return showToast('이미 제외한 번호예요.')
    if (excluded.size >= 10) return showToast('제외 번호는 최대 10개까지 가능해요.')
    setExcluded(new Set([...excluded, value]))
    setExcludeInput('')
  }

  function removeExcluded(number) {
    const next = new Set(excluded)
    next.delete(number)
    setExcluded(next)
  }

  const sortedExcluded = [...excluded].sort((a, b) => a - b)

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div className="wrap" id="top">
        <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

        <main>
          <section className="hero" aria-labelledby="heroTitle">
            <div className="hero-copy">
              <div className="eyebrow">오늘도, 가볍게 한 게임</div>
              <h1 id="heroTitle">번호는 우리가.<br />설렘은 당신이.</h1>
              <p className="intro">1부터 45까지. 생각은 짧게,<br />번호는 빠르고 공정하게.</p>
              <div className="hero-actions">
                <a className="primary-cta" href="#draw">번호 뽑기 <span aria-hidden="true">↗</span></a>
                <a className="secondary-cta" href="#how">왜 공정한가요?</a>
              </div>
            </div>
            <div className="hero-visual" aria-label="로또 번호 생성기 미리보기">
              <span className="visual-sticker">100% RANDOM</span>
              <img className="ticket-image" src="/images/lotto-ticket-editorial.jpg" alt="손으로 번호를 표시한 로또 용지 스타일의 그래픽" />
              <div className="visual-burst" aria-hidden="true">✦</div>
              <p>오늘의 번호를 기록하고, 가볍게 즐겨보세요.</p>
            </div>
          </section>

          <section className="lab" id="draw" aria-label="로또 번호 추첨기">
            <div>
              <div className="panel machine">
                <div className="machine-head">
                  <div><div className="section-label">Draw result</div><h2>{isDrawing ? '두근두근...' : results.length ? '행운 번호가 나왔어요!' : '준비 완료!'}</h2></div>
                  <div className="status">{isDrawing ? '추첨 중' : results.length ? '추첨 완료' : '추첨 대기'}</div>
                </div>
                <div className="result-list" aria-live="polite">
                  <LottoResult results={results} isDrawing={isDrawing} />
                </div>
                <div className="machine-footer">
                  <GenerateButton isDrawing={isDrawing} hasResults={results.length > 0} onClick={runDraw} />
                </div>
              </div>
            </div>

            <aside className="panel controls">
              <div className="section-label">Draw settings</div>
              <div className="control-group">
                <div className="control-title"><span>게임 수</span><span className="hint">한 번에 추첨</span></div>
                <div className="segmented">
                  {[1, 3, 5].map((count) => <button type="button" key={count} className={gameCount === count ? 'active' : ''} onClick={() => setGameCount(count)}>{count}게임</button>)}
                </div>
              </div>
              <div className="control-group">
                <div className="control-title"><span>제외 번호</span><span className="hint">{excluded.size}/10</span></div>
                <div className="exclude-wrap">
                  <input value={excludeInput} onChange={(event) => setExcludeInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addExcluded()} type="number" min="1" max="45" inputMode="numeric" placeholder="1–45 숫자 입력" aria-label="제외할 번호" />
                  <button type="button" onClick={addExcluded}>추가</button>
                </div>
                <div className="chips">
                  {sortedExcluded.length ? sortedExcluded.map((number) => <button className="chip" type="button" key={number} onClick={() => removeExcluded(number)} aria-label={`제외 번호 ${number} 삭제`}>{number} ×</button>) : <span className="no-chip">선택한 제외 번호가 없어요</span>}
                </div>
              </div>
              <div className="note" id="how"><span>◉</span><span><strong>어떻게 작동하나요?</strong><br />모든 조합의 당첨 확률은 동일하며, 브라우저의 암호학적 난수로 번호를 선택합니다.</span></div>
            </aside>
          </section>

        </main>

        <footer><span>© 2026 행운연구소</span><span>재미를 위한 번호 생성 도구이며 당첨을 보장하지 않습니다.</span></footer>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  )
}
