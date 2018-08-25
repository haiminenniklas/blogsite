
/*
    Get the first div with class search. This will be used to
    show the search bar on screen.
 */
let searchDiv = document.getElementsByClassName("search")[0];

//The HTML that'll show the search form
let formHTML = "" +
    "<form action='/search' method='post'> " +
        "<input type='text' name='query' placeholder='Search...' required>" +
        "<input type='hidden' value='search' name='type'>" +
    "</form>";

searchDiv.innerHTML = formHTML;