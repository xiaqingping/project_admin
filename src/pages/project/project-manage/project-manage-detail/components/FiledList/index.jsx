import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Button,
  Input,
  Breadcrumb,
  Select,
  Modal,
  ConfigProvider,
  Table,
  Row,
  Col,
  message,
} from 'antd';
import {
  FolderOutlined,
  DownloadOutlined,
  SearchOutlined,
  FileExclamationOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';
import Qs from 'qs';

// 自定义
// import api from '@/pages/project/api/disk';
import api from '@/pages/project/api/file';
import api1 from '@/pages/project/api/projectManageDetail';
import file from '@/assets/imgs/file.png';
import docx from '@/assets/imgs/word.png';
import excel from '@/assets/imgs/excel.png';
import pdf from '@/assets/imgs/pdf.png';
import FileUpload from './components/UpLoad';
import './index.less';

const { Option } = Select;
const { confirm } = Modal;

/**
 * 文件列表组件
 * 文件服务
 * @param {*} props
 */
const FiledList = props => {
  // 列表数据
  const [tableList, setTableList] = useState({});
  // 面包屑
  const [BreadcrumbName, setBreadcrumbName] = useState([]);
  // 创建文件夹名称
  const [projectParma, setProjectParma] = useState({
    name: '',
    describe: '',
  });
  // 项目基础信息
  const [baseList, setBaseList] = useState();
  // 用户信息
  const [businessParma, setBusinessParma] = useState({
    businessName: '',
    businessCode: '',
  });
  // 搜索条件
  const [listData, setListData] = useState({
    spaceType: 'project', // String 必填 空间类型（来源可以为服务名称...）
    spaceCode: '', // String 必填 空间编号(可以为功能ID/编号...)
    directoryId: '0', // String 可选 目录ID
    searchName: '', // String 可选 搜索名称（文件或目录名称）
    sortType: 1, // Integer 必填 {1, 2, 3}
    sortWay: 1, // Integer 必填 {1, 2}
  });

  /** 状态 */
  // 新建文件夹Model状态
  const [isVisible, setVisible] = useState(false);
  // 排序状态
  const [isActive, setIsActive] = useState(false);
  // 排序筛选参数
  const [sortParameters, setSortParameters] = useState(1);
  // 列表加载状态
  const [isloading, setLoading] = useState(true);
  // 批量选择的id
  const [selectedRows, setSelectedRows] = useState([]);

  // 批量操作
  const rowSelection = {
    onChange: (selectedRowKeys, selectRows) => {
      const newRows = selectRows.filter(item => !!item === true);
      setSelectedRows(newRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  /**
   * 方法对象
   */
  const fn = {
    /**
     * 通过列名称筛选
     * @param {String} value
     */
    handleChange: () => {
      const sortWay = isActive ? 1 : 2;
      const data = {
        sortType: sortParameters,
        sortWay,
      };
      setListData({
        ...listData,
        ...data,
      });
      console.log(data);
      fn.getDateList(data);
    },
    /**
     * 获取列表数据
     * @param {*} props
     */
    getDateList: parameters => {
      const { projectId } = props;
      const data = {
        ...listData,
        spaceCode: projectId,
        ...parameters,
      };

      if (!data.directoryId) setBreadcrumbName([]);

      setLoading(true);
      return api
        .getFiles(data)
        .then(res => {
          setTableList(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          // message.error('查询列表失败！');
        });
    },
    /**
     * 设置单行文件小图标
     * @param {Integer} mediaType 类型
     * @param {String} extendName 文件后缀
     */
    setImg: (type, extendName) => {
      const extendType = { file, docx, excel, pdf };
      if (type) {
        if (type === 2) return <img src={file} alt="" />;

        if (extendType[extendName])
          return <img src={extendType[extendName]} alt="" />;
      }
      return <FileExclamationOutlined />;
    },
    /** 删除警告 */
    showDeleteConfirm: () => {
      confirm({
        title: '删除后将不可恢复，确定删除当前项目吗？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        centered: true,
        onOk() {
          console.log('OK');
        },
      });
    },
    /** 查询 */
    queryList: e =>
      fn.getDateList({
        searchName: e.target.value,
      }),
    /** 目录查询 */
    querydirectory: (id, type, name) => {
      if (type === 2) {
        setBreadcrumbName([...BreadcrumbName, { name, id }]);
        setListData({
          ...listData,
          directoryId: id,
        });
        fn.getDateList({ directoryId: id });
      }
    },
    /** 创建目录 */
    createDirctory: () => {
      const { projectId } = props;
      const { code } = baseList;
      const id = listData.directoryId === '0' ? '3' : listData.directoryId;
      const data = {
        spaceType: 'project',
        spaceCode: projectId,
        sourceType: 'project',
        sourceCode: code,
        sourceId: projectId,
        userName: '',
        userCode: '',
        ...businessParma,
        ...projectParma,
        parentId: id,
      };
      // 校验输入值
      const result = fn.verifyInput(data);
      if (!result) return false;

      setLoading(true);

      return api
        .createDirctory(data)
        .then(res => {
          setTableList(res);
          fn.getDateList();
          setLoading(false);
          setVisible(false);
        })
        .catch(() => {
          setLoading(false);
          message.error('创建文件夹失败！');
        });
    },
    /** 清除创建 */
    clearParam: () => {
      setProjectParma({
        name: '',
        describe: '',
      });
    },
    /** 输入框验证 */
    verifyInput: data => {
      const { name } = data;
      const reg = new RegExp(
        // eslint-disable-next-line no-useless-escape
        /^(?![\s\.])[\u4E00-\u9FA5\uFE30-\uFFA0\w \.\-\(\)\+=!@#$%^&]{1,99}(?<![\s\.])$/,
      );
      const res = reg.test(name);
      if (!res) {
        message.error('输入字符不合法！');
        return false;
      }
      return true;
    },
    /**
     * 批量上传
     */
    getFileUpload: () => {
      const { projectId } = props;
      const id = listData.directoryId === '0' ? '3' : listData.directoryId;
      const data = {
        spaceType: 'project',
        spaceCode: projectId,
        sourceType: 'project',
        sourceId: projectId,
        userName: '',
        userCode: '',
        ...businessParma,
        logicDirectoryId: id,
      };
      return data;
    },
    /** 文件下载(单个) */
    downloadFile: row => {
      const data = {
        spaceCode: props.projectId,
        spaceType: 'project',
        id: row.id,
        fileType: row.fileType,
        dispositionType: 2,
        isDown: 2,
      };
      api
        .downloadFiles(data)
        .then(() => {
          data.isDown = 1;
          // eslint-disable-next-line max-len
          const url = `http://192.168.20.6:8150/disk/v1/${data.spaceType}/${
            data.spaceCode
          }/files/download/${data.id}?${Qs.stringify(data)}`;
          window.open(url);
        })
        .catch();
    },
    /** 文件下载（批量） */
    downloadFileBatch: () => {
      console.log(selectedRows);
      const data = {
        spaceCode: props.projectId,
        spaceType: 'project',
        dispositionType: 2,
        files: [],
        isDown: 2,
      };

      if (selectedRows && selectedRows.length) {
        const newFiles = [];
        selectedRows.forEach(item => {
          const newItem = {
            fileType: item.fileType,
            id: item.id,
          };
          newFiles.push(newItem);
        });
        data.files = newFiles;
        console.log(data);

        return false;
      }
      return message.warning('请选中需要下载的文件！');
    },
  };

  /**
   * 初始化操作
   */
  useEffect(() => {
    // 初始化列表数据
    fn.getDateList();
    // 查询项目基础信息及流程列表
    api1.getProjectProcess(props.projectId).then(res => {
      setBaseList(res);
    });
    // 查询成员列表
    api1.getProjectMember({ projectId: props.projectId }).then(res => {
      const { code, name } = res[0];
      setBusinessParma({
        businessName: name,
        businessCode: code,
      });
    });
  }, []);

  // 表结构
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      width: 150,
      render: (value, record) => (
        <div className="classProjectName">
          {fn.setImg(record.fileType, record.extendName)}
          <span
            style={{ marginLeft: 10, cursor: 'pointer' }}
            onClick={() => {
              fn.querydirectory(record.id, record.fileType, record.name);
            }}
          >
            {value}
          </span>
          <a
            href="#!"
            className={`classFile${record.id}`}
            onClick={() => fn.downloadFile(record)}
          >
            <DownloadOutlined className="classDown" />
          </a>
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'describe',
      width: 300,
    },
    {
      title: '来源',
      dataIndex: 'sourceType',
      width: 150,
    },
    {
      title: '修改时间',
      dataIndex: 'changeDate',
      width: 150,
    },
    {
      title: '大小',
      dataIndex: 'size',
      width: 100,
      render: text => `${text}kb`,
    },
    {
      title: '操作',
      width: 80,
      render: () => (
        <>
          <a onClick={() => fn.showDeleteConfirm()}>删除</a>
        </>
      ),
    },
  ];

  return (
    <ConfigProvider locale={zhCN}>
      {/* 搜索模块 */}
      <div className="classQuery">
        <Row>
          <Col span={8}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <FolderOutlined />
              新建文件夹
            </Button>
            <Button
              onClick={() => {
                fn.downloadFileBatch();
              }}
            >
              <DownloadOutlined />
              下载
            </Button>
            <FileUpload source={baseList} baseList={fn.getFileUpload} />
            <br />
            <div style={{ padding: '10px 0' }} className="classBreadcrumb">
              <Breadcrumb style={{ cursor: 'pointer' }}>
                <Breadcrumb.Item>
                  <span
                    onClick={() => {
                      fn.getDateList({ directoryId: '0' });
                      setListData({
                        ...listData,
                        directoryId: '0',
                      });
                      setBreadcrumbName([]);
                    }}
                  >
                    全部文件
                  </span>
                </Breadcrumb.Item>
                {BreadcrumbName && BreadcrumbName.length > 0
                  ? BreadcrumbName.map((item, index) => {
                      const key = index;
                      return (
                        <Breadcrumb.Item key={key}>
                          <span
                            onClick={() => {
                              fn.getDateList({
                                directoryId: item.id,
                              });
                              setListData({
                                ...listData,
                                directoryId: item.id,
                              });
                              setBreadcrumbName(
                                BreadcrumbName.slice(0, key + 1),
                              );
                            }}
                          >
                            {item.name}
                          </span>
                        </Breadcrumb.Item>
                      );
                    })
                  : ''}
              </Breadcrumb>
            </div>
          </Col>
          <Col span={8} offset={8}>
            <Row>
              <Col span={12}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="搜索"
                  onPressEnter={value => {
                    fn.queryList(value);
                  }}
                />
              </Col>
              <Col span={8} offset={4}>
                <div
                  onClick={() => {
                    setIsActive(!isActive);
                    setTimeout(() => {
                      fn.handleChange(sortParameters);
                    }, 100);
                  }}
                  style={{
                    width: '150px',
                    transform: 'translateX(10px)',
                    zIndex: '999',
                  }}
                >
                  {/* 排序 */}
                  <SwapRightOutlined
                    style={{
                      transform: 'rotate(90deg) scaleY(-1) translateY(8px)',
                      fontSize: '20px',
                      color: isActive ? '#ccc' : '#1890ff',
                    }}
                  />
                  <SwapLeftOutlined
                    style={{
                      transform: 'rotate(90deg)',
                      fontSize: '20px',
                      color: isActive ? '#1890ff' : '#ccc',
                    }}
                  />

                  {/* 筛选 */}
                  <Select
                    className="classSelect"
                    defaultValue="文件名"
                    style={{
                      width: 100,
                      textAlign: 'center',
                      fontSize: '14px',
                      color: 'rgb(24, 144, 255)',
                    }}
                    onChange={value => {
                      setSortParameters(value);
                      fn.handleChange(sortParameters);
                    }}
                    bordered={false}
                    dropdownMatchSelectWidth={120}
                    dropdownStyle={{ textAlign: 'center' }}
                    onClick={e => e.stopPropagation()}
                    showArrow={false}
                  >
                    <Option value={1}>文件名</Option>
                    <Option value={2}>大小</Option>
                    <Option value={3}>修改日期</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Table
        className="classrow"
        rowKey="name"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableList.length > 0 ? tableList : []}
        pagination={false}
        loading={isloading}
      />
      {/* Model新建文件夹 */}
      <Modal
        title="新建文件夹"
        visible={isVisible}
        centered
        onOk={() => {
          fn.createDirctory();
          fn.clearParam();
        }}
        onCancel={() => fn.clearParam()}
      >
        <div>
          文件夹名称：{' '}
          <Input
            placeholder="输入文件夹名称"
            value={projectParma.name}
            onChange={e => {
              setProjectParma({
                ...projectParma,
                name: e.target.value.trim(),
              });
            }}
          />
        </div>
        <div>
          描述：{' '}
          <Input
            placeholder="输入描述"
            value={projectParma.describe}
            onChange={e => {
              setProjectParma({
                ...projectParma,
                describe: e.target.value.trim(),
              });
            }}
          />
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default connect(({ projectManage }) => ({
  filedList: projectManage.filedList,
  projectList: projectManage.projectList,
}))(FiledList);
