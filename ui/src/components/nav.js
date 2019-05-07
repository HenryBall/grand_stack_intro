import React, { Component } from 'react';

import '../styles/nav.css';

class Header extends Component {
  render() {
    return (
      <div className='nav-bar'>
      	<div onClick={() => this.props.toggleHandler()} className='open-menu'></div>
        <div className='nav-text'>RECOMENDATIONS</div>
      </div>
    );
  }
}

export default Header;