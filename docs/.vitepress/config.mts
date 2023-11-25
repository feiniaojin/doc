import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Docs",
  description: "文档中心",
  themeConfig: {
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '悟道领域驱动设计', link: 'https://ddd.feiniaojin.com' }
    ],
    footer: {
      copyright: "京ICP备17012814号-1 Copyright © 2020-present Qin Yujie",
    },
    sidebar: [
      {
        text: '关于文档中心',
        collapsed: false,
        items: [
          { text: '文档中心说明', link: '/readme/0.md' },
          { text: '开发者交流', link: '/readme/1.md' }
        ]
      },
      {
        text: 'GracefulResponse',
        collapsed: false,
        items: [
          { text: '快速入门', link: '/graceful-response/0.md' },
          { text: '自定义异常和错误码', link: '/graceful-response/1.md' },
          { text: '异常别名', link: '/graceful-response/2.md' },
          { text: '参数校验异常错误码', link: '/graceful-response/3.md' },
          { text: '第三方组件适配', link: '/graceful-response/4.md' },
          { text: '例外请求放行', link: '/graceful-response/5.md' },
          { text: '通用工具类', link: '/graceful-response/6.md' },
          { text: '自定义Response格式', link: '/graceful-response/7.md' },
          { text: '常用配置', link: '/graceful-response/8.md' },
          { text: '开发者交流', link: '/graceful-response/9.md' }
        ]
      },
      {
        text: '责任链框架-Pie',
        collapsed: false,
        items: [
          { text: '快速入门', link: '/pie/0.md' }
        ]
      },
      {
        text: 'DDD脚手架',
        collapsed: false,
        items: [
          { text: '快速入门', link: '/ddd-archetype/0.md' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/feiniaojin' }
    ]
  }
})
