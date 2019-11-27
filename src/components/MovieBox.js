import React, { Component } from "react";

import "./moviebox.css";
import "./moviedetail.css"

import $ from "jquery";
import Animation from '../animation'
import { CSSTransition } from 'react-transition-group';
import { ColorExtractor } from "react-color-extractor";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
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
    //get the detail info of the movie
    getMovieDetail() {
        const urlString = "https://api.themoviedb.org/3/movie/" +
            this.props.movie.id +
            "?api_key=1e70c91a272209d404c18c8679f75072&append_to_response=credits";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var detail = searchResults;
                var release_date = detail.release_date.split("-");
                detail.release_date = release_date[0];
                var details = [];
                details.push(detail);

                var cast = detail.credits.cast;
                if (cast.length === 0) {
                    if (this.state.isTopBilledCastReady) {
                        this.setState({ isTopBilledCastReady: false })
                    }
                } else {
                    var afterCast = cast;

                    afterCast.forEach(cast => {
                        if (cast.profile_path !== null) {
                            cast.profile_path =
                            "https://image.tmdb.org/t/p/w185" + cast.profile_path;
                        } else {
                            cast.profile_path = "https://style.anu.edu.au/_anu/4/images/placeholders/person_8x10.png"
                        }
                        
                    });
                    if (afterCast.length > 5) {
                        this.setState({
                            cast: afterCast.slice(0, 5),
                            afterCast: afterCast,
                            isTopBilledCastReady: true
                        });
                    } else {
                        this.setState({
                            cast: afterCast,
                            afterCast: afterCast,
                            isTopBilledCastReady: true
                        });
                    }

                }

                var crew = detail.credits.crew;
                if (crew.length > 8) {
                    crew = crew.slice(0, 8);
                }

                this.setState({ detail: details });
                this.setState({ crew: crew });

            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    getSimilarMovie() {
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            this.props.movie.id +
            "/similar?api_key=1e70c91a272209d404c18c8679f75072&language=en-US";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var similar = searchResults.results;
                if (similar.length === 0) {
                    if (this.setState.isSimilarMovieReady) {
                        this.setState({ isSimilarMovieReady: false })
                    }
                    return
                }
                var afterSimilarMovies = similar;
                afterSimilarMovies.forEach(similarMovie => {
                    similarMovie.poster_path =
                        "https://image.tmdb.org/t/p/w185" + similarMovie.poster_path;
                });
                if (afterSimilarMovies.length > 5) {
                    this.setState({
                        similarMovies: afterSimilarMovies.slice(0, 5),
                        afterSimilarMovies: afterSimilarMovies,
                        isSimilarMovieReady: true
                    });
                } else {
                    this.setState({
                        similarMovies: afterSimilarMovies,
                        afterSimilarMovies: afterSimilarMovies,
                        isSimilarMovieReady: true
                    });
                }
            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    getRecommendMovie() {
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            this.props.movie.id +
            "/recommendations?api_key=1e70c91a272209d404c18c8679f75072&language=en-US";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var recommend = searchResults.results;
                if (recommend.length === 0) {
                    if (this.state.isRecommendMovieReady) {
                        this.setState({ isRecommendMovieReady: false })
                    }
                    return
                }
                var afterRecommendMovies = recommend;
                afterRecommendMovies.forEach(recommendMovie => {
                    recommendMovie.backdrop_path =
                        "https://image.tmdb.org/t/p/w500" + recommendMovie.backdrop_path;
                });
                if (afterRecommendMovies.length > 4) {
                    this.setState({
                        recommendMovies: afterRecommendMovies.slice(0, 4),
                        afterRecommendMovies: afterRecommendMovies,
                        isRecommendMovieReady: true
                    });
                } else {
                    this.setState({
                        recommendMovies: afterRecommendMovies,
                        afterRecommendMovies: afterRecommendMovies,
                        isRecommendMovieReady: true
                    });
                }
            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    handleAddMovieBlocks(movieBlock) {
        console.log("click handleAddMovieBlocks:", movieBlock)
        if (movieBlock === "recommend") {
            this.setState({
                recommendMovies: new Array(...this.state.recommendMovies, ...this.state.afterRecommendMovies.slice(this.state.recommendMovies.length, Math.min(this.state.recommendMovies.length + 2), this.state.afterRecommendMovies.length))
            })
        } else if (movieBlock === "similar") {
            this.setState({
                similarMovies: new Array(...this.state.similarMovies, ...this.state.afterSimilarMovies.slice(this.state.similarMovies.length, Math.min(this.state.similarMovies.length + 5), this.state.afterSimilarMovies.length))
            })
        } else if (movieBlock === "backgrounds") {
            this.setState({
                backgrounds: new Array(...this.state.backgrounds, ...this.state.afterBackgrounds.slice(this.state.backgrounds.length, Math.min(this.state.backgrounds.length + 5), this.state.afterBackgrounds.length))
            })
        } else if (movieBlock === "cast") {
            this.setState({
                cast: new Array(...this.state.cast, ...this.state.afterCast.slice(this.state.cast.length, Math.min(this.state.cast.length + 5), this.state.afterCast.length))
            })
        }

    }

    getBackgrounds() {
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            this.props.movie.id +
            "/images?api_key=1e70c91a272209d404c18c8679f75072&language=en-US&include_image_language=en";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var backgrounds = searchResults.posters;
                if (backgrounds.length === 0) {
                    if (this.state.isBackgroundsReady) {
                        this.setState({ isBackgroundsReady: false })
                    }
                    return
                }
                var afterBackgrounds = backgrounds

                afterBackgrounds.forEach(backdrop => {
                    backdrop.file_path =
                        "https://image.tmdb.org/t/p/w185" + backdrop.file_path;
                });
                if (afterBackgrounds.length > 5) {
                    this.setState({
                        backgrounds: afterBackgrounds.slice(0, 5),
                        afterBackgrounds: afterBackgrounds,
                        isBackgroundsReady: true
                    });
                } else {
                    this.setState({
                        backgrounds: afterBackgrounds,
                        afterBackgrounds: afterBackgrounds,
                        isBackgroundsReady: true
                    });
                }

            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    showMovieDetail = () => {
        console.log("click");
        this.getMovieDetail();
        this.getSimilarMovie();
        this.getRecommendMovie();
        this.getBackgrounds();
        this.setState({
            showDetail: true,
            slideIn: true,
        });
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

    getPosterColors(movie, colors) {
        this.setState({
            bgColor: colors[0],
            titleColor: colors[1],
            addButtonColor: colors[4],
        })

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
            <div key={this.props.movie.id} className={this.props.movie.isShow === true ? "col-xs-6 col-sm-3 visibility-visible marginbottom1rem" : "display-none"}>
                <div className={showHideClassName} onClick={this.hideMovieDetail.bind(this)} id="blure">
                    <MovieDetail showDetail={this.state.showDetail} handleClose={this.hideMovieDetail.bind(this)} handleNormalClick={this.handleNormalClick.bind(this)} slideIn={this.state.slideIn} onEnteredCalled={this.onEnterCalled.bind(this)} onExitedCalled={this.onExitedCalled.bind(this)} movieName={this.props.movie.title} bgColor={this.state.bgColor}>
                        <div class="row paddingtop_3">
                            <div class="col-xs-4 col-md-4 detailimage">
                                <a href={this.props.movie.poster.replace("w500", "w1280")} target="_blank">
                                    <ColorExtractor getColors={this.getPosterColors.bind(this, this.props.movie)}>
                                    <img
                                        class="detailimage-img"
                                        style={{ position: "relative" }}
                                        alt="poster"
                                        id={this.props.movie.id}
                                        src={this.props.movie.poster}
                                    />
                                    </ColorExtractor>
                                </a>
                            </div>
                            <div class="col-xs-7 col-md-7 detailinfo">
                                <div class="row marginleft0 margintop20">
                                    <p class="detailtitle" style={{color: this.state.titleColor}}>{this.props.movie.title}</p>
                                    <span>({this.props.movie.release_date === undefined ? "" : this.props.movie.release_date.substring(0, 4)})</span>
                                </div>
                                <div class="row marginleft0 margintop20">
                                    <div className="col-xs-1 circlebar">
                                        <CircularProgressbar value={this.props.movie.vote_average * 10} 
                                        text={`${this.props.movie.vote_average * 10}%`} 
                                        styles={buildStyles({
                                            textColor: "#fff",
                                            pathColor: "gold",
                                            trailColor: "white"
                                          })}
                                        />
                                    </div>
                                    <p class="col-xs-1 detailaddwatchlist padding0_10" onClick={this.handleAddMoveInWatchList.bind(this)} style={{color: this.state.addButtonColor}}>Add To WatchList</p>
                                </div>
                                <div class="margintop20">
                                    <p class="detailblocktitle" >OverView</p>
                                    <p className="detailblocktext textjustify" >{this.props.movie.overview}</p>
                                </div>
                                <div class={this.state.crew.length !== 0 ? "margintop20" : "hideblock"}>
                                    <p class="detailblocktitle" >Feature Crew</p>
                                    <div class="row marginleft0 stuffcard">
                                        {this.state.crew.map(function (crew, index) {
                                            return (
                                                <a key={crew.id} href={"https://www.themoviedb.org/person/" + crew.id + "-" + crew.name.replace(/ /g, "-")} target="_blank">
                                                    <div key={crew.id} className="col-xs-2 stuff">
                                                        {crew.name}
                                                        <p className="stuffjob">{crew.job}</p>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={this.state.isTopBilledCastReady === true ? "marginbottom20" : "marginbottom20 hideblock"}>
                            <div className="detailbigtitle">
                                <p class="detailblocktitle">Top Billed Cast</p>
                            </div>
                            <div className="row marginleft20 justify-content-md padding0_10">
                                {this.state.cast.map(function (cast, index) {
                                    return (
                                        <div key={cast.id} className="col-xs-2 padding5 castcard castdiv">
                                            <a className="height100" href={"https://www.themoviedb.org/person/" + cast.id + "-" + cast.name.replace(/ /g, "-")} target="_blank">
                                                <div className="card xs shadow-sm height100" key={index}>
                                                    <div className="card-img-top carddiv height90">
                                                        <img className="cardpostimage" alt="profile" src={cast.profile_path} />
                                                    </div>
                                                    <div>
                                                        <p className="actertextname">{cast.name}</p>
                                                        <p className="actertextcharacter">{cast.character}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                                <div className="col-md-12">
                                    <p className={this.state.cast.length === this.state.afterCast.length ? "visibility-hidden" : "visibility-visible addmore-text text-center"} onClick={this.handleAddMovieBlocks.bind(this, "cast")}>...See More...</p>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.isRecommendMovieReady === true ? "marginbottom20 showblock" : "marginbottom20 hideblock"}>
                            <div className="detailbigtitle">
                                <p class="detailblocktitle">Recommend Movies</p>
                            </div>
                            <div className="row justify-content-md margin10_0">
                                {this.state.recommendMovies.map(function (recommendMovie, index) {
                                    return (
                                        <div key={recommendMovie.id} className="col-md-6 padding12_17 castcard">
                                            <a href={"https://www.themoviedb.org/movie/" + recommendMovie.id} target="_blank">
                                                <div className="card xs shadow-sm height100" key={index}>
                                                    <div className="card-img-top carddiv height90">
                                                        <img className="cardpostimage" alt="profile" src={recommendMovie.backdrop_path} />
                                                    </div>
                                                    <div>
                                                        <p className="actertextname">{recommendMovie.title}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                                <div className="col-md-12">
                                    <p className={this.state.recommendMovies.length === this.state.afterRecommendMovies.length ? "visibility-hidden" : "visibility-visible addmore-text text-center"} onClick={this.handleAddMovieBlocks.bind(this, "recommend")}>...See More...</p>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.isSimilarMovieReady === true ? "marginbottom20 showblock" : "marginbottom20 hideblock"}>
                            <div className="detailbigtitle">
                                <p class="detailblocktitle">Similar Movies</p>
                            </div>
                            <div className="row marginleft20 justify-content-md">
                                {this.state.similarMovies.map(function (similarMovie, index) {
                                    return (
                                        <div key={similarMovie.id} className="col-xs-2 padding2_5 castcard">
                                            <a href={"https://www.themoviedb.org/movie/" + similarMovie.id} target="_blank">
                                                <div className="card xs shadow-sm height100" key={index}>
                                                    <div className="card-img-top carddiv height90">
                                                        <img className="cardpostimage" alt="profile" src={similarMovie.poster_path} />
                                                    </div>
                                                    <div>
                                                        <p className="actertextname">{similarMovie.title.length > 18 ? similarMovie.title.slice(0, 17) + "..." : similarMovie.title}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                                <div className="col-md-12">
                                    <p className={this.state.similarMovies.length === this.state.afterSimilarMovies.length ? "visibility-hidden" : "visibility-visible addmore-text text-center"} onClick={this.handleAddMovieBlocks.bind(this, "similar")}>...See More...</p>
                                </div>
                            </div>
                        </div>

                        <div className={this.state.isBackgroundsReady === true ? "marginbottom50 showblock" : "marginbottom50 hideblock"}>
                            <div className="detailbigtitle">
                                <p class="detailblocktitle">Backgrounds</p>
                            </div>
                            <div className="row marginleft20 justify-content-md">
                                {this.state.backgrounds.map(function (background, index) {
                                    return (
                                        <div key={index} className="col-xs padding2_5 castcard">
                                            <a href={background.file_path.replace("w185", "w1280")} target="_blank">
                                                <div className="card xs shadow-sm height100" key={index}>
                                                    <img className="backgroundspostimage height100" alt="profile" src={background.file_path} />
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                                <div className="col-md-12">
                                    <p className={this.state.backgrounds.length === this.state.afterBackgrounds.length ? "visibility-hidden" : "visibility-visible addmore-text text-center"} onClick={this.handleAddMovieBlocks.bind(this, "backgrounds")}>...See More...</p>
                                </div>
                            </div>
                        </div>


                    </MovieDetail>
                </div>
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

//Movie detail page
const MovieDetail = ({ handleClose, handleNormalClick, showDetail, children, slideIn, onEnteredCalled, onExitedCalled, movieName, bgColor}) => {
    return (
        <CSSTransition
            in={slideIn}
            timeout={300}
            onEnter={onEnteredCalled}
            onExited={onExitedCalled}
            classNames='slide-animation'>
            <div className="modal-main" onClick={handleNormalClick} id="modal-main" style={{backgroundColor: bgColor}}>
                <div class="container">
                    {children}
                </div>
            </div>
        </CSSTransition>
    );
};

export default MovieBox;
