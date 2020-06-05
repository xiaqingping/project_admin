import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import {
  Button,
  Input,
  Breadcrumb,
  Select,
  Modal,
  Table,
  Row,
  Col,
  message,
  Spin,
  notification,
  Tooltip,
} from 'antd';
import {
  FolderOutlined,
  DownloadOutlined,
  FileExclamationOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import Qs from 'qs';
// 自定义
import api from '@/pages/project/api/disk';
import api1 from '@/pages/project/api/projectManageDetail';
import api2 from '@/pages/project/api/file';
import file from '@/assets/imgs/file.png';
import docx from '@/assets/imgs/word.png';
import excel from '@/assets/imgs/excel.png';
import pdf from '@/assets/imgs/pdf.png';
import RecycleBin from '../recycleBin';
import FileEditModal from './components/fileEditModal';
import './index.less';
// 移动 复制 模态框
import ChooseFileList from './components/chooseFileList';

const { Option } = Select;
const { confirm } = Modal;

// 搜索条件
let listData = {
  spaceType: 'project', // String 必填 空间类型（来源可以为服务名称...）
  spaceCode: '', // String 必填 空间编号(可以为功能ID/编号...)
  directoryId: '0', // String 可选 目录ID
  searchName: '', // String 可选 搜索名称（文件或目录名称）
  sortType: 1, // Integer 必填 {1, 2, 3}
  sortWay: 1, // Integer 必填 {1, 2}
};

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

  const [searchName, setSearchName] = useState('');

  /** 状态 */
  // 新建文件夹Model状态
  const [isVisible, setVisible] = useState(false);
  // 修改弹框显示和隐藏
  const [editModalVis, setEditModalVis] = useState(false);
  // 修改文件数据
  const [editRow, setEditRow] = useState();
  // 批量选择的id
  const [selectedRows, setSelectedRows] = useState([]);
  // 排序状态
  const [isActive, setIsActive] = useState(false);

  // 列表加载状态
  const [isloading, setLoading] = useState(true);
  // 复制移动文件Model状态
  const [modelVisible, setModelVisible] = useState(false);
  // 复制或移动文件类型
  const [requestType, setRequestType] = useState('');
  // visible 回收站model状态
  const [isRecycle, setRecycle] = useState(false);
  // 新建文件夹弹框得loading
  const [addLoading, setAddLoading] = useState(false);
  // 是否为全局搜索
  const [globalSearch, setGlobalSearch] = useState(0);
  // let globalSearch = 0;

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
      fn.getDateList();
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

    /**
     * 批量删除
     * @param {string} isMulp 是否是批量删除的标志
     * @param {Object} row 被删除行或者多行的数据
     */
    handleDeleteFiles: (isMulp, row) => {
      let formatData = [];
      if (isMulp) {
        // 批量删除
        formatData = selectedRows.map(item => {
          return {
            id: item.id,
            fileType: item.fileType,
          };
        });
      } else {
        // 单个删除
        formatData = [row].map(item => {
          return {
            id: item.id,
            fileType: item.fileType,
          };
        });
      }
      setLoading(true);
      api2
        .deleteFiles(formatData, 'project', props.projectId)
        .then(() => {
          message.success('文件删除成功!');
          setLoading(false);
          fn.getDateList();
        })
        .catch(() => {
          setLoading(false);
        });
    },

    /** 删除警告
     * @param {string} isMulp 是否是批量删除的标志
     * @param {Object} row 被删除行或者多行的数据
     */
    showDeleteConfirm: (isMulp, row) => {
      if (!row && !selectedRows.length) {
        return false;
      }
      confirm({
        title: row
          ? '删除后将不可恢复，确定删除当前文件吗？'
          : '删除后将不可恢复，确定删除所选文件吗？',
        icon: <ExclamationCircleOutlined />,
        content: '',
        centered: true,
        onOk() {
          fn.handleDeleteFiles(isMulp, row);
        },
      });
      return true;
    },
    /** 查询 */
    queryList: e => {
      const value = e.target.value.trim();
      if (value) {
        listData = {
          ...listData,
          searchName: value,
          directoryId: globalSearch ? listData.directoryId : 0,
        };
        fn.getDateList();
      }
    },
    /** 目录查询 */
    querydirectory: (id, type, name) => {
      if (type === 2) {
        setBreadcrumbName([...BreadcrumbName, { name, id }]);
        listData = {
          ...listData,
          directoryId: id,
        };
        fn.getDateList();
      }
    },
    /** 创建目录 */
    createDirctory: () => {
      const { projectId } = props;
      const { code } = baseList;
      const id = listData.directoryId === '0' ? '3' : listData.directoryId;
      const data = {
        spaceType: 'project',
        sourceCode: code,
        sourceType: 'project',
        spaceCode: projectId,
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
      // setLoading(true);
      setAddLoading(true);
      return api
        .createDirctory(data)
        .then(res => {
          setAddLoading(false);
          fn.clearParam();
          setTableList(res);
          fn.getDateList();
          // setLoading(false);
        })
        .catch(() => {
          // setLoading(false);
          setAddLoading(false);
        });
    },
    /** 清除创建 */
    clearParam: () => {
      setVisible(false);
      setProjectParma({
        name: '',
        describe: '',
      });
    },
    /** 输入框验证 */
    verifyInput: data => {
      const { name } = data;
      // eslint-disable-next-line no-useless-escape
      const reg = /^(?![\s\.])[\u4E00-\u9FA5\uFE30-\uFFA0\w \.\-\(\)\+=!@#$%^&]{1,99}(?![\s\.]).?$/;
      const res = !reg.test(name);
      if (res) {
        message.error('输入字符不合法！');
        return false;
      }
      return true;
    },
    /** 文件下载(单个) */
    downloadFile: row => {
      const { baseURLMap } = props;
      const env = BASE_API;
      const data = {
        spaceCode: props.projectId,
        spaceType: 'project',
        id: row.id,
        fileType: row.fileType,
        dispositionType: 2,
        isDown: 2,
      };
      api2
        .downloadFiles(data)
        .then(() => {
          data.isDown = 1;
          const url = `${
            env === 'dev'
              ? 'http://localhost:8001/192.168.20.14:8150'
              : baseURLMap.env
          }/disk/v1/${data.spaceType}/${data.spaceCode}/files/download/${
            data.id
          }?${Qs.stringify(data)}`;
          window.open(url);
        })
        .catch();
    },
    /** 文件下载（批量） */
    downloadFileBatch: () => {
      const { baseURLMap } = props;
      const env = BASE_API;
      const data = {
        spaceCode: props.projectId,
        spaceType: 'project',
        isDown: 1,
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
        axios({
          url: `${
            env === 'dev'
              ? 'http://localhost:8001/192.168.20.14:8150'
              : baseURLMap.env
          }/disk/v1/${data.spaceType}/${
            data.spaceCode
          }/files/batchDownload?isDown=${data.isDown}`,
          method: 'post',
          data: newFiles,
          headers: {
            Authorization:
              '2oKfjHGD8_Ks-GZ2j7IeFJSAdTARWPRHmUuO5eM34S0hXfahsxNFLPNEM1Si0RQr',
            usercode: 123,
            username: 123,
          },
        })
          .then(res => {
            const content = res;
            const elink = document.createElement('a');
            const fileName = res.headers['content-disposition'].split('=')[1];
            elink.download = fileName;
            elink.style.display = 'none';
            const blob = new Blob([content]);
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          })
          .catch(err => {
            if (err.response.data.details[0]) {
              // eslint-disable-next-line no-shadow
              const message = '请求错误！';
              const description = err.response.data.details[0];
              notification.error({
                message,
                description,
              });
            }
          });
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
    api1.getProjectProcess(props.projectId).then(res => setBaseList(res));
    // 查询成员列表
    api1
      .getProjectMember({
        projectId: props.projectId,
      })
      .then(res => {
        const { code, name } = res[0];
        setBusinessParma({
          businessName: name,
          businessCode: code,
        });
      });
  }, []);

  const editFile = row => {
    setEditRow({ ...row });
    setEditModalVis(true);
  };

  const closeEditModal = v => {
    setEditModalVis(false);
    if (v) fn.getDateList();
  };

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
            style={{
              marginLeft: 10,
              cursor: 'pointer',
            }}
            onClick={() => {
              fn.querydirectory(record.id, record.fileType, record.name);
            }}
          >
            <Tooltip placement="top" title={value}>
              {value}
            </Tooltip>
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
      render: value => (
        <Tooltip placement="top" title={value}>
          {value}
        </Tooltip>
      ),
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
      render: (text, record) => (
        <>
          <a onClick={() => fn.showDeleteConfirm(null, record)}>删除</a>
          <a
            style={{ marginLeft: 10 }}
            onClick={() => {
              editFile(record);
            }}
          >
            修改
          </a>
        </>
      ),
    },
  ];

  /**
   * 复制或移动 文件
   */
  const copyOrMovementFilled = type => {
    // 单个操作
    if (type === 'copy' || type === 'movement') {
      // 单个文件操作时多条数据不执行
      if (selectedRows && selectedRows.length > 1) {
        return message.warning('只可选择一个文件或文件夹!');
      }
      // 选中数据并只有一条
      if (selectedRows && selectedRows.length === 1) {
        setModelVisible(true);
        setRequestType(type);
        return false;
      }
    }

    // 批量操作
    if (type === 'copyBatch' || type === 'movementBatch') {
      if (selectedRows && selectedRows.length) {
        setModelVisible(true);
        setRequestType(type);
        return false;
      }
    }

    return message.warning('请选择需要操作的文件或文件夹!');
  };

  // 关闭文件Model
  const copyFilledCloseModel = () => {
    setModelVisible(false);
    setRequestType('');
  };
  // 关闭回收站模态框
  const onClose = () => {
    setRecycle(false);
  };

  const searchChange = e => {
    setGlobalSearch(e);
    if (listData.searchName.trim()) {
      fn.getDateList({
        directoryId: e * 1 === 0 ? 0 : listData.directoryId,
      });
    }
  };

  const selectBefore = (
    <Select
      title={globalSearch * 1 === 0 ? '全局搜索' : '当前文件搜索'}
      defaultValue={0}
      className="select-before"
      onChange={searchChange}
      style={{ width: 90 }}
      dropdownMatchSelectWidth={150}
    >
      <Option value={0}>全局搜索</Option>
      <Option value={1}>当前文件搜索</Option>
    </Select>
  );

  return (
    <div>
      {/* 搜索模块 */}
      <div className="classQuery">
        <Row>
          <Col span={12}>
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
            <Button
              onClick={() => {
                setRecycle(true);
              }}
            >
              <DeleteOutlined />
              回收站
            </Button>
            <Button onClick={() => fn.showDeleteConfirm('mulp')}>删除</Button>
            <Button onClick={() => copyOrMovementFilled('copy')}>复制</Button>
            <Button onClick={() => copyOrMovementFilled('movement')}>
              移动
            </Button>
            <Button onClick={() => copyOrMovementFilled('copyBatch')}>
              批量复制
            </Button>
            <Button onClick={() => copyOrMovementFilled('movementBatch')}>
              批量移动
            </Button>
            <br />
            <div style={{ padding: '10px 0' }} className="classBreadcrumb">
              <Breadcrumb style={{ cursor: 'pointer' }}>
                <Breadcrumb.Item>
                  <span
                    onClick={() => {
                      fn.getDateList({ directoryId: '0', searchName: '' });
                      listData = {
                        ...listData,
                        directoryId: '0',
                        searchName: '',
                      };
                      setSearchName('');
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
                                searchName: '',
                              });
                              listData = {
                                ...listData,
                                directoryId: item.id,
                                searchName: '',
                              };
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
          <Col span={8} offset={4}>
            <Row>
              <Col span={14}>
                <Input
                  addonBefore={selectBefore}
                  placeholder="搜索"
                  width={150}
                  onPressEnter={value => {
                    fn.queryList(value);
                  }}
                  onChange={e => {
                    setSearchName(e.target.value);
                  }}
                  value={searchName}
                />
              </Col>
              <Col span={7} offset={2}>
                <div
                  onClick={() => {
                    const { sortType } = listData;
                    listData = {
                      ...listData,
                      sortType: sortType === 1 ? 2 : 1,
                    };
                    fn.getDateList();
                    setIsActive(!isActive);
                  }}
                  style={{
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
                      listData = { ...listData, sortWay: value };
                      fn.getDateList();
                    }}
                    bordered={false}
                    dropdownMatchSelectWidth={120}
                    dropdownStyle={{
                      textAlign: 'center',
                    }}
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
        rowKey={record => `${record.fileType}_${record.id}`}
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
        }}
        onCancel={() => fn.clearParam()}
      >
        <Spin spinning={addLoading}>
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
            <Input.TextArea
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
        </Spin>
      </Modal>
      {editModalVis && (
        <FileEditModal
          fileData={editRow}
          changeVis={closeEditModal}
          spaceCode={props.projectId}
        />
      )}
      {/* 移动 复制 模态框 */}
      {modelVisible && (
        <ChooseFileList
          projectId={props.projectId}
          selectedRows={selectedRows}
          onClose={copyFilledCloseModel}
          visible={modelVisible}
          requestType={requestType}
          getData={() => fn.getDateList()}
        />
      )}
      {/* 回收站的模态框 */}
      {isRecycle && (
        <RecycleBin onClose={onClose} getData={() => fn.getDateList()} />
      )}
    </div>
  );
};

export default connect(({ projectManage }) => ({
  filedList: projectManage.filedList,
}))(FiledList);
