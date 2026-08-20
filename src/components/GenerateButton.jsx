export default function GenerateButton({ isDrawing, hasResults, onClick }) {
  const label = isDrawing ? '뽑는 중.' : hasResults ? '다시 뽑기' : '번호 뽑기'

  return (
    <button className="draw-btn" type="button" onClick={onClick} disabled={isDrawing}>
      {label}
    </button>
  )
}
