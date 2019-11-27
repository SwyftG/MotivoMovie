import React, { Component } from "react";
import logo from './logo.svg';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import MoviePlayground from "./components/MoviePlayground.js";
import NaviBar from "./components/NaviBar.js"

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      routerUrl: "/",
    };

    this.gotoHomePage = this.gotoHomePage.bind(this)
    this.gotoAllMoviePage = this.gotoAllMoviePage.bind(this)
    this.gotoWatchListPage = this.gotoWatchListPage.bind(this)
    this.gotoMovieCategoryPage = this.gotoMovieCategoryPage.bind(this)
    this.gotoSearchPage = this.gotoSearchPage.bind(this)
    
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
    if (nextState.routerUrl !== this.state.routerUrl) {
      return true
    } else {
      return false
    }
  }

  render() {

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
            <MoviePlayground routerUrl={this.state.routerUrl} />
          </div>
        </div>
    );
  }
}




export default App;
