//calling main api discovery function to display for the users
$(async function () {
    let movies = await moviesApi.discover();
    console.log(movies);
    DOMStuff.discoverInserter(movies, "#moviesList", "movie");

    // Makes each icon clickable
    makeClickable();

    // Make search button clickable
    searchButtonMakeClickable();
});