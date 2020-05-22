import React, { Component } from 'react';
import {
  Table,
  Tag,
  Divider,
  message,
  Avatar,
  Tooltip,
  Popconfirm,
} from 'antd';
// import { connect } from 'dva';
// import router from 'umi/router';
import api from '@/pages/api';
import style from './index.less';
import disk from '@/pages/api/disk';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import parameterImg from '@/assets/imgs/canshu@1x.png';
import edit from '@/assets/imgs/edit.png';
// import { EditInforModel } from '../ModelUI';
import ProgressMould from '../ProgressMould';

class ProcessTable extends Component {
  constructor(props) {
    super(props);
    console.log(props.processData);
    this.state = {
      // 项目ID
      projectId: '',
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
      projectId: this.props.projectId || '',
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
          list: res.processes,
          loading: false,
        });
      })
      .catch();
  };

  /**
   * 查看流程参数
   * @param {object} processesData 流程数据
   */
  searchProcessParam = processesData => {
    const { projectId } = this.props;
    const { processModelId } = processesData;
    const processId = processesData.id;
    // const { processesStatus } = this.state;

    let type;
    if (processesData.status === 1) {
      type = 'edit';
    } else {
      type = 'view';
    }

    // if (processesStatus) {
    //   type = 'view';
    // }

    // router.push(
    //   // eslint-disable-next-line max-len
    //   `/project/project-manage/process-parameter/${type}_${processModelId}_${projectId}_${processId}`,
    // );
  };

  render() {
    const { tableData, loading } = this.state;

    const columns = [
      {
        title: '名称/描述',
        dataIndex: 'name',
        width: 600,
        render: (value, row, index) => (
          <>
            <span className={style.textEllipsis}>
              <Tooltip placement="top" title={row.describe}>
                {/* <a onClick={() => this.searchTaskList(row)}> */}
                {value} <br /> {row.describe}
                {/* </a> */}
              </Tooltip>
            </span>
            {/* {index === editIndex && (
              <span className={style.textEllipsisImg}>
                <img
                  src={edit}
                  alt=""
                  onClick={() => this.editBasicInfor(row)}
                />
              </span>
            )} */}
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
            <div style={{ float: 'left', marginLeft: '10px' }}>
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
          <img
            src={parameterImg}
            alt=""
            onClick={() => this.searchProcessParam(row)}
            style={{ fontSize: 20, cursor: 'pointer' }}
          />
        ),
      },
      {
        title: '操作',
        width: 200,
        render: (value, row) => (
          <>
            <Popconfirm
              title="确定删除数据？"
              onConfirm={() => this.handleDelete(row)}
            >
              <a>删除</a>
            </Popconfirm>
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
      <Table
        rowKey="id"
        loading={loading}
        dataSource={tableData}
        columns={columns}
        // onRow={(record, index) => ({
        //   onMouseEnter: () => {
        //     this.setState({ editIndex: index });
        //   },
        //   onMouseLeave: () => {
        //     this.setState({ editIndex: -1 });
        //   },
        // })}
        // height={80}
        pagination={false}
      />
    );
  }
}

export default ProcessTable;
