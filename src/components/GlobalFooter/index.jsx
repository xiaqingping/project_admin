import React from 'react';

import style from './index.less';

class GlobalHeader extends React.Component {
  state = {};

  render() {
    return (
      <div className={style.footerWrap}>
        Copyright
        <span style={{ fontSize: 16 }}>©</span>
        2017-2020,I-Sanger Inc. All Rights Reserved . 沪ICP备14033599号-1
        生工云计算
      </div>
    );
  }
}

export default GlobalHeader;
