<template>
<div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
  <div 
    class="d-grid board rounded shadow-lg"
    :style="{
      '--cols': cols,
      '--rows': rows,
      '--aspect': aspect,
      'max-width': '90vw',       /* scale down on small screens */
      'max-height': '90vh',      /* scale down vertically */
      'width': 'min(90vw, 1200px)',
      'height': 'auto'
    }"
  >
      <div
        v-for="(point, i) in boardPoints"
        :key="i"
        :class="['cell', i >= half ? 'bottom' : 'top', { selected: activeSource === point.originalIndex }]"
        :data-point="point.originalIndex"
        @click="onCellClick(point.originalIndex)"
      >
        <template v-if="point.field === 0">
          <span class="text-white-50">–</span>
        </template>

        <template v-else>
          <div
            class="checker-stack"
            :class="[getColorClass(point.field), i >= half ? 'bottom' : 'top']"
          >
            <div
              v-for="(n, idx) in Math.abs(point.field)"
              :key="idx"
              class="checker"
              :class="[
                getColorClass(point.field),
                activeSource === point.originalIndex && activeCheckerIndex === idx ? 'active' : ''
              ]"
              @click.stop="onCheckerClick(point.originalIndex, idx)"
            ></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { BoardState } from '../utils/useLobbyWebSocket'

const props = defineProps<{
  board: BoardState,
  sendMove: (from: number, to: number) => void
}>()

console.log("Board component received props:", props.board);
console.log("Fields:", props.board?.fields);
console.log("Fields length:", props.board?.fields?.length);
console.log("barWhite:", props.board?.barWhite);
console.log("barBlack:", props.board?.barBlack);

const windowWidth = ref(window.innerWidth);

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));


const half = computed(() => {
  if (!props.board?.fields || props.board.fields.length === 0) {
    return 0;
  }
  return Math.floor(props.board.fields.length / 2);
})

const boardPoints = computed(() => {
  const width = windowWidth.value;
  const fields = props.board?.fields || [];
  const len = fields.length;

  if (len === 0) {
    console.warn("No fields available for board");
    return [];
  }

  if (width < 768) {
    return Array.from({ length: Math.ceil(len / 2) })
        .flatMap((_, i) => {
        const start = { field: fields[i] ?? 0, originalIndex: i };
        const end = i !== len - 1 - i ? { field: fields[len - 1 - i] ?? 0, originalIndex: len - 1 - i } : [];
        return [start, end].flat();
    });
  }

  const topRow = fields
    .slice(half.value)
    .map((field, idx) => ({
      field,
      originalIndex: half.value + idx
    }))

  const bottomRow = fields
    .slice(0, half.value)
    .map((field, idx) => ({
      field,
      originalIndex: idx
    }))
    .reverse()

  return [...topRow, ...bottomRow]
})

const activeCheckerIndex = ref<number | null>(null)
const activeSource = ref<number | null>(null)

// Grid configuration
const rows = 2
const cols = computed(() => props.board.fields.length / rows)
const aspect = computed(() => 1 / (cols.value / rows) * 2)

const getColorClass = (field: number) => {
  if (field > 0) return 'white'   
  if (field < 0) return 'black'  
  return 'empty'
}

function onCheckerClick(point: number, checkerIndex: number) {
  if (activeSource.value === point && activeCheckerIndex.value === checkerIndex) {
    activeSource.value = null
    activeCheckerIndex.value = null
    return
  }

  activeSource.value = point
  activeCheckerIndex.value = checkerIndex
}

function onCellClick(point: number) {
  if (activeSource.value === null) return

  const from = activeSource.value
  const to = point

  props.sendMove(from, to)

  activeSource.value = null
}
</script>

<style scoped>
#game .board {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border-width: 20px;
  border-style: solid;
  border-image: var(--board-border-image, none) 20 round;
}

#game .board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--rows), 1fr);
  grid-template-rows: repeat(var(--cols), 1fr);
  background: var(--board-background);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.05);
  overflow: hidden;
  transform: scale(var(--board-scale));
  transform-origin: top center;
}

