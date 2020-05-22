// 项目管理：新建项目
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Card, Form, Tag, Button, DatePicker, message } from 'antd';
// import router from 'umi/router';
import { history } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import api from '@/pages/project/api/projectManage';
import detailApi from '@/pages/project/api/projectManageDetail';
// import classNames from 'classnames';
import BPList from './components/BPList';
// import './index.less';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;

class ProjectEdit extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const projectId = this.props.match.params;
    const { labels } = props.projectManage;

    this.state = {
      // requestType: 'addProject', // 请求类型
      selectedlabels: [], // 选中标签
      bpCode: '', // bp编号
      bpName: '', // bp名称
      beginDate: '', // 开始时间
      endDate: '', // 结束时间
      projectData: [],
      labels,
      projectId,
    };
  }

  /**
   * 获取表格数据
   * @param {string} projectId 查询字符串guid
   */
  getTableData = projectId => {
    detailApi.getProjectEdit(projectId).then(res => {
      this.setState({
        projectData: res,
      });
      // 设置初始值
      if (!(this.formRef.current === null)) {
        this.formRef.current.setFieldsValue({
          name: res.name,
          describe: res.describe,
          bpName: res.bpName,
        });
      }
      this.setState({
        selectedlabels: res.labels || [],
        beginDate: res.beginDate,
        endDate: res.endDate,
      });
    });
  };

  // 组件加载时
  componentDidMount = () => {
    // 加载table数据
    // const { projectId, requestType } = this.state;
    // if (JSON.stringify(projectId) === '{}') {
    //   this.setState({
    //     requestType,
    //   });
    // }
    // if (JSON.stringify(projectId) !== '{}') {
    //   this.setState({
    //     requestType: 'editProject'
    //   });
    //   this.getTableData(projectId.id);
    // }
    // return false;
  };

  // 保存
  handleSave = () => {
    const data = this.saveData();
    const { projectId } = this.state;
    // 新建
    if (JSON.stringify(projectId) === '{}') {
      api.addProjects(data).then(() => {
        history.push('/project/project-manage');
      });
    }
    // 修改
    if (JSON.stringify(projectId) !== '{}') {
      api.updateProjects(data).then(() => {
        history.push('/project/project-manage');
      });
    }
    // sessionStorage.removeItem('ModifyProject');
  };

  // 保存时所需数据
  saveData = () => {
    const {
      selectedlabels,
      bpCode,
      bpName,
      endDate,
      beginDate,
      projectId,
    } = this.state;

    const formData = this.formRef.current.getFieldsValue();

    if (formData.name === undefined) {
      message.error('项目名称不能为空！');
      return false;
    }
    if (formData.describe === undefined) {
      message.error('项目描述不能为空！');
      return false;
    }

    // 新增项目
    let data;
    if (JSON.stringify(projectId) === '{}') {
      if (bpName === '') {
        message.error('所有者不能为空！');
        return false;
      }
      if (beginDate === '') {
        message.error('开始时间不能为空！');
        return false;
      }
      if (endDate === '') {
        message.error('结束时间不能为空！');
        return false;
      }
      if (selectedlabels.length === 0) {
        message.error('标签不能为空！');
        return false;
      }
      data = {
        name: formData.name,
        describe: formData.describe,
        bpCode,
        bpName,
        endDate,
        beginDate,
        labels: selectedlabels,
      };
    }

    // 修改项目
    if (JSON.stringify(projectId) !== '{}') {
      data = {
        id: projectId.id,
        name: formData.name,
        describe: formData.describe,
        labels: selectedlabels,
      };
    }
    return data;
  };

  // 返回
  goBack = () => {
    message.success('返回上一页');
  };

  // 时间选中事件
  handleOnChangeTime = (value, dateString) => {
    this.setState({
      beginDate: dateString[0],
      endDate: dateString[1],
    });
  };

  // 标签选中事件
  handleOnChangelabel = (tag, checked) => {
    const { selectedlabels } = this.state;
    // eslint-disable-next-line max-len
    const nextSelectedTags = checked
      ? [...selectedlabels, tag]
      : selectedlabels.filter(t => t !== tag);
    this.setState({ selectedlabels: nextSelectedTags });
  };

  // 获取业务伙伴模态框回传数据
  getBPData = data => {
    this.formRef.current.setFieldsValue({
      bpName: data.name,
    });
    this.setState({
      bpCode: data.code,
      bpName: data.name,
    });
  };

  // 跳转到添加流程页面
  handleAdd = () => {
    const data = this.saveData();
    if (data === false) {
      this.props.dispatch({
        type: 'projectManage/setProjectInfor',
        payload: data,
      });
    } else {
      data.requestType = 'add';
      this.props.dispatch({
        type: 'projectManage/setProjectInfor',
        payload: data,
      });

      history.push('/project/project-manage/add/addflowpath/add');
    }
  };

  // 导航列表title样式
  navContent = () => {
    const { projectId, projectData } = this.state;
    let titleName;
    if (JSON.stringify(projectId) === '{}') {
      titleName = '新建项目';
    }
    if (JSON.stringify(projectId) !== '{}') {
      titleName = projectData.name;
    }

    return <div>{titleName}</div>;
  };

  render() {
    const { selectedlabels, projectData, labels, projectId } = this.state;
    return (
      <PageHeaderWrapper>
        <div
          style={{
            background: 'pink',
            height: '80px',
            fontSize: '20px',
            color: 'red',
            textAlign: 'center',
            lineHeight: '80px',
          }}
        >
          春去秋来
        </div>
        <Form
          ref={this.formRef}
          className="classPageHeaderWrapper"
          style={{ margin: '0 150px 24px 150px' }}
        >
          <Card bordered={false} style={{ background: 'skyblue' }}>
            <div
              style={{
                background: 'yellowgreen',
                height: '80px',
                fontSize: '20px',
                color: 'red',
                textAlign: 'left',
                paddingLeft: '24px',
                lineHeight: '80px',
                marginBottom: '20px',
              }}
            >
              新建项目
            </div>
            <FormItem
              label="名称"
              name="name"
              style={{
                paddingRight: '50px',
                width: '600px',
                marginBottom: '20px',
              }}
            >
              <Input
                placeholder="请输入项目名称"
                maxLength={20}
                style={{ marginLeft: '40px' }}
              />
            </FormItem>
            <FormItem
              label="描述"
              name="describe"
              style={{
                paddingRight: '50px',
                width: '600px',
                marginBottom: '20px',
              }}
            >
              <TextArea
                rows={4}
                placeholder="请输入项目描述"
                maxLength="200"
                spellCheck="false"
                style={{ marginLeft: '40px' }}
              />
            </FormItem>
            <div style={{ width: '300px', marginBottom: '20px' }}>
              <FormItem label="所有者" name="bpName">
                <Search
                  onSearch={() => this.showBPList.visibleShow(true)}
                  style={{ marginLeft: '26px' }}
                  readOnly
                  disabled={JSON.stringify(projectId) !== '{}'}
                />
              </FormItem>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <FormItem
                label="时间"
                name="time"
                style={{ paddingRight: '50px' }}
              >
                {JSON.stringify(projectId) === '{}' ? (
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.handleOnChangeTime}
                    style={{ marginLeft: '40px' }}
                  />
                ) : (
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    // defaultValue={[
                    //   moment(projectData.beginDate, 'YYYYMMDD HH:mm:ss'),
                    //   moment(projectData.endDate, 'YYYYMMDD HH:mm:ss'),
                    // ]}
                    initialValues={[
                      moment(projectData.beginDate, 'YYYYMMDD HH:mm:ss'),
                      moment(projectData.endDate, 'YYYYMMDD HH:mm:ss'),
                    ]}
                    onChange={this.handleOnChangeTime}
                    style={{ marginLeft: '40px' }}
                    disabled={JSON.stringify(projectId) !== '{}'}
                  />
                )}
              </FormItem>
            </div>
            <div style={{ height: '250px' }}>
              <FormItem label="标签" name="label">
                <div style={{ marginLeft: '40px', marginRight: '270px' }}>
                  {labels.map(item => (
                    <CheckableTag
                      key={item.id}
                      checked={selectedlabels.indexOf(item.id) > -1}
                      onChange={checked =>
                        this.handleOnChangelabel(item.id, checked)
                      }
                      style={{
                        height: '30px',
                        border: '1px',
                        borderStyle: 'solid',
                        borderColor: '#dcdcdc',
                        lineHeight: '30px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        marginBottom: '5px',
                      }}
                    >
                      {item.name} {item.text}
                    </CheckableTag>
                  ))}
                </div>
                {/* 12467678 */}
              </FormItem>
            </div>
          </Card>
        </Form>
        <div
          style={{
            height: '56px',
            width: '100%',
            borderTop: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
            lineHeight: '56px',
            textAlign: 'right',
          }}
          className="classPageHeaderWrapperFooter"
        >
          <Button
            type="default"
            onClick={() => this.goBack(true)}
            style={{ marginRight: '10px' }}
          >
            返回
          </Button>
          <Button
            type="default"
            onClick={() => this.handleSave()}
            style={{ marginRight: '10px' }}
          >
            保存
          </Button>
          {JSON.stringify(projectId) === '{}' ? (
            <Button type="primary" onClick={() => this.handleAdd(true)}>
              添加流程
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => this.handleAdd(true)}
              className="isShow"
            >
              添加流程
            </Button>
          )}
        </div>

        {/* 业务伙伴模态框 */}
        <BPList
          onRef={ref => {
            this.showBPList = ref;
          }}
          getData={data => {
            this.getBPData(data);
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(ProjectEdit);
// export default ProjectEdit;
