const projectModel = {
  namespace: 'projectManage',
  state: {
    status: [
      { value: 1, text: '未开始', color: 'rgba(0, 0, 0, 0.2)' },
      { value: 2, text: '进行中', color: '#1890ff' },
      { value: 3, text: '已完成', color: '#52c41a' },
      { value: 4, text: '已终止', color: '#ff4d4f' },
      { value: 5, text: '待处理', color: '#faad14' },
    ],
    // 批量下载 请求地址
    baseURLMap: {
      dev: 'https://devapi.sangon.com:30443/api',
      test: 'https://testapi.sangon.com/api',
      pre: 'https://preapi.sangon.com/api',
      prod: 'https://api.sangon.com/api',
    },
    // 业务伙伴认证状态
    BpCertificationStatus: [
      {
        id: 1,
        name: '未认证',
        // i18n: 'bp.unapproved',
        badge: 'default',
      },
      {
        id: 2,
        name: '审核中',
        // i18n: 'bp.processing',
        badge: 'warning',
      },
      {
        id: 3,
        name: '部分认证',
        // i18n: 'bp.partialApproved',
        badge: 'warning',
      },
      {
        id: 4,
        name: '已认证',
        // i18n: 'bp.approveds',
        badge: 'success',
      },
    ],
    // 销售范围冻结状态
    SalesOrderBlock: [
      {
        id: 1,
        name: '冻结',
        // i18n: 'bp.block',
        badge: 'error',
      },
      {
        id: 2,
        name: '正常',
        // i18n: 'bp.normal',
        badge: 'success',
      },
    ],
    // 标签
    labels: [
      {
        id: 1,
        name: '真核转录组',
        text: 'eukaryotic_transcriptome',
        color: '#87d068',
      },
      {
        id: 2,
        name: '宏转录组',
        text: 'metatranscriptome',
        color: 'volcano',
      },
      {
        id: 3,
        name: '真菌基因组',
        text: 'fugus_genome',
        color: 'blue',
      },
      {
        id: 4,
        name: '外显子组',
        text: 'exome',
        color: 'green',
      },
      {
        id: 5,
        name: '简化基因组',
        text: 'RAD',
        color: 'lime',
      },
      {
        id: 6,
        name: '宏基因组',
        text: 'metagenome',
        color: 'yellowgreen',
      },
      {
        id: 7,
        name: '微生物基因组',
        text: 'microbial_genome',
        color: 'cyan',
      },
      {
        id: 8,
        name: '重测序',
        text: 'resequencing',
        color: 'gold',
      },
      {
        id: 9,
        name: '原核转录组',
        text: 'prokaryotic_transcriptom',
        color: 'purple',
      },
      {
        id: 10,
        name: '小RNA',
        text: 'microRNA',
        color: 'red',
      },
      {
        id: 11,
        name: '动植物基因组',
        text: 'eukaryotic_genome',
        color: 'magenta',
      },
      {
        id: 12,
        name: '微生物多样性',
        text: 'microbial_diversity',
        color: 'geekblue',
      },
      {
        id: 13,
        name: '表观遗传学',
        text: 'epigenetics',
        color: 'orange',
      },
    ],
    // 成员权限
    jurisdiction: [
      {
        id: 1,
        name: '所有者',
      },
      {
        id: 2,
        name: '管理者',
      },
      {
        id: 3,
        name: '参与者',
      },
    ],
    // 点击查看的数据
    viewlist: [],
    // 修改项目参数
    projectData: [],
    // 已选中的流程
    processSelectedList: [],
    // 新建项目的基础信息
    projectInfor: [],
    // 流程参数列表
    paramList: [],
    filedStatus: {},
    // 文件列表测试数据
    filedList: [
      {
        id: '1',
        name: 'XXXX文件1',
        describe: 'XXXX流程名称1', // 描述
        sourceType: 'smaple',
        sourceCode: 2,
        sourceId: 1,
        size: 122313,
        changeDate: '2020/05/26 15:15',
        type: 2,
        mediaType: '1',
        extendName: '',
      },
      {
        id: '2',
        name: 'XXXX文件2',
        describe: 'XXXX流程名称2', // 描述
        sourceType: 'smaple',
        sourceCode: 2,
        sourceId: 1,
        size: 122313,
        changeDate: '2020/05/26 15:15',
        type: 1,
        mediaType: '2',
        extendName: 'word',
      },
      {
        id: '3',
        name: 'XXXX文件3',
        describe: 'XXXX流程名称3', // 描述
        sourceType: 'smaple',
        sourceCode: 2,
        sourceId: 1,
        size: 122313,
        changeDate: '2020/05/26 15:15',
        type: 1,
        mediaType: '2',
        extendName: 'excel',
      },
      {
        id: '4',
        name: 'XXXX文件4',
        describe: 'XXXX流程名称4', // 描述
        sourceType: 'smaple',
        sourceCode: 2,
        sourceId: 1,
        size: 122313,
        changeDate: '2020/05/26 15:15',
        type: 1,
        mediaType: '2',
        extendName: 'pdf',
      },
    ],
  },

  effects: {},

  reducers: {
    setviewlist(state, payload) {
      return { ...state, viewlist: payload };
    },
    setProjectData(state, action) {
      return { ...state, projectData: action.payload };
    },
    setProcessSelectedList(state, action) {
      return { ...state, processSelectedList: action.payload };
    },
    setProjectInfor(state, action) {
      return { ...state, projectInfor: action.payload };
    },
    setParamList(state, action) {
      return { ...state, paramList: action.payload };
    },
  },
};
export default projectModel;
