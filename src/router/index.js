import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import NovaVoznja from '@/components/NovaVoznja'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/nova-voznja',
      name: 'NovaVoznja',
      component: NovaVoznja
    }
  ]
})
