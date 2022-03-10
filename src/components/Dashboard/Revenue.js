import React from 'react';
import styles from '../../styles/styles';
import i18n from '../../i18n';
import { API_URL, APP_ID, MASTER_KEY, CURRENCY_CODE_HTML } from '../../config';
import { withRouter } from 'react-router-dom';
import Cashout from './../Modal/Cashout';
import styled from '@emotion/styled';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import RevenueChart from '../Charts/Revenue';
import YearlyChart from '../Charts/Yearly';
import CostsChart from '../Charts/Costs';
import Co2Chart from '../Charts/Co2';
import Container from '../Ui/Container';

const MySwal = withReactContent(Swal);

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 1em;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
  }
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const FiftyFifty = styled.div`
  width: 50%;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

class Revenue extends React.Component {
  constructor() {
    super();
    this.state = {
      eurEarnings: 0,
      eurRevenue: 0,
      totalEurEarnings: 0,
      totalRevenue: 0,
      loading: true,
      tabId: 'basic-tab-1',
      monthlyCostEur: 0,
      balance: 0,
      earningsLastUpdateDateTime: '',
      totalEarnings: 0,
      revenueThisMonth: 0,
      totalCashout: 0,
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
          this.setState({
            totalEurEarnings: data.eur_earnings ? data.eur_earnings : 0,
            eurEarnings: data.current_week_earnings
              ? data.current_week_earnings
              : 0,
            balance: data.balance ? data.balance : 0,
            earningsLastUpdateDateTime: data.EarningsLastUpdateDateTime
              ? data.EarningsLastUpdateDateTime
              : '',
            userpercentagerevenue: data.currentPeriodTokenHoursPct,
          });

          // if (!this.state.walletaddress) {
          //     this.createWallet();
          // }
        })
        .catch((err) => {
          console.log(err);
        });

      fetch('https://' + API_URL + '/classes/Settings', {
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
          this.setState({
            totalEurRevenue: data.results[0].revenuePoolTotal.toFixed(2),
            totalCostEur: data.results[0].costPoolTotal.toFixed(2),
          });

          // if (!this.state.walletaddress) {
          //     this.createWallet();
          // }
        })
        .catch((err) => console.log(err));

      fetch('https://' + API_URL + '/functions/getmystats', {
        method: 'POST',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': token,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            totalEarnings: data.result.totalEarnings,
            revenueThisMonth: data.result.revenueThisMonth,
            totalCashout: data.result.totalCashout,
          });

          // if (!this.state.walletaddress) {
          //     this.createWallet();
          // }
        })
        .catch((err) => console.log(err));
    }
  }

  getData = () => {};

  processCaseOut = (cashoutAmount) => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    }
    if (cashoutAmount < 10) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.text('Minimum payout is 10 Euro !'),
      });
      return false;
    }
    if (cashoutAmount > this.state.totalEarnings - this.state.totalCashout) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('Not enough balance to cashout !'),
      });
      return false;
    }
    if (
      cashoutAmount >= 10 &&
      this.state.totalEarnings - this.state.totalCashout >= cashoutAmount
    ) {
      fetch('https://' + API_URL + '/functions/requestPayout', {
        method: 'POST',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': token,
        }),
        body: JSON.stringify({
          amount: cashoutAmount,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error && data.code === 209) {
            this.logOut();
          }
          console.log(data);
          MySwal.fire({
            icon: 'success',
            text: i18n.t(
              'Your request has been sent and we will be in contact within 48 hours'
            ),
          });
        })
        .catch((err) => {
          console.log(err);
        });
      return true;
    } else {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('Something went wrong! Please try again later'),
      });
    }
  };

  processCreditConvert = (convertAmount) => {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    }
    if (convertAmount < 10) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('Minimum 10 credit require to convert !'),
      });
      return false;
    }
    if (convertAmount > this.state.balance) {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('Not enough balance for convert to credit !'),
      });
      return false;
    }
    if (convertAmount >= 10 && this.state.balance >= convertAmount) {
      fetch('https://' + API_URL + '/functions/requestCredits', {
        method: 'POST',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': token,
        }),
        body: JSON.stringify({
          amount: convertAmount,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error && data.code === 209) {
            this.logOut();
          }
          console.log(data);
          MySwal.fire({
            icon: 'success',
            text: i18n.t(
              'Your request has been sent and we will be in contact within 48 hours'
            ),
          });
        })
        .catch((err) => {
          console.log(err);
        });
      return true;
    } else {
      MySwal.fire({
        icon: 'warning',
        text: i18n.t('Something went wrong! Please try again later'),
      });
    }
  };

  logOut = () => {
    localStorage.removeItem('token');
    this.props.history.push('/login');
  };

  render() {
    return (
      <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
        <Container>
          <div className='revheading'>
            <div>
              <p
                style={{
                  textTransform: 'uppercase',
                  color: 'white',
                  fontSize: '1.5em',
                  textAlign: 'left',
                }}
              >
                {i18n.t('My Balance')}
              </p>
            </div>
            <Cashout
              show={true}
              handleCaseOut={this.processCaseOut}
              handleCreditConvert={this.processCreditConvert}
            />
          </div>
          <div className='revenue-con'>
            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Revenue this Month')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {this.state.revenueThisMonth}
                </span>
              </div>
            </div>
            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Total earnings')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {this.state.totalEarnings}
                </span>
              </div>
            </div>
            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Cashout Balance')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {(this.state.totalEarnings - this.state.totalCashout).toFixed(
                    2
                  )}
                </span>
              </div>
            </div>
          </div>
        </Container>
        <Flex>
          <FiftyFifty>
            <RevenueChart />
          </FiftyFifty>
          <FiftyFifty>
            <YearlyChart />
          </FiftyFifty>
        </Flex>
        <Flex>
          <FiftyFifty>
            <CostsChart />
          </FiftyFifty>
          <FiftyFifty>
            <Co2Chart />
          </FiftyFifty>
        </Flex>
        <Container>
          {/* <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Monthly Costs')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {this.state.monthlyCostEur}
                </span>
              </div>
            </div> */}

          {/*  <div className='lastupdate'>
              <span style={styles.detailTitleStyle}>
                {i18n.t('Last Updated')}
              </span>
              <span style={styles.detailItemStyle}>
                {this.state.earningsLastUpdateDateTime}
              </span>
            </div> */}

          {/* <p style={styles.instructionStyle}>
            {' '}
            {i18n.t('Below are details of your revenue, and total revenue')}
          </p>

          <p style={styles.headingStyle1}> {i18n.t('My Share')}</p>
          */}

          <p
            style={{
              textTransform: 'uppercase',
              color: 'white',
              fontSize: '1.5em',
              marginBottom: '3rem',
              textAlign: 'left',
            }}
          >
            {i18n.t('ELOOP ONE Car Pool')}
          </p>
          <div className='revenue-con' style={{ justifyContent: 'center' }}>
            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Cars in Pool')}
                </span>
                <span style={styles.revAmountStyle}>5</span>
              </div>
            </div>

            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Revenue since start')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {Math.round(this.state.totalEurRevenue)}
                </span>
              </div>
            </div>
            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Cost since start')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {this.state.totalCostEur}
                </span>
              </div>
            </div>
            <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>Profit since Start</span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML} </span>
                  {Math.round(
                    this.state.totalEurRevenue - this.state.totalCostEur
                  )}
                </span>
              </div>
            </div>
            {/* <div className='revenue-box'>
              <div className='card'>
                <span style={styles.revenueTitleStyle}>
                  {i18n.t('Balance')}
                </span>
                <span style={styles.revAmountStyle}>
                  <span className='revcode'>{CURRENCY_CODE_HTML}</span>
                  {this.state.balance}
                </span>
              </div>
            </div> */}
          </div>
        </Container>
      </div>
    );
  }
}

export default withRouter(Revenue);
