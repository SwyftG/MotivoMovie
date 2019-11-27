import React, { Component } from "react";



class NaviBar extends Component {
    state = {};

    handleSumbit(event) {
        let searchKey = this.refs.searchKey.value;
        this.props.gotoSearchPage(searchKey)
    }

    handleHomepage() {
        this.props.gotoHomePage();
    }

    handleAllMovie() {
        this.props.gotoAllMoviePage();
    }

    handleWatchList() {
        this.props.gotoWatchListPage();
    }

    handleCategoryMovie(category) {
        this.props.gotoMovieCategoryPage(category);
    }

    handleEnterKey = (e) => {
        if(e.nativeEvent.keyCode === 13){
             this.handleSumbit()
        }
    }

    render() {
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top" role="navigation">
                    <p class="navbar-brand" onClick={this.handleHomepage.bind(this)}>MotivoMovie</p>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item active">
                                <p class="nav-link" onClick={this.handleAllMovie.bind(this)}>All Movies <span class="sr-only">(current)</span></p>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Categorys
        </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" onClick={this.handleCategoryMovie.bind(this, "popular")}>Popular</a>
                                    <a class="dropdown-item" onClick={this.handleCategoryMovie.bind(this, "top_rated")}>Top Rated</a>
                                    <a class="dropdown-item" onClick={this.handleCategoryMovie.bind(this, "upcoming")}>Uncoming</a>
                                    <a class="dropdown-item" onClick={this.handleCategoryMovie.bind(this, "now_playing")}>Now Playing</a>
                                </div>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" onClick={this.handleWatchList.bind(this)}>Watch List</a>
                            </li>
                        </ul>
                        <div class="form-inline my-2 my-lg-0" >
                            <input class="form-control mr-sm-2" type="text" placeholder="Search Movie" ref="searchKey" onKeyPress={this.handleEnterKey}/>
                            <button class="btn btn-outline-success my-2 my-sm-0" type="submit" onClick={this.handleSumbit.bind(this)}>Search</button>
                        </div>
                    </div>
                </nav>

            </div>
        );
    }
}

export default NaviBar;

