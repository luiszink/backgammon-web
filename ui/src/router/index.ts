import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/HomeView.vue'
import Lobby from '../views/LobbyView.vue'
import MaintenanceView from '../views/MaintenanceView.vue'
// #web-comp: Demo Route für Web Components
import WebComponentsDemo from '../views/WebComponentsDemo.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: Home },
  {
    path: '/lobby/:id',
    name: 'Lobby',
    component: Lobby,
    props: true 
  },
  // #web-comp: Route zur Web Components Demo
  {
    path: '/demo',
    name: 'WebComponentsDemo',
    component: WebComponentsDemo
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: MaintenanceView
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

// Maintenance Mode Guard
router.beforeEach((to, from, next) => {
  const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true'
  
  if (maintenanceMode && to.path !== '/maintenance') {
    next('/maintenance')
  } else if (!maintenanceMode && to.path === '/maintenance') {
    next('/')
  } else {
    next()
  }
})

export default router