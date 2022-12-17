import { Component } from 'react';

import error from '../../resources/img/error.png';

class ErrorMessage extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={error} style={{ height: '100px' }} alt="ERROR" />
      </div>
    );
  }
}

export default ErrorMessage;
