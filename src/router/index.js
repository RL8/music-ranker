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
    path: '/database-test',
    name: 'database-test',
    component: () => import('../components/DatabaseTest.vue'),
    meta: {
      title: 'Database Integration Test'
    }
  },
  {
    path: '/hybrid-songs',
    name: 'hybrid-songs',
    component: () => import('../components/HybridSongList.vue'),
    meta: {
      title: 'Hybrid Song List - Compare Data Sources'
    }
  },
  {
    path: '/edition-browser',
    name: 'edition-browser',
    component: () => import('../components/EditionBrowser.vue'),
    meta: {
      title: 'Edition Browser - Database Feature'
    }
  },
  {
    path: '/simple-db',
    name: 'simple-db',
    component: () => import('../components/SimpleDatabaseView.vue'),
    meta: {
      title: 'Simple Database View'
    }
  },
  {
    path: '/database-diagnostic',
    name: 'database-diagnostic',
    component: () => import('../components/DatabaseDiagnostic.vue'),
    meta: {
      title: 'Database Connection Diagnostic'
    }
  },
  {
    path: '/env-checker',
    name: 'env-checker',
    component: () => import('../components/EnvChecker.vue'),
    meta: {
      title: 'Environment Variables Checker'
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
  // Updated routes for era ranking
  {
    path: '/rank/eras',
    name: 'era-ranking',
    component: () => import('../views/AlbumRankingCarouselView.vue')
  },
  // Legacy routes that redirect to the new structure
  {
    path: '/rank/albums/carousel',
    redirect: '/rank/eras'
  },
  // Updated routes for song ranking
  {
    path: '/rank/songs',
    name: 'song-ranking',
    component: () => import('../views/SongRankingCarouselView.vue')
  },
  // Legacy routes that redirect to the new structure
  {
    path: '/rank/songs/carousel',
    redirect: '/rank/songs'
  },
  {
    path: '/rank/songs/tier',
    name: 'song-ranking-tier',
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
  },
  {
    path: '/compliance',
    name: 'compliance',
    component: () => import('../views/ComplianceView.vue'),
    meta: {
      title: 'Legal & Compliance'
    }
  },
  {
    path: '/eras',
    name: 'eras',
    component: () => import('../components/ErasView.vue'),
    meta: {
      title: 'Musical Eras'
    }
  },
  {
    path: '/image-diagnostic',
    name: 'image-diagnostic',
    component: () => import('../components/ImageLoadingDiagnostic.vue'),
    meta: {
      title: 'Image Loading Diagnostic'
    }
  }
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
})

export default router
