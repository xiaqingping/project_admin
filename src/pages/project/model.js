const projectModel = {
  namespace: 'project',
  state: {
    // 状态
    status: [
      // 未发布
      {
        value: 1,
        text: '未发布',
        // i18n: 'bp.verfication',
        status: 'Default',
      },
      // 已发布
      {
        value: 2,
        text: '已发布',
        // i18n: 'bp.completed',
        status: 'Success',
      },
      // 已禁用
      {
        value: 3,
        text: '已禁用',
        // i18n: 'bp.rejected',
        status: 'Error',
      },
    ],
    // 颜色
    colorStore: [],
  },
  effects: {},
  reducers: {
    setColorStore(state, action) {
      return {
        ...state,
        colorStore: action.payload,
      };
    },
  },
};
export default projectModel;
