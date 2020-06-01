import React from 'react';
import { Form, Input, Modal, Button, Spin } from 'antd';
import api from '@/pages/project/api/file';

class FileEditModal extends React.Component {
  formRef = React.createRef();

  state = {
    loading: false,
  };

  componentDidMount() {}

  onFinish = () => {
    this.setState({ loading: true });
    const { fileData } = this.props;
    const formData = this.formRef.current.getFieldsValue();
    const formatData = {
      ...fileData,
      ...formData,
      spaceType: 'project',
      spaceCode: '6e761a1aa7934884b11bf57ebf69db51',
    };
    api
      .EditFile(formatData)
      .then(res => {
        console.log(res);
        this.setState({ loading: false });
        this.props.changeVis(true);
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  handleCancel = () => {
    this.props.changeVis();
  };

  render() {
    const { fileData } = this.props;
    const { loading } = this.state;
    return (
      <Modal
        title="修改"
        visible
        footer={false}
        onOk={this.handleCancel}
        onCancel={this.handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Spin spinning={loading}>
          <Form
            name="basic"
            ref={this.formRef}
            initialValues={fileData}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="name"
              label="名称"
              rules={[
                {
                  required: true,
                  message: '请输入任务名称',
                },
                {
                  max: 100,
                  message: '最多输入100个字符',
                },
                {
                  pattern: /^(?![\s]).*(?![\s]).$/,
                  message: '禁止输入空格',
                },
              ]}
            >
              <Input placeholder="输入名称" />
            </Form.Item>
            {fileData.fileType * 1 !== 2 && (
              <Form.Item
                name="describe"
                label="描述"
                rules={[
                  {
                    required: true,
                    message: '请输入任务名称',
                  },
                  {
                    pattern: /^(?![\s]).*(?![\s]).$/,
                    message: '禁止输入空格',
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            )}
            <div
              style={{
                textAlign: 'right',
                //   borderTop: '1px solid #eee',
                paddingBottom: 15,
              }}
            >
              <Button onClick={this.handleCancel} style={{ marginRight: 10 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default FileEditModal;
