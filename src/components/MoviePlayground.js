import React, { Component } from "react";
import MovieBox from "./MovieBox.js";
import "./moviedetail.css"
import $ from "jquery";
import { withRouter } from "react-router";
import InfiniteScroll from "react-infinite-scroll-component";

class MoviePlayground extends Component {
    constructor(props) {
        super(props);
        const { routerUrl } = this.props.routerUrl;
        this.state = {
            movies: [],
            hasMore: true,
            isWatchListMode: false,
            pageType: "category",
            pageNum: 1,
            category: "popular",
            routerUrl: "/",
            hasData: false,
        };
        this.pageNum = 5;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.routerUrl === this.state.routerUrl) {
            return true
        } else {
            return false
        }
    }

    componentWillReceiveProps = (nextProps) => {
        var message = "componentWillReceiveProps:" + nextProps.routerUrl
        this.updateComponent(nextProps.routerUrl, message)
        this.setState({
            routerUrl: nextProps.routerUrl
        })
    }

    // processing with different url
    componentDidMount() {
        this.updateComponent("/", "entry")
    }

    updateComponent(url, from) {
        var pathlist = url.split("/")
        var searchCategory = "popular"
        console.log("updateComponent:: ", pathlist)
        if (pathlist.length > 1 && pathlist[1] === "watchlist") {
            this.setState({
                hasMore: false,
                isWatchListMode: true,
                pageType: "watchlist",
            })
            this.showWatchlist()
            return
        }
        if (pathlist.length === 3 && pathlist[1] === "search" && pathlist[2] !== "") {
            this.setState({
                hasMore: false,
                isWatchListMode: false,
                pageType: "search",
            })
            var searchKey = pathlist[2]
            this.searchMovieByName(searchKey);
            return
        }
        if (pathlist.length === 3 && pathlist[1] === "movie" && (pathlist[2] === "top_rated" || pathlist[2] === "upcoming" || pathlist[2] === "now_playing")) {
            searchCategory = pathlist[2]
        }
        this.setState({
            isWatchListMode: false,
            hasMore: true,
            pageType: "category",
        })
        this.searchMovieByCategory(searchCategory);
    }

    //grab the watch list and show them
    showWatchlist() {
        var movieBoxes = [];
        var tempWatchlist = [];
        var localWatchlist = [];
        localWatchlist = JSON.parse(localStorage.getItem("motiveWatchList"));
        console.log(localWatchlist)
        if (localWatchlist) {
            tempWatchlist = localWatchlist;
        }
        Array.prototype.forEach.call(tempWatchlist, movie => {
            movie.isShow = true
            movieBoxes.push(movie);
        });
        setTimeout(() => {
            this.setState({
                movies: movieBoxes,
                hasData: true,
            });
        }, 0);
    }

    // filter movies by cateogyr, only four kinds: popular, top_rated, upcoming and now_playing
    searchMovieByCategory(searchCategory) {
        var movieBoxes = [];
        setTimeout(() => {
            this.setState({
                movies: [],
                category: searchCategory,
                pageNum: 1,
                hasData: false,
            });
        }, 0);
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            searchCategory +
            "?api_key=1e70c91a272209d404c18c8679f75072&language=en-US&page=1";
        $.ajax({
            url: urlString,
            success: searchResults => {
                const results = searchResults.results;
                results.forEach(movie => {
                    movie.poster =
                        "https://image.tmdb.org/t/p/w500" + movie.poster_path;
                    if (movie.release_date === undefined) {
                        return
                    }
                    var date = movie.release_date.replace(/-/g, "/");
                    movie.release_date = date;
                    var vote = movie.vote_average.toString()
                    if (vote.length === 1) {
                        vote = vote + ".0"
                    }
                    movie.vote_average = vote
                    movie.isShow = true
                    movieBoxes.push(movie);
                });

                setTimeout(() => {
                    this.setState({
                        movies: movieBoxes,
                        hasData: true,
                    });
                }, 0);

            },
            error: (xhr, status, err) => {
                console.error("Failed to fetch movie data, 10001");
            }
        });
    }


    // search movies by input keyword
    searchMovieByName(searchKeyword) {
        const urlString =
            "https://api.themoviedb.org/3/search/movie?api_key=1e70c91a272209d404c18c8679f75072&query=" +
            searchKeyword;

        this.setState({
            movies: [],
            hasData: false,
        });

        $.ajax({
            url: urlString,
            success: searchResults => {
                const results = searchResults.results;
                var movieBoxes = [];
                results.forEach(movie => {
                    if (movie.poster_path !== null) {
                        movie.poster =
                            "https://image.tmdb.org/t/p/w500" + movie.poster_path;
                    } else {
                        movie.poster =
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB-hMdo9NAj_4K1vtOpJ-DxQO-d_7Uoh8kUV7C6i32ebTW3NBGQQ&s";
                    }
                    if (movie.release_date === undefined) {
                        return
                    }
                    var date = movie.release_date.replace(/-/g, "/");
                    movie.release_date = date;
                    var vote = movie.vote_average.toString()
                    if (vote.length === 1) {
                        vote = vote + ".0"
                    }
                    movie.vote_average = vote
                    movie.isShow = true
                    movieBoxes.push(movie);
                });

                this.setState({
                    movies: movieBoxes,
                    hasData: true,
                });
            },
            error: (xhr, status, err) => {

                console.error("Failed to fetch data");
            }
        });
    }

    fetchMoreData = () => {
        var movieBoxes = [];
        var pageNumInt = this.state.pageNum + 1
        this.setState({
            pageNum: pageNumInt,
        })
        const urlString =
            "https://api.themoviedb.org/3/movie/" +
            this.state.category +
            "?api_key=1e70c91a272209d404c18c8679f75072&language=en-US&page=" + pageNumInt.toString();
        console.log("url: ", urlString)

        $.ajax({
            url: urlString,
            success: searchResults => {
                const results = searchResults.results;
                results.forEach(movie => {
                    movie.poster =
                        "https://image.tmdb.org/t/p/w500" + movie.poster_path;
                    if (movie.release_date === undefined) {
                        return
                    }
                    var date = movie.release_date.replace(/-/g, "/");
                    movie.release_date = date;
                    var vote = movie.vote_average.toString()
                    if (vote.length === 1) {
                        vote = vote + ".0"
                    }
                    movie.vote_average = vote
                    if (this.refs.filterQuery.value.toLowerCase().length !== 0 ) {
                        if (movie.title.toLowerCase().indexOf(this.refs.filterQuery.value.toLowerCase()) >= 0) {
                            movie.isShow = true
                        } else {
                            movie.isShow = false
                        }
                    } else {
                        movie.isShow = true
                    }
                    movieBoxes.push(movie);
                });
                this.setState({
                    movies: this.state.movies.concat(movieBoxes),
                });
            },
            error: (xhr, status, err) => {
                console.log(err)
                console.error("Failed to fetch movie data, 10001");
            }
        });
    };

    handlerFilter() {
        let filterQueryKey = this.refs.filterQuery.value.toLowerCase();
        const newList = this.state.movies
        newList.forEach(movie => {
            var oriTiele = movie.title.toLowerCase()
            if (oriTiele.indexOf(filterQueryKey) >= 0) {
                movie.isShow = true;
            } else {
                movie.isShow = false;
            }
        })
        this.setState({
            movies: newList,
        })
    }

    render() {
        return (
            <div>
                <div className="row margintop20 padding0_10">
                    <div class={this.state.pageType === "category" ? "input-group " : "display-none"}>
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-default">Filter Movie</span>
                        </div>
                        <input type="text" class="form-control" aria-label="Sizing example input" placeholder="input text" ref="filterQuery" onChange={this.handlerFilter.bind(this)} />
                    </div>

                    <InfiniteScroll
                        className="row infinitrow"
                        dataLength={this.state.movies.length}
                        next={this.fetchMoreData.bind(this)}
                        hasMore={this.state.hasMore}
                        loader={<h4>Loading...</h4>}>
                        {this.state.movies.map((movie, index) => (
                            <MovieBox key={movie.id} movie={movie} movieindex={this.state.pageType === "category" ? index : 4} isWatchListMode={this.state.isWatchListMode} showWatchlist={this.showWatchlist.bind(this)} />
                        ))}
                    </InfiniteScroll>
                </div>
                <div className={this.state.movies.length === 0 ? "showblock" : "hideblock"} >
                    <h1 className={this.state.hasData ? "showblock showincenter" : "hideblock"}>NoData</h1>
                </div>
            </div>

        )
    }
}

export default MoviePlayground;