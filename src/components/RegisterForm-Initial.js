import React from 'react';
import styles from '../styles/styles';
import CountrySelect from './CountrySelect';
import NationalitySelect from './NationalitySelect';
import DatePicker from 'react-datepicker';
import { Trans } from 'react-i18next';

import 'react-datepicker/dist/react-datepicker.css';
import { APP_ID, MASTER_KEY, API_URL } from '../config';
import i18n from '../i18n';
import { withRouter } from 'react-router-dom';
import '../styles/styles.css';

const validate = (
  firstName,
  lastName,
  email,
  password,
  password2,
  address1,
  address2,
  city,
  postcode,
  country,
  nationality,
  iban,
  mobile,
  DOB
) => {
  // we are going to store errors for all fields
  // in a signle array
  const errors = [];

  if (firstName.length === 0) {
    errors.push(i18n.t('Ensure you enter a First Name'));
  }

  if (lastName.length === 0) {
    errors.push(i18n.t('Ensure you enter a Last Name'));
  }

  if (DOB.length === 0) {
    errors.push(i18n.t('Ensure you enter a Date of Birth'));
  }

  if (email.length < 8) {
    errors.push(i18n.t('Email should be at least 8 characters long'));
  }
  if (email.split('').filter((x) => x === '@').length !== 1) {
    errors.push(i18n.t('Email should contain a @'));
  }
  if (email.indexOf('.') === -1) {
    errors.push(i18n.t('Email should contain at least one dot'));
  }

  if (password.length < 6) {
    errors.push(i18n.t('Password should be at least 6 characters long'));
  }

  if (password !== password2) {
    errors.push(i18n.t('Passwords dont match'));
  }

  if (address1.length === 0) {
    errors.push(i18n.t('Ensure you enter Address Line 1'));
  }

  if (mobile.length === 0) {
    errors.push(i18n.t('Mobile Number is required for KYC'));
  } else {
    if (mobile.indexOf('+') === -1 || mobile.indexOf(' ') > 1) {
      errors.push(
        i18n.t(
          'Enter mobile number in international (+43) format, with no spaces'
        )
      );
    }
  }

  if (city.length === 0) {
    errors.push(i18n.t('Ensure you enter a City'));
  }

  if (postcode.length === 0) {
    errors.push(i18n.t('Ensure you enter Postcode'));
  }

  if (country === 'XX') {
    errors.push(i18n.t('Please select a Country'));
  }

  if (nationality === 'XX') {
    errors.push(i18n.t('Please select a Nationality'));
  }

  return errors;
};

class RegisterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      firstName: '',
      lastName: '',
      DOB: '',
      DateOfBirth: '',
      email: '',
      password: '',
      password2: '',
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      country: 'XX',
      countryText: '',
      nationality: 'XX',
      iban: '',
      mobile: '',
      errors: [],
      checkbox1: false,
      checkbox2: false,
      checkbox3: false,
      checkbox4: false,
      checkbox5: false,
      checkbox6: false,
      checkbox7: false,
      registerDisabled: true,
      contractDocument: '/contract.pdf',
      informationDocument: '/Informationsblatt.pdf',
    };
  }

  componentDidMount = () => {
    console.log(i18n.language);
  };

  countryChange = (country, dataset) => {
    console.log(dataset);
    this.setState({ country, countryText: dataset });
  };

  nationalityChange = (nationality) => {
    console.log(nationality);
    this.setState({ nationality });
  };

  handleDOBChange = (date) => {
    var dob = this.formatDate(date);
    this.setState({ DOB: dob, DateOfBirth: date });
  };

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
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
        this.updateRegisterButton();
      }
    );
  };

  updateRegisterButton = () => {
    if (
      this.state.checkbox1 &&
      this.state.checkbox2 &&
      this.state.checkbox3 &&
      this.state.checkbox4 &&
      this.state.checkbox5 &&
      this.state.checkbox6 &&
      this.state.checkbox7
    ) {
      this.setState({ registerDisabled: false });
    } else {
      this.setState({ registerDisabled: true });
    }
  };

  createAccount = (event) => {
    // 1.  stop the form from submitting
    event.preventDefault();

    const {
      firstName,
      lastName,
      email,
      password,
      password2,
      address1,
      address2,
      city,
      postcode,
      country,
      nationality,
      iban,
      mobile,
      DOB,
      countryText,
    } = this.state;

    const errors = validate(
      firstName,
      lastName,
      email,
      password,
      password2,
      address1,
      address2,
      city,
      postcode,
      country,
      nationality,
      iban,
      mobile,
      DOB
    );
    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors: [] });
    console.log(this);
    console.log(this.props);

    fetch('https://' + API_URL + '/users', {
      method: 'POST',
      headers: new Headers({
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': MASTER_KEY,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        username: email.toLowerCase(),
        email: email.toLowerCase(),
        fullName: firstName + ' ' + lastName,
        firstName: firstName,
        lastName: lastName,
        DOB: DOB,
        password: password,
        address1,
        address2,
        city,
        postcode,
        country,
        nationality,
        kycstatus: false,
        kyccomment: 'AWAITING APPLICATION',
        enabled: true,
        language: i18n.language,
        iban,
        mobile,
        countryText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.objectId) {
          //localStorage.setItem('token',data.sessionToken);
          this.props.history.push('/registrationconf');
        } else {
          console.log(data);
          if (data.error) {
            errors.push(data.error);
          } else {
            errors.push(i18n.t('Registration Error. Please contact support'));
          }
          this.setState({ errors });
        }
      })
      .catch((err) => console.log(err));

    event.currentTarget.reset();
  };

  render() {
    const { errors } = this.state;
    return (
      <div
        style={{
          width: '80%',
          margin: 'auto',
          marginBottom: 30,
          textAlign: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.titleStyle}> {i18n.t('Register')} </h2>
          <p style={styles.instructionStyle}>
            {' '}
            {i18n.t('Please enter your details below, and click Register')}{' '}
            <a href='/login' style={styles.linkStyle}>
              {' '}
              {i18n.t('Already have an account?')}{' '}
            </a>
          </p>

          <form className='user-create' onSubmit={this.createAccount}>
            <div style={styles.inputBoxStyle}>
              <input
                name='email'
                value={this.state.email}
                onChange={(evt) => this.setState({ email: evt.target.value })}
                autoCapitalize='none'
                style={styles.inputStyle}
                type='email'
                placeholder={i18n.t('Email Address')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='firstName'
                value={this.state.firstName}
                onChange={(evt) =>
                  this.setState({ firstName: evt.target.value })
                }
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('First Name')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='lastName'
                value={this.state.lastName}
                onChange={(evt) =>
                  this.setState({ lastName: evt.target.value })
                }
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('Last Name')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <DatePicker
                selected={this.state.DateOfBirth}
                onChange={this.handleDOBChange}
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                calendarClassName='txt-dob'
                placeholderText={i18n.t('Date of Birth')}
              />
            </div>

            <div style={styles.inputBoxStyle}>
              <input
                name='iban'
                value={this.state.iban}
                onChange={(evt) => this.setState({ iban: evt.target.value })}
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('IBAN (For Payouts)')}
              />
            </div>

            <h4 style={styles.headingStyle}>{i18n.t('Passwords')} </h4>

            <div style={styles.inputBoxStyle} className='t-input-block'>
              <input
                name='password'
                value={this.state.password}
                onChange={(evt) =>
                  this.setState({ password: evt.target.value })
                }
                style={styles.inputStyle}
                type='password'
                placeholder={i18n.t('Password')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='password2'
                value={this.state.password2}
                onChange={(evt) =>
                  this.setState({ password2: evt.target.value })
                }
                style={styles.inputStyle}
                type='password'
                placeholder={i18n.t('Confirm Password')}
              />
            </div>

            <h4 style={styles.headingStyle}> {i18n.t('Your Address')} </h4>

            <div style={styles.inputBoxStyle}>
              <input
                name='address1'
                value={this.state.address1}
                onChange={(evt) =>
                  this.setState({ address1: evt.target.value })
                }
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('Address Line 1')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='address2'
                value={this.state.address2}
                onChange={(evt) =>
                  this.setState({ address2: evt.target.value })
                }
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('Address Line 2')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='city'
                value={this.state.city}
                onChange={(evt) => this.setState({ city: evt.target.value })}
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('City')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='postcode'
                value={this.state.postcode}
                onChange={(evt) =>
                  this.setState({ postcode: evt.target.value })
                }
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('PostCode')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <input
                name='mobile'
                value={this.state.mobile}
                onChange={(evt) => this.setState({ mobile: evt.target.value })}
                style={styles.inputStyle}
                type='text'
                placeholder={i18n.t('Mobile (Required for KYC)')}
              />
            </div>
            <div style={styles.inputBoxStyle}>
              <CountrySelect
                value={this.state.country}
                onChange={(country, text) => this.countryChange(country, text)}
              />
            </div>

            <div style={styles.inputBoxStyle}>
              <NationalitySelect
                value={this.state.nationality}
                onChange={(nationality) => this.nationalityChange(nationality)}
              />
            </div>

            <div
              className='checkboxcontainer'
              style={{
                padding: '3rem 0',
                width: '40%',
                margin: 'auto',
                minWidth: 400,
              }}
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
                    <a href={this.state.informationDocument}>
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
                  <Trans i18nKey='register_form_agree_3'>
                    I have read the{' '}
                    <a href={this.state.contractDocument}>
                      Investment Framework Agreement
                    </a>{' '}
                    (Investitionsrahmenvertrag) in respect of the Eloop Token
                    (in German) and accept this in its entirety.
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
                    <a href={this.state.informationDocument}>
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
                  <Trans i18nKey='register_form_agree_6'>
                    I have read the{' '}
                    <a href='https://eloop.at/de/privacy'>
                      data protection and usage statement
                    </a>{' '}
                    (in German) and agree to the use of my data as provided
                    above for the specified purposes.
                  </Trans>
                </span>
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  name='checkbox7'
                  type='checkbox'
                  className='customCheckbox'
                  checked={this.state.checkbox7}
                  onChange={this.handleCheckChange}
                />
                <span className='checkboxText'>
                  {i18n.t('register_form_agree_7')}
                </span>
              </label>
            </div>

            <div style={styles.errorStyle}>
              {errors.map((error) => (
                <p key={error}>
                  {i18n.t('Error')}: {error}
                </p>
              ))}
            </div>
            <div style={styles.inputBoxStyle}>
              <button
                type='submit'
                className='loginbutton'
                disabled={this.state.registerDisabled}
              >
                {i18n.t('Register')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(RegisterForm);
