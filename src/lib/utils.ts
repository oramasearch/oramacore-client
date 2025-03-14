import type { Maybe } from './types.ts'

export const LOCAL_STORAGE_USER_ID_KEY = '___orama_anonymous_user_id'
export const LOCAL_STORAGE_SERVER_SIDE_SESSION_KEY = '___orama_server_side_session'
export const DEFAULT_TELEMETRY_FLUSH_INTERVAL = 5_000
export const DEFAULT_TELEMETRY_FLUSH_SIZE = 25

export function createRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-$'
  let result = ''

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

export function formatDuration(duration: number): string {
  if (duration < 1000) {
    return `${duration}ms`
  } else {
    const seconds = duration / 1000
    if (Number.isInteger(seconds)) {
      return `${seconds}s`
    }
    return `${seconds.toFixed(1)}s`
  }
}

export function sendBeacon(endpoint: string, body?: string): Maybe<Promise<Response>> {
  if (typeof navigator !== 'undefined') {
    if (typeof navigator.sendBeacon !== 'undefined') {
      navigator.sendBeacon(endpoint, body)
    }
    return
  }

  fetch(endpoint, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(
    () => {},
    (e) => console.log(e),
  )
}

export const hasLocalStorage = typeof localStorage !== 'undefined'

export function throttle(func: (...args: unknown[]) => unknown, limit: number) {
  let inThrottle: boolean
  return function (...args: unknown[]) {
    if (!inThrottle) {
      // @ts-ignore - 'this' has implicitly any, yes
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function debounce(func: (...args: unknown[]) => unknown, delay: number) {
  let debounceTimer: number
  return function (...args: unknown[]) {
    clearTimeout(debounceTimer)
    // @ts-ignore - 'this' has implicitly any, yes
    debounceTimer = setTimeout(() => func.apply(this, args), delay)
  }
}
