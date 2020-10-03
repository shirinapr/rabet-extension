import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, {Component} from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Field } from 'react-final-form';

import Input from 'Root/components/Input';
import SelectOption from 'Root/components/SelectOption';
import currentActiveAccount from 'Root/helpers/activeAccount';

import styles from './styles.less';

class PaymentOps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      selected: {},
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const operations = this.props.state;

    for (let i = 0; i < operations.length; i++) {
      if (operations[i].id === this.props.id) {
        operations[i].asset = e.value;
      }
    }

    this.props.setState({ operations });

    this.setState({ selected: e });
  }

  onSubmit (values) {
    // console.warn(values);
    // console.log({
    //   destination: values.destination,
    //   amount: values.amount,
    //   asset: this.state.selected.value,
    // });
    /*
      values.destination
      values.amount
      this.state.selected
    */
  }

  // handleMax(values) {
  //   values.amount = this.state.selected.balance;
  // }

  validateForm (values) {
    const errors = {};

    if (!values.destination) {
      errors.destination = 'Required.';
    }

    if (!values.amount) {
      errors.amount = 'Required.';
    }

    const operations = this.props.state;

    for (let i = 0; i < operations.length; i++) {
      if (operations[i].id === this.props.id) {
        operations[i].amount = values.amount;
        operations[i].destination = values.destination;
      }
    }

    this.props.setState({ operations });

    return errors;
  }

  componentDidMount() {
    const { activeAccount, activeAccountIndex } = currentActiveAccount();

    const { balances } = activeAccount;

    const list = [];

    for (let i = 0; i < balances.length; i++) {
      list.push({
        value: balances[i].asset_code,
        label: balances[i].asset_code,
        balance: balances[i].balance,
      });
    }

    this.setState({ list });
  }

  render() {
    const { list } = this.state;

    return (
        <Form
          onSubmit={ this.onSubmit }
          validate={ (values) => this.validateForm(values) }
          render={ ({submitError, handleSubmit, submitting, values}) => (
                <form className={ classNames(styles.form, 'form') } onSubmit={ handleSubmit }>
                  <Field name="destination">
                    {({input, meta}) => (
                       <div className="group">
                         <label className="label-primary">Destination</label>
                         <Input
                           type="text"
                           placeholder="G…"
                           size="input-medium"
                           input={ input }
                           meta={ meta }
                         />
                       </div>
                    )}
                  </Field>
                  <Field name="amount">
                    {({input, meta}) => (
                        <div className="pure-g group">
                          <div className={ styles.selectInput }>
                            <label className="label-primary">
                              <span>Amount</span>
                              // <span onClick={() => {this.handleMax(values) }}>Max <span className="icon-caret-up" /></span>
                              <span>Max <span className="icon-caret-up" /></span>
                            </label>
                            <Input
                              type="number"
                              placeholder="1"
                              size="input-medium"
                              input={ input }
                              meta={ meta }
                            />
                          </div>
                          <div className={ styles.select }>
                            <SelectOption
                              items={list}
                              onChange={ this.onChange }
                              variant="select-outlined"
                            />
                          </div>
                        </div>
                    )}
                  </Field>
                  {submitError && <div className="error">{submitError}</div>}
                </form>
            ) }
        />
    );
  }
}

PaymentOps.propTypes = {};

export default PaymentOps;
