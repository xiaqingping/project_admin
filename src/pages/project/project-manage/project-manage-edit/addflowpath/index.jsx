// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  message,
  Table,
  Form,
  Popconfirm,
  Avatar,
  ConfigProvider,
  Empty,
} from 'antd';
import { history } from 'umi';
import { connect } from 'dva';
import { PlusOutlined, SettingOutlined } from '@ant-design/icons';
import api from '@/pages/project/api/projectManage';
import disk from '@/pages/project/api/disk';
import emptyImg from '@/assets/imgs/empty.png';
import DefaultHeadPicture from '@/assets/imgs/defaultheadpicture.jpg';
import ChooseProcessModel from '../components/ChooseProcessModel';
import '@/pages/project/project-manage/project-manage-edit/index.less';

localStorage.setItem(
  'token',
  '2oKfjHGD8_Ks-GZ2j7IeFJSAdTARWPRHmUuO5eM34S0hXfahsxNFLPNEM1Si0RQr',
);

class Test extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    // 传过来的已有项目的id和类型
    // TODO:
    const { id } = this.props.match.params;
    const data = id.split('_');
    const { projectInfor } = this.props.projectManage;

    this.state = {
      processType: data[0], // 请求类型 edit：流程列表跳转 携带项目id  add：新建项目跳转 无id
      projectId: data[1] || '', // 项目Id
      paramsType: data[2], // 参数页面带过来的判断是否强制刷新已选流程

      visible: false,
      list: [],
      loading: false,
      projectInfor, // 项目基础信息
      buttonLoading: false,
    };
  }

  /**
   * 渲染页面时调用
   * @param {Array} paramList 参数数据
   * @param {String} processType url带来的判断类型
   * @param {Object} paramsType 进入参数页面返回时传入的判断类型
   * @param introduction 存储已选流程数据的值
   * @param processForParams 存储参数数据的值
   */
  componentDidMount() {
    const { processType, paramsType } = this.state;
    this.getData();

    // 保存已选流程
    const introductionProcess = JSON.parse(
      sessionStorage.getItem('introduction'),
    );

    if (introductionProcess !== null) {
      this.setState({
        list: introductionProcess,
      });
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: introductionProcess,
      });
    }

    if (processType === 'add' && paramsType === undefined) {
      // console.log('新建项目进入页面先清空已选流程的数据');
      sessionStorage.removeItem('introduction');
      sessionStorage.removeItem('processForParams');
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: introductionProcess,
      });
      this.setState({
        list: [],
      });
    }

    if (processType === 'edit' && paramsType === undefined) {
      // console.log('已建项目进入页面先清空已选流程的数据');
      sessionStorage.removeItem('introduction');
      sessionStorage.removeItem('processForParams');
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: introductionProcess,
      });
      this.setState({
        list: [],
      });
    }
  }

  /**
   * 点击打开关联
   * @param {array} projectInfor 新建项目的基础信息
   * @param {strin} processType 新建项目传入的类型
   * @param {string} visible 控制模态框的显示收藏
   * */
  onOpen = () => {
    const { projectInfor, processType } = this.state;
    if (processType === 'add' && projectInfor.length === 0) {
      this.setState({
        visible: false,
      });
      message.error('新建项目基础信息未保存！请重新选择新建');
      history.push('/');
    }
    this.setState({
      visible: true,
    });
  };

  // 点击关闭关联
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  /**
   * 删除已选流程
   * @param {object} value 当前数据
   * @param {Array} tableData 已选中的流程模型的集合
   * @param {Array} newData 已删除过的流程模型的集合
   * */
  deleteRow = value => {
    const tableData = this.state.list;
    const newData = tableData.filter(item => item.id !== value.id);

    this.setState({
      list: newData,
    });
    this.props.dispatch({
      type: 'projectManage/setProcessSelectedList',
      payload: newData,
    });
    sessionStorage.setItem('introduction', JSON.stringify(newData));
  };

  /**
   * 打开参数
   * @param {Array} paramList 参数数据
   * @param introduction 存储已选流程数据的方法名
   * @param projectId 项目id
   * @param processModelId 流程模型id
   */
  handleOpen = row => {
    // console.log(row)
    // 参数数据
    const paramList = JSON.parse(sessionStorage.getItem('processForParams'));
    // console.log(paramList)
    // TODO:
    const { projectId } = this.state;
    let type = 'add';
    const it = [];
    // if (paramList === null) type = 'add';
    if (paramList) {
      paramList.forEach(item => {
        it.push(item);
        it.forEach(e => {
          if (e.processModelId === row.id) {
            type = 'update';
          }
        });
      });
    }

    const processModelId = row.id;

    let url;
    if (projectId === '' || projectId === "''") {
      url = `/project/project-manage/process-parameter/${type}_${processModelId}`;
    } else {
      url = `/project/project-manage/process-parameter/${type}_${processModelId}_${projectId}`;
    }
    history.push(url);
  };

  /**
   * 获取模态框选中的流程模型数据
   * @param {Array} list 已选流程
   * @param introduction 存储已选流程数据的方法名
   */
  getData = value => {
    // 存储选中的流程模型数据
    if (!(value === '' || value === undefined)) {
      const processModalList =
        JSON.parse(sessionStorage.getItem('introduction')) || [];
      const listMap = {};
      processModalList.forEach(item => {
        listMap[item.id] = item;
      });
      value.forEach(item => {
        if (!listMap[item.id]) {
          processModalList.push(item);
        }
      });
      sessionStorage.setItem('introduction', JSON.stringify(processModalList));

      this.setState({
        list: processModalList,
      });
      this.props.dispatch({
        type: 'projectManage/setProcessSelectedList',
        payload: processModalList,
      });
    }
  };

  /**
   * 保存
   * @param {object} projectInfor 新建项目的基础信息
   * @param {Array} list 已选流程
   * @param {Array} paramList 参数数据
   * @param {object} processType url带来的判断类型
   * @param {object} projectId 项目id
   */
  handleSave = () => {
    this.setState({
      buttonLoading: true,
    });
    const { list, projectInfor, processType, projectId } = this.state;
    const paramList = JSON.parse(sessionStorage.getItem('processForParams'));
    let status = false;

    if (processType === 'add') {
      // console.log('新建项目跳转，基础信息有值的保存,');

      if (list === '' || list === undefined) {
        status = true;
      }
      if (projectInfor === '' || projectInfor === undefined) {
        status = true;
      }
      if (paramList === '' || paramList === undefined) {
        status = true;
      }
      if (status) return message.error('数据为空');

      // 设置好的参数追加在流程列表数据中
      const newList = [];
      list.forEach(item => {
        let newItem = {};
        newItem = {
          describe: item.describe,
          name: item.name,
          processModelId: item.id,
        };
        if (paramList && paramList.length > 1) {
          paramList.forEach(e => {
            if (item.id === e.processModelId) {
              newItem.processesParams = e.params;
            }
          });
        }

        if (paramList && paramList.length === 1) {
          newItem.processesParams = paramList[0].params;
        }

        newList.push(newItem);
      });

      projectInfor.processes = newList;
      const data = projectInfor;
      api
        .addProjects(data)
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          history.push('/');
        })
        .catch(() => {
          this.setState({
            buttonLoading: false,
          });
        });
      sessionStorage.removeItem('introduction');
      sessionStorage.removeItem('processForParams');
    }
    if (processType === 'edit') {
      // console.log('正常从已有项目跳转，');
      const newList = [];
      list.forEach(item => {
        let newItem = {};
        newItem = {
          describe: item.describe,
          name: item.name,
          processModelId: item.id,
        };

        if (paramList && paramList.length > 1) {
          paramList.forEach(e => {
            if (item.id === e.processModelId) {
              newItem.processesParams = e.params;
            }
          });
        }
        if (paramList && paramList.length === 1) {
          newItem.processesParams = paramList[0].params;
        }

        newList.push(newItem);
      });
      const processes = newList;
      api
        .addProjectsProcess({ projectId, processes })
        .then(() => {
          this.setState({
            buttonLoading: false,
          });
          history.push(`/project/project-manage/detail/${projectId}`);
        })
        .catch(err => {
          // 错误提示
          if (err && err.details) message.error(err.details);

          this.setState({
            buttonLoading: false,
          });
        });
    }
    sessionStorage.removeItem('introduction');
    sessionStorage.removeItem('processForParams');
    sessionStorage.removeItem('bpModel');
    return '';
  };

  // 返回
  goBack = () => {
    const { processType, projectId } = this.state;
    const { projectInfor } = this.props.projectManage;
    let url;
    if (processType === 'add' && projectInfor !== '') {
      // console.log(
      //   '新建项目选择流程时，返回新建项目基础信息页面，这个页面是修改信息的操作',
      // // );
      const requestType = 'addGoback';
      url = `/project/project-manage/add/${requestType}`;
    } else {
      // console.log('已建项目选择流程时，返回项目列表详情页');
      url = `/project/project-manage/detail/${projectId}`;
    }
    sessionStorage.removeItem('introduction');

    history.push(url);
  };

  render() {
    const { list, loading, visible, buttonLoading } = this.state;
    const columns = [
      {
        title: '流程',
        dataIndex: 'name',
        width: 900,
        render: (value, row) => (
          <>
            <div>{value}</div>
            <div>{row.describe}</div>
          </>
        ),
      },
      {
        title: '模型',
        dataIndex: 'name',
        width: 300,
        render: (value, row) => (
          <>
            <Avatar
              src={
                row.picture
                  ? disk.downloadFiles(row.picture, { view: true })
                  : DefaultHeadPicture
              }
              style={{ float: 'left', width: '46px', height: '46px' }}
            />
            <div style={{ float: 'left' }}>
              <div>{value}</div>
              <div>{row.code}</div>
            </div>
          </>
        ),
      },
      {
        title: '参数',
        dataIndex: 'parameter',
        width: 100,
        render: (value, row) => (
          <SettingOutlined
            style={{ cursor: 'pointer', color: '#1890ff', fontSize: 20 }}
            onClick={() => this.handleOpen(row)}
          />
        ),
      },
      {
        title: '操作',
        width: 200,
        render: value => (
          <>
            <a onClick={() => this.deleteRow(value)}>删除</a>
            <Popconfirm
              placement="topLeft"
              title="确定要删除吗？"
              onConfirm={() => this.confirm(value)}
              okText="确定"
              cancelText="取消"
            />
          </>
        ),
      },
    ];

    // 判断list数组的长度，为0时控制form的margin-bottom的值，
    let listLength;
    if (list.length === 0) {
      listLength = {
        margin: '0 24px 286px 24px',
      };
    }
    if (list.length !== 0 && list.length === 1) {
      listLength = {
        margin: '0 24px 375px 24px',
      };
    }
    if (list.length !== 0 && list.length === 2) {
      listLength = {
        margin: '0 24px 300px 24px',
      };
    }
    if (list.length !== 0 && list.length === 3) {
      listLength = {
        margin: '0 24px 220px 24px',
      };
    }
    if (list.length !== 0 && list.length === 4) {
      listLength = {
        margin: '0 24px 144px 24px',
      };
    }
    if (list.length !== 0 && list.length === 5) {
      listLength = {
        margin: '0 24px 65px 24px',
      };
    }
    if ((list.length !== 0 && list.length === 6) || list.length > 6) {
      listLength = {
        margin: '0 24px 24px 24px',
      };
    }

    return (
      // <ConfigProvider renderEmpty={this.EmptyState}>
      <ConfigProvider>
        <div style={{ background: '#F0F2F5', width: '100%' }}>
          <Form style={listLength}>
            <div
              style={{
                background: '#FFFFFF',
                height: '80px',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'left',
                paddingLeft: '24px',
                lineHeight: '80px',
                marginBottom: '20px',
                marginTop: '24px',
              }}
            >
              添加流程
            </div>
            <div style={{ background: '#FFFFFF' }}>
              {list.length === 0 ? (
                <Empty
                  image={emptyImg}
                  style={{ padding: '48px 0' }}
                  description={<span>暂无数据</span>}
                />
              ) : (
                <Table
                  rowClassName="editable-row"
                  rowKey="id"
                  loading={loading}
                  dataSource={list}
                  columns={columns}
                  pagination={false}
                />
              )}
              <Button
                type="dashed"
                onClick={this.onOpen}
                icon={<PlusOutlined />}
                style={{
                  width: '98%',
                  height: '30px',
                  margin: '24px 0 24px 8px ',
                }}
              >
                选择流程模型
              </Button>
            </div>
          </Form>
          <div
            style={{
              height: '56px',
              width: '100%',
              lineHeight: '56px',
              textAlign: 'right',
              background: '#FFFFFF',
            }}
            className="classPageHeaderWrapperFooter"
          >
            <div style={{ margin: '0 150px 24px 150px' }}>
              <Button
                type="default"
                onClick={() => this.goBack(true)}
                style={{ marginRight: '10px' }}
              >
                返回
              </Button>
              <Button
                type="primary"
                onClick={() => this.handleSave()}
                style={{ marginRight: '10px' }}
                loading={buttonLoading}
              >
                保存
              </Button>
            </div>
          </div>

          {visible ? (
            <ChooseProcessModel
              visible={visible}
              onClose={v => this.onClose(v)}
              getData={v => this.getData(v)}
            />
          ) : (
            ''
          )}
        </div>
      </ConfigProvider>
    );
  }
}

// export default Addflowpath;
export default connect(({ projectDetail, projectManage }) => ({
  projectDetail,
  projectManage,
}))(Test);
