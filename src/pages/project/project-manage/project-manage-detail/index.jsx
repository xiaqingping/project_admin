import React, { Component } from 'react';
import { Card, Tabs, Layout, Button, message } from 'antd';
// import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { PlusSquareOutlined } from '@ant-design/icons';
// import { history } from 'umi';
import styles from './index.less';
import ProcessTable from './components/ProcessTable';

const { TabPane } = Tabs;
const { Header, Content } = Layout;

class projectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 加载状态
      loading: true,
      // 项目信息
      projectData: [],
      // 项目ID
      projectId: '',
      // Tabs切换
      selectKey: '1',
    };
  }

  /**
   * 组件加载
   */
  componentDidMount() {
    // const projectId = this.props.match.params.id;
    const projectId = '04a6a7216f25417d82b882fc6014bf53';
    // 保存项目Id
    this.setState({ projectId });
    // 加载table数据
    this.getTableData(projectId);
  }

  /**
   * 获取表格数据
   * @param {string} projectId 项目ID
   */
  getTableData = projectId => {
    this.setState({ loading: true });
    api
      .getProjectProcess(projectId)
      .then(res => {
        this.setState({ projectData: res });
      })
      .catch();
    this.setState({ loading: false });
  };

  /**
   * Tabs切换
   * @param {string} key Tabs 参数
   */
  callback = key => {
    this.setState({
      selectKey: key,
    });
    this.operations();
  };

  /**
   * Tabs抬头操作
   * */
  operations = () => {
    const { selectKey, projectData } = this.state;
    if (selectKey === '1') {
      return (
        <PlusSquareOutlined
          onClick={() => this.handleAddProcesses(projectData)}
          style={{
            fontSize: 20,
            color: '#1890ff',
            paddingRight: 30,
            paddingTop: 20,
          }}
        />
      );
    }
    return '';
  };

  /**
   * 添加流程
   * @param {object} projectData 项目信息数据
   */
  handleAddProcesses = projectData => {
    console.log('跳转');
    console.log(projectData);
    // const type = 'edit';
    // const projectId = data.id;
    // history.push(`/project/project-manage/detailAdd/${type}_${projectId}`);
  };

  /**
   * 返回跳转
   */
  goBackLink = () => {
    message.success('返回项目列表');
    // history.push(`/project/project-manage/detailAdd/${type}_${projectId}`);
  };

  render() {
    const { projectData, loading, projectId } = this.state;
    if (projectData.length === 0) return false;
    return (
      <Layout>
        <Header style={{ background: 'pink' }}>Header</Header>
        <Content className="classProjectDetailInfor">
          <Card className="class-project-name">{projectData.name}</Card>
          <Card className="class-project-describe">{projectData.describe}</Card>
          <Card>
            <Tabs
              defaultActiveKey="1"
              onChange={key => this.callback(key)}
              tabBarExtraContent={this.operations()}
              loading={loading}
            >
              <TabPane tab="流程列表" key="1" width="120px">
                <div className="classProcessList">
                  {/* 流程列表 */}
                  <ProcessTable
                    projectId={projectId}
                    processData={projectData.processes}
                  />
                </div>
              </TabPane>
              <TabPane tab="文件" key="2">
                <div className="classFile">文件</div>
              </TabPane>
              <TabPane tab="成员" key="3">
                <div className="classMemberList">成员</div>
              </TabPane>
            </Tabs>
          </Card>
          <Card className="class-project-footer">
            <Button
              className="class-project-button"
              onClick={() => this.goBackLink()}
            >
              返回
            </Button>
          </Card>
        </Content>
        {/* <Footer style={{ background: 'pink' }}>Footer</Footer> */}
      </Layout>
    );
  }
}

// export default connect(({ projectDetail }) => ({
//   projectDetail,
// }))(projectDetail);
export default projectDetail;
