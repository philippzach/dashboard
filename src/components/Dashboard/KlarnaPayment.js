import React from "react";
import paymentMethodsMock from "./klarna.json";
import {
  API_URL,
  APP_ID,
  ASSET_ID,
  MASTER_KEY,
  ENCRYPTION_KEY,
} from '../../config';

class KlarnaPayment extends React.Component {
  constructor(props) {
    super(props);
    this.initAdyenCheckout = this.initAdyenCheckout.bind(this);
  }

  componentDidMount() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.4.0/adyen.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src =
      "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.4.0/adyen.js";
    script.async = true;
    script.onload = this.initAdyenCheckout; // Wait until the script is loaded before initiating AdyenCheckout
    document.body.appendChild(script);

  }

  initAdyenCheckout() {
    const configuration = {
      locale: "de-DE",
      environment: "test",
      originKey: "pub.v2.8015385746871252.aHR0cHM6Ly9kYXNoYm9hcmQuZWxvb3Aub25l.0HSfv9AdVA-QcpvC7ZPBr1QKHFxZO13muD037j8gK-c",
      paymentMethodsResponse: {
        "paymentMethods": [
           {
            "name": "Online bank transfer.",
            "supportsRecurring": false,
            "type": "directEbanking"
           }
        ]
      },
      amount: {
        value: (this.props.amount * 100),
        currency: "EUR"
      }
    };

    const checkout = new window.AdyenCheckout(configuration);

    checkout
      .create("dropin", {
        onSubmit: (state, dropin) => {

        fetch('https://' + API_URL + '/functions/adyenpayment', {
        method: 'POST',
        headers: new Headers({
          'X-Parse-Application-Id': APP_ID,
          'X-Parse-REST-API-Key': MASTER_KEY,
          'Content-Type': 'application/json',
          'X-Parse-Session-Token': localStorage.getItem('token'),
        }),
        body: JSON.stringify({amount: configuration.amount, initData: state.data})
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
           console.log(data.result.redirect.url);
           window.location.href = data.result.redirect.url;

        })
        .catch((err) => console.log(err));

        },
        onAdditionalDetails: (state, dropin) => {
         // Not Used in this Implementation
        }
      })
      .mount(this.ref);
  }

  render() {
    return (
      <div
        ref={ref => {
          this.ref = ref;
        }}
      />
    );
  }
}

export default KlarnaPayment;
