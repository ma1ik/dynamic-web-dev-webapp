//calling main api discovery function to display for the users
$(async function () {
    let shows = await moviesApi.discover(true);
    DOMStuff.discoverInserter(shows, "#showsList", "tv");

    // Makes each icon clickable
    makeClickable(true);

    // Makes the search button clickable
    searchButtonMakeClickable(true);
});