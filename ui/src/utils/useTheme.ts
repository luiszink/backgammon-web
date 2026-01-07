import { ref, watch } from 'vue'

export type Theme = 'default' | 'classic-wood' | 'dark' | 'ocean' | 'desert' | 'forest'

const THEME_STORAGE_KEY = 'backgammon-theme'

const currentTheme = ref<Theme>('default')

export function useTheme() {
  // Load theme from localStorage on init
  const loadTheme = () => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (saved && ['default', 'classic-wood', 'dark', 'ocean', 'desert', 'forest'].includes(saved)) {
      currentTheme.value = saved
      applyTheme(saved)
    }
  }

  // Apply theme to document
  const applyTheme = (theme: Theme) => {
    if (theme === 'default') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  // Set theme
  const setTheme = (theme: Theme) => {
    currentTheme.value = theme
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  // Watch for theme changes
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  })

  // Load theme on init
  if (typeof window !== 'undefined') {
    loadTheme()
  }

  return {
    currentTheme,
    setTheme,
    themes: ['default', 'classic-wood', 'dark', 'ocean', 'desert', 'forest'] as const
  }
}
