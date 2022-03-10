import React from 'react';
import { BITPAY_API_URL, BITPAY_TOKEN } from '../../config';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from '../../styles/styles';
import i18n from '../../i18n';

class RegisteredConfirmation extends React.Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      paymentSuccess: false,
      valueTokens: 0,
      valueEur: 0,
    };
  }

  componentDidMount() {
    var edToken = localStorage.getItem('_ed_token_');
    if (edToken && edToken != null) {
      var tokenValue = window.atob(edToken);
      tokenValue = tokenValue.split('###');
      if (tokenValue.length > 1) {
        var tokens = tokenValue[0];
        var euros = tokenValue[1];
        var paymentMethod = tokenValue[2];

        this.setState({ valueTokens: tokens, valueEur: euros });

        if (paymentMethod === 'bitpay') {
          this.checkPaymentConfirmation();
        }
        else if (paymentMethod === 'sofort') {
          this.checkSofort();
        }
        else {
          this.setState({ loading: false, paymentSuccess: true });
        }
      }
    } else {
      this.props.history.push('/dashboard');
    }

    localStorage.removeItem('_ed_token_');
  }

  checkSofort = () => {
    var _self = this;

    var result = new URLSearchParams(this.props.location.search).get("resultCode")
    if(result == 'authorised') {
      _self.setState({ loading: false, paymentSuccess: true });
    }
    else {
      _self.setState({ loading: false });
    }
    localStorage.removeItem('_ed_invoice_');
  }

  checkPaymentConfirmation = () => {
    var _self = this;
    var invoiceId = localStorage.getItem('_ed_invoice_');
    if (invoiceId && invoiceId != null) {
      invoiceId = window.atob(invoiceId);

      fetch(
        BITPAY_API_URL + '/invoices/' + invoiceId + '?token=' + BITPAY_TOKEN,
        {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'x-accept-version': '2.0.0',
          }),
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (
            result.data.status === 'paid' ||
            result.data.status === 'confirmed' ||
            result.data.status === 'complete'
          ) {
            _self.setState({ loading: false, paymentSuccess: true });
          } else {
            _self.setState({ loading: false });
          }
        })
        .catch((err) => {
          _self.setState({ loading: false });
        });
    } else {
      this.setState({ loading: false });
    }

    localStorage.removeItem('_ed_invoice_');
  };

  backToDashboard = (event) => {
    event.preventDefault();
    this.props.history.push('/dashboard');
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <div className='loading-body'>
            <CircularProgress />
          </div>
        ) : (
          <div style={styles.instructionWrap}>
            {this.state.paymentSuccess ? (
              <div
                style={{
                  width: '80%',
                  height: '80vh',
                  margin: 'auto',
                  marginBottom: 30,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <h2 style={styles.titleStyle}>
                    {' '}
                    {i18n.t('Congratulations!')}{' '}
                  </h2>

                  <p style={styles.instructionStyle}>
                    <strong>
                      {' '}
                      {i18n.t(
                        'You have just bought ' +
                          this.state.valueTokens +
                          ' EOT with a current value of ' +
                          this.state.valueEur +
                          ' Euro.'
                      )}{' '}
                    </strong>
                  </p>
                  <p style={styles.instructionStyle}>
                    {' '}
                    {i18n.t(
                      'You will receive an E-Mail with a confirmation once your payment is confirmed. It may take up to 24 hours.'
                    )}{' '}
                  </p>
                  <button
                    className='loginbutton'
                    onClick={this.backToDashboard}
                  >
                    {i18n.t('Back to Dashboard')}
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '80%',
                  height: '80vh',
                  margin: 'auto',
                  marginBottom: 30,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div>
                  <h2 style={styles.titleStyle}>
                    {' '}
                    {i18n.t(
                      'Uh-oh! We were unable to process your payment '
                    )}{' '}
                  </h2>
                  <p style={styles.instructionStyle}>
                    {' '}
                    {i18n.t(
                      'Please try again later or If you have questions, please contact us directly support@eloop.to'
                    )}{' '}
                  </p>
                  <button
                    className='loginbutton'
                    onClick={this.backToDashboard}
                  >
                    {i18n.t('Back to Dashboard')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    );
  }
}

export default RegisteredConfirmation;
