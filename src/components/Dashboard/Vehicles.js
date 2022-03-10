import React from 'react';
import Moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { withRouter } from 'react-router-dom';

import { API_URL, APP_ID, MASTER_KEY } from '../../config';
import i18n from '../../i18n';
import Vehicle from '../Ui/Vehicle';

class Vehicles extends React.Component {
  constructor() {
    super();
    this.state = {
      vehicles: [],
      loading: true,
      balance: 0,
      tabId: 'basic-tab-1'
    };
    momentDurationFormatSetup(Moment);
  }

  componentWillMount() {
    let token = localStorage.getItem('token');
    if (!token) {
      this.props.history.push('/login');
    } else {
      this.getVehicles();
    }
  }

  getVehicles = () => {
    try {
      fetch('https://' + API_URL + '/classes/Vehicle/', {
        method: 'GET',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': localStorage.getItem('token')
        })
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          var vehicleDataList = data['results'];

          this.setState({ vehicles: vehicleDataList, loading: false });
        })

        .catch(e => console.log(e));
    } catch (err) {
      console.log('Error fetching data-----------', err);
    }
  };

  vehicleKmFormatter = cell => {
    if (cell) return Number(cell.toFixed(0));
    else return 0;
  };

  priceFormatter = cell => {
    if (cell) {
      return Number(cell)
        .toFixed(2)
        .toString();
    } else return 0;
  };

  durationFormatter = cell => {
    if (cell) {
      return Moment.duration(Number(cell.toFixed(0)), 'minutes').format(
        'H:mm:ss'
      );
    } else return 0;
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div style={{ maxWidth: '10em', margin: 'auto' }}>
            <div className='dot-red'>
              <div className='dot-red-pulse' />
            </div>
            <span>{i18n.t('LOADING')}</span>
          </div>
        ) : (
          <div className='vehiclegrid'>
            {this.state.vehicles.map((vehicle, index) => (
              <Vehicle key={index} data={vehicle} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Vehicles);