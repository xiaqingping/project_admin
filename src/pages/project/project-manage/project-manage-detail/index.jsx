/** 项目详情页面 */
import React, { Component } from 'react';
import { Card, Tabs, Button } from 'antd';
// import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { PlusSquareOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { history } from 'umi';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
// import styles from './index.less';
import ProcessTable from './components/ProcessTable';
import MemberTbale from './components/MemberTbale';
import FiledList from './components/FiledList';

const { TabPane } = Tabs;

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
    const projectId = this.props.match.params.id;
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
            paddingRight: 10,
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
    const type = 'edit';
    const projectId = projectData.id;
    history.push(
      `/project/project-manage/add/addflowpath/${type}_${projectId}`,
    );
  };

  /**
   * 返回跳转
   */
  goBackLink = () => {
    history.push('/');
  };

  render() {
    const { projectData, loading, projectId } = this.state;
    if (projectData.length === 0) return false;
    return (
      <>
        <div className="class-project-detail">
          <GlobalHeader />

          <PageHeaderWrapper className="classProjectDetailInfor">
            <Card className="class-project-name">{projectData.name}</Card>
            <Card className="class-project-describe">
              <p>2020年5月1日 15时20分20秒由用户令狐冲创建</p>
              <p>真核转录组 Eukaryotic transcriptome</p>
              <p>{projectData.describe}</p>
            </Card>
            <Card>
              <Tabs
                defaultActiveKey="1"
                onChange={key => this.callback(key)}
                tabBarExtraContent={this.operations()}
                loading={loading}
                size="large"
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
                  <div className="classFile">
                    <FiledList />
                  </div>
                </TabPane>
                <TabPane tab="成员" key="3">
                  <div className="classMemberList">
                    <MemberTbale projectId={projectId} />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </PageHeaderWrapper>

          <div className="class-project-footer">
            <Button
              className="class-project-button"
              onClick={() => this.goBackLink()}
            >
              返回
            </Button>
          </div>

          <GlobalFooter />
        </div>
      </>
    );
  }
}

// export default connect(({ projectDetail }) => ({
//   projectDetail,
// }))(projectDetail);
export default projectDetail;
