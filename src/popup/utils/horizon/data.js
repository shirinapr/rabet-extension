// import fetch from 'node-fetch';

import currentNetwork from './currentNetwork';

export default async (address) => new Promise((resolve) => {
  fetch(`${currentNetwork().url}/accounts/${address}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        resolve({});
      } else {
        resolve(data);
      }
    })
    .catch(() => {
      resolve({});
    });
});
