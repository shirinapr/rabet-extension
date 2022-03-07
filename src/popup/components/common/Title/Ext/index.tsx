import React from 'react';
import { useNavigate } from 'react-router-dom';

import Multiply from 'popup/svgs/Multiply';
import RouteName from 'popup/staticRes/routes';
import useTypedSelector from 'popup/hooks/useTypedSelector';

import * as S from './styles';

type AppProps = {
  title: string;
  status?: 'success' | 'warn' | null;
  alreadyLoaded?: boolean;
  className?: string;
  onClose?: () => void | undefined;
};

const ExtTitle = ({
  title,
  status,
  alreadyLoaded,
  className,
  onClose,
}: AppProps) => {
  const navigate = useNavigate();
  const accounts = useTypedSelector((state) => state.accounts);

  const generateTitle = () => {
    if (status) {
      return (
        <S.Status className={status}>
          <span />
          {title}
        </S.Status>
      );
    }

    if (title) {
      return <S.Title>{title}</S.Title>;
    }

    return null;
  };

  const handleClose = () => {
    if (onClose) {
      return onClose();
    }

    if (accounts.length) {
      return navigate(RouteName.Home, {
        state: {
          alreadyLoaded,
        },
      });
    }

    return navigate(-1);
  };

  return (
    <S.Container className={className}>
      <div>{generateTitle()}</div>

      <div className="cursor-pointer" onClick={handleClose}>
        <Multiply />
      </div>
    </S.Container>
  );
};

ExtTitle.defaultProps = {
  status: null,
  alreadyLoaded: true,
  className: '',
  onClose: undefined,
};

export default ExtTitle;
