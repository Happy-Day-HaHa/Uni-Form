import LottoBall from './LottoBall.jsx'

export default function LottoResult({ results, isDrawing }) {
  if (isDrawing) {
    return <div className="empty"><div className="empty-icon">⌁</div><p>번호를 고르는 중.</p></div>
  }

  if (!results.length) {
    return <div className="empty"><div className="empty-icon">✦</div><p>버튼을 눌러주세요.</p></div>
  }

  return results.map((game, gameIndex) => (
    <div className="game" key={`${gameIndex}-${game.numbers.join('-')}-${game.bonus}`}>
      <span className="game-label">{String.fromCharCode(65 + gameIndex)}</span>
      <div className="balls">
        {game.numbers.map((number, index) => (
          <LottoBall key={number} number={number} delay={(gameIndex * 70) + (index * 45)} />
        ))}
        <span className="bonus-plus" aria-hidden="true">+</span>
        <span className="bonus-ball" aria-label={`보너스 번호 ${game.bonus}`}>
          <LottoBall number={game.bonus} delay={(gameIndex * 70) + 270} />
        </span>
      </div>
    </div>
  ))
}
