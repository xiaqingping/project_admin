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
      path: '/project/project-manage/add',
      component: '@/pages/project/project-manage/project-manage-edit',
      title: '新建项目',
    },
    {
      path: '/project/project-manage/add/:id',
      component: '@/pages/project/project-manage/project-manage-edit',
      title: '返回新建项目',
    },
    {
      title: '修改项目',
      path: '/project/project-manage/edit/:id',
      component: './project/project-manage/project-manage-edit',
    },
    {
      title: '选择流程',
      path: '/project/project-manage/add/addflowpath/:id',
      component: './project/project-manage/project-manage-edit/addflowpath',
    },
    {
      path: '/project/project-manage/detail/:id',
      component: '@/pages/project/project-manage/project-manage-detail',
      title: '项目详情',
    },
    {
      path: '/project/project-manage/process-parameter/:id',
      component:
        '@/pages/project/project-manage/project-manage-detail/process-parameter',
      title: '流程参数',
    },
    {
      path: '/project/project-manage/detailAdd/:id',
      component: './project/project-manage/project-manage-edit/addflowpath',
      name: '添加流程',
    },
  ],
});
