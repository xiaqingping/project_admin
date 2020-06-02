// 点击选择流程模型的模态框
import React from 'react';
import { Modal, Table, Popconfirm, Button, message, Divider } from 'antd';
import { FileExclamationOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import api from '@/pages/project/api/recy';

// 选择流程模型模态框
class recycliBin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recycleTableList: [],
      selectedRowList: [], // 已选中的数据集合
      // 列表加载状态
      // loading :true,
    };
  }

  /**
   * 渲染页面时调用
   *getTableData 获取表格数据的方法名
   */
  componentDidMount() {
    this.getDeleteList();
  }

  // 回收站列表
  getDeleteList = parameters => {
    console.log('获取回收站列表数据');
    let data = {
      spaceType: 'project', // String 必填 空间类型（来源可以为服务名称...）
      spaceCode: '6e761a1aa7934884b11bf57ebf69db51', // String 必填 空间编号(可以为功能ID/编号...)
      directoryId: '', // String 可选 目录ID
      searchName: '', // String 可选 搜索名称（文件或目录名称）
      sortType: 1, // Integer 必填 {1, 2, 3}
      sortWay: 1, // Integer 必填 {1, 2}
    };

    if (parameters)
      data = {
        ...data,
        ...parameters,
      };

    api
      .getRecycleFiles(data)
      .then(res => {
        this.setState({
          // loading:false,
          recycleTableList: res,
        });
      })
      .catch(err => console.log(err));
  };

  // 关闭模态框的方法
  handleCancel = () => {
    console.log('关闭');
    this.props.onClose();
  };

  /**
   * 点击确定保存数据
   * @param {Array} selecteditem 所有被选择的流程模型数据的集合
   * @param onClose 关闭流程模型弹框的方法
   */
  handleOk = () => {
    console.log('确定关闭');
    this.props.onClose();
  };

  // 单个删除数据
  deleteRow = row => {
    const { selectedRowList } = this.state;
    console.log(selectedRowList);
    if (selectedRowList.length === 0)
      return message.error('请选中一条数据删除');
    if (selectedRowList.length > 1) return message.error('请选择批量删除');
    if (row.id !== selectedRowList[0].id)
      return message.error('请删除选中的数据');

    if (row.id === selectedRowList[0].id) {
      const data = {};
      data.spaceType = 'project'; // String 必填 空间类型（来源可以为服务名称...）
      data.spaceCode = '6e761a1aa7934884b11bf57ebf69db51'; // String 必填 空间编号(可以为功能ID/编号...)
      const files = [
        {
          id: selectedRowList[0].id, // String 可选 文件或文件夹的ID
          fileType: selectedRowList[0].fileType, // Integer 必填 {1目录, 2文件}
        },
      ];
      api.deleteRecycleRestore(data, files).then(res => {
        console.log(res);
        this.getDeleteList();
      });
    }
  };

  // 批量删除
  deleteAll = () => {
    const { selectedRowList } = this.state;
    console.log(selectedRowList);

    if (selectedRowList.length !== 0) {
      const data = {};
      data.spaceType = 'project';
      data.spaceCode = '6e761a1aa7934884b11bf57ebf69db51';
      const files = [];
      selectedRowList.forEach(item => {
        let newlist = {};
        newlist = {
          id: item.id, // String 可选 文件或文件夹的ID
          fileType: item.fileType, // Integer 必填 {1目录, 2文件}
        };
        files.push(newlist);
      });
      console.log(files);
      // data.files =files;
      api
        .deleteRecycleRestore(data, files)
        .then(res => {
          console.log(res);
          this.getDeleteList();
        })
        .catch(err => console.log(err));
    }
  };

  // 单个数据还原
  restore = row => {
    const { selectedRowList } = this.state;
    if (selectedRowList.length === 0)
      return message.error('请选中一条数据还原');
    if (selectedRowList.length > 1) return message.error('请选择批量还原');
    if (row.id !== selectedRowList[0].id)
      return message.error('请还原选中的数据');
    if (row.id === selectedRowList[0].id) {
      const data = {};
      data.spaceType = 'project';
      data.spaceCode = '6e761a1aa7934884b11bf57ebf69db51';
      const files = [
        {
          id: selectedRowList[0].id,
          fileType: selectedRowList[0].fileType,
        }, // String id可选 文件或文件夹的ID, Integer fileType必填 {1目录, 2文件}
      ];
      // data.files=newlist;
      api
        .getRecycleRestore(data, files)
        .then(res => {
          console.log(res);
          this.getDeleteList();
        })
        .catch(err => console.log(err));
    }
  };

  // 批量还原
  reductionAll = () => {
    const { selectedRowList } = this.state;
    console.log(selectedRowList);

    if (selectedRowList.length !== 0) {
      const data = {};
      data.spaceType = 'project';
      data.spaceCode = '6e761a1aa7934884b11bf57ebf69db51';
      const files = [];
      selectedRowList.forEach(item => {
        let newlist = {};
        newlist = {
          id: item.id, // String 可选 文件或文件夹的ID
          fileType: item.fileType, // Integer 必填 {1目录, 2文件}
        };
        files.push(newlist);
      });
      // data.files =files;
      console.log(data);
      api
        .getRecycleRestore(data, files)
        .then(res => {
          console.log(res);
          this.getDeleteList();
        })
        .catch(err => console.log(err));
    }
  };

  // 全部清空
  emptyAll = () => {
    const data = {};
    data.spaceType = 'project';
    data.spaceCode = '6e761a1aa7934884b11bf57ebf69db51';
    api
      .emptyRecycle(data)
      .then(res => {
        console.log(res);
        this.getDeleteList();
      })
      .catch(err => console.log(err));
  };

  render() {
    // const {loading,recycleTableList} =this.state;
    const { recycleTableList } = this.state;
    // 表结构
    const columns = [
      {
        title: '文件名称',
        dataIndex: 'name',
        width: 150,
        render: value => (
          <>
            <FileExclamationOutlined />
            <span style={{ marginLeft: 10 }}>{value}</span>
          </>
        ),
      },
      {
        title: '描述',
        dataIndex: 'describe',
        width: 300,
      },
      {
        title: '来源',
        dataIndex: 'sourceType',
        width: 150,
      },
      {
        title: '修改时间',
        dataIndex: 'changeDate',
        width: 150,
      },
      {
        title: '大小',
        dataIndex: 'size',
        width: 100,
        render: text => `${text}kb`,
      },
      {
        title: '操作',
        width: 150,
        render: row => (
          <>
            <Popconfirm
              title="确定删除数据？"
              onConfirm={() => this.deleteRow(row)}
            >
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.restore(row)}>还原</a>
          </>
        ),
      },
    ];

    // 批量操作
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(
          `selectedRowKeys: ${selectedRowKeys}`,
          'selectedRows: ',
          selectedRows,
        );
        this.setState({
          selectedRowList: selectedRows,
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
      }),
    };

    return (
      <div>
        <Modal
          title="回收站"
          className="classChooseProcessModel"
          visible
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1050}
          okText="确认"
          cancelText="取消"
        >
          <Button
            onClick={() => {
              this.deleteAll();
            }}
          >
            批量删除
          </Button>
          <Button
            onClick={() => {
              this.reductionAll();
            }}
          >
            批量还原
          </Button>
          <Button
            onClick={() => {
              this.emptyAll();
            }}
          >
            全部清空
          </Button>
          <Table
            className="classrow"
            rowKey="name"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={recycleTableList.length > 0 ? recycleTableList : []}
            pagination={false}
            // loading={loading}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(({ projectManage }) => ({
  projectManage,
}))(recycliBin);
