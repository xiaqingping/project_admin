// 项目列表
import React, { Component } from 'react';
import {
  Button,
  Divider,
  Select,
  message,
  Menu,
  Dropdown,
  Tag,
  Modal,
  DatePicker,
  ConfigProvider,
} from 'antd';
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';

import { formatter } from '@/utils/utils';
import api from '@/pages/project/api/projectManage';
import zhCN from 'antd/es/locale/zh_CN';
import style from './index.less';

localStorage.setItem(
  'token',
  '2oKfjHGD8_Ks-GZ2j7IeFJSAdTARWPRHmUuO5eM34S0hXfahsxNFLPNEM1Si0RQr',
);
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

class ProjectManagement extends Component {
  tableSearchFormRef = React.createRef();

  projectIds = null;

  dateRange = [];

  constructor(props) {
    super(props);
    this.state = {
      projectIds: null,
      // pagination: {},
      // loading: false,
      // list: [],
      createDate: [],
      modelSearchOptions: [], // 项目管理模糊搜素options
    };
    // 异步验证做节流处理

    this.fetchCodeData = debounce(this.fetchCodeData, 500);
  }

  // 异步节流处理的方法
  fetchCodeData = value => {
    api.gettProjectManageCodeAndName(value).then(res => {
      this.setState({ modelSearchOptions: res || [] });
    });
  };

  /**
   * 列表查询数据的处理
   * @param {object} params request返回的数据
   */
  getParamData = params => {
    const newObj = {
      page: params.current,
      pageSize: params.pageSize,
      id: params.projectIds ? params.projectIds : '',
      // status: params.status ? params.status : '',
      // status:
      //   params.status && params.status.length ? params.status.join(',') : '',
      // creatorCode: params.creatorCode,
      beginDate: params.createDate ? params.createDate[0] : '',
      endDate: params.createDate ? params.createDate[1] : '',
    };
    Object.getOwnPropertyNames(newObj).forEach(key => {
      if (!newObj[key]) {
        delete newObj[key];
      }
    });
    return newObj;
  };

  /**
   * 状态的值处理
   */
  statusValue = () => {
    const { status } = this.props;
    // 状态的值
    let statusValue = {};
    status.forEach(item => {
      statusValue = {
        ...statusValue,
        [item.value]: { text: item.text, status: item.status },
      };
    });
    return statusValue;
  };

  /**
   * 新建项目
   * @param {object} data 点击新建项目时传入的类型
   */
  handleAdd = () => {
    const data = { requestType: 'addProject' };
    this.props.dispatch({
      type: 'projectManage/setProjectData',
      payload: data,
    });
    history.push('/project/project-manage/add');
  };

  /**
   * 修改项目信息
   * @param {string} requestType 点击新建项目时传入的类型
   * @param ModifyProject 存入sessionStorage的值（项目基础信息）
   *  */
  editRow = row => {
    history.push(`/project/project-manage/edit/${row.id}`);
  };

  /**
   * 项目管理详情页面
   * @param {object} projectId 当前数据的id
   * */
  searchDetails = row => {
    const projectId = row.id;
    history.push(`/project/project-manage/detail/${projectId}`);
  };

  /**
   * 删除
   * @param {Array} row 当前数据
   * */
  deleteRow = row => {
    api.deleteProjectManage(row.id).then(() => {
      message.success('项目删除成功!');
      this.tableSearchFormRef.current.reload();
    });
  };

  /**
   * 修改项目状态
   * @param {Array} row 当前数据
   * @param {object} type 类型
   * */
  handleUpdateStatus = (row, type) => {
    if (!(row.status === type)) {
      const data = {
        id: row.id,
        status: type,
      };
      api.updateProjectStatus(data).then(() => {
        this.tableSearchFormRef.current.reload();
      });
    }
  };

