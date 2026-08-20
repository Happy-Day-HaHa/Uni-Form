import { getBallColor } from '../utils/generateLotto.js'

export default function LottoBall({ number, delay = 0 }) {
  return (
    <span className={`ball ${getBallColor(number)}`} style={{ animationDelay: `${delay}ms` }}>
      {number}
    </span>
  )
}
