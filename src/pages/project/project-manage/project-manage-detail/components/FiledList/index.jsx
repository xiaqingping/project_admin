import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Input, Breadcrumb, Select, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  FolderOutlined,
  DownloadOutlined,
  SearchOutlined,
  FileExclamationOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
} from '@ant-design/icons';

import './index.less';

const { Option } = Select;

const columns = [
  {
    title: '文件名称',
    dataIndex: 'name',
    width: 150,
    render: value => (
      <>
        {/* <img src={this.imgtype(item.type)} alt="" /> */}
        <FileExclamationOutlined />
        <span style={{ marginLeft: 10 }}>{value}</span>
      </>
    ),
  },
  {
    title: '描述',
    dataIndex: 'describe',
    width: 350,
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
    width: 80,
    render: () => (
      <>
        <a onClick={() => console.log('删除')}>删除</a>
      </>
    ),
  },
];

/**
 * 通过列筛选
 * @param {String} value
 */
const handleChange = value => {
  console.log(`${value}`);
};

/**
 * 文件列表组件
 * @param {*} props
 */
const FiledList = props => {
  // 默认数据
  const { filedList } = props;
  // 排序状态
  const [isActive, setIsActive] = useState(false);
  // 新建文件夹状态
  const [isVisible, setVisible] = useState(false);

  // 批量操作
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  return (
    <div>
      <ProTable
        rowSelection={{ ...rowSelection }}
        tableAlertRender={false}
        rowKey="id"
        search={false}
        options={false}
        columns={columns}
        request={() => {
          return { data: filedList, success: true };
        }}
        className="classFiledList"
        defaultData={filedList}
        headerTitle={
          <div>
            <Button
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              <FolderOutlined />
              新建文件夹
            </Button>
            <Modal
              title="新建文件夹"
              visible={isVisible}
              onOk={() => {
                setVisible(false);
              }}
              onCancel={() => {
                setVisible(false);
              }}
              okText="确认"
              cancelText="取消"
            >
              <Input placeholder="输入文件夹名称" />
            </Modal>
            <Button onClick={() => {}}>
              <DownloadOutlined />
              下载
            </Button>
            <br />
            <div style={{ padding: '10px 0' }} className="classBreadcrumb">
              <Breadcrumb>
                <Breadcrumb.Item>全部文件</Breadcrumb.Item>
                <Breadcrumb.Item>xxx文件夹</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
        toolBarRender={() => [
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索"
            onSearch={() => {}}
          />,
          <div
            onClick={() => setIsActive(!isActive)}
            style={{ transform: 'translateX(10px)', zIndex: '999' }}
          >
            <SwapRightOutlined
              style={{
                transform: 'rotate(90deg) scaleY(-1) translateY(8px)',
                fontSize: '20px',
                color: isActive ? '#ccc' : '#1890ff',
              }}
            />
            <SwapLeftOutlined
              style={{
                transform: 'rotate(90deg)',
                fontSize: '20px',
                color: isActive ? '#1890ff' : '#ccc',
              }}
            />
          </div>,
          <Select
            className="classSelect"
            defaultValue="文件名"
            style={{ width: 'auto', textAlign: 'right', fontSize: '16px' }}
            onChange={handleChange}
            bordered={false}
            dropdownMatchSelectWidth={120}
            dropdownStyle={{ textAlign: 'center' }}
          >
            <Option value="文件名">文件名</Option>
            <Option value="大小">大小</Option>
            <Option value="修改日期">修改日期</Option>
          </Select>,
        ]}
      />
    </div>
  );
};

export default connect(({ projectManage }) => ({
  filedList: projectManage.filedList,
}))(FiledList);
