import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/layout', title: 'test' },
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
