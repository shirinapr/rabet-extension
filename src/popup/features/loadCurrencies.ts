import store from 'popup/store';
import { load } from 'popup/reducers/currencies';
import getCurrencies from 'popup/utils/horizon/getCurrencies';

const loadCurrencies = async () => {
  const currencies = await getCurrencies();

  store.dispatch(load(currencies));
};

export default loadCurrencies;