  // 状态下拉列表
  menuList = row => (
    <Menu>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 1)}>未开始</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 2)}>进行中</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 3)}>已完成</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 4)}>已终止</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={() => this.handleUpdateStatus(row, 5)}>待处理</a>
      </Menu.Item>
    </Menu>
  );

  /**
   * 设置表格的colums
   */

  columns = () => {
    const { status, labels } = this.props;
    return [
      {
        title: '项目',
        dataIndex: 'code',
        hideInSearch: true,
        render: (value, row) => (
          <>
            <div style={{ float: 'left', marginLeft: '10px' }}>
              <div>{row.name}</div>
              <div>
                <a onClick={() => this.searchDetails(row)}>{value}</a>
              </div>
            </div>
          </>
        ),
      },

      {
        title: '描述',
        dataIndex: 'describe',
        width: 400,
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        // width: 200,
        filters: status,
        hideInSearch: true,
        render: (value, row) => {
          const color = formatter(status, value, 'value', 'color');
          return (
            <Dropdown overlay={this.menuList(row)} className="classmenulist">
              <Button
                style={{
                  background: color,
                  color: '#fff',
                  borderRadius: '12px',
                  textAlign: 'center',
                  width: '60px',
                  height: '24px',
                  border: 'none',
                }}
                size="small"
              >
                {formatter(status, value, 'value', 'text')}
              </Button>
            </Dropdown>
          );
        },
      },
      {
        title: '标签',
        dataIndex: 'labels',
        hideInSearch: true,
        render: value => {
          const arr = [];
          if (value) {
            value.forEach(item => {
              labels.forEach(i => {
                if (i.id === item) {
                  arr.push(
                    <Tag color={i.color} key={i.id}>
                      {i.name} {i.text}
                    </Tag>,
                  );
                }
              });
            });
          }
          return <>{arr}</>;
        },
      },
      {
        title: '操作',
        hideInSearch: true,
        render: row => (
          <>
            <a onClick={() => this.showConfirm(row)}>删除</a>
            <Divider type="vertical" />
            <a onClick={() => this.editRow(row)}>修改</a>
          </>
        ),
      },
    ];
  };

  showConfirm = row => {
    confirm({
      title: '删除后将不可恢复,确定删除当前项目吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.deleteRow(row);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  handleSearchCodeChange = value => {
    this.projectIds = value && value.value;
  };

  setParamState = action => {
    this.setState({
      projectIds: this.projectIds,
      createDate: this.dateRange,
    });
    action.setPageInfo({ page: 1 });
  };

  dateChange = (v, dateArr) => {
    this.dateRange = dateArr;
  };

  render() {
    const { modelSearchOptions, projectIds, createDate } = this.state;
    return (
      <ConfigProvider locale={zhCN}>
        <div>
          <div style={{ padding: 24, background: '#F0F2F5' }}>
            <div className={style.manageTitle}>项目列表</div>
            <ProTable
              actionRef={this.tableSearchFormRef}
              headerTitle={
                <Button type="primary" onClick={() => this.handleAdd()}>
                  <PlusOutlined />
                  新建
                </Button>
              }
              search={false}
              rowKey="id"
              request={params => {
                return api
                  .getProjectManage(this.getParamData(params))
                  .then(res => ({
                    data: res.results,
                    total: res.total,
                    success: true,
                  }));
              }}
              columns={this.columns()}
              options={false}
              pagination={{
                defaultPageSize: 10,
              }}
              params={{ projectIds, createDate }}
              toolBarRender={action => [
                <Select
                  placeholder="项目名称"
                  allowClear
                  showSearch
                  showArrow={false}
                  labelInValue
                  filterOption={false}
                  onSearch={this.fetchCodeData}
                  onChange={this.handleSearchCodeChange}
                  style={{ width: 200 }}
                  optionFilterProp="children" // 对子元素--option进行筛选
                  optionLabelProp="label" // 回填的属性
                >
                  {modelSearchOptions.map(d => (
                    <Option key={d.code} value={d.id} label={d.name}>
                      {d.code}&nbsp;&nbsp;{d.name}
                    </Option>
                  ))}
                </Select>,
                <RangePicker onChange={this.dateChange} />,
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ marginLeft: 8 }}
                  size="middle"
                  onClick={() => this.setParamState(action)}
                />,
              ]}
            />
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
  status: projectManage.status,
  labels: projectManage.labels,
}))(ProjectManagement);
