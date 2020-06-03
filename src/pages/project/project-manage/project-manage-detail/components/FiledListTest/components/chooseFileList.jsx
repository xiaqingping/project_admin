import React, { Component } from 'react';
import { Tree, Modal, Button, message } from 'antd';
import api from '@/pages/project/api/file';

class ChooseFileList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 树形列表数据
      treeData: [],
      // 复制或移动文件 接口请求参数
      requestData: {},
      // 复制或移动文件 重名提示框
      visibleCopy: false,
      // 父页面选中数据
      selectedRows: [],

      // 父页面请求类型
      // 移动(单个)movement / 复制(单个)copy
      // 移动(批量)movementBatch / 复制(批量)copyBatch
      requestType: '',
    };
  }

  componentDidMount() {
    this.getTreeData(this.props.projectId);
  }

  /**
   * 更新时
   */
  componentDidUpdate(nextProps) {
    if (this.props.selectedRows !== nextProps.selectedRows) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ selectedRows: nextProps.selectedRows });
    }
  }

  /**
   * 获取文件列表数据
   * @param {String} projectId 项目ID
   */
  getTreeData = projectId => {
    const data = {
      spaceCode: projectId,
      spaceType: 'project',
      directoryId: '0',
    };
    api.getDirctory(data).then(res => {
      const newRes = this.formatterData(res);
      this.setState({
        treeData: newRes,
        selectedRows: this.props.selectedRows,
        requestType: this.props.requestType,
      });
    });
  };

  /**
   * 格式化数据
   * @param {Array} treeData 列表数据
   * @param {String} key 处理目录下级文件时的父节点key值
   */
  formatterData = (treeData, key) => {
    const newData = [];
    treeData.forEach(item => {
      const newItem = { ...item };
      newItem.title = item.name;
      // 拼接父节点key
      if (!key) newItem.key = item.id;
      if (key) newItem.key = `${key}-${item.id}`;
      newData.push(newItem);
      return true;
    });
    return newData;
  };

  /**
   * 点击节点 加载数据
   * @param {Object} treeNode 当前节点信息
   */
  onLoadData = treeNode => {
    const data = {
      spaceCode: '6e761a1aa7934884b11bf57ebf69db51',
      spaceType: 'project',
      directoryId: treeNode.id,
    };
    const { key, children } = treeNode;
    const { treeData } = this.state;
    return new Promise(resolve => {
      if (children) {
        resolve();
        return;
      }
      api.getDirctory(data).then(res => {
        const newRes = this.formatterData(res, key);
        this.setState({
          treeData: this.updateTreeData(treeData, key, newRes),
        });
      });

      resolve();
    });
  };

  /**
   * 目录下级数据追加在父节点下
   * @param {Array} list 列表数据
   * @param {Array} key 父节点key值
   * @param {Array} children 子节点数据
   */
  updateTreeData = (list, key, children) => {
    return list.map(node => {
      if (node.key === key) {
        return { ...node, children };
      }
      if (node.children) {
        return {
          ...node,
          children: this.updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  };

  /**
   * 选中目录
   * @param {String} key 节点Key值
   * @param {Object} event 当前元素
   */
  onSelect = (key, event, type = 4) => {
    const treeNode = event.node;
    const { requestType, selectedRows } = this.state;
    const otherData = {
      spaceType: 'project',
      spaceCode: this.props.projectId,
      logicDirectoryId: treeNode.id,
    };
    let data = {};
    // 单个
    if (requestType === 'copy' || requestType === 'movement') {
      data = {
        ...otherData,
        type,
        fileType: selectedRows[0].fileType,
        id: selectedRows[0].id,
      };
    } else {
      // 批量
      const newData = [];
      selectedRows.forEach(item => {
        const newItem = {
          fileType: item.fileType,
          type: 3,
          id: item.id,
        };
        newData.push(newItem);
      });
      data = {
        ...otherData,
        files: newData,
      };
    }

    this.setState({ requestData: data });
  };

  /**
   * 确认(单个)
   * @param {String} type 请求参数的type类型值 1 覆盖 3 重命名 4 重名验证
   */
  handleOk = type => {
    const { requestData, requestType } = this.state;

    if (JSON.stringify(requestData) === '{}') {
      return message.warning('请选中一个文件夹！');
    }

    // 批量操作
    if (requestType === 'copyBatch' || requestType === 'movementBatch') {
      this.setState({ visibleCopy: true });
      return false;
    }

    // 请求参数中的类型为 是否覆盖或重命名
    if (type) requestData.type = type;

    // 复制文件
    if (requestType === 'copy') {
      api
        .fileCopy(requestData)
        .then(res => {
          // 返回1 文件名未重复 直接复制成功
          if (res === 1) {
            this.props.onClose();
            this.props.getData();
          }
          // 返回1 文件名已重复 弹出选择框
          if (res === 2) this.setState({ visibleCopy: true });
        })
        .catch();
    }
    // 移动文件
    if (requestType === 'movement') {
      api
        .fileMovement(requestData)
        .then(res => {
          // 返回1 文件名未重复 直接移动成功
          if (res === 1) {
            this.props.onClose();
            this.props.getData();
          }
          // 返回1 文件名已重复 弹出选择框
          if (res === 2) this.setState({ visibleCopy: true });
        })
        .catch();
    }
    return true;
  };

  /**
   * 批量复制或移动
   */
  handleOkBatch = type => {
    const { requestData, requestType } = this.state;

    // 请求参数中的类型为 是否覆盖或重命名
    if (type) {
      const newFiles = [];
      requestData.files.forEach(item => {
        const newItem = { ...item };
        newItem.type = type;
        newFiles.push(newItem);
      });
      requestData.files = newFiles;
    }

    // 复制文件
    if (requestType === 'copyBatch') {
      api
        .fileBatchCopy(requestData)
        .then(() => {
          this.props.onClose();
          this.props.getData();
        })
        .catch();
    }

    // 移动文件
    if (requestType === 'movementBatch') {
      api
        .fileBatchMovement(requestData)
        .then(() => {
          this.props.onClose();
          this.props.getData();
        })
        .catch();
    }
  };

  render() {
    const { treeData, visibleCopy, requestType } = this.state;

    return (
      <Modal
        width="800px"
        bodyStyle={{ height: 500 }}
        title="复制移动"
        visible={this.props.visible}
        onOk={() => this.handleOk(4)}
        onCancel={() => {
          this.props.onClose();
        }}
        centered
      >
        <Tree
          loadData={v => this.onLoadData(v)}
          onSelect={this.onSelect}
          treeData={treeData}
          height={450}
        />

        {/* 复制或移动文件 重名提示框 */}
        <Modal
          width="500px"
          bodyStyle={{ height: 100 }}
          title="替换或重命名"
          visible={visibleCopy}
          footer={[
            <Button
              onClick={() => {
                this.setState({ visibleCopy: false });
              }}
            >
              取消
            </Button>,
            <Button
              type="primary"
              onClick={() => {
                if (requestType === 'copy' || requestType === 'movement') {
                  return this.handleOk(1);
                }
                return this.handleOkBatch(1);
              }}
            >
              替换
            </Button>,
            <Button
              onClick={() => {
                if (requestType === 'copy' || requestType === 'movement') {
                  return this.handleOk(3);
                }
                return this.handleOkBatch(3);
              }}
            >
              重命名
            </Button>,
          ]}
          centered
        >
          {requestType === 'copy' || requestType === 'movement' ? (
            <span>当前选择文件夹中已有同名文件,请选择替换或重命名</span>
          ) : (
            <span>所有文件操作选择覆盖或者重命名？</span>
          )}
        </Modal>
      </Modal>
    );
  }
}

export default ChooseFileList;
