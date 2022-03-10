import React from 'react';
import { Trans } from 'react-i18next';
import {
  API_URL,
  APP_ID,
  MASTER_KEY,
  BITPAY_API_URL,
  STRIPE_PUBLISHABLE_KEY,
  BITPAY_TOKEN,
  CURRENCY_CODE,
  SERVER_URL,
  BITPAY_NOTIFICATION_URL,
  STRIPE_NOTIFICATION_URL,
} from '../../config';
import styles from '../../styles/styles';
import i18n from '../../i18n';
import { StripeProvider, Elements } from 'react-stripe-elements';
import StripePayment from './StripePayment';
import KlarnaPayment from './KlarnaPayment';
import CircularProgress from '@material-ui/core/CircularProgress';
import CoinLogo from '../../assets/images/token.svg';
import ContractIcon from '../../assets/images/contract.svg';
import TermsIcon from '../../assets/images/terms.svg';
import InfoIcon from '../../assets/images/infosheet.svg';
import CardLogos from '../../assets/images/creditcard.svg';
import CryptoLogos from '../../assets/images/crypto.svg';
import SofortLogo from '../../assets/images/klarna.svg';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

class Buy extends React.Component {
  constructor() {
    super();

    this.state = {
      tokenRange: 1,
      minPurchase: 1,
      maxPurchase: 5000,
      tokensToBuy: 0,
      valueTokens: 0,
      valueEur: 0,
      contractDocument: '/contract.pdf',
      termsDocument: '/sample.pdf',
      informationDocument: '/Informationsblatt.pdf',
      paymentMethod: '',
      fullName: '',
      stripeToken: '',
      loading: false,
      isTokenSet: false,
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: false,
      checkbox5: false,
      checkbox6: false,
      paymentDisabled: true,
    };
  }

