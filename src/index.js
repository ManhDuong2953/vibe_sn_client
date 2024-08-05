import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import store from './redux/Store/store';
import { Provider } from 'react-redux';
import { app } from './config/firebase.config';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

