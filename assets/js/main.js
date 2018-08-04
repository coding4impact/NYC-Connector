$(function() {
  var submitButton = $("#search");
  var addressField = $("#address");
  var clearAllButton = $("#clear_all");

  function loadJSONData(path, callback) {
    $.getJSON(window.location.href + 'json_files/' + path + '.json', function(data) {
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
      
      var content = '<div id="content" class="pt-2 bg-light" style="height: 100%;">' + 
                        '<a href="' + searchQueryUrl(place['Name']) + '"' + '<h4 id="firstHeading" class="firstHeading">' + place['Name'] + '</h4></a>' + 
                        '<div id="bodyContent">' + 
                            '<ul>';
      var factype = "";
      switch(type) {
          case "soup_kitchens":
              factype = "Soup Kitchen";
              content += '<li> Type: ' + factype + '</li>';
              break;
          case "senior_centers":
              factype = "Senior Center";
              content += '<li> Type: ' + factype + '</li>';
              break;
          case "snap_centers":
              factype = "Snap Center";
              content += '<li> Type: ' + factype + '</li>';
              break;
          case "food_pantries":
              factype = "Food Pantry";
              content += '<li> Type: ' + factype + '</li>';
              break;
          case "food_scraps":
              factype = "Food Scrap Drop-off Site (Composting)";
              content += '<li> Type: ' + factype + '</li>';
              break;
          case "homeless_shelters":
              factype = "Homeless Shelter";
              content += '<li> Type: ' + factype + '</li>';
              break;
          case "clothing_charities":
              factype = "Clothing Charity";
              content += '<li> Type: ' + factype + '</li>';
              break;
      }
      
      content += '<li> Address: ' + place['Address'] + '</li>';
      
      if (type === "clothing_charities" || type === "homeless_shelters") {
          content += '<li> Phone Number: ' + place['Phone Number'] + '</li>';
      }
      
      if (type === "food_scraps") {
          var website = place['Website']
          content += '<li> Website: <a href="' + website + '">' + website + '</a></li>';
          content += '<li> Open Months: ' + place['MONTH_'] + '</li>';
          content += '<li> Days Open: ' + place['DAYS'] + '</li>';
          content += '<li> Start Time: ' + place['STARTTIME'] + '</li>';
          content += '<li> End Time: ' + place['ENDTIME'] + '</li>';
      }
      
      content += '<li> Borough: ' + place['Borough'] + '</li>';
      content += '<li> Zip Code: ' + place['Zip Code'] + '</li>';  
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