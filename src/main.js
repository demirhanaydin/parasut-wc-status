import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import ToiletBox from './ToiletBox.jsx';

const socket = io(window.location.hostname + ":" + window.location.port );

ReactDOM.render(<ToiletBox socket={socket}/>, document.getElementById('content'));
