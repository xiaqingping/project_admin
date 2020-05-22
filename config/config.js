import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/layout', title: 'test' },
    { path: '/header', component: '@/pages/header', title: 'test1' },
  ],
});
