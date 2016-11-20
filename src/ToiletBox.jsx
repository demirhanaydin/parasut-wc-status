import React from 'react';
import 'whatwg-fetch'
import Toilet from './Toilet.jsx';

export default class ToiletBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toilets: []
    };
  }

  componentDidMount() {
    this.serverRequest = this.loadToilets();
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  loadToilets() {
    const self = this
    return fetch('/toilets').then(function(response) {
      return response.json();
    }).then(function(json) {
      self.setState({toilets: json});
    });
  }

  render() {
    const { socket } = this.props;
    return(
      <div className='toilet-app'>
        {this.state.toilets.map(function(toilet) {
          return <Toilet
                    key={toilet.name}
                    name={toilet.name}
                    location={toilet.location}
                    gender={toilet.gender}
                    initialStatus={toilet.status}
                    socket={socket}/>
        })}
      </div>
    )
  }
}
