import React from 'react';
import { Link } from 'react-router-dom';

import RouteName from 'popup/staticRes/routes';
import Button from 'popup/components/common/Button';
import useTypedSelector from 'popup/hooks/useTypedSelector';
import { Swap, Send, Receive } from 'popup/svgs/TransactionActions';

const Links = () => {
  const { mode } = useTypedSelector((store) => store.options);

  const isAdvanced = mode === 'ADVANCED';

  return (
    <div className="flex justify-center align-center mt-2">
      <Link
        to={
          isAdvanced
            ? RouteName.AdvancedOperation
            : RouteName.BasicOperation
        }
      >
        <Button
          iconBtn
          size="small"
          variant="icon-circle"
          content="S"
          title="test"
        />
      </Link>
      <Link to={RouteName.QRCode}>
        <Button
          size="small"
          variant="icon-circle"
          content="R"
          iconBtn
          title="test"
        />
      </Link>
      <Link to={RouteName.QRCode}>
        <Button
          size="small"
          variant="icon-circle"
          content="S"
          iconBtn
          title="test"
        />
      </Link>
    </div>
  );
};

export default Links;
