import React, { Component } from 'react';
import axios from 'axios';

import Nav from './components/nav';
import Menu from './components/menu';
import Movies from './components/movies';

import './App.css';

const api = axios.create({
  baseURL: 'http://13.57.31.93:80/',
  headers: {},
});

const GET_POPULAR_MOVIES = `
  {
    Movie(title: "Transformers") {
      popular {
        _id
        id
        imdbID
        plot
        posterURL
        title
        tmdbID
        imdbRating
        metacriticRating
        rottenTomatoesRating
      }
    }
  }
`;

const GET_RECENT_MOVIES = `
  {
    Movie(title: "Transformers") {
      recent {
        _id
        id
        imdbID
        plot
        posterURL
        title
        tmdbID
        imdbRating
        metacriticRating
        rottenTomatoesRating
      }
    }
  }
`;

const GET_SIMILAR_MOVIES = (title) => `
  {
    Movie(title: "${title}") {
      similar {
        _id
        id
        imdbID
        plot
        posterURL
        title
        tmdbID
        imdbRating
        metacriticRating
        rottenTomatoesRating
      }
    }
  }
`;

const GET_MOVIES_FOR_USER = (userId) => `
  {
    User(id: "${userId}") {
      recomended {
        _id
        id
        imdbID
        plot
        posterURL
        title
        tmdbID
        imdbRating
        metacriticRating
        rottenTomatoesRating
      }
    }
  }
`;

class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
        popMovies: [],
        simMovies: [],
        recoMovies: [],
        recentMovies: [],
        userId: '',
        favMovie: '',
        menuActive: false,
    };
  }

  componentDidMount() {
    this.getPopularMovies();
    this.getRecentMovies();
  }

  searchHandler() {
    this.getSimilarMovies();
    this.getMoviesForUser();
  }

  idInputHandler(event) {
    this.setState({userId: event.target.value});
  }

  favInputHandler(event) {
    this.setState({favMovie: event.target.value});
  }

  toggleHandler() {
    this.setState({menuActive: !this.state.menuActive});
  }

  getPopularMovies = () => {
    api
      .post('', { query: GET_POPULAR_MOVIES })
      .then(result => this.setState({popMovies: result.data.data.Movie[0].popular}))
      .catch(error => console.log(error));
  };

  getRecentMovies = () => {
    api
      .post('', { query: GET_RECENT_MOVIES })
      .then(result => this.setState({recentMovies: result.data.data.Movie[0].recent}))
      .catch(error => console.log(error));
  };

  getSimilarMovies = () => {
    api
      .post('', { query: GET_SIMILAR_MOVIES(this.state.favMovie) })
      .then(result => this.setState({simMovies: result.data.data.Movie[0].similar}))
      .catch(error => console.log(error));
  };

  getMoviesForUser = () => {
    api
      .post('', { query: GET_MOVIES_FOR_USER(this.state.userId) })
      .then(result => this.setState({recoMovies: result.data.data.User[0].recomended}))
      //.then(result => console.log(result))
      .catch(error => console.log(error));
  };

  render() {
    return (
      <div className='app'>
        <Nav toggleHandler={this.toggleHandler.bind(this)}/>
        <div className={this.state.menuActive === true ? ['menu-active'].join(' ') : 'menu-hidden'}>
          <Menu
            idInputHandler={this.idInputHandler.bind(this)}
            favInputHandler={this.favInputHandler.bind(this)}
            toggleHandler={this.toggleHandler.bind(this)}
            searchHandler={this.searchHandler.bind(this)}
          />
        </div>
        <div className='flex-row'>
          <div className='movies'>
            <div className='catagory-text'>{this.state.popMovies.length === 0 ? '' : 'Popular Movies'}</div>
            <Movies movies={this.state.popMovies}/>
            <div className='catagory-text'>{this.state.recentMovies.length === 0 ? '' : 'Recent Movies'}</div>
            <Movies movies={this.state.recentMovies}/>
            <div className='catagory-text'>{this.state.simMovies.length === 0 ? '' : 'Beacuse You Watched ' + this.state.favMovie}</div>
            <Movies movies={this.state.simMovies}/>
            <div className='catagory-text'>{this.state.recoMovies.length === 0 ? '' : 'Recomended For You'}</div>
            <Movies movies={this.state.recoMovies}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;