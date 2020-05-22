import React, { Component } from 'react';
import { history } from 'umi';
// import ProjectEdit from '@/pages/project/projectAdd';

class List extends Component {
  handleChange = () => {
    // alert('点击跳转到新建项目页面');
    history.push('/project-manage-edit');
  };

  render() {
    return (
      <div
        onClick={() => {
          this.handleChange();
        }}
        style={{
          background: 'pink',
          height: '80px',
          fontSize: '20px',
          color: 'red',
          textAlign: 'center',
          lineHeight: '80px',
        }}
      >
        春去秋来
      </div>
    );
  }
}
export default List;
