$(async function() {
    // Get URL Parameters
    const params = new URLSearchParams(window.location.search);

    // If it's a movie
    if (params.get("movie")) {
        const movie = await moviesApi.getById(params.get("movie"));
        // Not empty
        if (movie !== false) {
            // Populate Page
            $("#poster").attr("src", DOM_CONFIG.IMAGE_BASE_URL + movie.poster_path);
            $("#movieTitle").text(movie.title);
            $("#summary").text(movie.overview);
            let releaseDate = new Date(movie.release_date);
            $("#releaseDate").text("Release Date: " + releaseDate.toLocaleDateString());
            $("#rating").text("Rating: " + movie.vote_average);
            $("#genres").text("Genres: " + movie.genres.map(function (item) {return item.name;}).join(", "));
            $("#status").text("Status: " + movie.status);
            let runtimeMinutes = movie.runtime % 60;
            let runtimeHours = (movie.runtime - runtimeMinutes) / 60;
            $("#runTime").text("Run Time: " + runtimeHours + " Hours " + runtimeMinutes + " Minutes");
            $("#cinematography").text("Production Companies: " + (movie.production_companies.map(function (item) {return item.name}).join(", ") || "N/A"));
            $("#adult").text("Adult: " + (movie.adult ? "Yes" : "No"));
            $("#flavour").text("Suggested Popcorn Flavour: " + await getPopcornFlavour(movie.title));
        }
    // If it's a show
    } else if (params.get("show")) {
        const show = await moviesApi.getById(params.get("show"), true);
        // Not Empty
        if (show !== false) {
            // Populate
            let poster = $("#poster");
            poster.attr("src", DOM_CONFIG.IMAGE_BASE_URL + show.poster_path);
            // Make it so movie posters load the "no image" if their url is invalid.
            poster.off('error');
            poster.on('error', function (event) {
                $(event.target).attr("src", "img/missing.jpg");
            });
            $("#movieTitle").text(show.name);
            $("#summary").text(show.overview);
            let releaseDate = new Date(show.first_air_date);
            $("#releaseDate").text("Release Date: " + releaseDate.toLocaleDateString());
            $("#rating").text("Rating: " + show.vote_average);
            $("#genres").text("Genres: " + show.genres.map(function (item) {return item.name;}).join(", "));
            $("#status").text("Status: " + show.status);
            $("#runTime").remove();
            $("#cinematography").text("Production Companies: " + (show.production_companies.map(function (item) {return item.name}).join(", ") || "N/A"));
            $("#adult").remove();
            $("#flavour").text("Suggested Popcorn Flavour: " + await getPopcornFlavour(show.name));
        }
    }
});