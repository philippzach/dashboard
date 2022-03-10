import React from 'react';
import styles from '../styles/styles';
import styled from '@emotion/styled';
import CountrySelect from './CountrySelect';
import NationalitySelect from './NationalitySelect';
import DatePicker from 'react-datepicker';
import { Trans } from 'react-i18next';

import 'react-datepicker/dist/react-datepicker.css';
import { APP_ID, MASTER_KEY, API_URL } from '../config';
import i18n from '../i18n';
import { withRouter } from 'react-router-dom';
import '../styles/styles.css';

const Button = styled.button`
  background-color: ${(props) => (props.next ? '#4adeb4' : 'white')};
  border-color: white;
  padding: 0.5em 2.5em;
  text-transform: uppercase;
  box-shadow: 0 0.46875rem 2.1875rem rgba(8, 10, 37, 0.03),
    0 0.9375rem 1.40625rem rgba(8, 10, 37, 0.03),
    0 0.25rem 0.53125rem rgba(8, 10, 37, 0.05),
    0 0.125rem 0.1875rem rgba(8, 10, 37, 0.03);
  border: 2px solid rgba(32, 39, 140, 0.125);
  border-radius: 0.25rem;
  padding: 0.5em;
  font-family: 'Sofia Pro';
  color: ${(props) => (props.next ? 'white' : '#3c354c')};
  text-transform: uppercase;
  &:hover {
    background: #3c354c;
    color: #e4e4e4;
    border: 2px solid #4adeb4;
  }
  &:focus {
    background: #4adeb4;
    color: #3c354c;
    border: 2px solid #fff;
  }
`;
const ButtonContainer = styled.div`
  float: ${(props) => (props.next ? 'right' : 'left')};
`;
const MaxWidth = styled.div`
  margin: auto;
  max-width: 450px;
`;

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
      currentStep: 1,
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
      loading: '',
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
  /*
   * MUTLI STEP REGISTRATION
   */
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  _next = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 3 ? 4 : currentStep + 1;
    this.setState({
      currentStep: currentStep,
    });
  };

  _prev = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep,
    });
  };

  /*
   * the functions for our button
   */
  previousButton() {
    let currentStep = this.state.currentStep;
    if (currentStep !== 1) {
      return (
        <Button type='button' onClick={this._prev}>
          Go back
        </Button>
      );
    }
    return null;
  }

  nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 4) {
      return (
        <Button next type='button' onClick={this._next}>
          Continue
        </Button>
      );
    }
    return null;
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
    this.setState({ loading: true });
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
      this.setState({ loading: false });
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
          this.setState({ loading: false });
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
          margin: '2.5em auto auto',
          marginBottom: 30,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <form className='user-create' onSubmit={this.createAccount}>
            <Step1
              currentStep={this.state.currentStep}
              handleChange={this.handleChange}
              email={this.state.email}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              password={this.state.password}
              password2={this.state.password2}
            />
            <Step2
              currentStep={this.state.currentStep}
              handleChange={this.handleChange}
              address1={this.state.address1}
              address2={this.state.address2}
              city={this.state.city}
              postcode={this.state.postcode}
              country={this.state.country}
              countryChange={this.countryChange}
            />
            <Step3
              currentStep={this.state.currentStep}
              handleChange={this.handleChange}
              DateOfBirth={this.state.DateOfBirth}
              dayChange={this.handleDOBChange}
              mobile={this.state.mobile}
              iban={this.state.iban}
              nationality={this.state.nationality}
              nationalityChange={this.nationalityChange}
            />
            <Step4
              currentStep={this.state.currentStep}
              handleChange={this.handleChange}
              handleCheckChange={this.handleCheckChange}
              checkbox1={this.state.checkbox1}
              checkbox2={this.state.checkbox2}
              checkbox3={this.state.checkbox3}
              checkbox4={this.state.checkbox4}
              checkbox5={this.state.checkbox5}
              checkbox6={this.state.checkbox6}
              checkbox7={this.state.checkbox7}
              informationDocument={this.state.informationDocument}
              contractDocument={this.state.contractDocument}
              registerDisabled={this.state.registerDisabled}
              errors={this.state.errors}
              isLoading={this.state.loading}
            />
            <div />
            <div
              style={{
                maxWidth: '80%',
                margin: 'auto',
                marginTop: '3em',
                marginBottom: '3em',
              }}
            >
              <ButtonContainer>{this.previousButton()}</ButtonContainer>
              <ButtonContainer next>{this.nextButton()}</ButtonContainer>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function Step1(props) {
  if (props.currentStep !== 1) {
    return null;
  }
  return (
    <>
      <h2 style={styles.titleStyle}> {i18n.t('Registration')} </h2>
      <p style={styles.instructionStyle}>
        {' '}
        {i18n.t('Please enter your details below, and click continue.')}{' '}
        <a href='/login' style={styles.linkStyle}>
          {' '}
          <span style={{ color: '#4adeb5' }}>
            {i18n.t('Already have an account?')}
          </span>{' '}
        </a>
      </p>
      <MaxWidth>
        <label for='inp' class='inp'>
          <input
            name='email'
            value={props.email}
            onChange={props.handleChange}
            autoCapitalize='none'
            id='inp'
            placeholder='&nbsp;'
            type='email'
          />
          <span class='label'>Email</span>
          <span class='border' />
        </label>

        <label for='inp' class='inp'>
          <input
            name='firstName'
            value={props.firstName}
            onChange={props.handleChange}
            id='inp'
            placeholder='&nbsp;'
            type='text'
          />
          <span class='label'>First Name</span>
          <span class='border' />
        </label>
        <label for='inp' class='inp'>
          <input
            name='lastName'
            value={props.lastName}
            onChange={props.handleChange}
            id='inp'
            placeholder='&nbsp;'
            type='text'
          />
          <span class='label'>Last Name</span>
          <span class='border' />
        </label>
        <h4 style={{ color: 'white', marginTop: '1em' }}>
          {i18n.t('Choose a strong password')}{' '}
        </h4>
        <label for='inp' class='inp'>
          <input
            name='password'
            value={props.password}
            onChange={props.handleChange}
            id='inp'
            placeholder='&nbsp;'
            type='password'
          />
          <span class='label'>Password</span>
          <span class='border' />
        </label>
        <label for='inp' class='inp'>
          <input
            name='password2'
            value={props.password2}
            onChange={props.handleChange}
            id='inp'
            placeholder='&nbsp;'
            type='password'
          />
          <span class='label'>Confirm Password</span>
          <span class='border' />
        </label>
      </MaxWidth>
    </>
  );
}
function Step2(props) {
  if (props.currentStep !== 2) {
    return null;
  }
  return (
    <>
      <h3 style={styles.titleStyle}> {i18n.t('Additional Information')} </h3>
      <p style={styles.instructionStyle}>
        {' '}
        {i18n.t(
          'Please provide us your details below, and click continue'
        )}{' '}
      </p>
      <label for='inp' class='inp'>
        <input
          name='address1'
          value={props.address1}
          onChange={props.handleChange}
          id='inp'
          placeholder='&nbsp;'
          type='text'
        />
        <span class='label'>Address</span>
        <span class='border' />
      </label>
      <label for='inp' class='inp'>
        <input
          name='address2'
          value={props.address2}
          onChange={props.handleChange}
          id='inp'
          placeholder='&nbsp;'
          type='text'
        />
        <span class='label'>2nd Address</span>
        <span class='border' />
      </label>
      <label for='inp' class='inp'>
        <input
          name='city'
          value={props.city}
          onChange={props.handleChange}
          id='inp'
          placeholder='&nbsp;'
          type='text'
        />
        <span class='label'>City</span>
        <span class='border' />
      </label>
      <label for='inp' class='inp'>
        <input
          name='postcode'
          value={props.postcode}
          onChange={props.handleChange}
          id='inp'
          placeholder='&nbsp;'
          type='text'
        />
        <span class='label'>Post Code</span>
        <span class='border' />
      </label>
      <div>
        <CountrySelect
          value={props.country}
          onChange={(country, text) => props.countryChange(country, text)}
        />
      </div>
    </>
  );
}

