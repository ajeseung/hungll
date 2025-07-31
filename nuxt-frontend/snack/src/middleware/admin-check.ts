export default defineNuxtRouteMiddleware((to, from) => {
    const adminCheck = process.client && sessionStorage.getItem('admincheck') === 'true'
  
    if (to.path === '/admin' && !adminCheck) {

      return navigateTo('/')
    }
  })
  

  