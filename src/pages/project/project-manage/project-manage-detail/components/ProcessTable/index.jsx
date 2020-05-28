/** 流程列表 渲染Table页面 */
import React, { Component } from 'react';
import {
  Table,
  Tag,
  Divider,
  message,
  Avatar,
  Tooltip,
  Modal,
  Button,
} from 'antd';
import { history } from 'umi';
import api from '@/pages/project/api/projectManageDetail';
import disk from '@/pages/project/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import edit from '@/assets/imgs/edit.png';
import { ExclamationCircleOutlined, SettingOutlined } from '@ant-design/icons';
import style from './index.less';
import { EditInforModel } from '../ModelUI';
import ProgressMould from '../ProgressMould';

const { confirm } = Modal;

class ProcessTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 项目ID
      // projectId: '',
      // 表格数据
      tableData: [],
      // 加载状态
      loading: false,
      // 当前编辑行icon
      editIndex: -1,
      // 是否显示编辑模态框
      visibleModel: false,
      // 选中编辑行数据
      rowData: [],
    };
  }

  /**
   * 组件挂载时
   */
  componentDidMount() {
    this.setState({
      tableData: this.props.processData,
      // projectId: this.props.projectId,
    });
    if (!this.props.processData) this.getTableData(this.props.projectId);
  }

  /**
   * 获取表格数据
   * @param {string} projectId 项目id
   * */
  getTableData = projectId => {
    this.setState({ loading: true });
    api
      .getProjectProcess(projectId)
      .then(res => {
        this.setState({
          tableData: res.processes,
        });
      })
      .catch(error => message.error(error.details));
    this.setState({ loading: false });
  };

  /**
   * 查看流程参数
   * @param {object} processesData 流程数据
   */
  searchProcessParam = processesData => {
    const { projectId } = this.props;
    const { processModelId } = processesData;
    const processId = processesData.id;
    const { processesStatus } = this.state;

    let type;
    if (processesData.status === 1) {
      type = 'edit';
    } else {
      type = 'view';
    }

    if (processesStatus) {
      type = 'view';
    }

    history.push(
      // eslint-disable-next-line max-len
      `/project/project-manage/process-parameter/${type}_${processModelId}_${projectId}_${processId}`,
    );
  };

  /** 编辑名称描述模态框 */
  editBasicInfor = row => {
    this.setState({
      visibleModel: true,
      rowData: row,
    });
  };

  /** 关闭编辑模态框 */
  onCloseModel = () => {
    this.setState({
      visibleModel: false,
    });
  };

  /**
   * 获取回传数据进行保存
   * @param {object} data 回传数据
   */
  getEditModelData = data => {
    api
      .saveProcessInfor(data)
      .then(() => {
        this.setState({ visibleModel: false });
        this.getTableData(this.props.projectId);
      })
      .catch(error => message.error(error.details));
  };

  /**
   * 删除
   * @param {Object} row 当前行数据
   * */
  handleDelete = row => {
    this.setState({ loading: true });
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '删除后将不可恢复，确认删除当前流程吗？',
      centered: true,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        api.deleteProjectProcess(row.id).then(() => {
          this.getTableData(this.props.projectId);
        });
      },
      onCancel: () => {},
    });
    this.setState({ loading: false });
  };

  /**
   * 添加流程
   */
  handleAddProcesses = () => {
    const type = 'edit';
    const { projectId } = this.props;
    history.push(
      `/project/project-manage/add/addflowpath/${type}_${projectId}`,
    );
  };

  render() {
    const { tableData, loading, editIndex, visibleModel, rowData } = this.state;

    const columns = [
      {
        title: '名称/描述',
        dataIndex: 'name',
        width: 600,
        render: (value, row, index) => (
          <>
            <span className={style.textEllipsis}>
              <Tooltip placement="top" title={row.describe}>
                {value} <br /> {row.describe}
              </Tooltip>
            </span>
            {index === editIndex && (
              <span className={style.textEllipsisImg}>
                <img
                  src={edit}
                  alt=""
                  onClick={() => this.editBasicInfor(row)}
                />
              </span>
            )}
          </>
        ),
      },
      {
        title: '进度',
        dataIndex: 'processProgress',
        width: 270,
        render: (value, row) => <ProgressMould percentData={row} />,
      },
      {
        title: '流程模型',
        dataIndex: 'processModelName',
        width: 350,
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.processModelPicture
                  ? disk.downloadFiles(row.processModelPicture, { view: true })
                  : DefaultHeadPicture
              }
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left', marginLeft: 8 }}>
              <div>{value}</div>
              <div>
                <span style={{ marginRight: 10 }}>
                  {' '}
                  {row.processModelCode}{' '}
                </span>
                <Tag color="green"> {row.processModeVersion} </Tag>
              </div>
            </div>
          </>
        ),
      },
      {
        title: '参数',
        dataIndex: 'type',
        width: 150,
        render: (value, row) => (
          <SettingOutlined
            onClick={() => this.searchProcessParam(row)}
            style={{
              fontSize: 20,
              color: '#1890ff',
              marginLeft: 5,
            }}
          />
        ),
      },
      {
        title: '操作',
        width: 200,
        render: (value, row) => (
          <>
            <a onClick={() => this.handleDelete(row)}>删除</a>
            {row.interactionAnalysis === 1 ? (
              <>
                <Divider type="vertical" />
                <a onClick={() => message.success('交互分析')}>交互分析</a>
              </>
            ) : (
              ''
            )}
          </>
        ),
      },
    ];

    return (
      <>
        <Button
          type="primary"
          onClick={() => this.handleAddProcesses()}
          style={{ borderRadius: 5 }}
        >
          添加流程
        </Button>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={tableData}
          columns={columns}
          onRow={(record, index) => ({
            onMouseEnter: () => {
              this.setState({ editIndex: index });
            },
            onMouseLeave: () => {
              this.setState({ editIndex: -1 });
            },
          })}
          height={80}
          style={{
            marginBottom: 36,
          }}
          pagination={false}
        />
        <EditInforModel
          visible={visibleModel}
          onClose={this.onCloseModel}
          rowData={rowData}
          getData={this.getEditModelData}
        />
      </>
    );
  }
}

export default ProcessTable;
