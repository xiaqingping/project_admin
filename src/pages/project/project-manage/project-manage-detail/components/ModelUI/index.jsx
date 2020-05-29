import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

/**
 * 流程 编辑名称描述 模态框
 * @param {String} visible 是否显示
 */
const EditInforModel = props => {
  const [form] = Form.useForm();
  const [confirmLoading] = useState(false);

  // 关闭Model
  const handleCancel = () => {
    props.onClose();
  };

  // 确定保存
  const handleOk = async () => {
    const row = await form.validateFields();
    const data = {
      id: props.rowData.id,
      ...row,
    };
    props.getData(data);
    props.onClose();
  };

  return (
    <div>
      <Modal
        className="classEditFormItem"
        title="修改"
        visible={props.visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
            style={{ borderRadius: 5 }}
          >
            确定
          </Button>,
        ]}
        centered
        width={650}
      >
        <div>
          <Form
            name="basic"
            form={form}
            initialValues={{
              name: props.rowData.name,
              describe: props.rowData.describe,
            }}
          >
            <FormItem label="" name="name" rules={[{ message: '请输入名称!' }]}>
              <Input style={{ width: 272, height: 32, borderRadius: 5 }} />
            </FormItem>
            <FormItem
              label=""
              name="describe"
              rules={[{ message: '请输入相关描述!' }]}
            >
              <TextArea
                rows={4}
                style={{
                  width: 552,
                  height: 128,
                  marginBottom: -10,
                  borderRadius: 5,
                }}
              />
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export { EditInforModel };
