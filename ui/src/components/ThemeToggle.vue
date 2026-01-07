<template>
  <div class="theme-toggle" :class="{ open: isOpen }">
    <button 
      class="theme-icon-btn" 
      @click="toggleMenu"
      aria-label="Theme selector"
    >
      <i class="bi bi-palette-fill"></i>
    </button>
    
    <transition name="fade">
      <div v-if="isOpen" class="theme-menu">
        <button 
          v-for="theme in themes" 
          :key="theme.value"
          @click="selectTheme(theme.value)"
          :class="['theme-option', { active: currentTheme === theme.value }]"
        >
          <i :class="['bi', theme.icon]"></i>
          <span class="theme-name">{{ theme.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme, type Theme } from '../utils/useTheme'

const { currentTheme, setTheme } = useTheme()
const isOpen = ref(false)

const themes: Array<{ value: Theme; label: string; icon: string }> = [
  { value: 'default', label: 'Modern', icon: 'bi-file-earmark-fill' },
  { value: 'classic-wood', label: 'Classic Wood', icon: 'bi-box-fill' },
  { value: 'dark', label: 'Dark', icon: 'bi-moon-stars-fill' },
  { value: 'ocean', label: 'Ocean', icon: 'bi-water' },
  { value: 'desert', label: 'Desert', icon: 'bi-sun-fill' },
  { value: 'forest', label: 'Forest', icon: 'bi-tree-fill' }
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const selectTheme = (theme: Theme) => {
  setTheme(theme)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-toggle')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.theme-icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid var(--status-border);
  background: var(--status-background);
  color: var(--text-color);
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.theme-icon-btn i {
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.theme-icon-btn:active {
  transform: scale(0.95);
}

.theme-menu {
  position: absolute;
  top: 50px;
  left: 0;
  min-width: 180px;
  background: var(--status-background);
  border: 2px solid var(--status-border);
  border-radius: 10px;
  padding: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
}

.theme-option i {
  font-size: 16px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--button-primary);
}

.theme-option.active {
  background: var(--button-primary);
  color: white;
  border-color: var(--button-primary);
}

[data-theme="classic-wood"] .theme-option {
  color: #fff;
}

[data-theme="classic-wood"] .theme-option:hover {
  background: rgba(255, 255, 255, 0.15);
}

.theme-name {
  font-weight: 500;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
