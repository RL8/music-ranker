import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

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
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/song/:id',
    name: 'song-detail',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "song-detail" */ '../views/SongDetailView.vue'),
    props: true // Pass route params as component props
  },
  {
    path: '/admin/taylor-swift',
    name: 'taylor-swift-manager',
    component: () => import(/* webpackChunkName: "taylor-swift-manager" */ '../components/admin/TaylorSwiftDataManager.vue'),
    meta: {
      requiresAuth: true // This route requires authentication
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
