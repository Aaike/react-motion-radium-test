import React, { Component, PropTypes } from 'react';
import Radium from 'radium';
import _ from 'lodash';

@Radium
export class Item extends Component {

  static propTypes = {
    onClose: PropTypes.func,
    style: PropTypes.object,
    label: PropTypes.any,
    children: PropTypes.any
  };

  getStyles() {
    return {
      container: {
        lineHeight: '2.7rem'
      },
      span: {
        marginTop: '.2rem',
        display: 'inline-block'
      },
      leftButton: {
        height: '100%',
        width: '100%',
        textAlign: 'left',
        paddingLeft: '1rem'
      },
      rightButton: {
        background: '#ccc',
        position: 'absolute',
        top: 0,
        right: 0,
        cursor: 'pointer',
        height: '48px',
        width: '48px',
      },
      rightIconStyle: {
        color: 'red'
      }

    };
  }

  _handleRightButtonClick(e) {
    if(e.type=="mouseup" || e.type=="touchend") return;
    if (this.props.onClose) this.props.onClose(e);
  }

  render() {
    let styles = _.merge(this.getStyles(), this.props.style || {});
    return (<div style={styles.container} >
      <button
        style={ styles.leftButton }
        icon="home"
      >
        <span style={styles.span}>{this.props.label} {this.props.children}</span>
      </button>
      <button
        onClick={ this._handleRightButtonClick.bind(this) }
        onTouchTap={ this._handleRightButtonClick.bind(this) }
        style={ styles.rightButton }
      >
        X
      </button>
    </div>);
  }
}
