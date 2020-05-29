import React from 'react';
import { Layout, Avatar } from 'antd';
import { history } from 'umi';
import style from './index.less';

const { Header } = Layout;

class GlobalHeader extends React.Component {
  state = {
    user: {},
  };

  componentDidMount() {
    const userStorage = localStorage.getItem('user');
    const user = userStorage ? JSON.parse(userStorage) : {};
    this.setState({
      user,
    });
  }

  goIndex = () => {
    history.push('/');
  };

  render() {
    const { user } = this.state;
    return (
      <Header className={style.globalHeader}>
        <div className={style.headerContent}>
          <div className={style.logoImg} onClick={this.goIndex} />
          <div style={{ position: 'relative' }}>
            <Avatar
              size={36}
              src={user.avatar}
              style={{
                position: 'absolute',
                left: -35,
                top: 14,
                cursor: 'pointer',
              }}
            />
            <span className={style.headerUser} style={{ marginLeft: 10 }}>
              {user.name}
            </span>
          </div>
        </div>
      </Header>
    );
  }
}

export default GlobalHeader;
