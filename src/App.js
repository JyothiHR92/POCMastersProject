import React, { Component } from 'react';
import './App.css';
import { withAuthenticator, SumerianScene } from 'aws-amplify-react';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import '@aws-amplify/ui/dist/style.css';

Amplify.configure(awsmobile);

class App extends Component {
  render() {
    return (
      <div style={{ height: '100vh' }}>
        <SumerianScene sceneName='StorebotHost' />
      </div>
    );
  }
};

export default withAuthenticator(App, { includeGreetings: true });
