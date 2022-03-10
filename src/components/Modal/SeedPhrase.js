import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { Trans } from 'react-i18next';

import customStyles from '../../styles/styles';
import i18n from '../../i18n';

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

export default class SeedPhrase extends React.Component {
  constructor(props) {
    super(props);
  }

  copyCodeToClipboard = () => {
    const el = this.seedtext
    el.select()
    document.execCommand("copy")
  }
  handleClose = () => {
    this.props.handleClose();
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          disableBackdropClick={true}
          disableEscapeKeyDown={true}
          aria-labelledby='customized-dialog-title'
        >
          <DialogContent className='p-5'>
            <h4 className='text-center p-3'>{i18n.t('Save backup phrase')}</h4>
            <p className='text-center pl-2 pr-2' style={customStyles.textGray}>
              {i18n.t('save_phrase_text_1')}
            </p>
            <p className='text-center p-3'>
              {i18n.t('Please carefully write down these 15 words or ')}
              <CopyToClipboard text={this.props.seedPharse}>
                <a href="#">{i18n.t('copy them')}</a>
              </CopyToClipboard>
            </p>
            <p
              ref={(el) => this.seedtext = el} 
              style={customStyles.seedPharse}>
              {this.props.seedPharse}
            </p>
            <button
              type='button'
              onClick={this.handleClose}
              style={customStyles.greenFullButtonStyle}
            >
              {i18n.t('Yes, I have written it down.')}
            </button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
