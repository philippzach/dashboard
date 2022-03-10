import React from 'react';
import { API_URL, APP_ID, ASSET_ID, MASTER_KEY, NODE_URL } from '../../config';
import styles from '../../styles/styles';
import i18n from '../../i18n';
//import Modal from "../Modal/Modal";
import { toast /*ToastContainer*/ } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withRouter } from 'react-router-dom';
import CoinLogo from '../../assets/images/token.svg';
const { transfer, broadcast } = require('@0bsnetwork/zbs-transactions');

class Token extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      kycIsComplete: false,
      walletaddress: '',
      tokenUserHold: 0,
      totalSupply: 0,
      totalPurchase: 0,
      tokenData: null,
      tokensToBuy: 0,
      loading: true,
      balance: 0,
      tabId: 'basic-tab-1',
      show: false,
      isShowing: false,
    };
  }

  openModalHandler = () => {
    this.setState({
      isShowing: true,
    });
  };

  closeModalHandler = () => {
    this.setState({
      isShowing: false,
    });
  };

  handleInputTokenBuyChange = (event) => {
    this.setState({
      tokensToBuy: event.target.value,
    });
  };

  buyTokens = () => {
    this.props.history.push('/buy');
  };

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
          this.setState({
            walletaddress: data.walletaddress,
            kycIsComplete: data.kycstatus,
          });

          this.updateBalance();
          this.getData();
        })
        .catch((err) => {
          console.log(err);
        });

      this.interval = setInterval(() => this.getData(), 10000);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getData = () => {
    fetch('https://' + API_URL + '/classes/Settings/', {
      method: 'GET',
      headers: new Headers({
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': MASTER_KEY,
        'Content-Type': 'application/json',
        'X-Parse-Session-Token': localStorage.getItem('token'),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ tokenData: data['results'] });
        let totalPurchase = data['results'][0]['totalPurchased'];
        let totalSupply = data['results'][0]['TotalSupply'];
        this.setState({
          totalPurchase: totalPurchase,
          totalSupply: totalSupply,
        });
        //this.updateBalance();
      })
      .catch((e) => console.log(e));
  };

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
            let tokenUser =
              (balance.balance / 100 / this.state.totalSupply) * 100;
            this.setState({
              balance: balance.balance / 100,
              loading: false,
              tokenUserHold: tokenUser,
            });
          } else {
            this.setState({ balance: 0, loading: false, tokenUserHold: 0 });
          }
        });
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  };

  getData = () => {
    fetch('https://' + API_URL + '/classes/Settings/', {
      method: 'GET',
      headers: new Headers({
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': MASTER_KEY,
        'Content-Type': 'application/json',
        'X-Parse-Session-Token': localStorage.getItem('token'),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState({ tokenData: data['results'] });
        let totalPurchase = data['results'][0]['totalPurchased'];
        let totalSupply = data['results'][0]['TotalSupply'];
        this.setState({
          totalPurchase: totalPurchase,
          totalSupply: totalSupply,
        });
        this.updateBalance();
      })
      .catch((e) => console.log(e));
  };

  logOut = () => {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  };

  render() {
    return (
      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <div className='coincontainer'>
          <div className='coinprice'>
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
          <div>
            {this.state.isShowing ? (
              <div onClick={this.closeModalHandler} className='back-drop'></div>
            ) : null}

            {this.state.kycIsComplete ? (
              <button className='loginbutton' onClick={this.buyTokens}>
                {i18n.t('Buy Tokens')}
              </button>
            ) : null}
            {/* <Modal
                            className="modal"
                            header={i18n.t('Buy Tokens')}
                            show={this.state.isShowing}
                            close={this.closeModalHandler}
                            functionExecute={this.buyTokens}>
                            {i18n.t('How many Tokens do you want to buy?')}
                            <br />
                            <input value={this.state.tokensToBuy} onChange={this.handleInputTokenBuyChange}/>
                        </Modal>
                        <ToastContainer /> */}
          </div>
        </div>
        {/* <p style={styles.instructionStyle}> {i18n.t('Eloop Token Details')}</p> */}
        <div
          className='revenue-con'
          style={{ justifyContent: 'center', paddingTop: '4rem' }}
        >
          <div className='revenue-box'>
            <div className='card'>
              <span style={styles.revenueTitleStyle}>
                {this.state.kycIsComplete ? (
                  <span>{i18n.t('My Token Balance')}</span>
                ) : null}
              </span>
              <span style={styles.revAmountStyle}>
                {this.state.kycIsComplete ? this.state.balance : null}
              </span>
            </div>
          </div>
          <div className='revenue-box'>
            <div className='card'>
              <span style={styles.revenueTitleStyle}>
                {i18n.t('Total Supply')}
              </span>
              <span style={styles.revAmountStyle}>
                {this.state.totalSupply}
              </span>
            </div>
          </div>
          <div className='revenue-box'>
            <div className='card'>
              <span style={styles.revenueTitleStyle}>
                {i18n.t('Total Purchased')}
              </span>
              <span style={styles.revAmountStyle}>
                {this.state.totalPurchase}
              </span>
            </div>
          </div>
          <div className='revenue-box'>
            <div className='card'>
              <span style={styles.revenueTitleStyle}>
                {i18n.t('EST Annual Yield')}
              </span>
              <span style={styles.revAmountStyle}>7%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Token);
