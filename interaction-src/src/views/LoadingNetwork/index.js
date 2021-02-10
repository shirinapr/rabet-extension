import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'Root/components/Loading';

import styles from './styles.less';

const LoadingOne = props => {
  return (
      <div style={ { marginTop: '215px'} }>

       <div className={styles.loading}>
         <Loading title="Sending to network" size={95} />
       </div>
      </div>
  );
};

LoadingOne.propTypes = {

};

export default LoadingOne;
