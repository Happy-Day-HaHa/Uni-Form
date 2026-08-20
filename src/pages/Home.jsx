import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import LottoResult from '../components/LottoResult.jsx'
import GenerateButton from '../components/GenerateButton.jsx'
import { generateLotto } from '../utils/generateLotto.js'

export default function Home() {
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
        <Header />

        <main>
          <section className="hero" id="draw" aria-labelledby="heroTitle">
            <div className="hero-core">
              <div className="hero-copy">
                <div className="eyebrow">LOTTO 6 / 45</div>
                <h1 id="heroTitle">JUST PICK.</h1>
                <p className="intro">생각은 짧게. 번호는 바로.</p>
              </div>

              <div className="panel machine" aria-label="로또 번호 추첨기">
                <div className="machine-head">
                  <div><div className="section-label">6 NUMBERS + BONUS</div><h2>{isDrawing ? '섞는 중.' : results.length ? '이 번호로.' : '준비됐어요.'}</h2></div>
                  <div className="status">{isDrawing ? 'PICKING' : results.length ? 'DONE' : 'READY'}</div>
                </div>
                <div className="result-list" aria-live="polite">
                  <LottoResult results={results} isDrawing={isDrawing} />
                </div>
                <div className="quick-controls">
                  <div className="segmented" aria-label="게임 수">
                    {[1, 3, 5].map((count) => <button type="button" key={count} className={gameCount === count ? 'active' : ''} onClick={() => setGameCount(count)}>{count}게임</button>)}
                  </div>
                  <div className="exclude-wrap">
                    <input value={excludeInput} onChange={(event) => setExcludeInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addExcluded()} type="number" min="1" max="45" inputMode="numeric" placeholder="제외 번호 (1–45)" aria-label="제외할 번호" />
                    <button type="button" onClick={addExcluded}>제외</button>
                  </div>
                </div>
                <div className="chips">
                  {sortedExcluded.length ? sortedExcluded.map((number) => <button className="chip" type="button" key={number} onClick={() => removeExcluded(number)} aria-label={`제외 번호 ${number} 삭제`}>{number} ×</button>) : <span className="no-chip">선택한 제외 번호가 없어요</span>}
                </div>
                <div className="machine-footer">
                  <GenerateButton isDrawing={isDrawing} hasResults={results.length > 0} onClick={runDraw} />
                </div>
              </div>
            </div>

            <div className="hero-visual" aria-label="간결한 번호표 그래픽">
              <span className="visual-sticker">NO PLAN<br />JUST PICK</span>
              <img className="ticket-image" src="/images/lotto-ticket-minimal-v2.jpg" alt="날짜나 개인정보 없이 번호만 적힌 미니멀 번호표" />
              <div className="visual-burst" aria-hidden="true">✦</div>
            </div>
          </section>

        </main>

        <footer><span>© 2026 행운연구소</span><span>재미를 위한 번호 생성 도구이며 당첨을 보장하지 않습니다.</span></footer>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  )
}
