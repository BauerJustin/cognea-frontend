import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import * as serviceWorker from './serviceWorker';
import { PublicClientApplication, EventType, InteractionType } from "@azure/msal-browser";
import { msalConfig } from "./authConfig.js";
import { MsalProvider, MsalAuthenticationTemplate } from '@azure/msal-react';

const msalInstance = new PublicClientApplication(msalConfig);

if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

msalInstance.addEventCallback((event) => {
  if ((event.eventType === EventType.LOGIN_SUCCESS || event.eventType === EventType.ACQUIRE_TOKEN_SUCCESS || event.eventType === EventType.SSO_SILENT_SUCCESS)
    && event.payload.account) {
    msalInstance.setActiveAccount(event.payload.account);
  }
});

ReactDOM.render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <App />
      </MsalAuthenticationTemplate>
    </MsalProvider>
  </BrowserRouter>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();