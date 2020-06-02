import React from 'react';
import { Form, Input, Modal, Button, Spin, message } from 'antd';
import api from '@/pages/project/api/file';
import './index.less';

class FileEditModal extends React.Component {
  formRef = React.createRef();

  state = {
    loading: false,
  };

  componentDidMount() {}

  onFinish = result => {
    console.log(result);
    const patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、\s]/im;
    if (patrn.test(result.name)) {
      // 如果包含特殊字符返回false
      return message.error('请勿输入特殊字符');
    }

    if (patrn.test(result.describe)) {
      // 如果包含特殊字符返回false
      return message.error('请勿输入特殊字符');
    }

    this.setState({ loading: true });
    const { fileData } = this.props;
    const formData = this.formRef.current.getFieldsValue();
    const formatData = {
      ...fileData,
      ...formData,
      spaceType: 'project',
      spaceCode: this.props.spaceCode,
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
    return true;
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
                  message: '请输入文件名称',
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
            <div
              className="project_manage_user_file_test_modal_footer"
              style={{
                textAlign: 'right',
                paddingBottom: 15,
              }}
            >
              <div className="son" />
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