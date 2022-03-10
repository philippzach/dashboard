import React from 'react';
import i18n from '../i18n';

class Language extends React.Component {
  render() {
    return (
      <div>
        <button onClick={() => i18n.changeLanguage('de')}>de</button>
        <button onClick={() => i18n.changeLanguage('en')}>en</button>
      </div>
    );
  }
}

export default Language;
