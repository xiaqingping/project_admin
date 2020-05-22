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
    {
      path: '/',
      component: '@/pages/project/project-manage',
    },
    {
      path: '/page',
      component: '@/pages/project/project-manage/projectAdd',
      title: '新建项目',
    },
    {
      path: '/detail',
      component: '@/pages/project/project-manage/projectDetail',
      title: '项目详情',
    },
  ],
});
