import React, { Component } from 'react';
import { Card, Tabs, Layout } from 'antd';
// import { connect } from 'dva';
import api from '@/pages/api';
import './index.less';
import ProcessTable from './components/ProcessTable';

const { TabPane } = Tabs;
const { Header, Footer, Content } = Layout;

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
      // selectKey: '1',
    };
  }

  /**
   * 组件加载
   */
  componentDidMount() {
    // const projectId = this.props.match.params.id;
    const projectId = '6a52488f37654400966765f3eb349836';
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
        console.log(res);
        this.setState({ projectData: res });
      })
      .catch();
    this.setState({ loading: false });
  };

  render() {
    const { projectData, loading, projectId } = this.state;
    console.log(projectData);
    console.log(projectData.length === 0);
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
              // onChange={key => this.callback(key)}
              // tabBarExtraContent={this.operations()}
              loading={loading}
            >
              <TabPane tab="流程列表" key="1" width="120px">
                <div className="classProcessList">
                  <ProcessTable
                    project={projectId}
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
        </Content>
        <Footer style={{ background: 'pink' }}>Footer</Footer>
      </Layout>
    );
  }
}

// export default connect(({ projectDetail }) => ({
//   projectDetail,
// }))(projectDetail);
export default projectDetail;
