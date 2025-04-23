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
    path: '/admin/disco-overview',
    name: 'disco-overview',
    component: () => import('../components/admin/TaylorSwiftDataManager.vue'),
    meta: {
      requiresAuth: true // This route requires authentication
    }
  },
  {
    path: '/admin/database-test',
    name: 'database-test',
    component: () => import('../components/DatabaseTest.vue'),
    meta: {
      title: 'Database Integration Test'
    }
  },
  {
    path: '/admin/hybrid-songs',
    name: 'hybrid-songs',
    component: () => import('../components/HybridSongList.vue'),
    meta: {
      title: 'Hybrid Song List - Compare Data Sources'
    }
  },
  {
    path: '/admin/edition-browser',
    name: 'edition-browser',
    component: () => import('../components/EditionBrowser.vue'),
    meta: {
      title: 'Edition Browser - Database Feature'
    }
  },
  {
    path: '/admin/simple-db',
    name: 'simple-db',
    component: () => import('../components/SimpleDatabaseView.vue'),
    meta: {
      title: 'Simple Database View'
    }
  },
  {
    path: '/admin/database-diagnostic',
    name: 'database-diagnostic',
    component: () => import('../components/DatabaseDiagnostic.vue'),
    meta: {
      title: 'Database Connection Diagnostic'
    }
  },
  {
    path: '/admin/env-checker',
    name: 'env-checker',
    component: () => import('../components/EnvChecker.vue'),
    meta: {
      title: 'Environment Variables Checker'
    }
  },
  // New routes for the updated application structure
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  // Music section routes
  {
    path: '/music',
    name: 'music',
    component: () => import('../views/MusicView.vue'),
    meta: {
      title: 'Music Library'
    }
  },
  {
    path: '/music/eras',
    name: 'era-ranking',
    component: () => import('../views/ErasRankingView.vue')
  },
  {
    path: '/music/songs',
    name: 'song-ranking',
    component: () => import('../views/SongsRankingView.vue')
  },
  {
    path: '/music/artists',
    name: 'artists',
    component: () => import('../views/ArtistsRankingView.vue'),
    meta: {
      title: 'Artists'
    }
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
    path: '/terms-privacy-etc',
    name: 'terms-privacy',
    component: () => import('../views/TermsPrivacyEtcView.vue'),
    meta: {
      title: 'Legal & Compliance'
    }
  },
  {
    path: '/admin/eras',
    name: 'eras',
    component: () => import('../components/ErasView.vue'),
    meta: {
      title: 'Musical Eras'
    }
  },
  {
    path: '/admin/image-diagnostic',
    name: 'image-diagnostic',
    component: () => import('../components/ImageLoadingDiagnostic.vue'),
    meta: {
      title: 'Image Loading Diagnostic'
    }
  },
  // New admin dashboard route
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('../views/AdminDashboardView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Admin Dashboard'
    }
  }
]

const router = createRouter({
  history: createWebHistory(BASE_URL),
  routes
})

export default router
