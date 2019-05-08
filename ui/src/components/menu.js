import React, { Component } from 'react';

import '../styles/menu.css';

class Input extends Component {
  render() {
    return (
      <div className='menu-content'>
        <div className='menu-nav'>
          <div onClick={() => this.props.toggleHandler()} className='hide-menu'></div>
        </div>
        <div className='input-container'>
      	 <div className='input-item'>
            <div className='inline-icon'>
              <div className='input-text'>USER ID</div>
            </div>
            <input 
              placeholder='Enter your ID'
              onChange={this.props.idInputHandler.bind(this)}
            />
          </div>
          <div className='input-item'>
            <div className='inline-icon'>
              <div className='input-text'>FAVORITE MOVIE</div>
            </div>
            <input 
              placeholder='Enter your favorite movie'
              onChange={this.props.favInputHandler.bind(this)}
            />
          </div>
        </div>
        <div className='search-btn' onClick={() => this.props.searchHandler()}>{this.props.searchBtnContent}</div>
      </div>
    );
  }
}

export default Input;