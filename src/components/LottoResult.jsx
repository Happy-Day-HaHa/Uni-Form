import LottoBall from './LottoBall.jsx'

export default function LottoResult({ results, isDrawing }) {
  if (isDrawing) {
    return <div className="empty"><div className="empty-icon">⌁</div><p>번호를 고르는 중.</p></div>
  }

  if (!results.length) {
    return <div className="empty"><div className="empty-icon">✦</div><p>버튼을 눌러주세요.</p></div>
  }

  return results.map((game, gameIndex) => (
    <div className="game" key={`${gameIndex}-${game.join('-')}`}>
      <span className="game-label">{String.fromCharCode(65 + gameIndex)}</span>
      <div className="balls">
        {game.map((number, index) => (
          <LottoBall key={number} number={number} delay={(gameIndex * 70) + (index * 45)} />
        ))}
      </div>
    </div>
  ))
}
