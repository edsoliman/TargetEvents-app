const baseEventSearchURL = "http://api.eventful.com/json/events/search";

function getQueryString(params) {
  let queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
  return queryString;
};

function getUserInput() {
  let keyword = $('#keyword_search').val();
  let location = $('#location_search').val();
  let date = $('#date_search').val();
  let user_input = getQueryParams(keyword, location, date);
  return user_input;
}

function getQueryParams(keyword, location, date) {
  let params = {
    keywords: keyword,
    app_key: 'nnnzPr3kFQ5H3P77',
    location: location,
    date: date
  };
  let queryString = getQueryString(params);
  return baseEventSearchURL + '?' + queryString;
};

function headerAnimation() {
  setTimeout(() => {
    $('.app-logo').addClass('animate-left');
  }, 500)
  setTimeout(() => {
    $('.header-container').removeClass('header-container').addClass('header-container-fixed')
    $('.search-container').show();
  }, 2450);
  getEventSearchResults();
};

function placeholderInputInterval() {
  let placeholderIntervalArr = [{event: 'Music', location: 'Los Angeles', date: 'Today'}, 
                                {event: 'Tech', location: 'New York, NY', date: '06/20/2019'},
                                {event: 'Social', location: 'TX', date: 'All'},
                                {event: 'Books', location: 'Miami, Florida', date: 'This Week'}];
  let counter = 0;
    setInterval(function() {
       if(counter < placeholderIntervalArr.length) {
          let newEventPlaceholder = placeholderIntervalArr[counter].event;
          let newLocationPlaceholder = placeholderIntervalArr[counter].location;
          let newDatePlaceholder = placeholderIntervalArr[counter].date;
          counter++;
          $('#keyword_search').attr('placeholder', newEventPlaceholder);
          $('#location_search').attr('placeholder', newLocationPlaceholder);
          $('#date_search').attr('placeholder', newDatePlaceholder);
      } else {
          $('#keyword_search').attr('placeholder', placeholderIntervalArr[0].event);
          $('#location_search').attr('placeholder', placeholderIntervalArr[0].location);
          $('#date_search').attr('placeholder', placeholderIntervalArr[0].date);
          counter = 0;
       }
    },2000);
  }

function getEventSearchResults() {
  $('#see_results_form').submit(event => {
    event.preventDefault();
    let fullEventSearchURL = getUserInput();
    $.ajax({
      url: fullEventSearchURL,
      dataType: 'jsonp',
      type: 'GET',
      success: function(response) {
        if (response.total_items == 0 || isNaN(response.total_items)) {
          $('#search_results').html('<p style="font-size:20px">No results were returned. Please try your search again.</p>')
        } else {
          (displayResults(response))
        }
      }
    });
  });
};

function displayResults(response) {
  $('#search_results').empty();
  for (i=0; i < response.events.event.length; i++) {
    if (response.events.event[i].description) {
      $('#search_results').append(
        `<div class='result-container'>
        <span class='event-title'>${response.events.event[i].title}</span>
        <span class='event-city'>${response.events.event[i].city_name}, ${response.events.event[i].region_abbr}</span>
        <p>${response.events.event[i].description}</p>
        <p><a href=${response.events.event[i].url}>Click here for more event information</a></p></div>`
      )
    }
    else if (!response.events.event[i].description) {
      $('#search_results').append(
        `<div class='result-container'>
        <span class='event-title'>${response.events.event[i].title}</span>
        <span class='event-city'>${response.events.event[i].city_name}, ${response.events.event[i].region_abbr}</span>
        <p class='description-na'>A description for this event is not available.</p>
        <p><a href=${response.events.event[i].url}>Click here for more event information</a></p></div>`
      )
    }
  };
};

function handleEventApp() {
  headerAnimation();
  placeholderInputInterval();
};

$(handleEventApp);
