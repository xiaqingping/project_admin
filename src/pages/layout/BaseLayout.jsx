import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import React from 'react';

const BaseLayout = props => {
  const { children } = props;

  return (
    <div>
      <GlobalHeader />
      {children}
      <GlobalFooter />
    </div>
  );
};

export default BaseLayout;
