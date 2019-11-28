import React, { Component } from "react";

import "./moviebox.css";
import "./moviedetail.css"

import $ from "jquery";
import Animation from '../animation'
import { CSSTransition } from 'react-transition-group';
import { ColorExtractor } from "react-color-extractor";
import "react-circular-progressbar/dist/styles.css";

class MovieBox extends Component {
    state = {
        index: 0,
        showDetail: false,
        slideIn: false,
        bgColor: "#3caf8e",
        titleColor:"#edb05b",
        addButtonColor: "#000000",
        crew: [],
        cast: [],
        afterCast: [],
        similarMovies: [],
        afterSimilarMovies: [],
        recommendMovies: [],
        afterRecommendMovies: [],
        backgrounds: [],
        afterBackgrounds: [],
        isSimilarMovieReady: false,
        isRecommendMovieReady: false,
        isBackgroundsReady: false,
        isTopBilledCastReady: false,
    };

    handleNormalClick(event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    handleRemoveWatchList(event) {
        var popconfirm = window.confirm("Do you want to delet this movie from watchlist?")
        if (popconfirm) {
            var id = this.props.movie.id;
            this.removeMovieFromWatchList(id);
        }
    }

    // remove the movie from watchlist
    removeMovieFromWatchList(id) {
        var localWatchlist = JSON.parse(localStorage.getItem("motiveWatchList"));
        localWatchlist = localWatchlist.filter(function (e) {
            return e.id !== id;
        });
        localStorage.setItem("motiveWatchList", JSON.stringify(localWatchlist));
        this.props.showWatchlist();
    }

    hideMovieDetail(event) {
        if (event.currentTarget.id === "blure" && this.state.showDetail) {
            this.setState({
                slideIn: false,
            });
        }
    };

    handleAddMoveInWatchList(event) {
        var id = this.props.movie.id;
        this.addToWatchList(id);
        alert("Done. Alread add movie to watch list.")
    }
    // add the movie in watchlist
    addToWatchList(id) {
        var watchMovies = {
            id: id,
            title: this.props.movie.title,
            poster: this.props.movie.poster,
            overview: this.props.movie.overview,
            release_date: this.props.movie.release_date,
            vote_average: this.props.movie.vote_average
        };

        var localWatchlist = [];
        if (localStorage.getItem("motiveWatchList") !== null) {
            localWatchlist = Array.from(
                JSON.parse(localStorage.getItem("motiveWatchList"))
            );
            if (localWatchlist) {
                localWatchlist.push(watchMovies);
                localWatchlist = this.checkAvailable(localWatchlist, "id");
                localStorage.setItem("motiveWatchList", JSON.stringify(localWatchlist));
            }
        } else {
            localWatchlist.push(watchMovies);
            localStorage.setItem("motiveWatchList", JSON.stringify(localWatchlist));
        }
    }

    checkAvailable(watchlist, comp) {
        const unique = watchlist
            .map(e => e[comp])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => watchlist[e])
            .map(e => watchlist[e]);
        return unique;
    }

    
    showMovieDetail = () => {
        console.log("click");
        this.props.openDetail(this.props.movie)
    };

    onEnterCalled() {
        if (this.state.showDetail === false && this.state.slideIn) {
            this.setState({
                showDetail: true,
            })
        }
    }

    onExitedCalled() {
        if (this.state.showDetail && !this.state.slideIn) {
            this.setState({
                showDetail: false,
            })
        }
    }


    render() {
        var scoreClassName = "postscore"
        if (this.props.movieindex === 0) {
            scoreClassName = "postscore scprenum1"
        } else if (this.props.movieindex === 1) {
            scoreClassName = "postscore scprenum2"
        } else if (this.props.movieindex === 2) {
            scoreClassName = "postscore scprenum3"
        }
        const showHideClassName = this.state.showDetail ? "modal display-block" : "modal display-none";
        const processSlice = this.props.movie.vote_average * 10 / 5
        return (
            <div key={this.props.movie.id} className={this.props.movie.isShow === true ? "col-xs-6 col-sm-3 visibility-visible marginbottom1rem moviebox" : "display-none"}>
                <div className="card md-3 shadow-sm" id={this.props.movie.id} onClick={this.props.isWatchListMode === false ? this.showMovieDetail.bind(this) : this.handleRemoveWatchList.bind(this)} >
                    <div className="poster hovereffect">
                        <img
                            class="postimage"
                            id={this.props.movie.id}
                            src={this.props.movie.poster}
                        />
                        <div class="overlay">
                            <p className="textjustify">{this.props.movie.overview}</p>
                        </div>
                        <div class={scoreClassName}>
                            <strong class="postscoretext">{this.props.movie.vote_average}</strong>
                        </div>
                    </div>
                    <div class="titlerow">
                        <p class="titlerowleft">{this.props.movie.title}</p>
                        <p class="titlerowright">{this.props.movie.release_date}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default MovieBox;
