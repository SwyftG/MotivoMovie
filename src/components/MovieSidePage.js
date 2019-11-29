
import React, { Component } from 'react'
import "./moviedetail.css"
import $ from "jquery";
import { ColorExtractor } from "react-color-extractor";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { CSSTransition } from 'react-transition-group';



export default class MovieSidePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIn: false,
            movie: props.movie,
            bgColor: "#3caf8e",
            titleColor: "#edb05b",
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
            isSimilarMovieLoading:true,
            isRecommendMovieLoading:true,
            isBackgroundsLoading:true,
            isTopBilledCastLoading:true,
            isCrewLoading: true,
            isCrewReady: false,
            isSimilarMovieReady: false,
            isRecommendMovieReady: false,
            isBackgroundsReady: false,
            isTopBilledCastReady: false,
        };
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.movie === this.state.movie) {
            return true
        } else {
            return false
        }
    }

    componentDidMount() {
        this.updateMoveDetailPage(this.props.movie)
        this.setState({
            movie: this.props.movie,
            slideIn: true,
        })
    }



    componentWillReceiveProps = (nextProps) => {
        console.log("--->componentWillReceiveProps:", nextProps)
        if (nextProps.isClose) {
            this.setState({
                slideIn: false,
            })
        } else if (nextProps.showDetail) {
            this.setState({
                movie: nextProps.movie,
                slideIn: true,
            })
            this.updateMoveDetailPage(nextProps.movie)
            let mainPage = document.getElementById("modal-main")
            mainPage.scrollTop = 0;
        } else {
            this.setState({
                slideIn: false,


            })
        }
    }

    updateMoveDetailPage(movie) {
        console.log("updateMoveDetailPage", this.props.movie.id)
        this.getMovieDetail(movie.id);
        this.getSimilarMovie(movie.id);
        this.getRecommendMovie(movie.id);
        this.getBackgrounds(movie.id);
        this.setState({
            showDetail: true,
            slideIn: true,
        });
    }


    getPosterColors(movie, colors) {
        console.log('color:: ', colors)
        this.setState({
            bgColor: colors[0],
            titleColor: colors[1],
            addButtonColor: colors[4],
        })
    }

    handleAddMoveInWatchList() {
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

    getSimilarMovie(movieId) {
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            movieId +
            "/similar?api_key=1e70c91a272209d404c18c8679f75072&language=en-US";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var similar = searchResults.results;
                if (similar.length === 0) {
                    this.setState({ 
                        isSimilarMovieReady: false,
                        isSimilarMovieLoading: false,
                    })
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
                        isSimilarMovieReady: true,
                        isSimilarMovieLoading: false,
                    });
                } else {
                    this.setState({
                        similarMovies: afterSimilarMovies,
                        afterSimilarMovies: afterSimilarMovies,
                        isSimilarMovieReady: true,
                        isSimilarMovieLoading: false,
                    });
                }
            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    getBackgrounds(movieId) {
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            movieId +
            "/images?api_key=1e70c91a272209d404c18c8679f75072&language=en-US&include_image_language=en";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var backgrounds = searchResults.posters;
                if (backgrounds.length === 0) {
                    this.setState({ 
                        isBackgroundsReady: false,
                        isBackgroundsLoading: false
                    })
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
                        isBackgroundsReady: true,
                        isBackgroundsLoading: false
                    });
                } else {
                    this.setState({
                        backgrounds: afterBackgrounds,
                        afterBackgrounds: afterBackgrounds,
                        isBackgroundsReady: true,
                        isBackgroundsLoading: false
                    });
                }

            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    getRecommendMovie(movieId) {
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            movieId +
            "/recommendations?api_key=1e70c91a272209d404c18c8679f75072&language=en-US";

        $.ajax({
            url: urlString,
            success: searchResults => {
                var recommend = searchResults.results;
                if (recommend.length === 0) {
                        this.setState({ 
                            isRecommendMovieReady: false,
                            isRecommendMovieLoading:false
                        })
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
                        isRecommendMovieReady: true,
                        isRecommendMovieLoading:false
                    });
                } else {
                    this.setState({
                        recommendMovies: afterRecommendMovies,
                        afterRecommendMovies: afterRecommendMovies,
                        isRecommendMovieReady: true,
                        isRecommendMovieLoading:false
                    });
                }
            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch data");
            }
        });
    }

    //get the detail info of the movie
    getMovieDetail(movieId) {
        const urlString = "https://api.themoviedb.org/3/movie/" +
            movieId +
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
                        this.setState({ 
                            isTopBilledCastReady: false,
                            isTopBilledCastLoading: false,
                        })
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
                            isTopBilledCastReady: true,
                            isTopBilledCastLoading: false
                        });
                    } else {
                        this.setState({
                            cast: afterCast,
                            afterCast: afterCast,
                            isTopBilledCastReady: true,
                            isTopBilledCastLoading: false
                        });
                    }

                }

                var crew = detail.credits.crew;
                var crewList = crew

                if (crew.length > 10) {
                    this.setState({
                        crew: crewList.slice(0, 10),
                        isCrewReady: true,
                        isCrewLoading:false
                    })
                } else {
                    this.setState({
                        crew: crewList,
                        isCrewReady: true,
                        isCrewLoading:false
                    })
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

    onEnteredCalled() {
        console.log("onEnteredCalled")
    }

    onExitedCalled() {
        console.log("onExitedCalled")
        this.props.hidePage()
    }

    handleNormalClick(event) {
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }
    startHidePage() {
        this.props.startHideDetailPage()
    }

    render() {
        const isLoadingPage = this.state.movie === null ||
            this.state.crew === null 

        if (isLoadingPage) {
            return <div className="loading">
                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
            </div>
        }
        else {
            return (
                <CSSTransition
                    in={this.state.slideIn}
                    timeout={300}
                    onEnter={this.onEnteredCalled.bind(this)}
                    onExited={this.onExitedCalled.bind(this)}
                    classNames='slide-animation'>
                    <div className="modal-main" id="modal-main" onClick={this.handleNormalClick.bind(this)} style={{ backgroundColor: this.state.bgColor }} >
                        <div class="container" id="movie-detail-page">
                            <div className="marginbottom20 d-lg-none backtolistdiv row" onClick={this.startHidePage.bind(this)}>
                                <i class="fa fa-chevron-circle-left backtolisticon" aria-hidden="true"></i>
                                <p class="backtolisttext">Back To List</p>
                            </div>
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
                                <div class="col-xs-8 col-md-8 detailinfo">
                                    <div class="row marginleft0 margintop20">
                                        <p class="detailtitle" style={{ color: this.state.titleColor }}>{this.props.movie.title}</p>
                                        <span className="detailyear">({this.props.movie.release_date === undefined ? "" : this.props.movie.release_date.substring(0, 4)})</span>
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
                                        <p class="col-xs-1 detailaddwatchlist padding0_10" onClick={this.handleAddMoveInWatchList.bind(this)} style={{ color: this.state.addButtonColor }}>Add To WatchList</p>
                                    </div>
                                    <div class="margintop20">
                                        <p class="detailblocktitle" >OverView</p>
                                        <p className="detailblocktext textjustify" >{this.props.movie.overview}</p>
                                    </div>
                                    <div class={this.state.crew.length !== 0 ? "margintop20 d-none d-lg-block" : "hideblock"}>
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
                            <div className={this.state.crew.length  === 0 ? "blockloading d-lg-none" : "hideblock"}>
                                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
                            </div>
                            <div class={this.state.crew.length !== 0 ? "marginbottom20 d-lg-none" : "hideblock"}>
                                <div className="detailbigtitle">
                                    <p class="detailblocktitle">Feature Crew</p>
                                </div>
                                <div class="marginleft0 stuffcard">
                                    {this.state.crew.map(function (crew, index) {
                                        return (

                                            <div className="row mobilecrewrow">
                                                <p className="mobilecrewname">{crew.name}</p>
                                                <p className="mobilecrewjob">{crew.job}</p>
                                            </div>

                                        );
                                    })}
                                </div>
                            </div>
                            <div className={this.state.isTopBilledCastLoading === true ? "blockloading" : "hideblock"}>
                                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
                            </div>

                            <div className={this.state.isTopBilledCastReady === true ? "marginbottom20" : "marginbottom20 hideblock"}>
                                <div className="detailbigtitle">
                                    <p class="detailblocktitle">Top Billed Cast</p>
                                </div>
                                <div className="row justify-content-md padding0_10 justfiy_center">
                                    {this.state.cast.map(function (cast, index) {
                                        return (
                                            <div key={cast.id} className="col-xs-2 padding5 castcard castdiv castdiv">
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

                            <div className={this.state.isRecommendMovieLoading === true ? "blockloading" : "hideblock"}>
                                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
                            </div>

                            <div className={this.state.isRecommendMovieReady === true ? "marginbottom20 showblock" : "marginbottom20 hideblock"}>
                                <div className="detailbigtitle">
                                    <p class="detailblocktitle">Recommend Movies</p>
                                </div>
                                <div className="row justify-content-md margin10_0 justfiy_center">
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

                            <div className={this.state.isSimilarMovieLoading === true ? "blockloading" : "hideblock"}>
                                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
                            </div>

                            <div className={this.state.isSimilarMovieReady === true ? "marginbottom20 showblock" : "marginbottom20 hideblock"}>
                                <div className="detailbigtitle">
                                    <p class="detailblocktitle">Similar Movies</p>
                                </div>
                                <div className="row justify-content-md justfiy_center">
                                    {this.state.similarMovies.map(function (similarMovie, index) {
                                        return (
                                            <div key={similarMovie.id} className="col-xs-2 padding2_5 castcard similarmovie">
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

                            <div className={this.state.isBackgroundsLoading === true ? "blockloading" : "hideblock"}>
                                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
                            </div>

                            <div className={this.state.isBackgroundsReady === true ? "marginbottom50 showblock" : "marginbottom50 hideblock"}>
                                <div className="detailbigtitle">
                                    <p class="detailblocktitle">Backgrounds</p>
                                </div>
                                <div className="row justify-content-md justfiy_center">
                                    {this.state.backgrounds.map(function (background, index) {
                                        return (
                                            <div key={index} className="col-xs padding2_5 castcard backgrounddiv">
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

                        </div>
                    </div>
                </CSSTransition>
            )
        }
    }
}
