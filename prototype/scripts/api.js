const CONFIG = {
    API_KEY: "",
    // For security reasons we are using a proxy to build the url and so the users don't see the key
    API_BASE: "https://not.themoviedb.university.dbuidl.com",
    // Use local JSON Files for responses if we have them, to save api calls.
    DEV_USE_LOCAL_JSON: false,
};

//images need different url than the main api url
const DOM_CONFIG = {
    IMAGE_BASE_URL: "https://image.tmdb.org/t/p/original"
};

// This is a fun function - it takes a movie name and consistently turns it into the same flavour using cryptography.
// We hash the name, convert the hash output to numbers, add them up and get the remainder of division by 16
// Since hashing produces the same result given the same input, the movie will have a consistent popcorn flavour
async function getPopcornFlavour(name) {
    try {
        // Hash Using Browser Crypto (SHA256)
        const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(name));

        // Convert to numbers
        const asIntegers = new Uint8Array(hash);

        let total = 0;

        // Add up all numbers
        for (let i = 0; i < asIntegers.length; i++) {
            total += asIntegers[i];
        }

        // Get remainder after division by 16
        total = total % 16;

        // Pick and return a flavour
        return ["Butter", "Caramel", "Birthday Cake", "Cheese", "Jalapeno", "Chocolate", "Sea Salt", "Sweet", "Ketchup", "Dorito", "S'mores", "White cheddar", "Buffalo Ranch", "Coconut", "Cookies and Cream", "Cinnamon"][total];
    } catch (exception) {
        // On error (no browser crypto .etc.) return Butter
        return "Butter";
    }
}

class MoviesApi {
    constructor(config) {
        // Set up our variables so we can easily switch to our proxy when the time comes (to hide api key)
        // This code merges the config with the default config we have
        this.config = Object.assign({}, {API_KEY: "", API_BASE: "http://api.themoviedb.org/3", DEV_USE_LOCAL_JSON: false}, config);
    }

    // Fetch function to be used for fetching everything
    async endpointFetch(url) {
        // Fetch our url
        const response = await fetch(url, {});
        // If the response is good
        if (response.ok) {
            try {
                return await response.json();
            } catch {
                // Return false if it's invalid
                return false;
            }
        } else {
            return false;
        }
    }

    // Get Movies/Shows from the discover api
    async discover(shows = false) {
        let url;
        //if developer mode is on it will use the locally saved json if its not it will use the api key and url
        if (this.config.DEV_USE_LOCAL_JSON) {
            url = shows ? "./scripts/api_responses/shows.json" : "./scripts/api_responses/discover.json";
        } else {
            // Fetch from API
            url = this.config.API_BASE + (shows ? "/discover/tv" : "/discover/movie") + "?api_key=" + this.config.API_KEY;
        }

        return await this.endpointFetch(url);
    }

    // Query the API for a search.
    async searchQuery(movieSearch, shows = false){
        // Generate Search URL
        const url = this.config.API_BASE + "/search/" + (shows ? "tv" : "movie") + "?language=en-US&page=1&query=" + movieSearch + "&include_adult=false";
        // Fetch
        const data = await this.endpointFetch(url);
        // If we have data
        if (data !== false) {
            // Insert to right element.
            if (!shows) {
                DOMStuff.discoverInserter(data, "#moviesList");
            } else {
                DOMStuff.discoverInserter(data, "#showsList");
            }
        } else {
            return false;
        }
    }

    // Get a show/movie by its ID
    async getById(id, show = false) {
        return await this.endpointFetch(this.config.API_BASE + (show ? "/tv/" : "/movie/") + id + "?api_key=" + this.config.API_KEY);
    }
}

class DOMStuff {
    static discoverInserter(data, element) {
        const elem = $(element);
        // We prepare it so they still have something to look at if there was data there before.
        let to_insert = [];
        if (data !== false) {
            for (let i = 0; i < data.results.length; i++) {
                let result = data.results[i];

                // noinspection HtmlRequiredAltAttribute,RequiredAttributes
                to_insert.push(
                    $("<div/>", {class: "movieCard", "data-movie-id": result.id}).append(
                        $("<img />", {src: DOM_CONFIG.IMAGE_BASE_URL + result.poster_path, alt: result.title || result.name, class: "moviePoster"}),
                        $("<div/>", {class: "movieInfo"}).append(
                            $("<h2/>", {class: "movieName", text: result.title || result.name}),
                            $("<p/>", {class: "movieSubText", text: "Released " + (result.release_date || result.first_air_date)}),
                            $("<p/>", {class: "overviewText", text:result.overview}),
                            $('<div class="top-right" onclick="addToWatched(`'+result.title+'`)"><i class="fas fa-eye"></div>')
                        )
                    )
                );
            }

            // Empty Current Movies
            elem.empty();
            // Add loaded data
            elem.append(to_insert);

            // Make it so movie posters load the "no image" if their url is invalid.
            const moviePoster = $(".moviePoster");
            moviePoster.off('error');
            moviePoster.on('error', function (event) {
                $(event.target).attr("src", "img/missing.jpg");
            });
        } else {
            console.log("Data was empty or invalid.");
        }
    }
}

// Instance of the API Class for the rest of the program.
const moviesApi = new MoviesApi(CONFIG);

// Make the search button work based on whether or not we're searching shows.
function searchButtonMakeClickable(shows = false) {
    $("#movieSearchBtn").click(async function (event) {
        // Stop page reload
        event.preventDefault();
        event.stopPropagation();

        // Do search
        let movieSearchTerm = $("#movieSearchTerm");
        let movieSearch = movieSearchTerm.val();
        movieSearchTerm.val('');
        await moviesApi.searchQuery(movieSearch, shows);
        makeClickable(shows);
    });
}

// Makes posters/movies clickable based on whether it's a show or not
function makeClickable(show = false) {
    const movieCard = $(".movieCard");
    // Remove old events
    movieCard.off("click");
    // Add our events
    movieCard.on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        let target = $(event.target);

        if (target.data("movieId") === undefined) {
            target = target.parents(".movieCard");
        }

        if (target.data("movieId") !== undefined) {
            window.location.href = "info?" + (show ? "show" : "movie") + "=" + target.data("movieId");
        }
    });
}

//onClick listener for future adding to database
function addToWatched(element) {
    alert(element + ' Added to Your watched list');
}
