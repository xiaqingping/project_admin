// 项目管理：新建项目：添加流程
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ChooseProcessModel from '../components/ChooseProcessModel';

localStorage.setItem(
  'token',
  '2oKfjHGD8_Ks-GZ2j7IeFJSAdTARWPRHmUuO5eM34S0hXfahsxNFLPNEM1Si0RQr',
);

class Addflowpath extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      list: [],
    };
    console.log(this.state.list);
  }

  onOpen = () => {
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

  render() {
    return (
      <PageHeaderWrapper>
        <Button
          type="dashed"
          onClick={this.onOpen}
          icon={<PlusOutlined />}
          style={{
            width: '100%',
            marginTop: 16,
            paddingBottom: 8,
          }}
        >
          选择流程模型
        </Button>

        <ChooseProcessModel
          visible={this.state.visible}
          onClose={v => this.onClose(v)}
          getData={v => this.getData(v)}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Addflowpath;
