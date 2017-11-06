import React from 'react';
import ListAddress from './ListAddress';
import 'bootstrap/dist/css/bootstrap.min.css';
require('assets/styles/vendor/font-awesome/scss/font-awesome.scss');
require('assets/styles/base/_base.scss');

const App = () => {
  return (
    <div className="container">
      <header className="container container-fluid text-center">
        <h1>Simple address application</h1>
      </header>
      <ListAddress />
    </div>
  )
}
export default App;
