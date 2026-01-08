import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import Home from '../views/HomeView.vue'
import Lobby from '../views/LobbyView.vue'
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
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router