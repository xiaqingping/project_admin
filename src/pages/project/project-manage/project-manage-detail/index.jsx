/** 项目详情页面 */
import React, { Component } from 'react';
import { Card, Tabs, Button, Tag, ConfigProvider, Spin } from 'antd';
import { connect } from 'dva';
import api from '@/pages/project/api/projectManageDetail';
import empty from '@/assets/imgs/empty.png';
import { history } from 'umi';
import { formatter } from '@/utils/utils';
import style from './index.less';
import ProcessTable from './components/ProcessTable';
import MemberTbale from './components/MemberTbale';
import FiledList from './components/FiledList';
import FiledListTest from './components/FiledListTest';
import FiledListCopy from './components/FiledListCopy';

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
        const newRes = this.formatDate(res);
        this.setState({ projectData: newRes });
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
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <img alt="" src={empty} />
        <p style={{ marginTop: '8px' }}>暂无数据</p>
      </div>
    );

    if (loading) {
      return (
        <div className={style.example}>
          <Spin />
        </div>
      );
    }

    return (
      <>
        <div className={style.projectDetail}>
          <div className={style.detailInfor}>
            <Card className={style.name}>{projectData.name}</Card>
            <Card className={style.describe}>
              <p>
                {projectData.createDate}由用户{projectData.createName}创建
              </p>
              <p>
                {projectData.labels &&
                  projectData.labels.map(id => {
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
            <div className="projectDetail">
              <Card>
                <ConfigProvider renderEmpty={customizeRenderEmpty}>
                  <Tabs defaultActiveKey="1" loading={loading} size="large">
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
                    <TabPane tab="测试文件列表" key="4">
                      <div className="classFileListTest">
                        <FiledListTest projectId={projectId} />
                      </div>
                    </TabPane>
                    <TabPane tab="上传测试" key="5">
                      <div className="classFile">
                        <FiledListCopy projectId={projectId} />
                      </div>
                    </TabPane>
                  </Tabs>
                </ConfigProvider>
              </Card>
            </div>
          </div>

          <div className={style.footer}>
            <div className={style.footerContent}>
              <Button
                className={style.button}
                onClick={() => this.goBackLink()}
              >
                返回
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(projectDetail);
