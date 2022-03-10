import React from "react";
import { CardElement, injectStripe } from 'react-stripe-elements';

const createOptions = (fontSize) => {
    return {
      style: {
        base: {
          fontSize,
          color: '#424770',
        },
        invalid: {
          color: '#9e2146',
        },
      },
    };
  };

  
class StripePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        complete: false
    };
    this.processStripe = this.processStripe.bind(this);
  }

  processStripe = () => {
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((payload) => this.props.handleStripePayment(payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  }

  render() {
    return (
        <div className="payment-box">
            <CardElement
            {...createOptions("15px")} />
            <button onClick={this.processStripe}>Pay Now</button>
        </div>
    );
  }
}

export default injectStripe(StripePayment);
