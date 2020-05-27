/** 项目详情页面 */
import React, { Component } from 'react';
import { Card, Tabs, Button, Tag, ConfigProvider } from 'antd';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import add from '@/assets/imgs/add.png';
import empty from '@/assets/imgs/empty.png';
import { history } from 'umi';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { formatter } from '@/utils/utils';
import style from './index.less';
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
        if (res) {
          const newRes = this.formatDate(res);
          this.setState({ projectData: newRes });
        }
      })
      .catch();
    this.setState({ loading: false });
  };

  /**
   * 转换时间格式
   * @param {Object} data 项目详情数据
   */
  formatDate = data => {
    const newData = { ...data };
    const arr = data.createDate.split(' ');
    const dArr = arr[0].split('-');
    const tArr = arr[1].split(':');
    const dateStr = `${dArr[0]}年${dArr[1]}月${dArr[2]}日 ${tArr[0]}时${tArr[1]}分${tArr[2]}秒`;
    newData.createDate = dateStr;
    return newData;
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
        <img
          alt=""
          src={add}
          onClick={() => this.handleAddProcesses(projectData)}
          style={{
            fontSize: 20,
            color: '#1890ff',
            paddingRight: 10,
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

    // 自定义空状态
    const customizeRenderEmpty = () => (
      <div style={{ textAlign: 'center' }}>
        <img alt="" src={empty} />
        <p>暂无数据</p>
      </div>
    );

    return (
      <>
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <div className={style.projectDetail}>
            <GlobalHeader />

            <PageHeaderWrapper className={style.detailInfor}>
              <Card className={style.name}>{projectData.name}</Card>
              <Card className={style.describe}>
                <p>
                  {projectData.createDate}由用户{projectData.createName}创建
                </p>
                <p>
                  {projectData.labels.map(id => {
                    const { labels } = this.props.projectManage;
                    const name = formatter(labels, id, 'id', 'name');
                    const text = formatter(labels, id, 'id', 'text');
                    const color = formatter(labels, id, 'id', 'color');

                    return (
                      <Tag color={color} key={id}>
                        {name} {text}
                      </Tag>
                    );
                  })}
                </p>
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
                      <ProcessTable
                        projectId={projectId}
                        processData={projectData.processes}
                      />
                    </div>
                  </TabPane>
                  <TabPane tab="文件" key="2">
                    <div className="classFile">
                      <FiledList projectId={projectId} />
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

            <div className={style.footer}>
              <Button
                className={style.button}
                onClick={() => this.goBackLink()}
              >
                返回
              </Button>
            </div>

            <GlobalFooter />
          </div>
        </ConfigProvider>
      </>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(projectDetail);
