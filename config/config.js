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
      path: '/project-manage-edit',
      component: '@/pages/project/project-manage/project-manage-edit',
      title: '春去秋来',
    },
    {
      path: '/detail',
      component: '@/pages/project/project-manage/projectDetail',
      title: '项目详情',
    },
    {
      path: '/addflowpath',
      component:
        '@/pages/project/project-manage/project-manage-edit/addflowpath',
      title: '项目详情',
    },
  ],
});