function Step3(props) {
  if (props.currentStep !== 3) {
    return null;
  }
  return (
    <React.Fragment>
      <h3 style={styles.titleStyle}> {i18n.t('Required for KYC')} </h3>
      <div style={{ maxWidth: '600px', margin: 'auto auto 1em auto' }}>
        <p style={styles.instructionStyle}>
          In order to get KYC approved we need you to provide a phone number,
          your birth date and nationality. Your IBAN will be used for future
          payouts. You can change it anytime through support@eloop.to
        </p>
      </div>
      <div>
        <DatePicker
          selected={props.DateOfBirth}
          onChange={props.dayChange}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          calendarClassName='txt-dob'
          placeholderText={i18n.t('Date of Birth')}
        />
      </div>
      <label for='inp' class='inp'>
        <input
          name='iban'
          value={props.iban}
          onChange={props.handleChange}
          id='inp'
          placeholder='&nbsp;'
          type='text'
        />

        <span class='label'>IBAN (For Payouts)</span>
        <span class='border' />
      </label>
      <label for='inp' class='inp'>
        <input
          name='mobile'
          value={props.mobile}
          onChange={props.handleChange}
          id='inp'
          placeholder='&nbsp;'
          type='text'
        />
        <span class='label'>Mobile Number</span>
        <span class='border' />
      </label>
      <NationalitySelect
        style={{ marginTop: '1em' }}
        value={props.nationality}
        onChange={(nationality) => props.nationalityChange(nationality)}
      />
    </React.Fragment>
  );
}

