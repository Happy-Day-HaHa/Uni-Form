import { useEffect, useRef, useState } from 'react'
import Header from '../components/Header.jsx'
import LottoResult from '../components/LottoResult.jsx'
import GenerateButton from '../components/GenerateButton.jsx'
import { generateLotto } from '../utils/generateLotto.js'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnpalwow'

function readSavedNumbers() {
  try {
    return JSON.parse(localStorage.getItem('lucky-lab-saved') || '[]')
  } catch {
    return []
  }
}

export default function Home() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [gameCount, setGameCount] = useState(5)
  const [excluded, setExcluded] = useState(new Set())
  const [excludeInput, setExcludeInput] = useState('')
  const [results, setResults] = useState([])
  const [saved, setSaved] = useState(readSavedNumbers)
  const [isDrawing, setIsDrawing] = useState(false)
  const [toast, setToast] = useState('')
  const [formState, setFormState] = useState({ type: '', message: '' })
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

  async function copyResults() {
    if (!results.length) return showToast('먼저 번호를 추첨해 주세요.')
    const text = results.map((game, index) => `${String.fromCharCode(65 + index)}. ${game.join(', ')}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      showToast('번호를 복사했어요!')
    } catch {
      showToast('복사할 수 없어요. 다시 시도해 주세요.')
    }
  }

  function saveResults() {
    if (!results.length) return showToast('먼저 번호를 추첨해 주세요.')
    const date = new Intl.DateTimeFormat('ko-KR', { month: 'numeric', day: 'numeric' }).format(new Date())
    const next = [...results.map((numbers) => ({ numbers, date })), ...saved].slice(0, 12)
    setSaved(next)
    localStorage.setItem('lucky-lab-saved', JSON.stringify(next))
    showToast('행운 번호를 저장했어요!')
  }

  function clearSaved() {
    setSaved([])
    localStorage.removeItem('lucky-lab-saved')
    showToast('저장한 번호를 모두 지웠어요.')
  }

  async function submitInquiry(event) {
    event.preventDefault()
    const form = event.currentTarget
    setFormState({ type: 'loading', message: '' })
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error('Form submission failed')
      form.reset()
      setFormState({ type: 'success', message: '문의가 정상적으로 접수됐어요. 확인 후 빠르게 연락드리겠습니다.' })
    } catch {
      setFormState({ type: 'error', message: '전송하지 못했어요. 잠시 후 다시 시도해 주세요.' })
    }
  }

  const sortedExcluded = [...excluded].sort((a, b) => a - b)

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div className="wrap">
        <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

        <main>
          <div className="eyebrow">Lucky number generator</div>
          <h1>오늘의 <span className="marker">행운 번호</span>를<br />실험해 보세요.</h1>
          <p className="intro">1부터 45까지, 같은 숫자 없이 공정하게.<br />가볍게 뽑고 기분 좋게 도전하세요.</p>

          <section className="lab" aria-label="로또 번호 추첨기">
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
                  <button className="icon-btn" type="button" onClick={copyResults} aria-label="결과 복사" title="결과 복사">⧉</button>
                  <button className="icon-btn" type="button" onClick={saveResults} aria-label="결과 저장" title="결과 저장">♡</button>
                </div>
              </div>

              {saved.length > 0 && (
                <section className="panel saved" aria-label="저장한 번호">
                  <div className="saved-head"><h3>저장한 행운 번호</h3><button className="clear-btn" type="button" onClick={clearSaved}>전체 지우기</button></div>
                  <div className="saved-items">
                    {saved.map((item, index) => (
                      <div className="saved-item" key={`${item.numbers.join('-')}-${index}`}><span className="saved-nums">{item.numbers.join(' · ')}</span><span className="saved-time">{item.date}</span></div>
                    ))}
                  </div>
                </section>
              )}
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
              <div className="note"><span>◉</span><span><strong>알고 계셨나요?</strong><br />모든 조합의 당첨 확률은 동일해요. 이 추첨기는 브라우저의 난수로 번호를 선택합니다.</span></div>
            </aside>
          </section>

          <section className="panel partner" id="partnership" aria-labelledby="partnerTitle">
            <div className="partner-copy">
              <div className="section-label">Partnership</div>
              <h2 id="partnerTitle">좋은 제안은<br />언제나 환영해요.</h2>
              <p className="partner-description">브랜드 협업, 광고, 콘텐츠 제휴 등<br />함께 만들고 싶은 이야기를 들려주세요.</p>
              <div className="partner-tag">보통 1–2일 안에 답변드려요</div>
            </div>
            <form className="inquiry-form" action={FORMSPREE_ENDPOINT} method="POST" onSubmit={submitInquiry}>
              <input type="hidden" name="_subject" value="[행운연구소] 새로운 제휴 문의" />
              <div className="honeypot" aria-hidden="true"><label htmlFor="website">웹사이트</label><input id="website" type="text" name="_gotcha" tabIndex="-1" autoComplete="off" /></div>
              <div className="field"><label htmlFor="inquiryName">이름 <span className="required">*</span></label><input id="inquiryName" name="name" type="text" autoComplete="name" placeholder="홍길동" required /></div>
              <div className="field"><label htmlFor="inquiryEmail">이메일 <span className="required">*</span></label><input id="inquiryEmail" name="email" type="email" autoComplete="email" placeholder="hello@example.com" required /></div>
              <div className="field"><label htmlFor="inquiryCompany">회사·브랜드</label><input id="inquiryCompany" name="company" type="text" autoComplete="organization" placeholder="선택 입력" /></div>
              <div className="field"><label htmlFor="inquiryType">문의 유형 <span className="required">*</span></label><select id="inquiryType" name="inquiry_type" defaultValue="" required><option value="" disabled>선택해 주세요</option><option>브랜드 협업</option><option>광고 문의</option><option>콘텐츠 제휴</option><option>기타</option></select></div>
              <div className="field full"><label htmlFor="inquiryMessage">문의 내용 <span className="required">*</span></label><textarea id="inquiryMessage" name="message" placeholder="제안 내용과 예상 일정 등을 자유롭게 적어주세요." required /></div>
              <label className="privacy"><input name="privacy_consent" type="checkbox" value="동의" required /><span>문의 답변을 위해 이름과 이메일을 수집·이용하는 데 동의합니다. 제출 정보는 문의 응대 목적으로만 사용됩니다.</span></label>
              <button className="form-submit" type="submit" disabled={formState.type === 'loading'}>{formState.type === 'loading' ? '문의 보내는 중...' : '제휴 문의 보내기 →'}</button>
              {formState.message && <p className={`form-status ${formState.type}`} role="status" aria-live="polite">{formState.message}</p>}
            </form>
          </section>
        </main>

        <footer><span>© 2026 행운연구소</span><span>재미를 위한 번호 생성 도구이며 당첨을 보장하지 않습니다.</span></footer>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  )
}
