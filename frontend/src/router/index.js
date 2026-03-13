import { createRouter, createWebHistory } from 'vue-router'
import lists from '../assets/lists.json'
import ListView from '../views/ListView.vue'

const validKeys = lists.map(l => l.key)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListView,
    },
    {
      path: '/:liste',
      name: 'liste',
      component: ListView,
      beforeEnter: (to) => {
        if (!validKeys.includes(to.params.liste)) {
          return { path: '/' }
        }
      }
    }
  ]
})

// Redirect old query parameter URLs to new path-based URLs
router.beforeEach((to) => {
  const liste = to.query.liste
  if (liste) {
    return { path: `/${liste}`, query: {} }
  }
})

export default router
