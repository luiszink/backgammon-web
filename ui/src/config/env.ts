// Environment configuration for API URLs
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

// WebSocket URL (convert http(s) to ws(s))
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws')
