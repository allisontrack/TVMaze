

// Returns an array of objects conatining show name, id, summary, and image

async function searchShows(query) {
  const showsResponse = await axios.get('https://api.tvmaze.com/search/shows', {params: {
    'q': query
  } } );
  
  const showsArr = showsResponse.data.map(function (showRes) {
    const showEntry = {
      'id': showRes.show.id,
      'name': showRes.show.name,
      'summary': showRes.show.summary,
      'image': showRes.show.image
    }
    return showEntry;
  } );

  return showsArr;

}


// Populate shows list:
// given list of shows, add shows to DOM

function addShowCards(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    if (show.image.medium) { // if show.image is not null
      let $showCard = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
          <div class="card" data-show-id="${show.id}">
            <img class="card-img-top small" src="${show.image.medium}">
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">${show.summary}</p>
              <button class="btn btn-primary" id="${show.id}" type="submit">Episodes</button>
            </div>
          </div>
        </div>
        `);
      $showsList.append($showCard);
    }
    else {
      let $showCard = $(
        `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
          <div class="card" data-show-id="${show.id}">
          <img class="card-img-top small" src='https://tinyurl.com/tv-missing'>
            <div class="card-body">
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">${show.summary}</p>
              <button class="btn btn-primary" id="${show.id}" type="submit">Episodes</button>
            </div>
          </div>
        </div>
        `);
      $showsList.append($showCard);
    }

    $(`#${show.id}`).on("click", async function handleEpisodesClick (event) {
      console.log('')
      const episodes = await getEpisodes(show.id);
      populateEpisodes(episodes);
    })

  }

}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (event) {
  event.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  addShowCards(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {

  const episodesResponse = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  console.log(episodesResponse);

  const episodesArr = episodesResponse.data.map(function (episodeRes) {
    console.log(episodeRes.id);
    const episodeEntry = {
      'id': episodeRes.id,
      'name': episodeRes.name,
      'season': episodeRes.season,
      'number': episodeRes.number
    }
    return episodeEntry;
  })

  console.log(episodesArr);
  return episodesArr;

}


function populateEpisodes(episodes) {
  const $episodeList = $('#episodes-list');

  for (let episode of episodes) {
    console.log('this is episode in loop', episode);
    let $episodeListItem = $(
      `<li id="${episode.id}">
        ${episode.name} 
        (season ${episode.season}, 
        number ${episode.number})
      </li>
    `);
    console.log('this is supposed to be $episodelistitem', $episodeListItem);
    $episodeList.append($episodeListItem);
  }
  $("#episodes-area").show();
  console.log('this should be the $episodeList', $episodeList);
}

