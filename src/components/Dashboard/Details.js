import React from 'react';
import {
  API_URL,
  APP_ID,
  ASSET_ID,
  MASTER_KEY,
  ENCRYPTION_KEY,
} from '../../config';
import styles from '../../styles/styles';
import i18n from './../../i18n';
import styled from '@emotion/styled';
import SeedPhrase from './../Modal/SeedPhrase';

import { withRouter } from 'react-router-dom';
const { seedUtils } = require('@0bsnetwork/zbs-transactions');

const Values = styled.div`
  span {
    font-weight: bold;
    font-size: 1.2em;
  }
  p {
    font-size: 0.7em;
    opacity: 0.5;
    text-transform: uppercase;
  }
`;

const Container = styled.div`
  background-color: white;
  padding: 2em 4em 0.5em;
  box-shadow: 0 0.46875rem 2.1875rem rgba(8, 10, 37, 0.03),
    0 0.9375rem 1.40625rem rgba(8, 10, 37, 0.03),
    0 0.25rem 0.53125rem rgba(8, 10, 37, 0.05),
    0 0.125rem 0.1875rem rgba(8, 10, 37, 0.03);
  border: 1px solid rgba(32, 39, 140, 0.125);
  border-radius: 0.25rem;
`;
const FiftyContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const Fifty = styled.div`
  width: 50%;
  display: inline;
`;
const FiftyRight = styled.div`
  width: 50%;
  display: inline;
  text-align: right;
`;
const Email = styled.p`
  margin-bottom: 0;
  font-size: 1.4em;
`;
const Passed = styled.span`
  background-color: green;
  padding: 0.2em;
  border-radius: 5px;
  color: white;
  font-size: 0.9em !important;
`;
const NotPassed = styled.span`
  background-color: orange;
  padding: 0.2em;
  border-radius: 5px;
  color: white;
  font-size: 0.9em !important;
`;
const Logout = styled.div`
  font-family: 'Sofia Pro';
  margin-top: 30px;
  color: white;

  text-align: right;
`;
const Buttons = styled.div`
  display: flex;
  justify-content: center;
`;
const Support = styled.p`
  margin-top: 10px;
  font-size: 14px;
  color: white;
  text-align: center;
  text-transform: uppercase;
`;
class Details extends React.Component {
  constructor() {
    super();
    this.state = {
      objectId: '',
      fullName: '',
      firstName: '',
      lastName: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      country: '',
      countryText: '',
      nationality: '',
      language: '',
      purchasecurrency: '',
      purchasevalue: '',
      walletaddress: '',
      walletaddresstosave: '',
      seedPharse: '',
      loading: true,
      viewSeedPharse: false,
      isOpenSavePhrase: false,
      balance: 0,
      tabId: 'basic-tab-1',
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
          localStorage.setItem('objectId', data.objectId);
          if (!this.state.walletaddress && this.state.email.length > 0) {
            // TODO: Make sure new wallet doesnt get generated if problem with API call
            this.createWallet();
          }

          let encryptionKey = ENCRYPTION_KEY + '###' + this.state.email;
          let encryptedSeed = localStorage.getItem('encryptedSeed');
          if (encryptedSeed) {
            var seedDecrypted = seedUtils.decryptSeed(
              encryptedSeed,
              encryptionKey,
              2048
            );
            if (seedDecrypted !== '') {
              this.setState({ seedPharse: seedDecrypted });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  updateBalance = () => {
    try {
      fetch(
        'https://node1.testnet-0bsnetwork.com/assets/balance/' +
          this.state.walletaddress +
          '/' +
          ASSET_ID
      )
        .then((response) => {
          return response.json();
        })
        .then((balance) => {
          if (balance.balance) {
            var bal = balance.balance / 100;
            this.setState({ balance: bal, loading: false });
          } else {
            this.setState({ balance: 0, loading: false });
          }
        });
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  };

  async componentDidMount() {
    //this.updateBalance()
    this.timer = setInterval(() => this.updateBalance(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  createWallet = () => {
    // 1.  stop the form from submitting
    //event.preventDefault();

    var seed = window.zbs.createSeed();
    //console.log("Seed", seed);

    const walletaddresstosave = seed.address;

    fetch('https://' + API_URL + '/users/' + localStorage.getItem('objectId'), {
      method: 'PUT',
      headers: new Headers({
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': MASTER_KEY,
        'Content-Type': 'application/json',
        'X-Parse-Session-Token': localStorage.getItem('token'),
      }),
      body: JSON.stringify({
        walletaddress: walletaddresstosave,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          alert(i18n.t('Error adding wallet address, please contact support.'));
        } else {
          let encryptionKey = ENCRYPTION_KEY + '###' + this.state.email;
          var seedObj = seedUtils.Seed.fromExistingPhrase(seed.phrase);
          var seedEncrypted = seedObj.encrypt(encryptionKey, 2048);
          localStorage.setItem('encryptedSeed', seedEncrypted);
          this.setState({ seedPharse: seed.phrase });
          this.setState({ walletaddress: walletaddresstosave });
          this.setState({ walletaddresstosave: '' });
          this.state.isOpenSavePhrase = true;
        }
      })
      .catch((err) => console.log(err));

    //event.currentTarget.reset();
  };

  startKyc = () => {
    if (window.confirm(i18n.t('Kyc_text_1'))) {
      fetch('https://' + API_URL + '/functions/startKyc', {
        method: 'POST',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': localStorage.getItem('token'),
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data)
          window.open(data.result.TargetURL, '_blank');
          window.location.reload();
        })
        .catch((err) => console.log(err));
    } else {
      // Do nothing!
    }
  };

  logOut = () => {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  };

  viewSeedPharse = () => {
    this.setState({ viewSeedPharse: true });
    setTimeout(
      function () {
        this.setState({ viewSeedPharse: false });
      }.bind(this),
      30000
    );
  };

  importSeedPhrase = () => {
    var phrase = prompt('Enter Seed Phrase', '');

    if (phrase != null) {
      let encryptionKey = ENCRYPTION_KEY + '###' + this.state.email;
      var seedObj = seedUtils.Seed.fromExistingPhrase(phrase);
      var seedEncrypted = seedObj.encrypt(encryptionKey, 2048);
      localStorage.setItem('encryptedSeed', seedEncrypted);
      this.setState({ seedPharse: phrase });
      //this.setState({ walletaddress: walletaddresstosave });
      alert('Saved');
    }
  };

  closeSavePhraseModal = () => {
    this.setState({ isOpenSavePhrase: false });
  };

  selectEn = () => {
    i18n.changeLanguage('en');
    localStorage.setItem('I18N_LANGUAGE', 'en');
  };

  selectDe = () => {
    i18n.changeLanguage('de');
    localStorage.setItem('I18N_LANGUAGE', 'de');
  };

  formatDate(inputDate) {
    var date = new Date(inputDate);
    if (!isNaN(date.getTime())) {
      var day = date.getDate().toString();
      var month = (date.getMonth() + 1).toString();
      // Months use 0 index.

      return (
        (month[1] ? month : '0' + month[0]) +
        '/' +
        (day[1] ? day : '0' + day[0]) +
        '/' +
        date.getFullYear()
      );
    }
    return '';
  }

  render() {
    return (
      <div>
        <div>
          <Container>
            <FiftyContainer>
              <Fifty>
                <Values>
                  <span>{this.state.email}</span>
                  <p>Email Address</p>
                </Values>
                <Values>
                  <span style={{ fontSize: '0.75em' }}>
                    {this.state.kycstatus && (
                      <span>{this.state.walletaddress}</span>
                    )}
                  </span>
                  <p>Wallet Address</p>
                </Values>
              </Fifty>
              <FiftyRight>
                <Values>
                  <span>
                    {this.state.kycstatus && (
                      <span>
                        {!this.state.loading && this.state.balance} EOT
                      </span>
                    )}
                  </span>{' '}
                  <p>Token Balance </p>
                </Values>
                <Values>
                  <span>
                    {this.state.kycstatus === false ? (
                      <NotPassed>NOT PASSED</NotPassed>
                    ) : (
                      <Passed>PASSED</Passed>
                    )}
                  </span>{' '}
                  <p>KYC Status</p>
                </Values>
                <Values>
                  <span>{this.state.kyccomment}</span>
                  <p>KYC Message </p>
                </Values>
              </FiftyRight>
            </FiftyContainer>

            <div>
              <Values>
                <span>
                  {this.state.firstName} {this.state.lastName}
                </span>
                <p>Name</p>
              </Values>
              <Values>
                <span>{this.formatDate(this.state.DOB)}</span>
                <p>Date of Birth</p>
              </Values>
              <Values>
                <span>
                  {this.state.address1}, {this.state.address2}
                  <br />
                  {this.state.postcode}, {this.state.city},{' '}
                  {this.state.countryText}
                </span>
                <p>Address</p>
              </Values>
            </div>

            <div>
              {this.state.seedPharse !== '' && this.state.kycstatus && (
                <div style={styles.detailboxStyle}>
                  <span style={styles.detailTitleStyle}>
                    {i18n.t('Seed Phrase')}
                  </span>
                  {this.state.viewSeedPharse ? (
                    <span style={styles.pharsedetailItemStyle}>
                      {this.state.seedPharse}
                    </span>
                  ) : (
                    <button
                      className='logoutbutton'
                      onClick={this.viewSeedPharse}
                    >
                      {i18n.t('View')}
                    </button>
                  )}
                </div>
              )}
            </div>
            <Buttons>
              {this.state.seedPharse == '' && (
                <button
                  style={{ marginRight: '0', marginBottom: '1em' }}
                  className='logoutbutton'
                  onClick={this.importSeedPhrase}
                >
                  {i18n.t('Import New Seed Phrase')}
                </button>
              )}
              {this.state.kyccomment === 'AWAITING APPLICATION' && (
                <button
                  style={{ marginRight: '0', marginBottom: '1em' }}
                  href='#!'
                  onClick={() => {
                    this.startKyc();
                  }}
                  className='loginbutton'
                >
                  {i18n.t('Start')} {i18n.t('KYC')} Application
                </button>
              )}
            </Buttons>

            <div style={{ textAlign: 'center', paddingTop: '.5em' }}>
              <a href='/passwordreset' style={styles.linkStyle}>
                <span style={{ color: 'black', textDecoration: 'underline' }}>
                  {i18n.t('Change Password')}
                </span>
              </a>
            </div>
          </Container>
          <SeedPhrase
            open={this.state.isOpenSavePhrase}
            handleClose={this.closeSavePhraseModal}
            seedPharse={this.state.seedPharse}
          />
          <Support>
            If you encounter any problems, please don't hesitate to contact us{' '}
            <a href='mailto:support@eloop.one' style={{ color: '#49deb5' }}>
              support@eloop.one
            </a>
          </Support>
          <Logout>
            <span
              style={{
                textDecoration: 'initial',
                paddingRight: '1em',
                fontSize: '1.3em',
              }}
            >
              <a type='button' onClick={this.selectEn}>
                🇺🇸
              </a>
              |
              <a type='button' onClick={this.selectDe}>
                🇦🇹
              </a>
            </span>

            <button
              type='submit'
              className='logoutbutton'
              onClick={this.logOut}
              style={{ marginBottom: '3em' }}
            >
              {i18n.t('Logout')}
            </button>
          </Logout>
        </div>

        {/*    <div style={styles.detailboxStyle}>
          <span style={styles.detailTitleStyle}>KYC {i18n.t('Status')}</span>{' '}
          <span style={styles.detailItemStyle}>
            {this.state.kycstatus === false ? 'NOT PASSED' : 'PASSED'}
          </span>
        </div>

        <div style={styles.detailboxStyle}>
          <span style={styles.detailTitleStyle}>KYC {i18n.t('Message')}</span>
          <div style={{ height: 10 }}></div>{' '}
          <span style={styles.detailItemStyle}>{this.state.kyccomment}</span>{' '}
          {this.state.kyccomment === 'AWAITING APPLICATION' && (
            <a
              href='#!'
              onClick={() => {
                this.startKyc();
              }}
              style={styles.kycButtonStyle}
            >
              {i18n.t('Start')} {i18n.t('KYC')} >>
            </a>
          )}
        </div>

        {this.state.seedPharse !== '' && this.state.kycstatus && (
          <div style={styles.detailboxStyle}>
            <span style={styles.detailTitleStyle}>{i18n.t('Seed Phrase')}</span>
            {this.state.viewSeedPharse ? (
              <span style={styles.pharsedetailItemStyle}>
                {this.state.seedPharse}
              </span>
            ) : (
              <button style={styles.viewbtnStyle} onClick={this.viewSeedPharse}>
                View
              </button>
            )}
          </div>
        )} */}
      </div>
    );
  }
}

export default withRouter(Details);

/* {this.state.kycstatus && (
  <div>
    <div style={styles.detailboxStyle}>
      <span style={styles.detailTitleStyle}>
        {i18n.t('Wallet Address')}
      </span>
      <span style={styles.detailItemStyle}>
        {this.state.walletaddress} &nbsp;
      </span>
      <br />
    </div>
    <div style={styles.detailboxStyle}>
      <span style={styles.detailTitleStyle}>
        {i18n.t('Token Balance')}
      </span>
      <span style={styles.detailItemStyle}>
        {!this.state.loading && this.state.balance} &nbsp;
      </span>
      <br />
    </div>
    <div style={{ height: 40 }} ></div>
   <form className="user-create" onSubmit={this.createWallet}>
      <div style={styles.inputBoxStyle}>

      </div>


    <button type="submit" style={styles.submitAddressStyle}>Save Address</button>

    </form>
  </div>
)} */
