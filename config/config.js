import { defineConfig } from 'umi';

const { BASE_API } = process.env;
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  define: {
    BASE_API: BASE_API || 'dev',
  },
  routes: [
    { path: '/', component: '@/pages/layout', title: 'test' },
    // { path: '/page', component: '@/pages/project/project-manage/projectAdd', title: '春去秋来' },
    {
      path: '/project-manage-edit',
      component: '@/pages/project/project-manage/project-manage-edit',
      title: '春去秋来',
    },
  ],
});
