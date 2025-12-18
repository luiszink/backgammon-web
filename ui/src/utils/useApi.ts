import { ref } from 'vue'
import axios from 'axios'
import { API_BASE_URL } from '@/config/env'

// Configure axios to use the API base URL
axios.defaults.baseURL = API_BASE_URL

export function useApi() {
  const csrfToken = ref<string | null>(null)
  const openLobbyCount = ref<number | null>(null)
  const username = ref<string | null>(null)

  async function fetchCsrfToken() {
    const res = await axios.get('/csrf-token')
    csrfToken.value = res.data
    return csrfToken.value
  }

  async function fetchLobbyCount() {
    const res = await axios.get('/get-lobby-count')
    openLobbyCount.value = parseInt(res.data)
    return openLobbyCount.value
  }

  async function fetchUsername() {
    const res = await axios.get('/get-username')
    username.value = res.data || null
    return username.value
  }

  async function updateUsername(newName: string) {
    if (!csrfToken.value) await fetchCsrfToken()

    const res = await axios.post(
      '/update-username',
      new URLSearchParams({ username: newName }),
      { headers: { 'Csrf-Token': csrfToken.value } }
    )

    username.value = newName
    return res.data
  }

  async function getCsrfToken() {
    if (!csrfToken.value) await fetchCsrfToken()
    return csrfToken.value
  }

  async function getOpenLobbyCount() {
    if (openLobbyCount.value === null) await fetchLobbyCount()
    return openLobbyCount.value
  }

  async function getUsername() {
    if (!username.value) await fetchUsername()
    return username.value
  }

  return {
    csrfToken,
    openLobbyCount,
    username,

    fetchCsrfToken,
    fetchLobbyCount,
    fetchUsername,

    getCsrfToken,
    getOpenLobbyCount,
    getUsername,

    updateUsername,
  }
}
