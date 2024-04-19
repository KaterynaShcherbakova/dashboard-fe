import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'tiles',
    component: () => import('../views/TilesView.vue')
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
