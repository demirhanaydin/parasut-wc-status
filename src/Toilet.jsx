import React from 'react';
import ToiletSign from './ToiletSign.jsx';

export default class Toilet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.initialStatus
    };
  }

  componentDidMount() {
    const self = this;
    this.props.socket.on('status', function(data){
      if(data.name === self.props.name) {
        console.log(data.name, '->', data.status);
        self.setState({status: data.status});
      }
    });
  }

  classNames() {
    return "status-check toilet " + this.props.name + ' ' + this.state.status;
  }

  render() {
    return (
      <div className={this.classNames()}>
        <div className='toilet-content'>
          <ToiletSign status={this.state.status} gender={this.props.gender}/>
          <h1>{this.props.location}</h1> <h1 className='status-text'>{this.state.status}</h1>
        </div>
      </div>
    );
  }
}
