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
      path: '/detail/:id',
      component: '@/pages/project/project-manage/project-manage-detail',
      title: '项目详情',
    },
    {
      path: '/addflowpath',
      component:
        '@/pages/project/project-manage/project-manage-edit/addflowpath',
      title: '项目详情',
    },
    {
      path: '/detail/parameter/:id',
      component:
        '@/pages/project/project-manage/project-manage-detail/process-parameter',
      title: '流程参数',
    },
  ],
});
