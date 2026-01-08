// useLobbyWebSocket.ts
import { ref, reactive, onMounted, onBeforeUnmount, type Ref, watch } from "vue";
import { WS_BASE_URL } from '@/config/api';

export interface ChatMessage {
    type: string;
    user?: string;
    text?: string;
    timestamp?: string;
}

export interface BoardState {
    fields: number[];
    barWhite: number;
    barBlack: number;
}

export interface GameState {
    game: BoardState;
    dice?: number[];
    currentPlayer?: string;
}

export interface User {
    name: string;
    connected: boolean;
}

export interface LobbyState {
    white?: User;
    black?: User;
    gameStarted: boolean;
}

export function useLobbyWebSocket(lobbyId: string, username: Ref<string | null>) {
    const ws = ref<WebSocket | null>(null);
    const messages = reactive<ChatMessage[]>([]);
    const player = ref<string>("");
    const connected = ref(false);
    const gameState = ref<GameState | null>(null);
    const lobbyState = ref<LobbyState | null>(null);

    const sendMessage = (text: string) => {
        if (ws.value && text.trim() !== "") {
            ws.value.send(
                JSON.stringify({
                    type: "ChatMessage",
                    text
                })
            );
        }
    };

    const sendMove = (from: number, to: number) => {
        if (ws.value) {
            ws.value.send(
                JSON.stringify({
                    type: "MoveMessage",
                    from: String(from),
                    to: String(to)
                })
            );
        }
    };

    const close = () => {
        console.log(`close ${ws}`)
        if (ws.value) {
            ws.value.close() 
            ws.value = null
        }   
    }

    const connect = () => {
        console.log("🔌 Attempting to connect WebSocket...");
        console.log("Username:", username.value);
        console.log("Lobby ID:", lobbyId);
        
        if (!username.value) {
            console.warn("❌ Cannot connect: No username");
            return;
        }
        if (ws.value) {
            console.warn("⚠️ WebSocket already connected");
            return;
        }

        const wsUrl = `${WS_BASE_URL}/lobby/${lobbyId}/ws?user=${encodeURIComponent(username.value)}`;
        console.log("🔗 Connecting to:", wsUrl);

        ws.value = new WebSocket(wsUrl);

        ws.value.onopen = () => {
            console.log("✅ WebSocket CONNECTED!");
            connected.value = true;
            messages.push({ type: "system", text: "Connected to lobby!" });
        };

        ws.value.onmessage = (event) => {
            console.log("=== WebSocket Message Received ===");
            console.log("Raw data:", event.data);
            
            let data: any;
            try {
                data = JSON.parse(event.data);
            } catch (e) {
                console.error("Failed to parse JSON:", e);
                data = { message: event.data };
            }

            console.log("Parsed data:", data);
            console.log("Message type:", data.type);

            const type = data.type;
            const content = data.data;
            const timestamp = new Date(data.timestamp || Date.now()).toLocaleTimeString();

            // Handle GameUpdate
            if (type === "GameUpdate") {
                console.log("✅ Received GameUpdate:", content);
                console.log("Game data:", content.game);
                console.log("Dice:", content.dice);
                console.log("Current player:", content.currentPlayer);
                gameState.value = {
                    game: content.game,
                    dice: content.dice,
                    currentPlayer: content.currentPlayer
                };
                console.log("✅ Updated gameState:", gameState.value);
            }

            // Handle LobbyUpdate
            if (type === "LobbyUpdate") {
                lobbyState.value = {
                    white: content.white,
                    black: content.black,
                    gameStarted: content.gameStarted
                };
            }

            // Handle PlayerAssigned
            if (type === "PlayerAssigned") {
                player.value = content.color;
            }

            if (type == "ServerInfo") {
                messages.push({
                    type: "system",
                    text: content.text,
                    timestamp
                });
            }

            // Handle ChatBroadcast
            if (type === "ChatBroadcast") {
                messages.push({
                    type: "chat",
                    user: content.user,
                    text: content.text,
                    timestamp
                });
            }
        };

        ws.value.onerror = (error) => {
            console.error("❌ WebSocket ERROR:", error);
        };

        ws.value.onclose = () => {
            console.log("🔌 WebSocket CLOSED");
            connected.value = false;
            messages.push({ type: "system", text: "WebSocket closed." });
        };
    };

    watch(username, (newName) => {
        if (newName) connect()
    }, { immediate: true })

    onBeforeUnmount(() => {
        ws.value?.close();
    });

    return {
        ws,
        messages,
        player,
        connected,
        gameState,
        lobbyState,
        sendMessage,
        sendMove,
        close
    };
}
