export function secureRandom(max) {
  const ceiling = Math.floor(0x100000000 / max) * max
  const random = new Uint32Array(1)

  do {
    crypto.getRandomValues(random)
  } while (random[0] >= ceiling)

  return random[0] % max
}

export function generateLotto(excluded = new Set()) {
  const pool = Array.from({ length: 45 }, (_, index) => index + 1)
    .filter((number) => !excluded.has(number))

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const target = secureRandom(index + 1)
    ;[pool[index], pool[target]] = [pool[target], pool[index]]
  }

  return pool.slice(0, 6).sort((a, b) => a - b)
}

export function getBallColor(number) {
  if (number <= 10) return 'yellow'
  if (number <= 20) return 'blue'
  if (number <= 30) return 'red'
  if (number <= 40) return 'gray'
  return 'green'
}
