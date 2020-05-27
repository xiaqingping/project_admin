/** 流程参数 */
import React, { Component } from 'react';
import {
  Card,
  List,
  Form,
  Button,
  message,
  Tooltip,
  Modal,
  ConfigProvider,
} from 'antd';
import { connect } from 'dva';
import { history } from 'umi';
import api from '@/pages/project/api/projectManageDetail';
import {
  QuestionCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import empty from '@/assets/imgs/empty.png';
import { isEmpty } from '@/utils/utils';
import GlobalHeader from '@/components/GlobalHeader';

/** 参数组件引用 */
// eslint-disable-next-line max-len
import EnvironmentalFactorsModel from '@/pages/project/components/ModelComponents/EnvironmentalFactorsModel';
import SampleGroupModel from '@/pages/project/components/ModelComponents/SampleGroupModel';
import SampleSelectModel from '@/pages/project/components/ModelComponents/SampleSelectModel';
import CheckBoxModel from '@/pages/project/components/ModelComponents/CheckBoxModel';
import InputModel from '@/pages/project/components/ModelComponents/InputModel';
import InputNumberModel from '@/pages/project/components/ModelComponents/InputNumberModel';
import RadioModel from '@/pages/project/components/ModelComponents/RadioModel';

/** 样式 */
import style from './index.less';

/** 排序 */
function compare(property) {
  // eslint-disable-next-line func-names
  return function(a, b) {
    const value1 = a[property];
    const value2 = b[property];
    return value1 - value2;
  };
}

const { confirm } = Modal;

class ProcessParameter extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    const data = id.split('_');

    this.state = {
      // 参数页面前置数据
      requestType: data[0] || '', // 请求类型
      processModelId: data[1] || '', // 流程模型ID
      projectId: data[2] || '', // 项目ID
      processId: data[3] || '', // 流程ID
      paramGroupList: [], // 参数列表
      // 流程模型参数
      processParam: [],
      // 流程参数值
      processParamValue: [],
      // 样品选择框 样品列表
      sampleList: [],
      // 提交的数据
      paramList: [],
      // 需要验证的列表
      checkList: [],
      // 消息提示列表
      messageList: [],
      // 分组方案是否存在
      isSampleGroup: false,
      // 环境因子是否存在
      isSampleEnvironmentFactor: false,
    };
    // 判断请求类型
    this.determineTheRequestType();
  }

  /**
   * 判断请求类型
   */
  determineTheRequestType = () => {
    const { requestType, processId, processModelId } = this.state;

    // 创建项目 添加参数值 / 未保存时修改参数值
    if (requestType === 'add' || requestType === 'update') {
      this.getProcessParam(processModelId); // 查询流程参数
    }

    // 流程参数 修改参数值 / 查看参数
    if (requestType === 'edit' || requestType === 'view') {
      this.getProcessParam(processModelId); // 查询流程参数
      this.getProcessParamValue(processId); // 查询流程参数值
    }
    return false;
  };

  /**
   * 获取数据 执行不同的处理
   * @param {Array} param  流程模型参数
   * @param {Array} paramValue 流程参数值
   */
  getParamData = (param, paramValue) => {
    const { requestType, processModelId } = this.state;
    let newData = [];
    let data;
    const checkData = [];
    if (param.length > 0) {
      // 处理参数数据
      const newParam = this.deleteNullGroup(param); // 删除参数为空的分组
      // 无参数
      if (newParam.length === 0) {
        message.error('暂无参数列表！');
        setTimeout(() => {
          history.goBack();
        }, 1000);
        return false;
      }
      const newParamData = this.disposeParamAttribute(newParam); // 处理参数属性

      // 添加 参数值
      if (requestType === 'add') {
        if (param.length > 0) {
          data = newParamData;
        }
        data.forEach(item => {
          if (item.params.length) {
            item.params.forEach(it => {
              if (it.isRequired === 'true') {
                const obj = {
                  paramKey: it.paramKey,
                  paramName: it.paramName,
                };
                checkData.push(obj);
              }
            });
          }
        });
      }

      // 修改 未保存的参数值
      if (requestType === 'update') {
        // update参数值
        const processParamList = JSON.parse(
          sessionStorage.getItem('processForParams'),
        );
        const processParamValue = processParamList.filter(
          item => item.processModelId === processModelId,
        );

        // 有参数值时
        if (newParamData.length > 0 && processParamValue.length > 0) {
          const processParamValueList = processParamValue[0].params;
          // 合并参数和参数值
          data = this.comparedWith(newParamData, processParamValueList);
        }

        // 未设置参数值时
        if (newParamData.length > 0 && processParamValue.length === 0) {
          data = newParamData;
        }
      }

      // 编辑 参数值
      if (requestType === 'edit' || requestType === 'view') {
        // 有参数值时
        if (newParamData.length > 0 && paramValue.length > 0) {
          // 合并参数和参数值
          data = this.comparedWith(newParamData, paramValue);
        }
        // 未设置参数值时
        if (param.length > 0 && paramValue.length === 0) {
          data = newParamData;
          data.forEach(item => {
            if (item.params.length) {
              item.params.forEach(it => {
                if (it.isRequired === 'true') {
                  const obj = {
                    paramKey: it.paramKey,
                    paramName: it.paramName,
                  };
                  checkData.push(obj);
                }
              });
            }
          });
        }
      }
    }
    if (!data) return false;
    this.getDefaultParams(data);
    // 参数排序
    newData = this.compareParams(data, 'sortNo');
    this.setState({ paramGroupList: newData, checkList: checkData });
    return false;
  };

  /**
   * 参数排序
   * @param {Array} paramGroupList 参数分组数据
   * @param {String} field 排序字段
   */
  compareParams = (paramGroupData, field) => {
    const newData = [];
    paramGroupData.forEach(groItem => {
      const newGroupItem = JSON.parse(JSON.stringify(groItem));
      const { params } = groItem;
      const newParams = params.sort(compare([field]));
      newGroupItem.params = newParams;
      newData.push(newGroupItem);
    });
    return newData;
  };

  /**
   * 获取初始参数列表 提交时作为默认数据
   * @param {Array} paramGroupList 参数分组数据
   */
  getDefaultParams = paramGroupList => {
    let paramList = [];
    let sampleList = [];
    paramGroupList.forEach(groItem => {
      const { params } = groItem;
      paramList = [...paramList, ...params];
      params.forEach(item => {
        // 把组件的默认值赋值给
        // eslint-disable-next-line no-param-reassign
        if (item.defaultValue && isEmpty(item.paramValue))
          // eslint-disable-next-line no-param-reassign
          item.paramValue = item.defaultValue;
        // 有样品选择框时 数据单独保存下来传递给分组和环境因子组件
        if (item.type === 'sample_select') {
          if (item.paramValue) {
            sampleList = [...sampleList, ...JSON.parse(item.paramValue)];
          }
        }
        // 判断参数中是否有 环境因子 和 分组方案
        if (item.type === 'sample_group') {
          this.setState({ isSampleGroup: true });
        }
        if (item.type === 'sample_environment_factor') {
          this.setState({ isSampleEnvironmentFactor: true });
        }
      });
    });
    this.setState({ paramList, sampleList });
  };

  /**
   * 编辑状态 设置表单初始值
   * @param {string} data 组件数据
   */
  setInitialFromValues = data => {
    data.forEach(item => {
      const { paramKey } = item;
      if (this.formRef.current) {
        this.formRef.current.setFieldsValue({
          [paramKey]: item.paramValue || item.deafultValue,
        });
      }
    });
  };

  /** 保存提交 */
  onSubmit = () => {
    const {
      paramList,
      checkList,
      messageList,
      requestType,
      processId,
      processModelId,
      projectId,
    } = this.state;

    if (checkList.length) {
      if (messageList.length > 0) {
        messageList.forEach(item => {
          message.error(item.message);
        });
        return false;
      }

      if (checkList.length > 3) {
        message.error(`有多个必填参数为空, 请检查填写的参数`);
      } else {
        checkList.forEach(item => {
          message.error(`${item.paramName} 是必填参数`);
        });
      }
      return false;
    }

    let url;
    // 添加 / 修改
    if (requestType === 'add' || requestType === 'update') {
      const processParams = JSON.parse(
        sessionStorage.getItem('processForParams'),
      );
      let newProcessParams = [];
      if (processParams && processParams.length > 0) {
        newProcessParams = processParams.filter(
          item => item.processModelId !== processModelId,
        );
      } else {
        newProcessParams = processParams;
      }

      const newData = { params: paramList, processModelId };
      let list = [];
      if (newProcessParams) {
        list = [...newProcessParams, newData];
      } else {
        list = [newData];
      }

      sessionStorage.setItem('processForParams', JSON.stringify(list));
      if (isEmpty(projectId))
        url = `/project/project-manage/add/addflowpath/add_''_1`;
      if (projectId)
        url = `/project/project-manage/detailAdd/edit_${projectId}_2`;
      return history.push(url);
    }

    // 编辑
    if (requestType === 'edit') {
      api
        .updateProcessesParameter(processId, paramList)
        .then(() => {
          if (projectId === '') url = `/project/project-manage`;
          if (projectId !== '') url = `/detail/${projectId}`;

          return history.push(url);
        })
        .catch();
    }
    return false;
  };

  /**
   * 组件返回数据
   * @param {string} data 组件数据
   * @param {string} type 组件类型
   * @param {boolean} isVerify 数据是否通过验证
   * @param {String} massage 验证未通过时的错误提示
   */
  getModelData = (data, type, isVerify, errorMassage) => {
    const { paramList, checkList, messageList } = this.state;
    let checkData = [...checkList];
    const checkParamKey = [];
    checkData.forEach(item => checkParamKey.push(item.paramKey));
    let messageData = [...messageList];

    // 获取必填参数 提示信息
    if (isVerify) {
      if (checkParamKey.includes(data.paramKey)) {
        let newCheckData = [];
        newCheckData = checkData.filter(
          item => item.paramKey !== data.paramKey,
        );
        checkData = newCheckData;
        const newMessageData = messageData.filter(
          item => item.paramKey !== data.paramKey,
        );
        messageData = newMessageData;
      }
    } else if (!checkParamKey.includes(data.paramKey)) {
      const newItem = {
        paramKey: data.paramKey,
        paramName: data.paramName,
      };
      checkData.push(newItem);
      const obj = {
        paramKey: data.paramKey,
        message: errorMassage,
      };
      messageData.push(obj);
    }
    this.setState({
      checkList: checkData,
      messageList: messageData,
    });

    // 数据通过验证时
    if (isVerify) {
      let newParams = [];
      newParams = paramList.filter(item => item.paramKey !== data.paramKey);
      paramList.forEach(item => {
        if (item.paramKey === data.paramKey) {
          const newItem = JSON.parse(JSON.stringify(item));
          newItem.paramValue = data.paramValue;
          newParams.push(newItem);
        }
        return false;
      });

      this.setState({
        paramList: newParams,
      });
      return false;
    }
    return false;
  };

  /**
   * 删除参数为空的分组
   * @param {Array} data 流程参数
   */
  deleteNullGroup = data => {
    const newData = [];
    data.forEach(item => {
      if (item.params.length > 0) {
        newData.push(item);
      }
    });
    return newData;
  };

  /**
   * 处理参数属性
   * @param {Array} data 流程参数
   */
  disposeParamAttribute = data => {
    const newData = [];
    // 遍历分组
    data.forEach(groupItem => {
      // 保留分组信息 分组参数设置为空 以便新的参数列表赋值
      const groupData = JSON.parse(JSON.stringify(groupItem));
      groupData.params = [];

      // 遍历参数列表
      const paramList = groupItem.params;
      const nparam = [];
      paramList.forEach(paramItem => {
        const nParamItem = JSON.parse(JSON.stringify(paramItem));
        // 遍历参数属性列表
        const propertyList = paramItem.paramProperties;
        propertyList.forEach(proItem => {
          // key：value
          nParamItem[proItem.paramPropertyKey] = proItem.paramPropertyValue;
        });
        nParamItem.sortNo = paramItem.sortNo;

        // 删除 参数属性列表 字段（可不删）
        delete nParamItem.paramProperties;

        // 保存处理好的参数
        nparam.push(nParamItem);
        if (groupData.id === nParamItem.groupId) {
          groupData.params = nparam;
        }
      });

      // 每个分组数据重新push到新数组中
      newData.push(groupData);
    });
    return newData;
  };

  /**
   * 合并参数列表和参数值
   * @param {Array} paramGroupData 参数分组数据
   * @param {Array} valueData 参数值
   */
  comparedWith = (paramGroupData, valueData) => {
    const list = [];
    paramGroupData.forEach(groupItem => {
      // 保存分组数据
      const groupData = JSON.parse(JSON.stringify(groupItem));
      groupData.params = [];

      const paramList = groupItem.params;
      const newList = [];
      const ids = [];
      paramList.forEach(paramItem => {
        valueData.forEach(valueItem => {
          const newItem = JSON.parse(JSON.stringify(paramItem));
          if (paramItem.paramKey === valueItem.paramKey) {
            if (newList.length === 0) {
              newItem.paramValue = valueItem.paramValue;
              newList.push(newItem);
            } else {
              newList.forEach(listItem => ids.push(listItem.id));
              if (ids.indexOf(paramItem.id) === -1) {
                newItem.paramValue = valueItem.paramValue;
                newList.push(newItem);
              }
            }
          }
        });
      });
      groupData.params = newList;
      list.push(groupData);
    });

    return list;
  };

  /**
   * 获取流程参数
   * @param {Array} processModelId 流程模型ID
   */
  getProcessParam = processModelId => {
    api.getProcessParam(processModelId).then(res => {
      if (res.length === 0) {
        message.error('未查询到参数！');
        return false;
      }
      this.setState({ processParam: res }, () => {
        this.getParamData(
          this.state.processParam,
          this.state.processParamValue,
        );
      });
      return false;
    });
  };

  /**
   * 获取流程参数值
   * @param {Array} processModelId 流程ID
   */
  getProcessParamValue = processId => {
    api.getProcessParamValue(processId).then(res => {
      this.setState({ processParamValue: res }, () => {
        this.getParamData(
          this.state.processParam,
          this.state.processParamValue,
        );
        // 设置默认值
        this.setInitialFromValues(res);
      });
    });
  };

  /**
   * 获取样品选择框的实时数据
   * @param {Array} updateData 样品列表数据
   */
  getSelectUpdateData = updateData => {
    const { isSampleGroup, isSampleEnvironmentFactor } = this.state;
    this.setState(
      {
        sampleList: updateData,
      },
      () => {
        if (isSampleGroup) this.handleUpdateSampleGroup();
        if (isSampleEnvironmentFactor) this.handleUpdateEnvironmentFactor();
      },
    );
  };

  /** 返回 */
  goBackLink = () => {
    const { requestType, projectId } = this.state;
    let url;
    if (requestType === 'add' || requestType === 'update') {
      if (projectId)
        url = `/project/project-manage/detailAdd/edit_${projectId}_2`;
      if (projectId === '' || projectId === undefined)
        url = `/project/project-manage/add/addflowpath/add_''_1`;
    } else {
      if (projectId === '') url = `/project/project-manage`;
      if (projectId !== '') url = `/detail/${projectId}`;
    }

    confirm({
      icon: <ExclamationCircleOutlined />,
      content: '未保存的数据将丢失，是否返回？',
      centered: true,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        history.push(url);
      },
      onCancel: () => {},
    });
  };

  render() {
    const { paramGroupList, sampleList, requestType } = this.state;
    const data = paramGroupList;
    if (data.length === 0) return false;

    // 自定义空状态
    const customizeRenderEmpty = () => (
      <div style={{ textAlign: 'center' }}>
        <img alt="" src={empty} />
        <p>暂无数据</p>
      </div>
    );

    return (
      <>
        <GlobalHeader />
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <div className={style.processParams}>
            <Form name="basic" ref={this.formRef} className={style.form}>
              <div className={style.name}>
                <span className={style.canshu}>参数维护</span>
              </div>
              <List
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <Card
                      title={
                        <>
                          <span style={{ display: 'inline-block' }}>
                            {item.groupName === 'no'
                              ? '未分组'
                              : item.groupName}
                          </span>
                          <span
                            style={{ display: 'inline-block', marginLeft: 30 }}
                          >
                            {item.groupDescribe && (
                              <Tooltip
                                placement="right"
                                title={<span>{item.groupDescribe}</span>}
                              >
                                <QuestionCircleOutlined />
                              </Tooltip>
                            )}
                          </span>
                        </>
                      }
                      style={{ width: '100%' }}
                    >
                      {item.params.map(it => {
                        if (it.type === 'input')
                          return (
                            <div key={it.id}>
                              <InputModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'} // 禁用
                                getData={this.getModelData} // 提交数据
                              />
                              <div className={style.hr} />
                            </div>
                          );
                        // 数值输入框
                        if (it.type === 'number_input') {
                          return (
                            <div key={it.id}>
                              <InputNumberModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'}
                                getData={this.getModelData}
                              />
                              <div className={style.hr} />
                            </div>
                          );
                        }
                        // 单选
                        if (it.type === 'radio')
                          return (
                            <div key={it.id}>
                              <RadioModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'}
                                getData={this.getModelData}
                              />
                              <div className={style.hr} />
                            </div>
                          );

                        // 多选
                        if (it.type === 'checkbox')
                          return (
                            <div key={it.id}>
                              <CheckBoxModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'}
                                getData={this.getModelData}
                              />
                              <div className={style.hr} />
                            </div>
                          );
                        // 样品选择框
                        if (it.type === 'sample_select') {
                          return (
                            <div key={it.id}>
                              <SampleSelectModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'}
                                sampleList={sampleList} // 样品列表
                                getData={this.getModelData}
                                // 当样品选择改变的时候
                                emitData={this.getSelectUpdateData}
                                setSelectState={this.setSelectState}
                              />
                              <div className={style.hr} />
                            </div>
                          );
                        }
                        // 样品分组方案
                        if (it.type === 'sample_group') {
                          return (
                            <div key={it.id}>
                              <SampleGroupModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'}
                                sampleList={sampleList}
                                getData={this.getModelData}
                                // 样品列表改变执行事件
                                getFun={func => {
                                  this.handleUpdateSampleGroup = func;
                                }}
                              />
                              <div className={style.hr} />
                            </div>
                          );
                        }
                        // 样品环境因子
                        if (it.type === 'sample_environment_factor') {
                          return (
                            <div key={it.id}>
                              <EnvironmentalFactorsModel
                                paramList={it}
                                key={it.id}
                                disabled={requestType === 'view'}
                                sampleList={sampleList}
                                getData={this.getModelData}
                                // 样品列表改变执行事件
                                getFun={func => {
                                  this.handleUpdateEnvironmentFactor = func;
                                }}
                              />
                              <div className={style.hr} />
                            </div>
                          );
                        }
                        return false;
                      })}
                    </Card>
                  </List.Item>
                )}
              />
            </Form>

            <div className={style.footer}>
              <div className={style.button}>
                <Button
                  className={style.back}
                  onClick={() => this.goBackLink()}
                >
                  返回
                </Button>
                {requestType === 'view' ? (
                  ''
                ) : (
                  <Button type="primary" onClick={this.onSubmit}>
                    提交
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ConfigProvider>
      </>
    );
  }
}

export default connect(({ projectDetail }) => ({
  projectDetail,
}))(ProcessParameter);
