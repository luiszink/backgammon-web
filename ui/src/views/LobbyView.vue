<template>
    <div class="lobby-wrapper">
  <ThemeToggle />
  <div class="lobby">
  <StatusPanel
    v-if="lobbyState"
    :lobbyId="lobbyId"
    :state="lobbyState"
    @leave="leaveLobby"
  />
    <chat-window :messages="messages" @sendMessage="sendMessage" />
    <div v-if="gameState">
      <div v-if="!gameState.game">
        <p>Waiting for game data...</p>
        <p>Debug: {{ gameState }}</p>
      </div>
      <div v-else id="game">
        <Board :board="gameState.game" :send-move="sendMove"/>
        <Dice v-if="gameState.dice" :dice="gameState.dice" />
      </div>
    </div>
    <div v-else>
      <p>Waiting for game to start...</p>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { useLobbyWebSocket, type BoardState } from '../utils/useLobbyWebSocket';
import ChatWindow from "./ChatWindow.vue";
import Board from './Board.vue' 
import Dice from '../components/Dice.vue'
import ThemeToggle from '../components/ThemeToggle.vue'
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useApi } from '@/utils/useApi'
import StatusPanel from "./StatusPanel.vue";


const route = useRoute();
const lobbyId = route.params.id as string;

const {
  username,
  fetchUsername,
} = useApi()

onMounted(async () => {
  console.log('Lobby ID:', lobbyId)
  console.log('Username before fetch:', username.value)
  await fetchUsername()
  console.log('Username after fetch:', username.value)
})

// Call composable
const { messages, player, gameState, lobbyState, connected, sendMessage, sendMove, close } =
  useLobbyWebSocket(lobbyId, username);

const router = useRouter()
function leaveLobby() {
  close()
  router.push('/')
}
</script>


<style scoped>
.lobby-wrapper {
  background: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
  position: relative;
}

/* Background image support */
.lobby-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--background-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
  pointer-events: none;
  z-index: 0;
}

/* Hide background layer if no image is set */
.lobby-wrapper::before:not([style*="background-image"]) {
  display: none;
}

/* Classic Wood uses background image like other themes */
[data-theme="classic-wood"] .lobby-wrapper::before {
  opacity: 0.25;
}

/* Noise layer for Classic Wood theme */
[data-theme="classic-wood"] .lobby::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  z-index: 0;
}

.lobby {
  position: relative;
  z-index: 1;
}

.leave-btn {
  position: absolute;
  top: 16px;
  right: 16px;

  padding: 8px 16px;
  font-size: 14px;

  background: var(--button-danger, #b33);
  color: white;
  border: none;
  border-radius: 6px;

  cursor: pointer;
  transition: background 0.2s;
}

.leave-btn:hover {
  background: var(--button-danger-hover, #922);
}

.lobby {
  position: relative;
  min-height: 100vh;
  background: transparent;
}

#game {
  position: relative;
}
</style>
