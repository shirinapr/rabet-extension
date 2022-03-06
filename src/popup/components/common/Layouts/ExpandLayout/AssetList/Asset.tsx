import React from 'react';
import { Horizon } from 'stellar-sdk';

import BlackCheck from 'popup/svgs/BlackCheck';
import formatBalance from 'popup/utils/formatBalance';
import useAssetPrice from 'popup/hooks/useAssetPrice';
import formatCurrency from 'popup/utils/formatCurrency';
import handleAssetAlt from 'popup/utils/handleAssetAlt';
import useTypedSelector from 'popup/hooks/useTypedSelector';
import handleAssetImage from 'popup/utils/handleAssetImage';
import handleAssetSymbol from 'popup/utils/handleAssetSymbol';

import questionIcon from '../../../../../../assets/images/question-circle.png';
import ImageOnErrorHandler from '../../../../../../helpers/ImageOnErrorHandler';

import * as S from './styles';

type AssetType = {
  asset: Horizon.BalanceLine;
};

const Asset = ({ asset }: AssetType) => {
  const [assetImages, currencies, options] = useTypedSelector(
    (store) => [
      store.assetImages,
      store.currencies,
      store.options,
      store.bids,
    ],
  );
  const price = useAssetPrice(asset);

  let asset_code: string;
  let isVerified = false;

  if (
    asset.asset_type === 'credit_alphanum4' ||
    asset.asset_type === 'credit_alphanum12'
  ) {
    asset_code = asset.asset_code;
    const assetImageFound = assetImages.find(
      (assetImage) =>
        assetImage.asset_code === asset.asset_code &&
        assetImage.asset_issuer === asset.asset_issuer,
    );

    if (assetImageFound && assetImageFound.is_verified) {
      isVerified = true;
    }
  } else {
    isVerified = true;
    asset_code = 'XLM';
  }

  return (
    <div>
      <S.Container className="flex items-center">
        <S.Circle>
          <S.Image
            isDark={asset.asset_type === 'native'}
            src={handleAssetImage(asset, assetImages)}
            alt={handleAssetAlt(asset)}
            onError={(e) => ImageOnErrorHandler(e, questionIcon)}
          />
        </S.Circle>
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-col">
            <div className="inline-flex text-base">
              <span className=" font-medium">
                {formatCurrency(asset.balance)}
              </span>
              <span className="text-primary-dark font-normal ml-1">
                {asset_code}
              </span>
              {isVerified && (
                <div className="ml-1 mt-1">
                  <BlackCheck width="16" height="16" />
                </div>
              )}
            </div>
            <div className="text-sm text-primary-dark mt-[2px]">
              {handleAssetSymbol(currencies, options)}
              {formatBalance(price)}
            </div>
          </div>
        </div>
      </S.Container>
    </div>
  );
};

export default Asset;
