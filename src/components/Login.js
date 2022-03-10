import React from 'react';
import styles from '../styles/styles';
import { API_URL, APP_ID, MASTER_KEY } from '../config';
import i18n from '../i18n';
import { withRouter } from 'react-router-dom';

const validate = (email, password) => {
  // we are going to store errors for all fields
  // in a signle array
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

  if (password.length < 6) {
    errors.push(i18n.t('Password should be at least 6 characters long'));
  }

  return errors;
};

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: [],
      loading: '',
    };
  }

  componentWillMount() {
    let token = localStorage.getItem('token');
    if (token) {
      this.setState({ loading: 'true' });
      this.props.history.push('/dashboard');
    }
  }

  login = (event) => {
    event.preventDefault();
    this.setState({ loading: 'true' });
    const { email, password } = this.state;

    const errors = validate(email, password);
    if (errors.length > 0) {
      this.setState({ errors });
      this.setState({ loading: 'false' });
      return;
    }
    this.setState({ errors: [] });

    fetch('https://' + API_URL + '/login', {
      method: 'POST',
      headers: new Headers({
        'X-Parse-Application-Id': APP_ID,
        'X-Parse-REST-API-Key': MASTER_KEY,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        username: email.toLowerCase(),
        email: email.toLowerCase(),
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.sessionToken) {
          localStorage.setItem('token', data.sessionToken);
          localStorage.setItem('objectId', data.objectId);
          this.props.history.push('/dashboard');
        } else {
          this.setState({ loading: 'false' });
          console.log(data);
          if (data.error) {
            if (data.error.indexOf('verified')) {
              errors.push(
                'We send you an email to the address you provided. Please check your mails and verify your account in order to login.'
              );
            } else
              errors.push(
                data.error +
                  '. ' +
                  i18n.t(
                    'Ohh. There seems to be a problem on our side. Please contact us at support@eloop.to'
                  )
              );
          } else {
            errors.push(
              i18n.t(
                'There seems to be a problem on our side. Please contact support@eloop.to'
              )
            );
          }

          this.setState({ errors });
        }
      })
      .catch((err) => console.log(err));

    event.currentTarget.reset();
  };
  render() {
    const { errors } = this.state;
    const isLoading = this.state.loading;
    return (
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
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.titleStyle}> {i18n.t('Welcome')} </h2>

          <div className='contactbox'>
            <div style={styles.errorStyle}>
              {errors.map((error) => (
                <span className='errormessage' key={error}>
                  {error}
                </span>
              ))}
            </div>
            <form onSubmit={this.login}>
              <label for='inp' class='inp'>
                <input
                  name='email'
                  value={this.state.email}
                  onChange={(evt) => this.setState({ email: evt.target.value })}
                  autoCapitalize='none'
                  type='email'
                  id='inp'
                  placeholder='&nbsp;'
                />
                <span class='label'>Email</span>
                <span class='border' />
              </label>

              <label for='email' class='inp'>
                <input
                  id='email'
                  name='password'
                  value={this.state.password}
                  onChange={(evt) =>
                    this.setState({ password: evt.target.value })
                  }
                  type='password'
                  placeholder='&nbsp;'
                />
                <span class='label'>Password</span>
                <span class='border' />
              </label>
              <label class='inp'>
                <div style={{ textAlign: 'right' }}>
                  <a href='/passwordreset' style={styles.linkStyle}>
                    {i18n.t('Forgot password')}
                  </a>
                </div>
              </label>
              {isLoading ? (
                <div style={{ marginTop: '1.5em', marginBottom: '1em' }}>
                  <div class='sp sp-circle'></div>
                  {/*   <button type='submit' className='loginbutton'>
                    {i18n.t('Loading...')}
                  </button> */}
                </div>
              ) : (
                <div style={{ marginTop: '1.5em', marginBottom: '1em' }}>
                  <button type='submit' className='loginbutton'>
                    {i18n.t('Login')}
                  </button>
                </div>
              )}
              {/*  <div style={{ marginTop: '1.5em', marginBottom: '1em' }}>
                <button type='submit' className='loginbutton'>
                  {i18n.t('Login')}
                </button>
              </div> */}

              <div style={{ fontFamily: 'Sofia Pro' }}>
                Don't have an account?{' '}
                <a href='/register' style={styles.linkStyle}>
                  {i18n.t('Sign up.')}
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
