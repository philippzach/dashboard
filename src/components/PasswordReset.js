import React from 'react';
import styles from '../styles/styles';
import { API_URL, APP_ID, MASTER_KEY } from '../config';
import i18n from '../i18n';

const validate = (email) => {
  const errors = [];

  if (email.length < 8) {
    errors.push(i18n.t('Email should be at least 8 characters long'));
  }
  if (email.split('').filter((x) => x === '@').length !== 1) {
    errors.push(i18n.t('Email should contain a @'));
  }
  if (email.indexOf('.') === -1) {
    errors.push(i18n.t('Email should contain at least one dot'));
  }
  return errors;
};

class PasswordReset extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      errors: [],
    };
  }

  login = (event) => {
    event.preventDefault();

    const { email } = this.state;

    const errors = validate(email);
    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors: [] });

    fetch('https://' + API_URL + '/requestPasswordReset', {
      method: 'POST',
      headers: new Headers({
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': MASTER_KEY,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        email: email.toLowerCase(),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        //alert('Password Reset Requested. Check your mail.')
        localStorage.removeItem('token');
        this.props.history.push('/resetconf');
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
          height: '80vh',
          margin: 'auto',
          marginBottom: 30,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className='contactbox'>
          <h2 style={styles.titleStyle}> {i18n.t('PasswordReset')} </h2>
          <p style={styles.instructionStyle}>
            {' '}
            {i18n.t(
              'Please enter email address and you will receive an email with a reset link which will allow you to create a new password.'
            )}{' '}
          </p>
          <div style={styles.errorStyle}>
            {errors.map((error) => (
              <span className='errormessage' key={error}>
                {error}
              </span>
            ))}
          </div>
          <form onSubmit={this.login}>
            <label for='email' class='inp'>
              <input
                name='email'
                value={this.state.email}
                onChange={(evt) => this.setState({ email: evt.target.value })}
                autoCapitalize='none'
                id='email'
                type='email'
                placeholder='&nbsp;'
              />
              <span class='label'>Email address</span>
              <span class='border' />
            </label>

            <div style={styles.inputBoxStyle}>
              <button type='submit' className='loginbutton'>
                {i18n.t('Request Reset')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PasswordReset;
