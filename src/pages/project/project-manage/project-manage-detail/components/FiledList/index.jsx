import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import ProTable from '@ant-design/pro-table'
import {
  Button,
  Input,
  Breadcrumb,
  Select,
  Modal
} from 'antd'
import {
  FolderOutlined,
  DownloadOutlined,
  SearchOutlined,
  FileExclamationOutlined,
  SwapLeftOutlined,
  SwapRightOutlined,
} from '@ant-design/icons'

// 自定义
import api from '@/pages/project/api/disk'
import './index.less'

const { Option } = Select

/**
 * 文件列表组件
 * 文件服务
 * @param {*} props
 */
const FiledList = props => {

  // 默认数据
  const { filedList } = props
  // 列表数据
  const [tableList, setTableList] = useState({})
  // 新建文件夹Model状态
  const [isVisible, setVisible] = useState(false)
  // 单行下载按钮状态
  const [isDownloadOutlined, setDownloadOutlined] = useState(false)
  // 排序状态
  const [isActive, setIsActive] = useState(false)
  // 排序筛选参数
  const [sortParameters, setSortParameters] = useState(1)

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

  // 表结构
  const columns = [
    {
      title: '文件名称',
      dataIndex: 'name',
      width: 150,
      render: (value, record) => (
        <>
          {/* <img src={this.imgtype(item.type)} alt="" /> */}
          <FileExclamationOutlined />
          <span style={{ marginLeft: 10 }}>{value}</span>
          <DownloadOutlined
            className='DownloadOutlined'
            style={{ visibility: record.id === isDownloadOutlined ? 'visible' : 'hidden' }} />
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
  ]

  /**
   * 方法对象
   */
  const fn = {
    /**
     * 这是一个测试方法
     * @param {String} value
     */
    test: () => {
      console.log('test')
    },
    /**
     * 通过列名称筛选
     * @param {String} value
     */
    handleChange: () => {
      console.log(isActive, sortParameters)
    },
    /**
     * 获取列表数据
     * @param {*} props
     */
    getDateList: () => {
      const data = {
        spaceType: '1', // String 必填 空间类型（来源可以为服务名称...）
        spaceCode: '1', // String 必填 空间编号(可以为功能ID/编号...)
        directoryId: '1', // String 可选 目录ID
        searchName: '1', // String 可选 搜索名称（文件或目录名称）
        sortType: 1, // Integer 必填 {1, 2, 3}
        sortWay: 1, // Integer 必填 {1, 2}
      }
      api.getFiles(data).then(res => {
        console.log(res)
      })
      setTableList({ data: filedList, success: true })
    }
  }

  /**
   * 副作用
   * 初始化操作
   */
  useEffect(() => {

    // 初始化列表数据
    fn.getDateList()

    // 封装方法对象
    fn.test()

  }, [])

  return (
    <ProTable
      rowSelection={{ ...rowSelection }}
      tableAlertRender={false}
      rowKey="id"
      search={false}
      options={false}
      columns={columns}
      request={() => tableList}
      onRow={record => ({
        // 显示隐藏单行下载图标
        onMouseEnter: () => setDownloadOutlined(record.id),
        onMouseLeave: () => setDownloadOutlined(-1),
      })}
      className='classFiledList'
      // defaultData={{ data: filedList, success: true }}
      headerTitle={
        <div>
          <Button type="primary" onClick={() => { setVisible(true) }}>
            <FolderOutlined />
              新建文件夹
            </Button>
          <Modal
            title="新建文件夹"
            visible={isVisible}
            onOk={() => {
              setVisible(false)
            }}
            onCancel={() => { setVisible(false) }}
            okText="确认"
            cancelText="取消"
          >
            <Input placeholder="输入文件夹名称" />
          </Modal>
          <Button onClick={() => { }}>
            <DownloadOutlined />
              下载
          </Button><br />
          <div style={{ padding: '10px 0' }} className="classBreadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>全部文件</Breadcrumb.Item>
              <Breadcrumb.Item>xxx文件夹</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      toolBarRender={() => [
        // 搜索框
        <Input prefix={<SearchOutlined />} placeholder="搜索" onSearch={() => { }} />
        ,
        <div
          onClick={() => {
            setIsActive(!isActive)
            fn.handleChange(sortParameters)
          }}
          style={{ transform: 'translateX(10px)', zIndex: '999' }}
        >

          {/* 排序 */}
          <SwapRightOutlined
            style={{
              transform: 'rotate(90deg) scaleY(-1) translateY(8px)',
              fontSize: '20px',
              color: isActive ? '#ccc' : '#1890ff'
            }} />
          <SwapLeftOutlined
            style={{
              transform: 'rotate(90deg)',
              fontSize: '20px',
              color: isActive ? '#1890ff' : '#ccc'
            }} />

          {/* 筛选 */}
          <Select
            className="classSelect"
            defaultValue="文件名"
            style={{ width: 100, textAlign: 'center', fontSize: '14px' }}
            onChange={value => setSortParameters(value)}
            bordered={false}
            dropdownMatchSelectWidth={120}
            dropdownStyle={{ textAlign: 'center' }}
            onClick={e => e.stopPropagation()}
          >
            <Option value={1}>文件名</Option>
            <Option value={2}>大小</Option>
            <Option value={3}>修改日期</Option>
          </Select>
        </div>
      ]}
    />
  )
}

export default connect(({ projectManage }) => ({
  filedList: projectManage.filedList,
}))(FiledList);
