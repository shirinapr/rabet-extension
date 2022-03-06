import React from 'react';
import { Horizon } from 'stellar-sdk';

import BN from 'helpers/BN';
import Trash from 'popup/svgs/Trash';
import xlmLogo from 'assets/images/xlm-logo.svg';
import Button from 'popup/components/common/Button';
import CopyText from 'popup/components/common/CopyText';
import addAssetAction from 'popup/actions/operations/addAsset';
import ButtonContainer from 'popup/components/common/ButtonContainer';

import * as S from './styles';
import useAssetInfo from './useAssetInfo';

type AssetType = {
  isNative?: boolean;
  onDelete: (result: [boolean, string]) => void;
  onCancel: () => void;
  children?: React.ReactNode;
  asset: Horizon.BalanceLine;
  onBeforeDelete: () => void;
};

const AssetInfo = ({
  isNative,
  asset,
  onDelete,
  onCancel,
  children,
  onBeforeDelete,
}: AssetType) => {
  const { loading, error, assetData } = useAssetInfo(asset);

  const handleDelete = () => {
    if (
      asset.asset_type === 'credit_alphanum4' ||
      asset.asset_type === 'credit_alphanum12'
    ) {
      onBeforeDelete();

      addAssetAction(asset.asset_code, asset.asset_issuer, '0').then(
        (result) => {
          onDelete(result);
        },
      );
    }
  };

  const HandleDomain = () => {
    if (loading) {
      return <S.Info>Loading</S.Info>;
    }

    if (error) {
      return <S.Info>Error</S.Info>;
    }

    if (!assetData?.home_domain) {
      return <S.Info>No home domain</S.Info>;
    }

    return (
      <a
        href={`https://${assetData?.home_domain}`}
        target="_blank"
        rel="noreferrer"
      >
        {assetData?.home_domain}
      </a>
    );
  };

  const HandleIssuer = () => {
    if (loading) {
      return <S.Info>Loading</S.Info>;
    }

    return (
      <div>
        <CopyText
          text={assetData?.asset_issuer || ''}
          custom={<S.Value>{assetData?.asset_issuer}</S.Value>}
        />
      </div>
    );
  };

  const HandleFlags = () => {
    let required = '';
    let revocable = '';
    let immutable = '';

    if (loading) {
      required = 'Loading';
      revocable = 'Loading';
      immutable = 'Loading';
    }

    if (error) {
      required = 'Error';
      revocable = 'Error';
      immutable = 'Error';
    }

    if (!assetData?.flags) {
      required = '-';
      revocable = '-';
      immutable = '-';
    } else {
      required = assetData?.flags.auth_revocable ? 'True' : 'False';
      revocable = assetData?.flags.auth_revocable ? 'True' : 'False';
      immutable = assetData?.flags.auth_revocable ? 'True' : 'False';
    }

    return (
      <S.Table>
        <table>
          <thead>
            <tr>
              <th>Required</th>
              <th>Revocable</th>
              <th>Immutable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <S.Info>{required}</S.Info>
              </td>
              <td>
                <S.Info>{revocable}</S.Info>
              </td>
              <td>
                <S.Info>{immutable}</S.Info>
              </td>
            </tr>
          </tbody>
        </table>
      </S.Table>
    );
  };

  const assetInfo = [
    {
      title: 'Assets code',
      value: assetData?.asset_code || 'LOADING',
    },
    {
      title: 'Issuer',
      value: <HandleIssuer />,
    },
    {
      title: 'Website',
      value: <HandleDomain />,
    },
    {
      title: 'Assets type',
      value: asset.asset_type,
    },
  ];

  const isDeletable = new BN(assetData?.balance || '0').isEqualTo(
    '0',
  );
  if (isNative) {
    return (
      <div className=" py-[30px] px-[32px]">
        {children}

        <div className="flex flex-col h-[490px]">
          <S.Circle>
            <S.ImgContainer>
              <img src={xlmLogo} alt="xlm logo" />
            </S.ImgContainer>
          </S.Circle>
          <p className="text-base">
            <strong className="text-lg">XLM</strong> is the native
            currency of the network. An XLM is the only asset type
            that can be used on the Stellar network that doesn&apos;t
            require an issuer or a trustline. Any account can hold
            XLM. You can trade XLM for other assets in the network
          </p>
        </div>
      </div>
    );
  }
  return (
    <S.Page>
      {children}
      <S.Content>
        {assetInfo.map((item, index) => (
          <div key={item.title}>
            <S.Title>{item.title}</S.Title>
            <S.Value>{item.value}</S.Value>
            {assetInfo.length - 1 !== index && <S.Hr />}
          </div>
        ))}
        <HandleFlags />
        {!isDeletable ? (
          <div className="text-xs text-error mt-2 py-1 px-2 bg-[#fbeded] rounded-sm	">
            You cannot remove this asset unless the asset&apos;s
            balance is zero.
          </div>
        ) : (
          ''
        )}
        <ButtonContainer btnSize={102} justify="end" mt={32} gap={5}>
          <Button
            variant="default"
            size="medium"
            content="Cancel"
            onClick={onCancel}
          />

          <Button
            type="button"
            variant="danger"
            size="medium"
            content="Delete"
            disabled={!isDeletable}
            onClick={handleDelete}
            startIcon={<Trash />}
          />
        </ButtonContainer>
      </S.Content>
    </S.Page>
  );
};

AssetInfo.defaultProps = {
  children: '',
  isNative: false,
};

export default AssetInfo;
