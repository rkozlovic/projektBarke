import Vue from 'vue'
import Router from 'vue-router'
import Rides from '@/components/Rides'
import Signup from '@/components/Signup'
import Login from '@/components/Login'
import NewRide from '@/components/NewRide'
import EditRide from '@/components/EditRide'
import Reservations from '@/components/Reservations'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      // voznje glavni
      path: '/',
      name: 'Rides',
      component: Rides,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/new-ride',
      name: 'NewRide',
      component: NewRide,
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
    },
    {
      path: '/reservations',
      name: 'Reservations',
      component: Reservations,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/edit-reservation',
      name: 'EditRide',
      component: EditRide,
      meta: {
        requiresAuth: true
      }
    },

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
