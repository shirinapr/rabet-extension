import store from 'popup/store';
import getAccount from 'popup/api/getAccount';
import {
  IAccount,
  addAssets,
  addFlags,
  setInactive,
} from 'popup/reducers/accounts2';

const loadAccount = async (account: IAccount) => {
  const accountResult = await getAccount(account.publicKey);

  if (!accountResult) {
    store.dispatch(
      addAssets({
        publicKey: account.publicKey,
        assets: [],
      }),
    );

    store.dispatch(
      setInactive({
        publicKey: account.publicKey,
        inactive: true,
      }),
    );

    return;
  }

  let assets = accountResult.balances;
  // Remove liquidity pool assets
  assets = assets.filter(
    (asset) => asset.asset_type !== 'liquidity_pool_shares',
  );

  // Move XLM to the first element
  const nativeAsset = assets.find(
    (asset) => asset.asset_type === 'native',
  );
  assets = assets.filter((asset) => asset.asset_type !== 'native');

  if (nativeAsset) {
    assets.unshift(nativeAsset);
  }

  store.dispatch(
    addAssets({
      publicKey: account.publicKey,
      assets,
    }),
  );

  store.dispatch(
    addFlags({
      publicKey: account.publicKey,
      flags: accountResult.flags,
    }),
  );

  store.dispatch(
    setInactive({
      publicKey: account.publicKey,
      inactive: false,
    }),
  );
};

export default loadAccount;
