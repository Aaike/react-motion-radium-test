import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './Demo';
import injectTapEventPlugin from 'react-tap-event-plugin';

//Needed for React Developer Tools
window.React = React;

//Inject the tap event plugin to handle onTouchTap events
injectTapEventPlugin();

ReactDOM.render(<Demo />, document.querySelector('#root'));
