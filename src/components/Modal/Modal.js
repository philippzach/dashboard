import React from 'react';

import '../../styles/modal.css';
import i18n from '../../i18n';

const Modal = (props) => {
    return (
        <div>
            <div className="modal-wrapper"
                 style={{
                     transform: props.show ? 'translateY(0vh)' : 'translateY(-100vh)',
                     opacity: props.show ? '1' : '0'
                 }}>
                <div className="modal-header">
                    <h3>{props.header}</h3>
                    <span className="close-modal-btn" onClick={props.close}>×</span>
                </div>
                <div className="modal-body">
                    <p>
                        {props.children}
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={props.close}>{i18n.t('Close')}</button>
                    <button className="btn-continue" onClick={props.functionExecute}>{i18n.t('Continue')}</button>
                </div>
            </div>
        </div>
    )
}

export default Modal;
