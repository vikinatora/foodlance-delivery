import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './components/MapButtons/MapButtonsStyles.css';
import './components/OrderForm/OrderFormStyles.css';
import './components/Navigation/NavigationStyles.css';
import './components/Login/LoginFormStyles.css';
import './components/Profile/ProfileStyles.css';

import 'antd/dist/antd.css'; 
import App from './App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
 