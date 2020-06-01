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

// 自定义
import api from '@/pages/project/api/disk';
import api1 from '@/pages/project/api/projectManageDetail';
import file from '@/assets/imgs/file.png';
import docx from '@/assets/imgs/word.png';
import excel from '@/assets/imgs/excel.png';
import pdf from '@/assets/imgs/pdf.png';
import FileEditModal from './components/fileEditModal';
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
  // 当前层级
  const [hierarchy, setHierarchy] = useState('1');
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

  /** 状态 */
  // 新建文件夹Model状态
  const [isVisible, setVisible] = useState(false);
  // 修改弹框显示和隐藏
  const [editModalVis, setEditModalVis] = useState(false);
  // 修改文件数据
  const [editRow, setEditRow] = useState();
  // 排序状态
  const [isActive, setIsActive] = useState(false);
  // 排序筛选参数
  const [sortParameters, setSortParameters] = useState(1);
  // 列表加载状态
  const [isloading, setLoading] = useState(true);

  // 批量操作
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
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
        directoryId: '1',
        searchName: '',
        sortType: sortParameters,
        sortWay,
      };
      fn.getDateList(data);
    },
    /**
     * 获取列表数据
     * @param {*} props
     */
    getDateList: parameters => {
      const { projectId } = props;
      let data = {
        spaceType: 'project', // String 必填 空间类型（来源可以为服务名称...）
        spaceCode: projectId, // String 必填 空间编号(可以为功能ID/编号...)
        directoryId: '', // String 可选 目录ID
        searchName: '', // String 可选 搜索名称（文件或目录名称）
        sortType: 1, // Integer 必填 {1, 2, 3}
        sortWay: 1, // Integer 必填 {1, 2}
      };

      if (parameters)
        data = {
          ...data,
          ...parameters,
        };

      if (!data.directoryId) setBreadcrumbName([]);

      setLoading(true);

      return api.getFiles(data).then(res => {
        setTableList(res);
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
    // 查询
    queryList: e => fn.getDateList({ searchName: e.target.value }),
    // 目录查询
    querydirectory: (id, type, name) => {
      if (type === 2) {
        setBreadcrumbName([...BreadcrumbName, { name, id }]);
        setHierarchy(id);
        fn.getDateList({
          directoryId: id,
        });
      }
    },
    // 创建目录
    createDirctory: () => {
      const { projectId } = props;
      const { code } = baseList;
      const data = {
        spaceType: 'project',
        sourceCode: code,
        parentId: hierarchy,
        sourceType: 'project',
        spaceCode: projectId,
        sourceId: projectId,
        userName: '',
        userCode: '',
        ...businessParma,
        ...projectParma,
      };
      // 校验输入值
      const result = fn.verifyInput(data);
      if (!result) return false;

      setLoading(true);

      return api.createDirctory(data).then(res => {
        setTableList(res);
        fn.getDateList(hierarchy);
        setLoading(false);
      });
    },
    // 清除创建
    clearParam: () => {
      setVisible(false);
      setProjectParma({
        name: '',
        describe: '',
      });
    },
    // 输入框验证
    verifyInput: data => {
      const { name } = data;
      const arr = ['&', '\\', '/', '*', '>', '<', '@', '!'];
      for (let i = 0; i < arr.length; i++) {
        if (name.indexOf(arr[i]) !== -1 || name.indexOf(arr[i]) !== -1) {
          message.error('输入字符不合法！');
          return false;
        }
      }
      return true;
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
    api1.getProjectMember({ projectId: props.projectId }).then(res => {
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

  const closeEditModal = () => setEditModalVis(false);

  // 表结构
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      width: 150,
      render: (value, record) => (
        <div>
          {fn.setImg(record.fileType, record.extendName)}
          <span
            style={{ marginLeft: 10, cursor: 'pointer' }}
            onClick={() => {
              fn.querydirectory(record.id, record.fileType, record.name);
            }}
          >
            {value}
          </span>
          <DownloadOutlined className="classDown" />
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
      render: (text, record) => (
        <>
          <a onClick={() => fn.showDeleteConfirm()}>删除</a>
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

  const handleDeleteFiles = (isMulp, row) => {
    const formatData = {};
    if (isMulp) {
      // 批量删除
      formatData.list = selectedRows.map(item => {
        return {
          id: item.id,
          fileType: item.fileType,
        };
      });
    } else {
      // 单个删除
      formatData.list = [row].map(item => {
        return {
          id: item.id,
          fileType: item.fileType,
        };
      });
    }
    api1.deleteFiles(formatData, 'project', '6e761a1aa7934884b11bf57ebf69db51');
  };

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
            <Button onClick={() => {}}>
              <DownloadOutlined />
              下载
            </Button>
            <Button onClick={() => handleDeleteFiles('mulp')}>删除</Button>
            <br />
            <div style={{ padding: '10px 0' }} className="classBreadcrumb">
              <Breadcrumb style={{ cursor: 'pointer' }}>
                <Breadcrumb.Item>
                  <span
                    onClick={() => {
                      fn.getDateList();
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
                              fn.getDateList(item.id, 2);
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
                    fn.handleChange(sortParameters);
                  }}
                  style={{ transform: 'translateX(10px)', zIndex: '999' }}
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
                    onChange={value => setSortParameters(value)}
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
      {editModalVis && (
        <FileEditModal fileData={editRow} changeVis={closeEditModal} />
      )}
    </ConfigProvider>
  );
};

export default connect(({ projectManage }) => ({
  filedList: projectManage.filedList,
}))(FiledList);
