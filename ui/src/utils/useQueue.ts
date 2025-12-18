// useQueue.ts (Composable)
import { ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'
import { WS_BASE_URL, API_BASE_URL } from '@/config/env'

export function useQueue(
  username: Ref<string | null>,
  playerColor: Ref<string>,
  boardSize: Ref<string>,
  scope: Ref<string>,
  csrfToken: Ref<string | null>
) {
  const router = useRouter()
  const isQueueing = ref(false)
  const joinCode = ref('')

  async function joinQueue() {
    const startTime = new Date().toISOString()

    try {
      console.log(`[${startTime}] Sending join-queue request for player:`, playerColor.value)

      const socket = new WebSocket(`${WS_BASE_URL}/queue-ws`)

      socket.onopen = () => {
        console.log(`[${startTime}] WebSocket connected`)
        isQueueing.value = true

        const joinQueueMsg = {
          playerId: username.value,
          options: {
            player: playerColor.value,
            boardSize: boardSize.value,
            scope: scope.value
          }
        }

        socket.send(JSON.stringify(joinQueueMsg))
      }

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        console.log(`[${startTime}] WebSocket message received:`, msg)

        if (msg.type === 'matchFound') {
          console.log(`[${startTime}] Lobby found, navigating to /lobby/${msg.lobbyId}`)
          router.push(`/lobby/${msg.lobbyId}`)
          socket.close()
        }
      }

      socket.onerror = (err) => {
        console.error('WebSocket error:', err)
      }

      socket.onclose = () => {
        isQueueing.value = false
        console.log(`[${startTime}] WebSocket closed`)
      }
    } catch (err) {
      console.error('Error joining queue:', err)
    } finally {
      isQueueing.value = false
    }
  }

  async function joinOrQueue() {
    const formData = new URLSearchParams({
      player: playerColor.value,
      boardSize: boardSize.value,
      scope: scope.value
    })
    if (username.value == undefined || username.value?.trim() == ''){
      showToast('Please enter a username', 'warning')
      return
    }

    if (scope.value === 'Public') {
      joinQueue()
    } else {
      const response = await fetch(`${API_BASE_URL}/lobby`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Csrf-Token': csrfToken.value ?? ''
        },
        body: formData
      })

      if (response.redirected) {
        const url = new URL(response.url)
        const lobbyId = url.pathname.split('/').pop()
        router.push(`/lobby/${lobbyId}`)
      } else {
        showToast(await response.text(), 'danger')
      }
    }
  }

  function joinLobby() {
    if (joinCode.value.trim() === '') {
      showToast('Please enter a lobby code', 'warning')
      return
    }
    if (username.value == undefined || username.value?.trim() == ''){
      showToast('Please enter a username', 'warning')
      return
    }

    router.push(`/lobby/${joinCode.value}`)
  }

  return {
    isQueueing,
    joinCode,
    joinQueue,
    joinOrQueue,
    joinLobby
  }
}
