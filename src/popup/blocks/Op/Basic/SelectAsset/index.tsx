import React, { useEffect, useState } from 'react';

import Modal from 'popup/components/common/ModalDialog';
import AngleDownBold from 'popup/svgs/AngleDownBold';
import { Usage } from 'popup/models';
import questionLogo from '../../../../../assets/images/question-circle.png';
import SearchAsset from './Search';

import * as S from './styles';

type AppProps = {
  currencies: any[];
  onChange: (value: any) => void;
  usage: Usage;
};

const SelectAssetModal = ({
  asset,
  onChange,
  currencies,
  setValue,
  valueName,
  defaultNull,
  usage,
}: AppProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState(
    defaultNull ? null : currencies[0],
  );

  const onOpenModal = () => setIsModalOpen(true);
  const onCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (asset) {
      setCurrentAsset(asset);
    }
  }, [asset]);

  const handleAssetChange = (newAsset) => {
    setCurrentAsset(newAsset);
    onChange(newAsset);

    if (setValue) {
      setValue(valueName, newAsset);
    }
  };

  return (
    <S.InputContainer className="select-modal">
      <S.ModalTrigger onClick={onOpenModal}>
        <div className="flex items-center">
          {currentAsset ? (
            <>
              <S.Img
                fallBack={questionLogo}
                alt="asset"
                src={questionLogo}
              />
              asset
            </>
          ) : (
            <p>NONE</p>
          )}
        </div>
        <AngleDownBold />
      </S.ModalTrigger>

      <Modal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        isStyled={false}
        size={usage === 'extension' ? 'small' : 'medium'}
      >
        <SearchAsset
          currencies={currencies}
          closeModal={onCloseModal}
          onChange={handleAssetChange}
        />
      </Modal>
    </S.InputContainer>
  );
};

export default SelectAssetModal;
