import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/layout', title: 'test' },
    { path: '/page', component: '@/pages/projectAdd', title: '新建项目' },
  ],
});
