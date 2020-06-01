import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import style from './index.less';

const BaseLayout = props => {
  const { children } = props;

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ display: 'flex', flexFlow: 'column', minHeight: '100vh' }}>
        <GlobalHeader />
        <div className={style.setWidth} style={{ flex: 1 }}>
          {children}
        </div>
        <GlobalFooter />
      </div>
    </ConfigProvider>
  );
};

export default BaseLayout;
