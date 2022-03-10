import React from 'react';
import styles from '../styles/styles';
import i18n from '../i18n';
import { withRouter } from 'react-router-dom';

class ResetConfirmation extends React.Component {
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
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className='contactbox'>
          <h2 style={styles.titleStyle}> {i18n.t('Reset Successful')} </h2>
          <p style={styles.instructionStyle}>
            {' '}
            {i18n.t(
              'Check your email for a reset link that will take you to a page to reset your password. Once complete, you may login.'
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

export default withRouter(ResetConfirmation);
