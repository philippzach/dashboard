import React from "react";
import i18n from "../i18n";

class PurchaseCurrencySelect extends React.Component {
  render() {
    return (
        <select
          name="purchasecurrency"
          style={this.props.style}
          onChange={evt => this.props.onChange(evt.target.value)}
          value={this.props.value}
          >

        <option value="XX">{i18n.t('Purchase Currency')}</option>
        <option value="ETH">{i18n.t('ETH')}</option>
        <option value="BTC">{i18n.t('BTC')}</option>
        <option value="EUR">{i18n.t('EUR')}</option>
        <option value="GBP">{i18n.t('GBP')}</option>

    </select>
    );
  }
}

export default PurchaseCurrencySelect;



