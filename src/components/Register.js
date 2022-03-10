import React from "react";

import RegisterForm from "./RegisterForm"
import { withRouter } from 'react-router-dom';

class Register extends React.Component {

  componentWillMount() {
    let token = localStorage.getItem('token');
    if (token) {
      this.props.history.push('/dashboard')
    }
  }

  render() {
    return (
      <div className="register">
         <RegisterForm history = {this.props.history} />
      </div>
    );
  }
}

export default withRouter(Register);
