import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import customStyles from '../../styles/styles';
import i18n from '../../i18n';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default class Cashout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      valueTokens: 0,
      valueEur: 0,
      valueNetEuro: 0,
    };
  }

  changeTokenValue = (evt, type) => {
    const re = /^\d*\.?\d*$/;
    if (evt.target.value === '' || re.test(evt.target.value)) {
      var value = evt.target.value;

      if (type === 'eur') {
        this.setState({
          valueEur: value,
          valueTokens: ((value / 1.275) * 1.5).toFixed(2),
          valueNetEuro: (value / 1.275).toFixed(2),
        });
      } else {
        this.setState({
          valueTokens: value,
          //valueEur: value,
          //valueNetEuro: (value / 1.275).toFixed(2)
        });
      }
    }
  };

  handleClickOpen = () => {
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };

  processCaseOut = () => {
    if (this.props.handleCaseOut(this.state.valueEur))
      this.setState({ show: false });
  };
  processCreditConvert = () => {
    if (this.props.handleCreditConvert(this.state.valueTokens))
      this.setState({ show: false });
  };

  render() {
    return (
      <div>
        <button className='loginbutton' onClick={this.handleClickOpen}>
          {i18n.t('Cash Out')}
        </button>

        <Dialog
          onClose={this.handleClose}
          aria-labelledby='customized-dialog-title'
          open={this.state.show}
        >
          <DialogContent className='cashoutModal'>
            <h4 className='text-center'>{i18n.t('Cash Out Your Earnings')}</h4>
            <hr />
            <p className='text-center pl-2 pr-2'>{i18n.t('cashout_text_1')}</p>
            <hr />
            <h4 className='text-center pb-3'>{i18n.t('Choose your Option')}</h4>
            <div className='row align-items-center'>
              <div className='col-sm-5 pr-sm-1'>
                <label>
                  <strong>{i18n.t('Euro Cash Out')}</strong>
                </label>
                <input
                  value={this.state.valueEur}
                  name='valueEur'
                  className='inputStyle text-right'
                  type='text'
                  autoComplete='off'
                  onChange={(evt) => this.changeTokenValue(evt, 'eur')}
                  placeholder={i18n.t('00')}
                />

                <button
                  type='button'
                  onClick={this.processCaseOut}
                  style={customStyles.greenButtonStyle}
                >
                  {i18n.t('Cash Out')}
                </button>

                <div style={{ marginTop: 5 }}>-27,5% KESt.</div>
                <div>
                  {i18n.t('Net Cashout')}: {this.state.valueNetEuro}
                </div>
              </div>
              <div className='col-sm-2 text-center pt-2'>{i18n.t('OR')}</div>
              <div className='col-sm-5 pl-sm-1'>
                <label>
                  <strong>{i18n.t('Convert to Credits')}</strong>
                </label>
                <input
                  value={this.state.valueTokens}
                  name='valueTokens'
                  className='inputStyle text-right'
                  type='text'
                  autoComplete='off'
                  onChange={(evt) => this.changeTokenValue(evt, 'token')}
                  placeholder={i18n.t('00')}
                />
                <button
                  type='button'
                  onClick={this.processCreditConvert}
                  style={customStyles.greenButtonStyle}
                >
                  {i18n.t('Convert')}
                </button>
                <div style={{ marginTop: 5 }}>&nbsp;</div>
                <div>&nbsp;</div>
              </div>
            </div>
            {this.state.balance}
            <hr />
            <p style={customStyles.smallText}>
              {i18n.t(
                'We Will take care of you request within the next 48 hours'
              )}
            </p>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
