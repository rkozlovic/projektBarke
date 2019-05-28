import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import NovaVoznja from '@/components/NovaVoznja'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // voznje glavni
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/nova-voznja',
      name: 'NovaVoznja',
      component: NovaVoznja,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }

  ]
})

// router guards
router.beforeEach((to, from, next) => {
  // check to see if route has auth guard
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if (user) {
      // User is signed in. Proceed to route
      next()
    } else {
      // No user is signed in. Redirect to login
      next({
        name: 'Login'
      })
    }
  } else {
    // if route is not guarded by auth, proceed
    next()
  }
})

export default router
