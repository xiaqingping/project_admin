import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import React from 'react';

const BaseLayout = props => {
  const { children } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <GlobalHeader />
      <div style={{ flex: 1 }}>{children}</div>
      <GlobalFooter />
    </div>
  );
};

export default BaseLayout;
