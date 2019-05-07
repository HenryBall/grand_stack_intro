import React, { Component } from 'react';

import '../styles/movies.css';

class Movies extends Component {

  constructor(props) {
    super(props);
      this.state = {
        movieIdx: 0
    };
  }
 
  render() {
    return (
      <div>
        <div className={this.props.movies.length === 0 ? '' : 'movie-feed'} id='scroll-container'>
           {this.props.movies.map((movie, idx) => 
            <div key={movie._id} className='movie' id={idx.toString()}>
              <img src={ movie.posterURL } alt=''/>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Movies;