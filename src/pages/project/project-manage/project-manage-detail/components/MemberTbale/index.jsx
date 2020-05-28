/** 成员列表 渲染Table页面 */
import { Form, Table, Select, Avatar, Modal } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

class MemberTbale extends Component {
  tableFormRef = React.createRef();

  state = {
    list: [], // 表格数据
    loading: true, // 加载状态
  };

  /** 组件挂载时 */
  componentDidMount() {
    const { projectId } = this.props;
    this.getCacheData();
    this.getTableData(projectId);
  }

  /** 获取此页面需要用到的基础数据 */
  getCacheData = () => {};

  /**
   * 获取表格数据
   * @param {String} projectId  项目ID
   */
  getTableData = projectId => {
    this.setState({ loading: true });
    const data = { projectId };
    api
      .getProjectMember(data)
      .then(res => {
        this.setState({ list: res });
      })
      .catch();
    this.setState({ loading: false });
  };

  /**
   * 修改成员权限
   * @param {Number} value  选中的权限值
   * @param {Object} row  当前行数据
   */
  handleUpdateJurisdiction = (value, row) => {
    let name = '';
    if (value === 2) name = '管理者';
    if (value === 3) name = '参与者';

    let contenText = '';
    if (value === 1) contenText = `是否将当前项目转交给${row.name}？`;
    else contenText = `是否将当前用户修改为${name}？`;

    const data = {
      id: row.id,
      jurisdictionValue: value,
    };

    confirm({
      icon: <ExclamationCircleOutlined />,
      content: contenText,
      centered: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.getEditModelData(data);
      },
      onCancel: () => {},
    });
  };

  /**
   * 确认修改权限
   * @param {Object} data  修改数据
   */
  getEditModelData = data => {
    api
      .updateMemberJurisdiction(data)
      .then(() => {
        this.getTableData(this.props.projectId);
      })
      .catch();
  };

  /** 退出 */
  handleExit = row => {
    api.deleteMember(row.id).then(() => {
      this.getTableData(this.props.projectId);
    });
  };

  render() {
    const { list, loading } = this.state;
    const { jurisdiction } = this.props.projectManage;

    let columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        width: 150,
        render: value => {
          return (
            <div style={{ display: 'flex' }}>
              <Avatar size={40} src="" />
              <div style={{ marginLeft: 10, marginTop: 6 }}>
                <p>{value}</p>
              </div>
            </div>
          );
        },
      },
      {
        title: '加入时间',
        dataIndex: 'createDate',
        width: 180,
      },
      {
        title: '权限',
        dataIndex: 'jurisdictionValue',
        width: 180,
        render: (value, row) => {
          // const userData = JSON.parse(localStorage.user);
          // let disabledIs = true;
          // if (value === 1 && userData.code === row.code) disabledIs = false;
          const disabledIs = true;
          return (
            <Select
              style={{ width: 100 }}
              disabled={disabledIs}
              defaultValue={value}
              // bordered={false}
              onChange={val => this.handleUpdateJurisdiction(val, row)}
            >
              {jurisdiction.map(e => (
                <Option value={e.id} key={e.name}>
                  {e.name}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'jurisdictionValue',
        width: 150,
        render: (value, row) => {
          if (value === 1) return '';
          return <a onClick={() => this.handleExit(row)}>退出</a>;
        },
      },
    ];

    columns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <>
        <Form ref={this.tableFormRef}>
          <Table
            rowKey="id"
            loading={loading}
            dataSource={list}
            columns={columns}
            onChange={this.handleStandardTableChange}
            pagination={false}
          />
        </Form>
      </>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(MemberTbale);
