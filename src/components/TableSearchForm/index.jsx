import { Button, Col, Form, Row } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'umi/locale';
import './index.less';

/**
 * 表格查询表单
 * @param {Object} props
 * @param {Function} props.getTableData 表单onFinish时执行的方法（根据Form values查询表格数据）
 * @param {ReactDOM} props.simpleForm 简单表单
 * @param {ReactDOM} props.advancedForm 复杂表单
 * @param {Object} props.initialValues 表单默认值
 */
const TableSearchForm = React.forwardRef((props, ref) => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();

  // 查询
  const onFinish = () => {
    props.getTableData({ page: 1 });
  };

  return (
    <Form
      ref={ref}
      form={form}
      name="表格搜索表单"
      onFinish={onFinish}
      initialValues={props.initialValues}
    >
      <Row gutter={24}>
        {props.simpleForm()}
        {expand && props.advancedForm ? props.advancedForm() : null}
        {props.noButton ? (
          ''
        ) : (
          <Col
            xxl={expand && props.advancedForm ? 24 : 6}
            xl={expand && props.advancedForm ? 24 : 8}
            style={{ textAlign: 'right' }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginBottom: '24px' }}
            >
              {/* <FormattedMessage id="action.search" /> */}搜索
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                form.resetFields();
              }}
            >
              {/* <FormattedMessage id="action.reset" /> */}重置
            </Button>
            {props.advancedForm ? (
              <a
                style={{ marginLeft: 8, fontSize: 14 }}
                onClick={() => {
                  setExpand(!expand);
                }}
              >
                {expand ? (
                  <>
                    {/* <FormattedMessage id="action.unexpand" /> */}unexpand
                    <UpOutlined />
                  </>
                ) : (
                  <>
                    {/* <FormattedMessage id="action.expand" /> */}expand
                    <DownOutlined />
                  </>
                )}
              </a>
            ) : null}
          </Col>
        )}
      </Row>
    </Form>
  );
});

TableSearchForm.defaultProps = {
  initialValues: {},
  simpleForm: null,
  advancedForm: null,
};

TableSearchForm.propTypes = {
  initialValues: PropTypes.object,
  getTableData: PropTypes.func.isRequired,
  simpleForm: PropTypes.func,
  advancedForm: PropTypes.func,
};

export default TableSearchForm;
