import React, { useEffect, useState } from 'react';

import { Tab } from 'popup/models';
import loadBids from 'popup/features/loadBids';
import Error from 'popup/pageComponents/Error';
import Loading from 'popup/components/Loading';
import loadAccount from 'popup/features/loadAccount';
import Transactions from 'popup/components/Transactions';
import loadCurrencies from 'popup/features/loadCurrencies';
import useActiveAccount from 'popup/hooks/useActiveAccount';
import WalletInfo from 'popup/pages/expand/EHome/WalletInfo';
import loadAssetImages from 'popup/features/loadAssetImages';
import ModalDialog from 'popup/components/common/ModalDialog';
import ExpandLayout from 'popup/components/common/Layouts/ExpandLayout';

const EHome = () => {
  const activeAccount = useActiveAccount();
  const [modal, setModal] = useState(false);
  const onOpenModal = () => setModal(true);
  const onCloseModal = () => setModal(false);

  useEffect(() => {
    loadCurrencies();

    loadAccount(activeAccount).then(() => {
      loadBids();
      loadAssetImages();
    });
  }, [activeAccount.publicKey]);

  const tabs: Tab[] = [
    {
      id: 1,
      title: 'Operation',
      content: (
        <>
          <div
            onClick={onOpenModal}
            className="text-slate-600 text-[16px]"
          >
            Error modal test (free to remove)
          </div>
          <ModalDialog
            isStyled={false}
            size="medium"
            onClose={onCloseModal}
            isOpen={modal}
          >
            <Error
              handleClick={() => console.log('Handel modal please')}
              message="YOUR RECEIVED ADDRESS IS NOT ALLOWED FOR THIS TOKEN"
            />
          </ModalDialog>
          <div
            onClick={onOpenModal}
            className="text-slate-600 text-[16px]"
          >
            Loading modal test (free to remove)
          </div>
          <ModalDialog
            isStyled={false}
            size="medium"
            onClose={onCloseModal}
            isOpen={modal}
          >
            <Loading size={120} title="Sending to network" />
          </ModalDialog>
        </>
      ),
    },
    { id: 2, title: 'Transactions', content: <Transactions /> },
    { id: 3, title: 'Wallet info', content: <WalletInfo /> },
    { id: 4, title: 'Settings', content: 'SETTINGS' },
  ];

  return <ExpandLayout tabItems={tabs} />;
};

export default EHome;
