import React from 'react';

import { API_URL, APP_ID, MASTER_KEY, NODE_EXPLORER_URL } from '../../config';
import styles from '../../styles/styles';
//import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import i18n from '../../i18n';
import Moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import '../../styles/styles.css';
//import InfiniteScroll from 'react-infinite-scroll-component';
import Trip from '../Ui/Trip';

class Trips extends React.Component {
  constructor() {
    super();
    this.state = {
      trips: [],
      loading: true,
      balance: 0,
      hasMore: true,
      tabId: 'basic-tab-1'
    };

    momentDurationFormatSetup(Moment);
  }

  componentWillMount() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    }
    this.getTrips();
  }

  getTrips = () => {
    try {
      fetch(
        'https://' +
          API_URL +
          '/classes/Trip/?order=-endDateTime&limit=500&where={"$or": [{"billingAmount":{"$gt":0}}, {"billingAmount":{"$lt":0}}]}',
        {
          // TODO: Trello #17
          method: 'GET',
          headers: new Headers({
            'X-Parse-Application-Id': APP_ID,
            'X-Parse-REST-API-Key': MASTER_KEY,
            'Content-Type': 'application/json',
            'X-Parse-Session-Token': localStorage.getItem('token')
          })
        }
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          let tripData = data['results'];
          this.setState({
            total: tripData,
            trips: tripData,
            loading: false
          });
        })
        .catch(e => console.log(e));
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  };

  /*   dateFormatter = cell => {
    let locale = window.navigator.userLanguage || window.navigator.language;
    Moment.locale(locale);
    return Moment(cell.iso).format('D/MM/YYYY HH:mm:ss');
  };

  durationFormatter = cell => {
    return Moment.duration(Number(cell.toFixed(0)), 'minutes').format(
      'H:mm:ss'
    );
  };

  priceFormatter = cell => {
    return Number(cell)
      .toFixed(2)
      .toString();
  };

  txidFormatter = cell => {
    return cell !== undefined
      ? '<a href="' + NODE_EXPLORER_URL + cell + '" target="_blank">View</a>'
      : '';
  }; */

  render() {
    /*  function revertSortFunc() {
      // order is desc or asc
      return -1;
    }
    const options = {
      // defaultSortName: "startDateTime",
      // defaultSortOrder: 'desc',
    }; */
    /* const initialData = () => {
      this.setState({
        trips: TripArray.slice(0, 25)
      });
    };
    const fetchMoreData = () => {
      this.setState({
        trips: TripArray.slice(26, 50)
      });
    }; */
    /* console.log(this.state.total.slice(0, 26));
    console.log(this.state.trips); */

    if (!this.state.trips) {
      return (
        <div style={styles.detailboxStyle}>
          <span style={styles.detailTitleStyle}>
            {i18n.t('Trips Not Found...Please try again later')}
          </span>
        </div>
      );
    }

    return (
      <div>
        {this.state.loading ? (
          <div style={{ maxWidth: '10em', margin: 'auto' }}>
            <div className='dot-red'>
              <div className='dot-red-pulse' />
            </div>
            <span style={{ color: 'white' }}>{i18n.t('LOADING TRIPS')}</span>
          </div>
        ) : (
          this.state.trips.map((i, index) => {
            return <Trip data={i} key={index} />;
          })
        )}

        {/* <InfiniteScroll
          dataLength={this.state.trips}
          hasMore={this.state.hasMore}
          loader={
            <>
              <div className='dot-red'>
                <div className='dot-red-pulse' />
              </div>
              <span>LOADING</span>
            </>
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {this.state.loading ? (this.state.trips.map((i, index) => {
            return <Trip data={i} key={index} />;
          })
          ) :
          <>
              <div className='dot-red'>
                <div className='dot-red-pulse' />
              </div>
              <span>LOADING</span>
            </>
          }
        </InfiniteScroll> */}
      </div>
    );
  }
}

export default Trips;

{
  /* <div style={styles.detailboxStyle}>
  <BootstrapTable
    data={this.state.trips}
    version='4'
    bootstrap4={true}
    striped
    hover
    pagination
    options={options}
  >
    <TableHeaderColumn isKey dataField='objectId' hidden>
      {i18n.t('Id')}
    </TableHeaderColumn>
    <TableHeaderColumn dataField='vehicle'>
      {i18n.t('Vehicle')}
    </TableHeaderColumn>
    <TableHeaderColumn
      dataField='startDateTime'
      dataFormat={this.dateFormatter}
      dataSort
      sortFunc={revertSortFunc}
    >
      {i18n.t('Start Date')}
    </TableHeaderColumn>
    <TableHeaderColumn
      dataField='endDateTime'
      dataFormat={this.dateFormatter}
      dataSort
      sortFunc={revertSortFunc}
    >
      {i18n.t('End Date')}
    </TableHeaderColumn>
    <TableHeaderColumn
      dataField='duration'
      dataFormat={this.durationFormatter}
    >
      {i18n.t('Duration')}
    </TableHeaderColumn>
    <TableHeaderColumn
      dataField='billingAmount'
      dataFormat={this.priceFormatter}
    >
      {i18n.t('Billing Amount (EUR)')}
    </TableHeaderColumn>
    <TableHeaderColumn dataField='txid' dataFormat={this.txidFormatter}>
      {i18n.t('Blockchain Proof')}
    </TableHeaderColumn>
  </BootstrapTable>
</div> */
}
