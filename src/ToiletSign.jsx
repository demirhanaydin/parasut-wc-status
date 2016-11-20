import React from 'react';
import WomenSignBusy from './signs/WomenSignBusy.jsx';
import MenSignBusy from './signs/MenSignBusy.jsx';
import WomenSignAvailable from './signs/WomenSignAvailable.jsx';
import MenSignAvailable from './signs/MenSignAvailable.jsx';

export default class ToiletSign extends React.Component {
  busySign() {
    switch(this.props.gender) {
      case "women":
        return <WomenSignBusy />;
      case "men":
        return <MenSignBusy />;
    }
  }

  availableSign() {
    switch(this.props.gender) {
      case "women":
        return <WomenSignAvailable />;
      case "men":
        return <MenSignAvailable />;
    }
  }

  render() {
    return(
      <div>
        {(() => {
          switch (this.props.status) {
            case "busy":
              return <div>{this.busySign()}</div>
            case "available":
              return <div>{this.availableSign()}</div>
          }
        })()}
      </div>
    )
  }
}
