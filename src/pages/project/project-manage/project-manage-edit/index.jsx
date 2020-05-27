// 项目管理：新建项目
import React, { Component } from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Input, Card, Form, Tag, Button, DatePicker, message } from 'antd';
// import router from 'umi/router';
import { history } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import api from '@/pages/project/api/projectManage';
import detailApi from '@/pages/project/api/projectManageDetail';
// import classNames from 'classnames';
import BPList from './components/BPList';
import './index.less';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { CheckableTag } = Tag;
const { RangePicker } = DatePicker;

class ProjectEdit extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const projectId = this.props.match.params;
    console.log(this.props);
    const { labels } = props.projectManage;

    this.state = {
      selectedlabels: [], // 选中标签
      bpCode: '', // bp编号
      bpName: '', // bp名称
      beginDate: '', // 开始时间
      endDate: '', // 结束时间
      projectData: [],
      labels,
      projectId,
      requestType: '',
    };
  }

  // 组件加载时
  componentDidMount = () => {
    // 加载table数据
    const { projectId, requestType } = this.state;
    console.log(this.state);
    if (JSON.stringify(projectId) === '{}') {
      this.setState({
        requestType,
      });
    }
    if (JSON.stringify(projectId) !== '{}' && projectId.id !== 'addGoback') {
      this.setState({
        requestType: 'editProject',
      });
      this.getTableData(projectId.id);
    }

    if (projectId.id === 'addGoback') {
      console.log('从选择流程页面返回');
      const addProjectInfor = JSON.parse(
        sessionStorage.getItem('addProjectInfor'),
      );
      // console.log(addProjectInfor);
      this.formRef.current.setFieldsValue({
        name: addProjectInfor.name,
        describe: addProjectInfor.describe,
        bpName: addProjectInfor.bpName,
      });
      this.setState({
        selectedlabels: addProjectInfor.labels || [],
        beginDate: addProjectInfor.beginDate,
        endDate: addProjectInfor.endDate,
      });
    }
    return false;
  };

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

  // 保存
  handleSave = () => {
    const data = this.saveData();
    console.log(data);
    const { selectedlabels, endDate, beginDate, projectId } = this.state;
    // 新建
    if (JSON.stringify(projectId) === '{}') {
      api.addProjects(data).then(() => {
        history.push('/');
      });
    }
    // 修改
    if (JSON.stringify(projectId) !== '{}' && projectId.id !== 'addGoback') {
      api.updateProjects(data).then(() => {
        history.push('/');
      });
    }

    // 点击返回修改基础信息的保存
    if (JSON.stringify(projectId) !== '{}' && projectId.id === 'addGoback') {
      const addProjectInfor = JSON.parse(
        sessionStorage.getItem('addProjectInfor'),
      );

      const bpModelList = JSON.parse(sessionStorage.getItem('bpModel'));
      console.log(bpModelList);

      const datas = {
        name: addProjectInfor.name,
        describe: addProjectInfor.describe,
        bpCode: bpModelList.code,
        bpName: bpModelList.name,
        endDate,
        beginDate,
        labels: selectedlabels,
      };
      console.log(datas);

      api.addProjects(datas).then(() => {
        history.push('/');
      });
    }
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
    console.log(this.state);

    const formData = this.formRef.current.getFieldsValue();
    console.log(formData);

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
    if (JSON.stringify(projectId) !== '{}' && projectId.id !== 'addGoback') {
      console.log('修改项目');
      data = {
        id: projectId.id,
        name: formData.name,
        describe: formData.describe,
        labels: selectedlabels,
      };
    }

    // 选择流程时返回新建项目页面的保存
    if (projectId.id === 'addGoback') {
      console.log('返回新建项目页面的保存');
      const addProjectInfor = JSON.parse(
        sessionStorage.getItem('addProjectInfor'),
      );
      console.log(addProjectInfor);
      this.formRef.current.setFieldsValue({
        name: formData.name,
        describe: formData.describe,
        bpName: formData.bpName,
      });
      this.setState({
        selectedlabels: addProjectInfor.labels || [],
        beginDate: addProjectInfor.beginDate,
        endDate: addProjectInfor.endDate,
      });

      data = {
        name: formData.name,
        describe: formData.describe,
        bpCode,
        bpName,
        endDate,
        beginDate,
        labels: selectedlabels,
      };

      // if(addProjectInfor.bpName === '') {
      //   data = {
      //     name: formData.name,
      //     describe: formData.describe,
      //     bpCode,
      //     bpName,
      //     endDate,
      //     beginDate,
      //     labels: selectedlabels,
      //   };
      //   console.log(data)
      // }else {
      //     data = {
      //     name: formData.name,
      //     describe: formData.describe,
      //     bpCode,
      //     bpName,
      //     endDate,
      //     beginDate,
      //     labels: selectedlabels,
      //   };
      //   console.log(data)
      // }
    }
    return data;
  };

  // 返回
  goBack = () => {
    message.success('返回项目列表页');
    history.push('/');
  };

  // 时间选中事件
  handleOnChangeTime = (value, dateString) => {
    console.log(dateString);
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
    console.log(data);
    this.formRef.current.setFieldsValue({
      bpName: data.name,
    });
    this.setState({
      bpCode: data.code,
      bpName: data.name,
    });
    sessionStorage.setItem('bpModel', JSON.stringify(data));
  };

  // 跳转到添加流程页面
  handleAdd = () => {
    const { projectId } = this.state;

    const data = this.saveData();
    console.log(data);
    if (data === false) {
      this.props.dispatch({
        type: 'projectManage/setProjectInfor',
        payload: data,
      });
    } else {
      if (projectId === 'addGoback') {
        console.log(123);
      } else {
        data.requestType = 'add';
        sessionStorage.setItem('addProjectInfor', JSON.stringify(data));
      }

      const projectInforList = JSON.parse(
        sessionStorage.getItem('goBackInfors'),
      );
      console.log('点击返回带回来的值', projectInforList);

      this.props.dispatch({
        type: 'projectManage/setProjectInfor',
        payload: data,
      });

      history.push('/project/project-manage/add/addflowpath/add');
    }
  };

  render() {
    const {
      selectedlabels,
      projectData,
      labels,
      projectId,
      beginDate,
      endDate,
    } = this.state;
    console.log(this.state);
    return (
      <div style={{ background: '#F0F2F5', width: '100%' }}>
        <GlobalHeader />
        <Form
          ref={this.formRef}
          className="classPageHeaderWrapper"
          style={{ margin: '0 24px 24px 24px' }}
        >
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
            新建项目
          </div>
          <Card bordered={false}>
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
                  disabled={
                    JSON.stringify(projectId) !== '{}' &&
                    projectId.id !== 'addGoback'
                  }
                />
              </FormItem>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <FormItem
                label="时间"
                name="time"
                style={{ paddingRight: '50px' }}
              >
                {JSON.stringify(projectId) === '{}' ||
                projectId.id === 'addGoback' ? (
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.handleOnChangeTime}
                    defaultPickerValue={[
                      moment(beginDate, 'YYYYMMDD HH:mm:ss'),
                      moment(endDate, 'YYYYMMDD HH:mm:ss'),
                    ]}
                    style={{ marginLeft: '40px' }}
                  />
                ) : (
                  <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    initialValues={[
                      moment(projectData.beginDate, 'YYYYMMDD HH:mm:ss'),
                      moment(projectData.endDate, 'YYYYMMDD HH:mm:ss'),
                    ]}
                    onChange={this.handleOnChangeTime}
                    style={{ marginLeft: '40px' }}
                    disabled={
                      JSON.stringify(projectId) !== '{}' &&
                      projectId.id !== 'addGoback'
                    }
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
            lineHeight: '56px',
            textAlign: 'right',
            background: '#FFFFFF',
          }}
          className="classPageHeaderWrapperFooter"
        >
          <div style={{ margin: '0 24px 24px 24px' }}>
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
            {JSON.stringify(projectId) === '{}' ||
            projectId.id === 'addGoback' ? (
              <Button
                type="primary"
                onClick={() => this.handleAdd(true)}
                style={{ marginRight: '10px' }}
              >
                添加流程
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => this.handleAdd(true)}
                style={{ marginRight: '10px', display: 'none' }}
              >
                添加流程
              </Button>
            )}
          </div>
        </div>

        <GlobalFooter />

        {/* 业务伙伴模态框 */}
        <BPList
          onRef={ref => {
            this.showBPList = ref;
          }}
          getData={data => {
            this.getBPData(data);
          }}
        />
      </div>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(ProjectEdit);
// export default ProjectEdit;