import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { BASE_URL } from '../utils/env'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/song/:id',
    name: 'song-detail',
    component: () => import('../views/SongDetailView.vue'),
    props: true // Pass route params as component props
  },
  {
    path: '/admin/taylor-swift',
    name: 'taylor-swift-manager',
    component: () => import('../components/admin/TaylorSwiftDataManager.vue'),
    meta: {
      requiresAuth: true // This route requires authentication
    }
  },
  {
    path: '/visualizations/sunburst',
    name: 'sunburst-demo',
    component: () => import('../views/SunburstDemo.vue')
  },
  {
    path: '/visualizations/taylor-swift',
    name: 'taylor-swift-sunburst',
    component: () => import('../views/TaylorSwiftSunburst.vue')
  },
  // New routes for the updated application structure
  {
    path: '/music',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/rank/albums',
    name: 'album-ranking',
    component: () => import('../views/AlbumRankingView.vue')
  },
  {
    path: '/rank/songs',
    name: 'song-ranking',
    component: () => import('../views/SongRankingView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
})

export default router