function Step4(props) {
  if (props.currentStep !== 4) {
    return null;
  }
  return (
    <React.Fragment>
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
            className='customCheckboxRegister'
            checked={props.checkbox1}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            {i18n.t('register_form_agree_1')}
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input
            name='checkbox2'
            type='checkbox'
            className='customCheckboxRegister'
            checked={props.checkbox2}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            <Trans i18nKey='register_form_agree_2'>
              I have read the{' '}
              <a href={props.informationDocument}>Information Notice</a> from
              Caroo Mobility GmbH (in German) and accept this.
            </Trans>
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input
            name='checkbox3'
            type='checkbox'
            className='customCheckboxRegister'
            checked={props.checkbox3}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            <Trans i18nKey='register_form_agree_3'>
              I have read the{' '}
              <a href={props.contractDocument}>
                Investment Framework Agreement
              </a>{' '}
              (Investitionsrahmenvertrag) in respect of the Eloop Token (in
              German) and accept this in its entirety.
            </Trans>
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input
            name='checkbox4'
            type='checkbox'
            className='customCheckboxRegister'
            checked={props.checkbox4}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            {i18n.t('register_form_agree_4')}
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input
            name='checkbox5'
            type='checkbox'
            className='customCheckboxRegister'
            checked={props.checkbox5}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            <Trans i18nKey='register_form_agree_5'>
              I have read the cancellation conditions in the{' '}
              <a href={props.informationDocument}>Information Notice</a> (in
              German) and agree to these.
            </Trans>
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input
            name='checkbox6'
            type='checkbox'
            className='customCheckboxRegister'
            checked={props.checkbox6}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            <Trans i18nKey='register_form_agree_6'>
              I have read the{' '}
              <a href='https://eloop.at/de/privacy'>
                data protection and usage statement
              </a>{' '}
              (in German) and agree to the use of my data as provided above for
              the specified purposes.
            </Trans>
          </span>
        </label>

        <label style={styles.checkboxLabel}>
          <input
            name='checkbox7'
            type='checkbox'
            className='customCheckboxRegister'
            checked={props.checkbox7}
            onChange={props.handleCheckChange}
          />
          <span className='checkboxTextRegister'>
            {i18n.t('register_form_agree_7')}
          </span>
        </label>
      </div>
      <div style={{ marginBottom: '1em' }}>
        {props.errors.map((error) => (
          <span
            style={{ textAlign: 'center' }}
            className='errormessage'
            key={error}
          >
            {error}
          </span>
        ))}
      </div>
      {props.isLoading ? (
        <div class='sp sp-circle'></div>
      ) : (
        <button
          type='submit'
          className='loginbutton'
          style={{ marginRight: '0' }}
          disabled={props.registerDisabled}
        >
          {i18n.t('Complete Registration')}
        </button>
      )}
    </React.Fragment>
  );
}

export default withRouter(RegisterForm);
