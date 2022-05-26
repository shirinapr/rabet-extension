import classNames from 'classnames';
import React from 'react';

import Button from '../../components/Button';
import shorter from '../../../helpers/shorter';
import shortName from '../../../helpers/shortName';
import smallDetail from '../../../helpers/smallDetail';

import styles from './styles.less';

const ContactRequest = () => {
  const host = global.sessionStorage.getItem('host');
  const title = global.sessionStorage.getItem('title');
  const name = global.sessionStorage.getItem('accountName');
  const publicKey = global.sessionStorage.getItem('accountPublicKey');

  const handleReject = () => {
    global.chrome.runtime.sendMessage({
      type: 'RABET_EXTENSION_CONTACT_REQUEST_RESPONSE',
      id: global.sessionStorage.getItem('generatedId'),
      result: 'reject',
      detail: {
        host,
        title,
      },
      activeAcconut: {
        name,
        publicKey,
      },
    });
  };

  const handleConnect = () => {
    global.chrome.runtime.sendMessage({
      type: 'RABET_EXTENSION_CONTACT_REQUEST_RESPONSE',
      id: global.sessionStorage.getItem('generatedId'),
      result: 'confirm',
      detail: {
        host,
        title,
      },
      activeAcconut: {
        name,
        publicKey,
      },
    });
  };

  return (
    <div>
      <div className="content">
        <h6 className={styles.contact}>Connect Request</h6>
        <div className={styles.step}>
          <div className="pure-g step-container">
            <div
              className="step step-one flex-parent"
              style={{ alignItems: 'center' }}
            >
              <img
                src={`https://logo.clearbit.com/${host}?size=55`}
                style={{ height: 'auto' }}
                alt={host}
              />
            </div>
            <div className="step step-two">{shortName(name)}</div>
            <div className="icon-checkmark step-checked" />
          </div>
          <div className="pure-g step-name-container">
            <div className="pure-u-4-24">
              <p className="step-name">{host}</p>
            </div>
            <div className="pure-u-5-24">
              <p className="step-name">{name}</p>
            </div>
          </div>
        </div>
        <h1 className={styles.title}>
          <a
            style={{
              color: '#3277ff',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            href={`https://${host}`}
            target="_blank"
          >
            {host}
          </a>{' '}
          would like to connect to your account
        </h1>

        <div className={classNames('pure-g', styles.buttons)}>
          <Button
            variant="btn-default"
            size="btn-medium"
            content="Reject"
            onClick={handleReject}
          />

          <Button
            type="submit"
            variant="btn-primary"
            size="btn-medium"
            content="Connect"
            onClick={handleConnect}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactRequest;
