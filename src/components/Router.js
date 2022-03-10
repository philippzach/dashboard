import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Dashboard from "./Dashboard";
import Register from "./Register";
import Login from "./Login";
import Buy from "./Dashboard/Buy";
import PasswordReset from "./PasswordReset";
import RegisteredConfirmation from "./RegisteredConfirmation";
import ResetConfirmation from "./ResetConfirmation";
import VerifyConfirmation from "./VerifyConfirmation"
import PurchaseConfirmation from "./Dashboard/PurchaseConfirmation"

const Router = () => (
<BrowserRouter>
  <Switch>
    <Route exact path="/register" component={Register} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/buy" component={Buy} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/" component={Login} />
    <Route exact path="/passwordreset" component={PasswordReset} />
    <Route exact path="/registrationconf" component={RegisteredConfirmation} />
    <Route exact path="/resetconf" component={ResetConfirmation} />
    <Route exact path="/verifyconf" component={VerifyConfirmation} />
    <Route exact path="/purchase_confirm" component={PurchaseConfirmation} />
  </Switch>
</BrowserRouter>

);

export default Router;
