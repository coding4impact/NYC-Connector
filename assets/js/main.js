$(function() {
  var submitButton = $("#search");
  var addressField = $("#address");
  var clearAllButton = $("#clear_all");

  function loadJSONData(path, callback) {
    $.getJSON('/json_files/' + path + '.json', function(data) {
      callback(data);
    });
  }
    
  function searchQueryUrl(name) {
      var query = "https://www.google.com/search?q="
      var split_words = name.split(" ");
      for(var i = 0; i < split_words.length; i++) {
          if (i != split_words.length - 1) {
              query += split_words[i] + "+";
          } else {
              query += split_words[i];
          }
      }
      return query;
  }

  function handleContent(type, place) {
      
      var website_url = type === "food_scraps" ? place['Website'] : searchQueryUrl(place['Name'])
      var content = '<div id="content" class="pt-2 bg-light">' + 
                        '<a href="' + website_url + '"' + '<h4 id="firstHeading" class="firstHeading">' + place['Name'] + '</h4></a><br /><br />' + 
                        '<div id="bodyContent">' + 
                            '<ul>';
      var factype = "";
      switch(type) {
          case "soup_kitchens":
              factype = "Soup Kitchen";
              break;
          case "senior_centers":
              factype = "Senior Center";
              break;
          case "snap_centers":
              factype = "Snap Center";
              break;
          case "food_pantries":
              factype = "Food Pantry";
              break;
          case "food_scraps":
              factype = "Food Scrap Drop-off Site (Composting)";
              break;
          case "homeless_shelters":
              factype = "Homeless Shelter";
              break;
          case "clothing_charities":
              factype = "Clothing Charity";
              break;
      }
      
      content += '<li> Type: <strong>' + factype + '</strong></li>';
      content += '<li> Address: <strong>' + place['Address'] + '</strong></li>';
      
      if (type === "clothing_charities" || type === "homeless_shelters") {
          content += '<li> Phone Number: <strong>' + place['Phone Number'] + '</strong></li>';
      }
      
      if (type === "food_scraps") {
          var website = place['Website']
          content += '<li> Website: <strong><a href="' + website + '">' + website + '</a></strong></li>';
          content += '<li> Open Months: <strong>' + place['MONTH_'] + '</strong></li>';
          content += '<li> Days Open: <strong>' + place['DAYS'] + '</strong></li>';
          content += '<li> Times: <strong>' + place['STARTTIME'] + ' - ' + place['ENDTIME'] + '</strong></li>';
      }
      
      content += '<li> Borough: <strong>' + place['Borough'] + '</strong></li>';
      content += '<li> Zip Code: <strong>' + place['Zip Code'] + '</strong></li>';  
      content += '</ul>' +
                 '</div>' +
                    '</div>';
                        
      return content;
  }

  function displayMarkers(map, filename, color) {
    loadJSONData(filename, function(data) {
      data.forEach(function(place) {
        var content = handleContent(filename, place);
        map.addMarker({
          lat: place['lat'],
          lng: place['lng'],
          icon: 'assets/icons/' + color + '-dot.png',
          infoWindow: {
            content: content
          }
        });
    });
  });
  }
    
  function displayCheckedItems(map) {
      $("input:checkbox:checked").each(function(box) {
        var id = $(this).attr("id");
        if(id === "soup_kitchens_checkbox") {
          displayMarkers(map, 'soup_kitchens', 'orange');
        }
        if(id === "senior_centers_checkbox") {
          displayMarkers(map, 'senior_centers', 'red');
        }
        if(id === "snap_centers_checkbox") {
          displayMarkers(map, 'snap_centers', 'green');
        }
        if(id === "food_pantries_checkbox") {
          displayMarkers(map, 'food_pantries', 'yellow');
        }
        if(id === "food_scraps_checkbox") {
          displayMarkers(map, 'food_scraps', 'blue');
        }
        if(id === "homeless_shelters_checkbox") {
            displayMarkers(map, 'homeless_shelters', 'purple');
        }
        if(id === "clothing_charities_checkbox") {
          displayMarkers(map, 'clothing_charities', 'pink');
        }
      }); 
  }

  function handleSubmit(map) {
    submitButton.click(function() {
      GMaps.geocode({
        address: addressField.val().trim(),
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            map.setCenter(latlng.lat(), latlng.lng());
            map.setZoom(14);
            map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng()
            });
          }
        }
      });
      map.removeMarkers();
      displayCheckedItems(map);    
    });
  }

  function init() {
      var map = new GMaps({
        el: '#map',
        lat: 40.7128,
        lng: -74.0060,
        zoom: 11
      });
      displayMarkers(map, 'senior_centers', 'red');
      displayMarkers(map, 'snap_centers', 'green');
      displayMarkers(map, 'soup_kitchens', 'orange');
      displayMarkers(map, 'food_pantries', 'yellow');
      displayMarkers(map, 'food_scraps', 'blue');
      displayMarkers(map, 'homeless_shelters', 'purple');
      displayMarkers(map, 'clothing_charities', 'pink');
      handleSubmit(map);
  }

  init();
});