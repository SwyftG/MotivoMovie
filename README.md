MotivoMovie is  a *small, responsive single-page application* which provides visitors the ability to browse and interact with an online catalog of movies.

Using *React, Html5 and CSS3* to build the frontend and using *TMDb's* public API to be the backend.

### Check it out

You could check it out by the follow link: https://swyftg.github.io/motivomovie/

![homepage](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/homepage.png)


### Key Feature
- It's a single-page application.
- Showing movie list by four categories.
- Support search movies.
- Support filter movies.
- Showing movie details.
- Could add movie to your local watch list.
- Could modify watch list by simple operations.
- Implement infinite scrolling, grab the data from API page by page.
- Automatically set movie detail page's background color by its poster.
- Simple animations between page changing and hover.
- Deployed the web on GitHub Page. Open access to anybody to visit.

### Feature Details

#### Single-page Application

The MotivoMovie is a single-page application. Because all the interactions are happened in a single URL, here is `https://swyftg.github.io/motivomovie/`.

Page shows the different content by passing different parameters to `<MoviePlayground>` in `App.js`.

#### TMDb's Movie List

Here I use TMDb's public API to get Movie list.

| Action | API URL |
| ------ | ------ |
| Movie Detail | `https://api.themoviedb.org/3/movie/<movie_id>?api_key=<api_key>&append_to_response=credits` |
| similar Movie | `https://api.themoviedb.org/3/movie/<movie_id>/similar?api_key=<api_key>&language=en-US` |
| Recommendation Movie | `https://api.themoviedb.org/3/movie/<movie_id>/recommendations?api_key=<api_key>&language=en-US` |
| Background | `https://api.themoviedb.org/3/movie/<movie_id>/images?api_key=<api_key>&language=en-US&include_image_language=en` |
| Movie List By Category | `https://api.themoviedb.org/3/movie/<category>?api_key=<api_key>&language=en-US&page=1` |
| Search Movie | `https://api.themoviedb.org/3/search/movie?api_key=<api_key>&query=<search_keyword>` |
| Movie List By PageNum | `https://api.themoviedb.org/3/movie/<category>?api_key=<api_key>&language=en-US&page=<page_num>` |

Above APIs can implement:
- Search movie by type in movie's name.
- Grab movie list data from backend by different category.
- Grab movie in same category by different page number.
- Grab movie details by movie's id.

#### CSS framework

Using Bootstrap 4.3.1 to implement UI.

#### Local Watch List

When you are in the movie detail page, there is a button named `Add To WatchList`. Click this button will store the current movie's info into local storage in JSON format.

Next time when you visit `Watch List` page, the page will read localStorage to get all the stored item, and show them on the page.

Here in this page, when you click the post again, it will remove the movie from watch list.

![watch_list](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/watchlist.png)

#### Filter Movie And See More

In the top of movie category page, there is a `<input>` component to support filter movie by type names.

This is just using react to manage the movie data which should be shown on the page.

![filter_01](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/filter01.png)

![filter_02](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/filter02.png)

See more part is same as below.

![see_more_01](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/seemore.png)

![see_more_02](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/seemore02.png)

#### Infinite Scrolling

Using `react-infinite-scroll-component` to implement infinite scrolling page. When page scroll to the bottom, it will automatically fetch data from backend by page number adding one.

#### Colorful UI

Using `react-color-extractor` to make movie detail page's background color more colorful. The color is from movie poster. Different movie will present different movie detail page color.

![color_01](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/color01.png)

![color_02](https://raw.githubusercontent.com/SwyftG/motivomovie2/master/img/color02.png)

#### Slide Animation

Using `react-transition-group` and CSS3 to implement movie detail page slide-in and slide-out animations. 

#### Progress bar

Using `react-circular-progressbar` to implement circle progress bar of movie score.

#### Github Page

The whole project has been deployed on Github Page. You could visit it by the following URL: https://swyftg.github.io/motivomovie/

### TODO

This is my first react project. It is so interesting. There are lot of place I need to focus on, such as:
- UI
- Animations
- Performance
- Code refactor

I have made some improvement of above aspects according to my Mobile development experience. But it is not enough. I will pay more attention and do more exercise on these. 

If you have any questions, please contact me via email.

Thank you very much.



