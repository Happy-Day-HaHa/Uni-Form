export default function GenerateButton({ isDrawing, hasResults, onClick }) {
  const label = isDrawing ? '번호를 섞는 중...' : hasResults ? '다시 추첨하기' : '행운 번호 추첨하기'

  return (
    <button className="draw-btn" type="button" onClick={onClick} disabled={isDrawing}>
      {label}
    </button>
  )
}
