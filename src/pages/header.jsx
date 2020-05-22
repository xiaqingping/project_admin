import React from 'react';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

class Header extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <GlobalHeader />
        <h1>jdjdj</h1>
        <GlobalFooter />
      </div>
    );
  }
}

export default Header;
