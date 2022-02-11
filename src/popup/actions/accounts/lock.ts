import store from 'popup/store';
import { set } from 'helpers/storage';
import { logout } from 'popup/reducers/user';
import { stop } from 'popup/reducers/interval';
import RouteName from 'popup/staticRes/routes';

export default (push) => {
  localStorage.clear();

  store.dispatch(logout());
  store.dispatch(stop());

  set('timer', {});

  push(RouteName.Setting, {
    state: {
      hadLogged: false,
    },
  });
};
