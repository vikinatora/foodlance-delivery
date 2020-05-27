import React from 'react';
import { LeafletMap } from "./components/Map/Map";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LoginForm } from './components/Login/LoginForm';
import { RegisterForm } from './components/Register/RegisterForm';
import { LayerContextProvider } from './context/LayerContext';
import { Profile } from './components/Profile/Profile';

function App() {
  return (
    <div className="App">
      <Router>
        <LayerContextProvider>
          <Switch>
            <Route path="/" exact component={LeafletMap} />
            <Route path="/login" exact component={LoginForm} />
            <Route path="/register" exact component={RegisterForm} />
            <Route path="/profile" exact component={Profile} />
          </Switch>
        </LayerContextProvider>
      </Router>

    </div>
  );
}

export default App;
