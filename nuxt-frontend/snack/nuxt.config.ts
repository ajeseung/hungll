import vuetify from 'vite-plugin-vuetify'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src',
  ssr: true,

  css: ['vuetify/styles', '@mdi/font/css/materialdesignicons.css'],

  build: {
    transpile: ['vuetify', '@aws-sdk/client-s3'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: [
        'vuetify',
      '@tosspayments/payment-widget-sdk'],
    },
    optimizeDeps: {
      include: ['fast-xml-parser', ],
    },
    plugins: [vuetify()],
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap',
        },
      ],
      script: [
        {
          innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K35DKXLF');`,
          type: 'text/javascript',
        },
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=G-1WZKVN0BMG',
          async: true,
        },
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1WZKVN0BMG');
          `,
          type: 'text/javascript',
        },
      ],
      meta: [
        {
          property: 'og:title',
          content: '헝글 - 서울 맛집 & 서울 밥친구 찾기 서비스',
        },
        {
          property: 'og:description',
          content:
            '당신의 취향에 맞는 서울 맛집과 밥친구를 헝글 AI가 연결해드립니다.',
        },
        {
          property: 'og:image',
          content: 'https://hungll.com/og/hungle_hgl.png',
        },
        { property: 'og:url', content: 'https://hungll.com/' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'naver-site-verification',
          content: 'd3ea9de3d958a25bdf06e1aec7db4df25f4f4223',
        },
      ],
    },
  },

  modules: ['@nuxtjs/sitemap'],

  sitemap: {
    siteUrl: 'https://hungll.com',
    gzip: true,
    trailingSlash: false,
    exclude: [
      '/admin/**',
      '/[provider]-oauth/**',
      '/common/error',
      '/common/404',
    ],
    routes: [
      {
        url: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      { url: '/login', changefreq: 'monthly', priority: 0.4 },
      { url: '/mypage', changefreq: 'weekly', priority: 0.3 },
      { url: '/restaurants/all', changefreq: 'daily', priority: 0.9 },
      { url: '/board/all', changefreq: 'daily', priority: 0.9 },
      { url: '/board/create', changefreq: 'weekly', priority: 0.6 },
      { url: '/policy/privacy', changefreq: 'yearly', priority: 0.2 },
      { url: '/policy/terms-info', changefreq: 'yearly', priority: 0.2 },
      { url: '/subscribe/select', changefreq: 'monthly', priority: 0.5 },
      { url: '/payments', changefreq: 'monthly', priority: 0.5 },
      { url: '/prefer', changefreq: 'monthly', priority: 0.6 },
    ],
  },

  runtimeConfig: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    TOSS_SECRET_KEY: process.env.TOSS_SECRET_KEY,
    public: {
      KAKAO_JAVASCRIPT_KEY: process.env.KAKAO_JAVASCRIPT_APP_KEY,
      MAIN_API_URL: process.env.NUXT_PUBLIC_MAIN_API_URL,
      AI_BASE_URL: process.env.NUXT_PUBLIC_AI_BASE_URL,
      TOSS_CLIENT_KEY: process.env.TOSS_CLIENT_KEY,
    },
  },

  compatibilityDate: '2025-04-04',
})
