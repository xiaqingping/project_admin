import React from 'react';
import { Layout, Avatar } from 'antd';
import style from './index.less';

const { Header } = Layout;

class GlobalHeader extends React.Component {
  state = {
    user: {},
  };

  componentDidMount() {
    const userStorage = localStorage.getItem('user');
    const user = userStorage && JSON.parse(userStorage);
    this.setState({
      user,
    });
  }

  render() {
    const { user } = this.state;
    return (
      <Layout>
        <Header className={style.globalHeader}>
          <div className={style.headerContent}>
            <div className={style.logoImg} />
            <div>
              <Avatar size={40} src={user.avatar} />
              <span className={style.headerUser} style={{ marginLeft: 10 }}>
                {user.name}
              </span>
            </div>
          </div>
        </Header>
      </Layout>
    );
  }
}

export default GlobalHeader;
