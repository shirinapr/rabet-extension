import React from 'react';

import Header from 'popup/components/common/Header';
import LoadingNetwork from 'popup/pages/LoadingNetwork';
import ExtTitle from 'popup/components/common/Title/Ext';
import ScrollBar from 'popup/components/common/ScrollBar';

const LoadingNerwork = () => (
  <ScrollBar isHidden>
    <Header />

    <div className="content">
      <ExtTitle alreadyLoaded={false} noMultiplyIcon />
      <div className="py-3">
        <LoadingNetwork />
      </div>
    </div>
  </ScrollBar>
);

export default LoadingNerwork;
