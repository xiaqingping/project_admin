/* eslint-disable no-param-reassign */
/**
 * 环境因子表
 */
import React from 'react';
import { Table, Button, message } from 'antd';
import {
  CloseOutlined,
  PlusSquareOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { isEmpty } from '@/utils/utils';
import style from './index.less';
import UploadSequenceFile from './UploadSequenceFile';

class EnvironmentalFactorsModel extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    return {
      sampleList: nextProps.sampleList || [],
    };
  }

  /**
   * 是否是第一次更新样品列表
   */
  isFirstUpdate = true;

  /**
   * 表头 第一列
   */
  firstColumn = {
    id: 1,
    title: '样品',
    dataIndex: 'sampleName',
    key: 'sampleName',
    width: 100,
  };

  /**
   * 表头 最后一列
   */
  lastColumn = {
    title: () => (
      <PlusSquareOutlined
        className={style.addButton}
        onClick={this.addColumn}
      />
    ),
    dataIndex: 'add',
    key: 'add',
    width: 80,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 样品选择框 样品列表
      sampleList: [],
      // 参数列表
      paramList: props.paramList,
      // 表数据
      data: [],
      // 表格全部列
      columns: [],
      // 表格新增列
      headers: [],
      // 上传模态框
      visible: false,
      // 新的点击上传
      isNewUpload: false,
    };
  }

  /**
   * 挂载时初始化表格数据
   */
  componentDidMount() {
    this.initTable();
    this.getParamData();
    this.props.getFun(this.selectUpdateDataSource);
  }

  /**
   * 状态变更时，判断是否更新
   */
  componentDidUpdate(nextProps) {
    if (this.props.sampleList !== nextProps.sampleList && this.isFirstUpdate) {
      this.initTable();
      this.getParamData();
      this.props.getFun(this.selectUpdateDataSource);
      this.isFirstUpdate = false;
    }
  }

  /**
   * 初始化表格
   */
  initTable = () => {
    // 初始数据
    const { firstColumn, lastColumn } = this;
    const { sampleList, headers } = this.state;

    // 获取表头
    const columns = [firstColumn, ...this.formatHeader(headers), lastColumn];

    const newList = [];
    // 获取表格数据
    let i = 1;
    sampleList.forEach(item => {
      const newItem = {};
      newItem.id = i++;
      newItem.sampleName = item.sampleAlias || item.sampleName;
      newItem.add = '';
      newList.push(newItem);
    });

    this.setState(
      {
        data: newList,
        columns,
      },
      () => {
        this.selectUpdateDataSource();
      },
    );
    return true;
  };

  /**
   * 样品列表改变时同步环境因子样品列表
   */
  selectUpdateDataSource = () => {
    const { sampleList, data, headers } = this.state;
    const newData = [];
    sampleList.map(samItem => {
      let newItem = {};
      newItem = {
        sampleId: samItem.id,
        sampleName: samItem.sampleAlias || samItem.sampleName,
      };
      const item = {};
      data.forEach(daItem => {
        item[daItem.sampleId] = daItem;
      });
      if (item[samItem.id]) {
        newItem = item[samItem.id];
        newItem.sampleName = samItem.sampleAlias || samItem.sampleName;
      } else {
        headers.forEach(heaItem => {
          newItem[heaItem.dataIndex] = '';
        });
      }
      newData.push(newItem);
      return false;
    });
    newData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (item[key] === undefined) item[key] = '';
      });
    });
    this.formatSubmitData(newData, 'tableData');
    this.setState({ data: newData });
  };

  /**
   * 提交数据格式化
   * @param {Array} tableSources 表格资源(表头数据或表数据)
   * @param {String} type 资源类型
   */
  formatSubmitData = (tableSources, type) => {
    const { paramList } = this.state;
    let { data, headers } = this.state;
    if (type === 'tableHeader') {
      headers = tableSources;
    } else if (type === 'tableData') {
      data = tableSources;
    }

    let error;
    let errorData = {};

    // 数据整理
    let tableData = [];
    if (data.length > 0 || headers.length > 0) {
      headers.forEach(item => {
        tableData = [
          ...tableData,
          {
            environmentFactorName: item.title,
            environmentFactorValues: [],
            dataIndex: item.key,
          },
        ];
      });

      for (let i = 0; i < tableData.length; i++) {
        if (!tableData[i]) return false;
        const values = [];
        // eslint-disable-next-line no-loop-func
        data.forEach(item => {
          if (!isEmpty(item[tableData[i].dataIndex])) {
            const sampleValue = {
              sampleId: item.sampleId,
              sampleName: item.sampleName,
            };
            const samples = [];
            samples.push(sampleValue);
            if (values.indexOf(item[tableData[i].dataIndex]) === -1) {
              tableData[i].environmentFactorValues.push({
                environmentFactorValue: item[tableData[i].dataIndex],
                samples,
              });
            } else {
              tableData[i].environmentFactorValues.forEach(valItem => {
                if (
                  item[tableData[i].dataIndex] ===
                  valItem.environmentFactorValue
                ) {
                  valItem.samples.push(sampleValue);
                }
              });
            }
            values.push(item[tableData[i].dataIndex]);
          }
        });
        delete tableData[i].dataIndex;
      }
      // 验证数据
      errorData = this.verifyData(tableData);
      error = errorData.errorSta;
    }

    const paramData = {
      paramKey: paramList.paramKey,
      paramValue: error ? '' : JSON.stringify(tableData),
      taskModelId: paramList.taskModelId,
    };
    const isVerify = !error;
    const { errorMessage } = errorData;

    if (this.props.disabled) return false;
    this.props.getData(paramData, 'environmentFactor', isVerify, errorMessage);
    return false;
  };

  /**
   * 验证数据
   * @param {Array} tableData 表数据
   */
  verifyData = tableData => {
    const { paramList, sampleList } = this.state;
    // 环境因子下不能全部为空
    let errorSta = false;
    let errorMessage = '';

    tableData.forEach(item => {
      if (item.environmentFactorValues.length === 0) {
        errorSta = true;
        errorMessage = '存在空的环境因子！';
      }
    });

    if (paramList.isRequired === 'true') {
      if (tableData.length === 0) {
        errorSta = true;
        errorMessage = '环境因子为必须项，请设置环境因子！';
      }
    }
    if (sampleList.length === 0 && tableData.length > 0) {
      errorSta = true;
      errorMessage = '环境因子为必须项，请设置环境因子！';
    }
    return { errorSta, errorMessage };
  };

  /**
   * 整理表头表数据
   * @param {Array} tableHaed 表头数据
   * @param {Array} tableList 表数据
   */
  getDataDispose = (tableHaed, tableList, upload) => {
    const newHeader = tableHaed.filter(item => item.dataIndex !== 'sampleName');
    const { isUploadGoBack, sampleList } = this.state;

    // 获取表头
    const { firstColumn, lastColumn } = this;

    const disabledIs = this.props.disabled; // 是否禁用
    let newColumns;
    if (disabledIs) newColumns = [firstColumn, ...this.formatHeader(newHeader)];
    else
      newColumns = [firstColumn, ...this.formatHeader(newHeader), lastColumn];

    // 上传文件回传数据处理
    if (upload) {
      // 有别名修改为别名
      sampleList.forEach(samItem => {
        tableList.forEach(daItem => {
          if (
            samItem.sampleName === daItem.sampleName ||
            samItem.sampleAlias === daItem.sampleName
          ) {
            daItem.sampleName = samItem.sampleAlias || samItem.sampleName;
            daItem.sampleId = samItem.id;
          }
        });
      });

      // 按样品列表顺序显示对应的数据
      const newData = [];
      sampleList.map(samItem => {
        let newItem = {};
        newItem = {
          sampleId: samItem.id,
          sampleName: samItem.sampleAlias || samItem.sampleName,
        };
        const item = {};
        tableList.forEach(daItem => {
          item[daItem.sampleId] = daItem;
        });
        if (item[samItem.id]) {
          newItem = item[samItem.id];
        } else {
          newColumns.forEach(heaItem => {
            if (heaItem.dataIndex !== 'sampleName') {
              newItem[heaItem.dataIndex] = '';
            }
          });
        }
        newData.push(newItem);
        return false;
      });
      tableList = newData;
      // 是否从上传文件返回
      this.setState({ isUploadGoBack: !isUploadGoBack });
    }

    this.setState(
      {
        data: tableList,
        columns: newColumns,
        headers: newHeader,
      },
      () => {
        this.formatSubmitData(newHeader, 'tableHeader');
      },
    );
  };

  /**
   * 获取参数数据
   * @param {Array} paramList 父页面传递的 参数数据
   * @param {Array} sampleList 父页面传递的 样品列表
   */
  getParamData = () => {
    const { paramList, sampleList } = this.props;
    const { firstColumn } = this;
    if (paramList === undefined) return false;
    if (paramList.paramValue === undefined) return false;

    const paramValue = JSON.parse(paramList.paramValue);

    if (paramList) {
      const list = paramValue;
      const columns = [firstColumn];
      const titleName = 'environmentFactorName';
      if (list) {
        // 取出 表头
        const newColumns = this.getTableHeaderData(list, columns, titleName);
        // 取出 行数据
        const rowData = this.getRowDataEnvironment(
          list,
          sampleList,
          newColumns,
        );
        // 填充行数据
        const newData = this.getFillDataEnvironment(list, rowData, newColumns);

        this.getDataDispose(newColumns, newData);
      }
    }
    return false;
  };

  /**
   * 新增列
   * @param {Array} headers 表头数据
   * @param {Object} firstColumn 第一列表头
   * @param {Object} lastColumn 最后一列表头
   */
  addColumn = () => {
    const { firstColumn, lastColumn } = this;
    const { headers } = this.state;

    // 设置新增列
    let num;
    if (headers.length > 0) {
      const ids = [];
      headers.forEach(item => ids.push(item.id));
      let max = Math.max.apply(null, ids);

      const NumberList = [];
      headers.forEach(item => {
        if (item.title && item.title.indexOf('环境因子_') !== -1) {
          const endNum = item.title.split('_')[1];
          // eslint-disable-next-line no-restricted-globals
          if (!isNaN(Number(endNum))) {
            NumberList.push(endNum * 1);
          }
        }
      });

      if (NumberList.includes(max + 1)) {
        max = Math.max.apply(null, NumberList);
      }
      num = max + 1;
    } else {
      num = 2;
    }

    const newHeader = {
      id: num,
      dataIndex: `header_${num}`,
      key: `header_${num}`,
      title: `环境因子_${num}`,
    };

    const hds = [...headers, newHeader];
    const cls = [firstColumn, ...this.formatHeader(hds), lastColumn];

    // 设置表格数据
    const { data } = this.state;
    const newData = [];
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (item[key] === undefined) item[key] = '';
      });
      const newItem = JSON.parse(JSON.stringify(item));
      const key = newHeader.dataIndex;
      newItem[key] = '';
      newData.push(newItem);
    });

    this.setState(
      {
        headers: hds,
        columns: cls,
        data: newData,
      },
      () => this.formatSubmitData(hds, 'tableHeader'),
    );
  };

  /**
   * 移除列
   * @param {Array} row 行数据
   */
  removeColumn = row => {
    const { firstColumn, lastColumn } = this;
    const { data, headers } = this.state;
    const headerArr = headers.filter(item => item.id !== row.id);
    data.forEach(item => delete item[row.dataIndex]);
    const columns = [firstColumn, ...this.formatHeader(headerArr), lastColumn];

    this.setState(
      {
        headers: headerArr,
        columns,
        data,
      },
      () => this.formatSubmitData(headerArr, 'tableHeader'),
    );
  };

  /**
   * 修改表头
   * @param {Object} row 当前行数据
   */
  handleOnChangeTitle = (row, event) => {
    const value = event.target.value.trim();
    // 验证是否有空格
    if (value === '') {
      message.warning('内容不能为空！');
      event.target.value = row.title;
      return false;
    }

    const { headers } = this.state;
    // 验证是否已有该名称
    const repeatList = headers.filter(item => item.title === value);
    if (repeatList.length && row.title !== value) {
      event.target.value = row.title;
      return message.warning('已有该名称请重新输入');
    }

    // 修改为新值
    headers.forEach(item => {
      if (row.id === item.id) {
        item.title = value;
      }
    });
    this.formatSubmitData(headers, 'tableHeader');
    this.setState({ headers });
    return false;
  };

  /**
   * 修改数据
   * @param {Object} row 当前行数据
   * @param {String} title 当前列的title
   */
  handleOnChangeData = (row, event, id) => {
    const { data, headers } = this.state;
    let newKey;
    headers.forEach(item => {
      if (item.id === id) {
        newKey = item.key;
      }
    });
    const newRow = JSON.parse(JSON.stringify(row));
    newRow[newKey] = event.target.value.trim();

    const newData = [];
    data.forEach(item => {
      if (row.sampleId === item.sampleId) {
        newData.push(newRow);
      } else {
        const newItem = JSON.parse(JSON.stringify(item));
        newData.push(newItem);
      }
    });
    this.formatSubmitData(newData, 'tableData');
    this.setState({ data: newData });
  };

  /**
   * 配置表头
   * @param {Array} headers 表头数据
   */
  formatHeader = headers => {
    const disabledIs = this.props.disabled; // 是否禁用
    const groups = headers.map(item => ({
      title: () => (
        <div className={style.environmentFactorTitle} key={item.id}>
          <input
            defaultValue={item.title}
            onBlur={event => this.handleOnChangeTitle(item, event)}
            disabled={disabledIs}
          />
          {disabledIs ? (
            ''
          ) : (
            <CloseOutlined onClick={() => this.removeColumn(item)} />
          )}
        </div>
      ),
      dataIndex: `${item.dataIndex}`,
      key: `${item.key}`,
      width: 150,
      render: (value, row) => (
        <div className={style.editTable} key={item.id}>
          <input
            defaultValue={value}
            onBlur={event => this.handleOnChangeData(row, event, item.id)}
            disabled={disabledIs}
          />
        </div>
      ),
    }));

    return groups;
  };

  /** 上传 */
  uploadButton = () => {
    this.setState({ visible: true, isNewUpload: true });
  };

  /** 关闭上传 */
  handleClose = () => {
    this.setState({ visible: false, isNewUpload: false });
  };

  /**
   * 获取表头
   * @param {Array} data 数据列表
   * @param {Array} columns 初始列
   */
  getTableHeaderData = (data, columns, titleName) => {
    const newColumns = [...columns];

    data.forEach(item => {
      // 获取当前id最大值
      const ids = [];
      newColumns.forEach(cItem => {
        ids.push(cItem.id);
      });
      const max = Math.max.apply(null, ids);

      // 取出表头数据
      const newCol = {
        id: max + 1,
        title: item[titleName],
        dataIndex: `header_${max + 1}`,
        key: `header_${max + 1}`,
      };
      newColumns.push(newCol);
    });
    return newColumns;
  };

  /**
   * 获取行数据 环境因子
   * @param {Array} list 环境因子数据
   * @param {Array} sampleList 样品列表数据
   * @param {Array} columns 环境因子初始列
   */
  getRowDataEnvironment = (list, sampleList, columns) => {
    const newsamples = [];
    // 环境因子数据遍历
    list.forEach(item => {
      // 环境因子列表遍历
      item.environmentFactorValues.forEach(it => {
        // 样品列表遍历
        it.samples.forEach(t => {
          newsamples.push(t);
        });
      });
    });

    // 样品去重 排序
    const newData = this.sampleRemoveDuplication(
      newsamples,
      sampleList,
      columns,
    );
    return newData;
  };

  /**
   * 填充行数据 环境因子
   * @param {Array} list  环境因子数据
   * @param {Array} rowData 行数据 有表头字段但数据为空
   * @param {Array} columns 环境因子初始列
   */
  getFillDataEnvironment = (list, rowData, columns) => {
    const titleList = [];
    columns.forEach(item => {
      titleList.push(item.title);
    });
    // 环境因子遍历
    list.forEach(item => {
      const { environmentFactorName } = item;

      // 行数据遍历
      rowData.forEach(rowItem => {
        // 环境因子列表遍历
        item.environmentFactorValues.forEach(valItem => {
          // 环境因子值下的样品列表遍历
          valItem.samples.forEach(samItem => {
            // 找到对应的样品行
            if (rowItem.sampleId === samItem.sampleId) {
              Object.keys(rowItem).map(key => {
                if (rowItem[key] === environmentFactorName) {
                  rowItem[key] = valItem.environmentFactorValue;
                }
                // 删除多余属性
                delete rowItem.sampleColor;
                return false;
              });
            }
          });
        });
      });
    });
    rowData.forEach(rowItem => {
      Object.keys(rowItem).map(key => {
        if (titleList.includes(rowItem[key])) rowItem[key] = '';
        return false;
      });
    });

    return rowData;
  };

  /**
   * 样品去重 排序
   * @param {Array} list 数据中拿到的样品列表
   * @param {Array} sampleList 样品表中的样品列表
   * @param {Array} columns 初始列数据
   */
  sampleRemoveDuplication = (list, sampleList, columns) => {
    // 去重
    const newSample = [];
    const ids = [];
    list.forEach(samItem => {
      if (newSample.length === 0) {
        newSample.push(samItem);
        ids.push(samItem.sampleId);
      }
      if (ids.indexOf(samItem.sampleId) === -1) {
        newSample.push(samItem);
        ids.push(samItem.sampleId);
      }
    });

    // 第一列样品 排序 与样品列表顺序一致
    const newData = [];
    sampleList.forEach(item => {
      newSample.forEach(it => {
        if (item.id === it.sampleId) {
          // 拼装行
          const newIt = {
            sampleId: it.sampleId,
            sampleColor: '',
          };
          columns.forEach(groItem => {
            newIt[groItem.dataIndex] = groItem.title;
          });
          newIt.sampleName = it.sampleName;
          newData.push(newIt);
        }
      });
    });
    return newData;
  };

  render() {
    const {
      columns,
      data,
      visible,
      sampleList,
      isNewUpload,
      isUploadGoBack,
    } = this.state;
    const disabledIs = this.props.disabled; // 是否禁用
    const { paramName } = this.props.paramList;
    let tableWidth = 0;

    const newColumns = columns.map(col => {
      if (!col.width) col.width = 150;
      tableWidth += col.width;
      if (!col.editable) {
        return col;
      }
      return true;
    });

    return (
      <div
        style={{ width: '100%', marginTop: 30, marginBottom: 30 }}
        key={isUploadGoBack || ''}
      >
        <div
          style={{
            float: 'left',
            marginTop: 10,
            marginLeft: 16,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          {paramName}
        </div>
        {!disabledIs && sampleList.length > 0 ? (
          <div
            onClick={() => this.uploadButton()}
            style={{ float: 'right', marginTop: 10, marginBottom: 10 }}
          >
            <Button type="primary">
              <UploadOutlined />
              上传
            </Button>
          </div>
        ) : (
          ''
        )}

        {/* 表格 */}
        <Table
          scroll={{ x: tableWidth }}
          rowKey="sampleId"
          dataSource={data}
          columns={newColumns}
          pagination={false}
          style={{ clear: 'both' }}
        />
        {/* 上传文件 */}
        <UploadSequenceFile
          visible={visible}
          sampleList={sampleList}
          handleClose={this.handleClose}
          getUploadData={this.getDataDispose}
          isNewUpload={isNewUpload}
        />
      </div>
    );
  }
}

export default EnvironmentalFactorsModel;
