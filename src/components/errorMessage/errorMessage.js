import { Component } from 'react';

class ErrorMessage extends Component {
  constructor(props) {
    super(props);

    this.errorIamge = this.props.errorIamge;
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={this.errorIamge} style={{ height: '100px' }} alt="ERROR" />
      </div>
    );
  }
}

export default ErrorMessage;
