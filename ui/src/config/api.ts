// API Configuration
const isProduction = import.meta.env.PROD

export const API_BASE_URL = isProduction 
  ? 'https://backgammon-backend-prd-918b3f7cf8f2.herokuapp.com'
  : ''

export const WS_BASE_URL = isProduction
  ? 'wss://backgammon-backend-prd-918b3f7cf8f2.herokuapp.com'
  : 'ws://localhost:9000'
