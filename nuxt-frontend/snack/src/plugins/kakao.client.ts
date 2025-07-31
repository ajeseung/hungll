export default defineNuxtPlugin(() => {
    return new Promise((resolve) => {
      if (typeof window.kakao !== 'undefined') {
        resolve()
        return
      }
  
      const script = document.createElement('script')
      script.onload = () => resolve()
      const config = useRuntimeConfig()
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.public.KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=clusterer`
      document.head.appendChild(script)
    })
  })
  