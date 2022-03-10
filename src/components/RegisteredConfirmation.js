import React from 'react';
import styles from '../styles/styles';
import i18n from '../i18n';

class RegisteredConfirmation extends React.Component {
  login = (event) => {
    event.preventDefault();

    this.props.history.push('/login');
  };
  render() {
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
          <h2 style={styles.titleStyle}>
            {' '}
            {i18n.t('Registration Successful')}{' '}
          </h2>
          <p style={styles.instructionStyle}>
            {' '}
            {i18n.t(
              'Check your email for a verification link, once clicked, you will be able to login.'
            )}{' '}
          </p>
          <form className='user-create' onSubmit={this.login}>
            <div style={styles.inputBoxStyle}>
              <button type='submit' className='loginbutton'>
                {i18n.t('Login')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default RegisteredConfirmation;
