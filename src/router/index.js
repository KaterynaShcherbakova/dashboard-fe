import { createRouter, createWebHashHistory } from 'vue-router'
import TilesView from '../views/TilesView.vue'

const routes = [
  {
    path: '/',
    name: 'tiles',
    component: TilesView
  },
  {
    path: '/bitcoins',
    name: 'bitcoins',
    component: () => import('../views/BitcoinsView.vue')

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