  componentWillMount() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      fetch('https://' + API_URL + '/users/me', {
        method: 'GET',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error && data.code === 209) {
            this.logOut();
          }
          this.setState({ ...data });
          //console.log(this.state);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    localStorage.removeItem('_ed_token_');
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  openContract = () => {
    setTimeout(() => {
      window.open(this.state.contractDocument);
    }, 100);
  };

  openTerms = () => {
    setTimeout(() => {
      window.open(this.state.termsDocument);
    }, 100);
  };

  openInformationSheet = () => {
    setTimeout(() => {
      window.open(this.state.informationDocument);
    }, 100);
  };

  choosePurchaseToken = (amount) => {
    this.setState({
      valueTokens: amount,
      valueEur: amount,
    });
  };

  setPurchaseValues() {
    var tokenValue =
      this.state.valueTokens +
      '###' +
      this.state.valueEur +
      '###' +
      this.state.paymentMethod;
    tokenValue = window.btoa(tokenValue);
    localStorage.setItem('_ed_token_', tokenValue);
  }

  chooseBitcoinPayment = () => {
    if (this.state.valueEur < this.state.minPurchase) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('minimum purchase of token is 200!'),
      });
      return;
    }
    if (this.state.valueEur > this.state.maxPurchase) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('maximum purchase amount is 5000 EUR'),
      });
      return;
    }

    this.setState({ paymentMethod: 'bitpay', loading: true }, () => {
      this.setPurchaseValues();
    });

    fetch(BITPAY_API_URL + '/invoices', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-accept-version': '2.0.0',
      }),
      body: JSON.stringify({
        price: this.state.valueEur,
        currency: CURRENCY_CODE,
        token: BITPAY_TOKEN,
        redirectURL: SERVER_URL + '/purchase_confirm',
        posData: this.state.objectId,
        buyerEmail: this.state.userName,
        fullNotifications: true,
        notificationURL: BITPAY_NOTIFICATION_URL,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          var invoiceId = window.btoa(result.data.id);
          localStorage.setItem('_ed_invoice_', invoiceId);
          window.location = result.data.url;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  chooseSofortPayment = () => {
    this.setState({ paymentMethod: 'sofort' }, () => {
      this.setPurchaseValues();
    });
  };

  chooseStripePayment = () => {
    if (this.state.valueEur < this.state.minPurchase) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('minimum purchase of token is 200!'),
      });
      return;
    }
    if (this.state.valueEur > this.state.maxPurchase) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('maximum purchase amount is 5000 EUR'),
      });
      return;
    }

    this.setState({ paymentMethod: 'stripe' });
  };

  processStripePayment = (payload) => {
    if (this.state.valueEur < this.state.minPurchase) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('minimum purchase of token is 200!'),
      });
      return;
    }
    if (payload.error) {
      alert(payload.error.message);
      return;
    }
    if (payload.token && !payload.error) {
      this.setPurchaseValues();
      this.setState({ stripeToken: payload, loading: true });
      let token = localStorage.getItem('token');

      fetch(STRIPE_NOTIFICATION_URL, {
        method: 'POST',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': token,
        }),
        body: JSON.stringify({
          user: this.state.objectId,
          amt: this.state.valueEur,
          token: payload.token.id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.result.status) {
            this.props.history.push('/purchase_confirm');
          } else {
            MySwal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Payment failed! please try again',
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  };

  processBack = () => {
    this.setState({ isTokenSet: false });
  };

  processContinue = () => {
    if (this.state.valueTokens < this.state.minPurchase) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('Please choose the token amount'),
      });
      return;
    } else {
      this.setState({ isTokenSet: true });
    }
  };

  transactionBuyTokens = () => {
    console.log(this.state.tokensToBuy);
    var buyWithDec = this.state.tokensToBuy * 100 * 10000000;
    console.log(buyWithDec);
  };

  getActiveTokenButton(amount) {
    return amount === this.state.valueTokens
      ? 'btn-price-option active'
      : 'btn-price-option';
  }

  handleCheckChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({});

    this.setState(
      {
        [name]: value,
      },
      () => {
        this.updatePaymentButtons();
      }
    );
  };

  updatePaymentButtons = () => {
    if (
      this.state.checkbox1 &&
      this.state.checkbox2 &&
      this.state.checkbox3 &&
      this.state.checkbox4 &&
      this.state.checkbox5 &&
      this.state.checkbox6
    ) {
      this.setState({ paymentDisabled: false });
    } else {
      this.setState({ paymentDisabled: true });
    }
  };

  render() {
    return (
      <div className='buy-token-block'>
        {this.state.loading && (
          <div className='loading-body'>
            <CircularProgress />
          </div>
        )}

        <div className='mainWrap'>
          <div style={styles.detailboxStyle}>
            {this.state.kycIsComplete ? (
              <span style={styles.detailTitleStyle}>
                {i18n.t('Your Eloop Token Balance')}
              </span>
            ) : null}{' '}
            <span style={styles.detailItemStyle}>
              {this.state.kycIsComplete ? this.state.balance : null}
            </span>
            {!this.state.isTokenSet ? (
              <div>
                <h4
                  style={{
                    color: 'white',
                    paddingTop: '10px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    color: '#49deb5',
                  }}
                >
                  1. {i18n.t('Choose your desired amount')}
                  <p style={styles.txtStyle1}>
                    {i18n.t('You can buy Tokens multiple times.')}{' '}
                  </p>
                </h4>
                <div
                  className='coinprice'
                  style={{ justifyContent: 'center', padding: '1.5rem 0' }}
                >
                  <div className='coinlogo'>
                    <img
                      style={{ height: '40px' }}
                      src={CoinLogo}
                      alt='Eloop One Logo'
                    />
                    <div className='coinname'>
                      <div
                        style={{
                          color: 'white',
                          fontweight: 'bold',
                          fontSize: '1.25em',
                          marginBottom: '-9px',
                        }}
                      >
                        EOT
                      </div>
                      <div style={{ color: 'grey' }}>ELOOP ONE</div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontweight: 'bold',
                      fontSize: '1.25em',
                    }}
                  >
                    € 1,00
                  </div>
                </div>

                <div className='tokengrid'>
                  <div className='tokencon'>
                    <div
                      className={this.getActiveTokenButton(250)}
                      onClick={() => this.choosePurchaseToken(250)}
                    >
                      <span>
                        250<sub>EOT</sub>
                      </span>
                    </div>
                  </div>
                  <div className='tokencon'>
                    <div
                      className={this.getActiveTokenButton(500)}
                      onClick={() => this.choosePurchaseToken(500)}
                    >
                      <span>
                        500<sub>EOT</sub>
                      </span>
                    </div>
                  </div>
                  <div className='tokencon'>
                    <div
                      className={this.getActiveTokenButton(1000)}
                      onClick={() => this.choosePurchaseToken(1000)}
                    >
                      <span>
                        1.000<sub>EOT</sub>
                      </span>
                    </div>
                  </div>
                  <div className='tokencon'>
                    <div
                      className={this.getActiveTokenButton(2500)}
                      onClick={() => this.choosePurchaseToken(2500)}
                    >
                      <span>
                        2.500<sub>EOT</sub>
                      </span>
                    </div>
                  </div>
                  <div className='tokencon lasttoken'>
                    <div
                      className={this.getActiveTokenButton(5000)}
                      onClick={() => this.choosePurchaseToken(5000)}
                    >
                      <span>
                        5.000<sub>EOT</sub>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h4
                  style={{
                    color: 'white',
                    paddingTop: '10px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    color: '#49deb5',
                  }}
                >
                  2. {i18n.t('Download Documents')}
                </h4>
                <div
                  className='documentcontainer'
                  style={{ padding: '3rem 0' }}
                >
                  <div className='document'>
                    <div className='insidedoc'>
                      <p>{i18n.t('Signed Contract')}</p>
                      <img src={ContractIcon} alt='contract ICone' />
                      <button
                        type='button'
                        className='downloaddocsbutton'
                        onClick={this.openContract}
                      >
                        Download {i18n.t('Contract')}
                      </button>
                    </div>
                  </div>
                  <div className='document'>
                    <div className='insidedoc'>
                      <p>{i18n.t('EOT Information Sheet')}</p>
                      <img src={InfoIcon} alt='contract ICone' />
                      <button
                        type='button'
                        className='downloaddocsbutton'
                        onClick={this.openInformationSheet}
                      >
                        {i18n.t('Download Information Sheet')}
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className='checkboxcontainer'
                  style={{ padding: '3rem 0' }}
                >
                  <label style={styles.checkboxLabel}>
                    <input
                      name='checkbox1'
                      type='checkbox'
                      className='customCheckbox'
                      checked={this.state.checkbox1}
                      onChange={this.handleCheckChange}
                    />
                    <span className='checkboxText'>
                      {i18n.t('register_form_agree_1')}
                    </span>
                  </label>

                  <label style={styles.checkboxLabel}>
                    <input
                      name='checkbox2'
                      type='checkbox'
                      className='customCheckbox'
                      checked={this.state.checkbox2}
                      onChange={this.handleCheckChange}
                    />
                    <span className='checkboxText'>
                      <Trans i18nKey='register_form_agree_2'>
                        I have read the{' '}
                        <a
                          style={{ color: '#4adeb4' }}
                          href={this.state.informationDocument}
                        >
                          Information Notice
                        </a>{' '}
                        from Caroo Mobility GmbH (in German) and accept this.
                      </Trans>
                    </span>
                  </label>

                  <label style={styles.checkboxLabel}>
                    <input
                      name='checkbox3'
                      type='checkbox'
                      className='customCheckbox'
                      checked={this.state.checkbox3}
                      onChange={this.handleCheckChange}
                    />
                    <span className='checkboxText'>
                      <Trans i18nKey='buy_agree_1'>
                        I have read the Investment Framework Agreement
                        (Investitionsrahmenvertrag), in particular the
                        provisions regarding the{' '}
                        <a
                          style={{ color: '#4adeb4' }}
                          href={this.state.contractDocument}
                        >
                          Token Purchase Agreement
                        </a>{' '}
                        (Points 6, 7, 8, 9, 11, 14, 15 and 16) in respect of the
                        Eloop Token and accept this in its entirety.
                      </Trans>
                    </span>
                  </label>

                  <label style={styles.checkboxLabel}>
                    <input
                      name='checkbox4'
                      type='checkbox'
                      className='customCheckbox'
                      checked={this.state.checkbox4}
                      onChange={this.handleCheckChange}
                    />
                    <span className='checkboxText'>
                      {i18n.t('register_form_agree_4')}
                    </span>
                  </label>

                  <label style={styles.checkboxLabel}>
                    <input
                      name='checkbox5'
                      type='checkbox'
                      className='customCheckbox'
                      checked={this.state.checkbox5}
                      onChange={this.handleCheckChange}
                    />
                    <span className='checkboxText'>
                      <Trans i18nKey='register_form_agree_5'>
                        I have read the cancellation conditions in the{' '}
                        <a
                          style={{ color: '#4adeb4' }}
                          href={this.state.informationDocument}
                        >
                          Information Notice
                        </a>{' '}
                        (in German) and agree to these.
                      </Trans>
                    </span>
                  </label>

                  <label style={styles.checkboxLabel}>
                    <input
                      name='checkbox6'
                      type='checkbox'
                      className='customCheckbox'
                      checked={this.state.checkbox6}
                      onChange={this.handleCheckChange}
                    />
                    <span className='checkboxText'>
                      {i18n.t('register_form_agree_7')}
                    </span>
                  </label>
                </div>
                <div className='buyconfirm'>
                  <h4 style={{ color: 'white' }}>Token Purchase Summary</h4>
                  <div
                    style={{ margin: '15px auto' }}
                    className={this.getActiveTokenButton(
                      this.state.valueTokens
                    )}
                  >
                    <span>
                      {this.state.valueTokens}
                      <sub>EOT</sub>
                    </span>
                  </div>
                  <div className='purchase-summary'>
                    <p>{this.state.valueTokens} EOT x € 1</p>

                    <p>
                      {i18n.t('Est. Annual Yield (7%)')}: €{' '}
                      {Math.floor((this.state.valueTokens / 100) * 7)}
                    </p>
                    <p style={{ fontSize: '1.5em' }}>
                      <b>
                        {i18n.t('Total Investment')}: € {this.state.valueTokens}
                      </b>
                    </p>
                  </div>
                </div>
                <h4
                  style={{
                    color: 'white',
                    paddingTop: '10px',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    color: '#49deb5',
                  }}
                >
                  3. {i18n.t('Choose Your Payment Method')}
                </h4>
                {this.state.paymentMethod === 'stripe' && (
                  <div>
                    <StripeProvider apiKey={STRIPE_PUBLISHABLE_KEY}>
                      <div className='stripe-payment-block'>
                        <Elements>
                          <StripePayment
                            fullName={this.state.fullName}
                            handleStripePayment={this.processStripePayment}
                          />
                        </Elements>
                      </div>
                    </StripeProvider>
                  </div>
                )}
                {this.state.paymentMethod === 'sofort' && (
                  <div>
                    <KlarnaPayment amount={this.state.valueTokens} />
                  </div>
                )}
                <div className='textcenter' style={styles.spaceTop}>
                  <button
                    type='button'
                    className='payment-button'
                    onClick={this.chooseBitcoinPayment}
                    disabled={this.state.paymentDisabled}
                  >
                    <p className='payheading'>Pay with Crypto</p>
                    <img
                      src={CryptoLogos}
                      alt={i18n.t(
                        'BitPay Supported Currencies (BTC, BCH, ETH, XRP)'
                      )}
                    />
                  </button>

                  <button
                    type='button'
                    className='payment-button'
                    onClick={this.chooseSofortPayment}
                    disabled={this.state.paymentDisabled}
                  >
                    <p className='payheading'>{i18n.t('Pay with Sofort')}</p>
                    <img src={SofortLogo} alt='Sofort / Klarna' />
                  </button>

                  <button
                    type='button'
                    className='payment-button'
                    onClick={this.chooseStripePayment}
                    disabled={this.state.paymentDisabled}
                  >
                    <p className='payheading'>
                      {i18n.t('Pay with Credit Card')}
                    </p>
                    <img src={CardLogos} alt='Stripe Payment' />
                  </button>
                </div>
              </>
            )}
            <div className='textcenter' style={{ marginTop: '50px' }}>
              {!this.state.isTokenSet ? (
                <button
                  style={{ marginRight: '0' }}
                  className='loginbutton'
                  onClick={this.processContinue}
                >
                  {i18n.t('Continue')}
                </button>
              ) : (
                <>
                  {/* <button className='cashoutbutton' onClick={this.processBack}>
                  {i18n.t('Back')}
                </button> */}
                </>
              )}
            </div>
            <div style={styles.clearBoth}></div>
            <p style={styles.txtStyle2}>
              {i18n.t('buy_text_1')}{' '}
              <a href='mailto:support@eloop.one' style={{ color: '#49deb5' }}>
                support@eloop.one
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Buy;
