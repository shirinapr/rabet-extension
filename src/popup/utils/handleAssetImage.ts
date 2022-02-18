import { Horizon } from 'stellar-sdk';

import { AssetImage } from 'popup/reducers/assetImages';
import xlmLogo from '../../assets/images/stellar-black.png';
import questionLogo from '../../assets/images/question-circle.png';

const handleAssetImage = (
  asset: Horizon.BalanceLine,
  assetImages: AssetImage[],
) => {
  if (asset.asset_type === 'native') {
    return xlmLogo;
  }

  if (asset.asset_type === 'liquidity_pool_shares') {
    return questionLogo;
  }

  const assetImageFound = assetImages.find(
    (assetImage) =>
      assetImage.asset_code === asset.asset_code &&
      assetImage.asset_issuer === asset.asset_issuer,
  );

  if (assetImageFound) {
    return assetImageFound.logo;
  }

  return questionLogo;
};

export default handleAssetImage;
