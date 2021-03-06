import React, { Component } from "react";
import logo from './logo.svg';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import './components/moviedetail.css'
import MoviePlayground from "./components/MoviePlayground.js";
import NaviBar from "./components/NaviBar.js"
import MovieSidePage from "./components/MovieSidePage"

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isClose: false,
      routerUrl: "/",
      movieDetail: undefined,
      showMovieDetail:false,
    };

    this.gotoHomePage = this.gotoHomePage.bind(this)
    this.gotoAllMoviePage = this.gotoAllMoviePage.bind(this)
    this.gotoWatchListPage = this.gotoWatchListPage.bind(this)
    this.gotoMovieCategoryPage = this.gotoMovieCategoryPage.bind(this)
    this.gotoSearchPage = this.gotoSearchPage.bind(this)
    this.hideMovieSidePage = this.hideMovieSidePage.bind(this)
    this.startHideMovieSidePage = this.startHideMovieSidePage.bind(this)
  }

  gotoHomePage() {
    var newUrl = "/"
    this.setState({
      routerUrl: newUrl
    })
    
  }

  gotoAllMoviePage() {
    var newUrl = "/movie"
    this.setState({
      routerUrl: newUrl
    })
  }

  gotoWatchListPage() {
    var newUrl = "/watchlist"
    this.setState({
      routerUrl: newUrl
    })
  }

  gotoMovieCategoryPage(category) {
    var newUrl = "/movie/" + category
    this.setState({
      routerUrl: newUrl
    })
  }

  gotoSearchPage(searchKey) {
    var newUrl = "/search/" + searchKey
    this.setState({
      routerUrl: newUrl
    })
  }

  // avoid mutiple refresh
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.routerUrl !== this.state.routerUrl || nextState.movieDetail !== this.state.movieDetail || nextState.showMovieDetail !== this.state.showMovieDetail || nextState.isClose !== this.state.isClose) {
      return true
    } else {
      return false
    }
  }

  showMovieSidePage(movie) {
    console.log("App id:", movie.id)
    this.setState({
      movieDetail: {...movie},
      showMovieDetail:true,
    })      
  }

  startHideMovieSidePage() {
    console.log("startHideMovieSidePage, ",this.state.isClose)
    this.setState({
      isClose: true,
    }) 
  }

  hideMovieSidePage() {
    this.setState({
      isClose: false,
      showMovieDetail: !this.state.showMovieDetail,
      movieDetail: undefined,
    }) 
  }

  render() {
    const isMovieNull = this.state.movieDetail === undefined;
    let movieDetail = null;
    if (isMovieNull) {
      movieDetail = <div></div>
    } else {
      movieDetail = <div className={this.state.showMovieDetail ? "modal display-block" : "modal display-none"} onClick={this.startHideMovieSidePage}>
        <MovieSidePage showDetail={this.state.showMovieDetail} movie={this.state.movieDetail} isClose={this.state.isClose} hidePage={this.hideMovieSidePage} startHideDetailPage={this.startHideMovieSidePage}/>
        </div>
    }
    return (
        <div>
          <div className="topnavi">
            <NaviBar style={{ position: "sticky" }} 
            gotoHomePage={this.gotoHomePage}
            gotoAllMoviePage={this.gotoAllMoviePage}
            gotoWatchListPage={this.gotoWatchListPage}
            gotoMovieCategoryPage={this.gotoMovieCategoryPage}
            gotoSearchPage={this.gotoSearchPage}
            />
          </div>
          <div className="main">
            <MoviePlayground routerUrl={this.state.routerUrl} showDetail={this.showMovieSidePage.bind(this)}/>
            {movieDetail}
          </div>
        </div>
    );
  }
}




export default App;
