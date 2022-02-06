import React from 'react';
import { connect } from 'react-redux';
import { Form, Field } from 'react-final-form';
import { useNavigate } from 'react-router-dom';

import Logo from 'popup/components/Logo';

import Layout from 'popup/components/Layout';
import Input from 'popup/components/common/Input';
import Button from 'popup/components/common/Button';

import * as route from 'popup/staticRes/routes';
import restoreAccountAction from 'popup/actions/accounts/restore';
import validatePrivateKey from 'popup/utils/validate/privateKey';

import TabList from './TabList';

import * as S from './styles';
import ArrowBack from 'popup/svgs/ArrowBack';

type FormValues = {
  key: string | null;
};

const RestoreWallet = ({ accounts }) => {
  const navigate = useNavigate();

  const handleCancel = (form: any) => {
    form.reset();

    if (accounts.length) {
      return navigate(route.homePage, {
        state: {
          alreadyLoaded: true,
        },
      });
    }

    return navigate(route.firstPage);
  };

  const onSubmit = async (values: FormValues) => {
    if (!validatePrivateKey(values.key)) {
      return { key: 'Invalid private key.' };
    }

    const isDuplicated = accounts.some(
      (x) => x.privateKey === values.key,
    );

    if (isDuplicated) {
      return { key: 'Account is duplicated.' };
    }

    const account = await restoreAccountAction(values.key);

    if (account === 'duplicate') {
      return {
        key: "The account you're trying to import is a duplicate.",
      };
    }

    if (!account) {
      return { key: 'Invalid seed.' };
    }

    return navigate(route.homePage);
  };

  const validateForm = (values: FormValues) => {
    const errors = {} as FormValues;

    if (!values.key) {
      errors.key = null;
    }

    return errors;
  };

  return (
    <Layout isDashboard={false}>
      <div>
        <Logo />
        <S.TabContainer>
          <TabList />
        </S.TabContainer>
        <Form
          onSubmit={(values: FormValues) => onSubmit(values)}
          validate={(values: FormValues) => validateForm(values)}
          render={({ submitError, handleSubmit, form, pristine }) => (
            <form
              className="form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <Field name="key">
                {({ input, meta }) => (
                  <S.InputContainer>
                    <label className="label-primary">
                      Private key
                    </label>
                    <Input
                      type="text"
                      size="medium"
                      placeholder="Private key"
                      input={input}
                      meta={meta}
                      autoFocus
                    />
                  </S.InputContainer>
                )}
              </Field>
              {submitError && (
                <div className="error">{submitError}</div>
              )}
              <S.ButtonContainer>
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  content="Import"
                  disabled={pristine}
                />
                <Button
                  style={{ marginTop: '12px' }}
                  variant="default"
                  size="medium"
                  content="Back"
                  onClick={() => {
                    handleCancel(form);
                  }}
                  startIcon={<ArrowBack />}
                />
              </S.ButtonContainer>
            </form>
          )}
        />
      </div>
    </Layout>
  );
};

export default connect((state) => ({
  accounts: state.accounts,
}))(RestoreWallet);
