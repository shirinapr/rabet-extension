import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate } from 'react-router-dom';

import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import * as route from '../../../../staticRes/routes';
import getMaxBalance from '../../../../utils/maxBalance';
import validateAddress from '../../../../utils/validate/address';
import currentActiveAccount from '../../../../utils/activeAccount';
import getAccountData from '../../../../utils/horizon/isAddressFound';
import SelectAssetModal from '../../../../components/SelectAssetModal';
import { buttonSizes, buttonTypes, inputTypes } from '../../../../staticRes/enum';
import validateMemo from '../../../../utils/validate/memo';
import isInsufficientAsset from '../../../../utils/isInsufficientAsset';
import isTransferable from '../../../../utils/isTransferable';

import styles from './styles.less';

const Send = () => {
  const navigate = useNavigate();
  const [isAccountNew, setIsAccountNew] = useState(false);
  const { activeAccount: { balances, maxXLM } } = currentActiveAccount();
  const [selectedAsset, setSelectedAsset] = useState(balances[0]);

  const onSubmit = async (v) => {
    const values = {
      ...v,
      asset: selectedAsset,
      isAccountNew,
    };

    navigate(route.basicSendConfirmPage, {
      state: {
        values,
      },
    });
  };

  const validateForm = async (v) => {
    const values = {
      ...v,
      asset: selectedAsset,
    };

    if (values.memo && !validateMemo(values.memo)) {
      return {
        memo: 'Memo should not be more than 28 characters.',
      };
    }

    if (!values.destination) {
      return {
        destination: null,
      };
    }

    if (!validateAddress(values.destination)) {
      return {
        destination: 'Invalid destination.',
      };
    }

    if (!values.amount) {
      return {
        amount: null,
      };
    }

    if (!isInsufficientAsset(selectedAsset, maxXLM, values.amount)) {
      return {
        amount: `Insufficient ${selectedAsset.asset_code} balance.`,
      };
    }

    const destinationAccount = await getAccountData(values.destination);

    const [transferableResult, resultCode] = isTransferable(values, destinationAccount);

    if (!transferableResult && resultCode === 0) {
      return {
        destination: 'Inactive accounts cannot receive tokens.',
      };
    }

    if (!transferableResult && resultCode === 1) {
      return {
        destination: 'Invalid destination.',
      };
    }

    if (!transferableResult && resultCode === 2) {
      return {
        destination: 'The destination account does not trust the asset you are attempting to send.',
      };
    }

    if (!transferableResult && resultCode === 3) {
      return {
        destination: 'The destination account balance would exceed the trust of the destination in the asset.',
      };
    }

    setIsAccountNew(resultCode === 0);

    return {};
  };

  return (
    <>
      <Form
        mutators={{
          setMax: (a, s, u) => {
            u.changeValue(s, 'amount', () => getMaxBalance(selectedAsset));
          },
        }}
        onSubmit={onSubmit}
        validate={validateForm}
        render={({
          form,
          invalid,
          pristine,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className={styles.group}>
              <label className="label-primary">Amount</label>
              <div className={styles.inputModal}>
                <div className={styles.inputValue}>
                  <Field name="amount">
                    {({ input, meta }) => (
                      <Input
                        type="number"
                        placeholder="123"
                        size="input-medium"
                        input={input}
                        meta={meta}
                        variant={inputTypes.max}
                        setMax={form.mutators.setMax}
                      />
                    )}
                  </Field>
                </div>

                <Field name="asset">
                  {({ input, meta }) => (
                    <SelectAssetModal
                      input={input}
                      meta={meta}
                      max
                      form={form}
                      currencies={balances}
                      onChange={setSelectedAsset}
                    />
                  )}
                </Field>
              </div>
            </div>

            <Field name="destination">
              {({ input, meta }) => (
                <div className={styles.group}>
                  <label className="label-primary">Destination</label>
                  <Input
                    type="text"
                    placeholder="G..."
                    size="input-medium"
                    input={input}
                    meta={meta}
                  />
                </div>
              )}
            </Field>

            <Field name="memo">
              {({ input, meta }) => (
                <div className={styles.group}>
                  <label className="label-primary">
                    Memo
                    {' '}
                    <span className="label-optional">(optional)</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="G..."
                    size="input-medium"
                    input={input}
                    meta={meta}
                  />
                </div>
              )}
            </Field>

            <div className={styles.buttons}>
              <Button
                type="button"
                variant={buttonTypes.default}
                size={buttonSizes.medium}
                content="Cancel"
                onClick={() => { navigate(-1); }}
              />

              <Button
                type="submit"
                variant={buttonTypes.primary}
                size={buttonSizes.medium}
                content="Send"
                disabled={invalid || pristine}
              />
            </div>
          </form>
        )}
      />
    </>
  );
};

export default Send;