@media (min-width: 768px) {
    #game .board::after {
    content: "";
    position: absolute;
    inset: 0 auto 0 50%;
    transform: translateX(-50%);
    width: 15px;
    background: var(--board-bar-background, transparent) round;
    z-index: 100;
    border-radius: 2px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.35);
    }
}

@media (max-width: 767px) {
    #game .board::before {
    content: "";
    position: absolute;
    inset: 50% auto auto 0; /* vertically centered */
    transform: translateY(-50%);
    height: 15px;             /* thickness of the line */
    width: 100%;             /* span entire board horizontally */
    background: var(--board-bar-background, transparent) round;
    z-index: 100;
    border-radius: 2px;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.35);
    }
}

/* Zellen/Dreiecke */
#game .cell {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 1; /* mobil */
  display: flex;
  align-items: center;       /* zentriert den „–“ Platzhalter */
  justify-content: center;
  z-index: 1;                /* über Mittelleiste */
}

#game .cell::before {
  content: "";
  position: absolute;
  inset: 0;
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
  background: var(--board-point-light);
  transition: clip-path .25s ease;
  z-index: 0;
  box-shadow:
    inset 0 4px 6px rgba(0,0,0,0.25),
    inset -2px 0 4px rgba(0,0,0,0.15),
    inset 2px 0 4px rgba(0,0,0,0.15);
  border-radius: 2px;
}

#game .cell:nth-child(even)::before { background: var(--board-point-dark); }

@media (max-width: 767px) {
  #game .cell:nth-child(odd)::before {
    transform: rotate(180deg);
  }
}

/* Desktop: 12 / 12 */
@media (min-width: 768px) {
  #game .board {
    grid-template-columns: repeat(var(--cols), 1fr);
    grid-template-rows: repeat(var(--rows), 1fr);
  }
  #game .cell { aspect-ratio: var(--aspect); }
  #game .cell::before { 
    clip-path: polygon(50% 100%, 0 0, 100% 0); 
    transform: rotate(0deg); /* reset default */
  }

  #game .cell::before {
    transform: rotate(0deg);
  }

  #game .cell.bottom::before {
    transform: rotate(180deg);
  }

  #game .checker-stack {
    flex-direction: column !important;
  }
}

/* --- Checker & Stacks --- */
#game .checker-stack {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 8px;
  bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  z-index: 2;
}

#game .checker-stack.top    { justify-content: flex-start; }
#game .checker-stack.bottom { justify-content: flex-end; }
#game .checker-stack.empty  { color: #9ca3af; }

#game .checker {
  width: var(--checker-size);
  height: var(--checker-size);
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 600;
  line-height: 1;
  box-shadow:
    inset 0 2px 4px rgba(255,255,255,0.25),
    inset 0 -2px 4px rgba(0,0,0,0.45),
    0 2px 3px rgba(0,0,0,0.5);
  z-index: 2;
}

.player-turn-shadow {
    box-shadow: 0 0 12px 4px rgba(255, 255, 0, 0.7);
    transition: box-shadow 0.3s ease;
}

#game .checker.black {
  background: radial-gradient(circle at 30% 30%, var(--checker-black-gradient-start), var(--checker-black-gradient-end));
  border: 1px solid rgba(0, 0, 0, 0.3);
  color: var(--checker-black-text);
}

#game .checker.white {
  background: radial-gradient(circle at 30% 30%, var(--checker-white-gradient-start), var(--checker-white-gradient-end));
  border: 1px solid var(--checker-white-border);
  color: var(--checker-white-text);
}

#game.active-move {
  cursor: grab;
}

#game .checker.active {
  outline: 4px solid yellow; 
  outline-offset: -2px;
  box-shadow: 
    0 0 10px 5px rgba(255, 255, 0, 0.7), /* Yellow glow */
    inset 0 2px 4px rgba(255,255,255,0.25),
    inset 0 -2px 4px rgba(0,0,0,0.45),
    0 2px 3px rgba(0,0,0,0.5);
}
</style>
