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
      var query = "https://www.google.com/search?q=";
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
    
  function googleMapsSearchQuery(name) {
      var query = "https://www.google.com/maps/place";
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
      var content = '';
                        
      
      var factype_color_classes = {
          "soup_kitchens": "black-color",
          "senior_centers": "red-color",
          "snap_centers": "green-color",
          "food_pantries": "yellow-color",
          "food_scraps": "blue-color",
          "clothing_charities": "pink-color",
          "homeless_shelters": "purple-color"
      };
      
      var factype_display_names = {
          "soup_kitchens": "Soup Kitchen",
          "senior_centers": "Senior Center",
          "snap_centers": "SNAP Center",
          "food_pantries": "Food Pantry",
          "food_scraps": "Food Scrap Drop-off Site",
          "clothing_charities": "Clothing Charity",
          "homeless_shelters": "Homeless Shelter"
      }
      
      var opening_div_tag = '<div class="place_info ' + factype_color_classes[type] + '">';
      content += opening_div_tag;
      content += '<a href="' + website_url + '"' + '<h5 class="firstHeading">' + place['Name'] + '</h5></a><hr>' + 
                        '<div id="bodyContent">' + 
                            '<ul>';
      
      var factype = factype_display_names[type];
      
      content += '<li> Type: <br /><strong>' + factype + '</strong></li><br />';
      content += '<li> Address: <br /> <strong>' + place['Address'] + '</strong></li><br />';
      
      if (type === "clothing_charities" || type === "homeless_shelters" || type === "snap_centers") {
          content += '<li> Phone Number: <br /> <strong>' + place['Phone Number'] + '</strong></li><br />';
      }
      
      if (type === "food_scraps") {
          var website = place['Website']
          content += '<li> Website: <br /> <strong><a href="' + website + '">' + website + '</a></strong></li><br />';
          content += '<li> Open Months: <br /> <strong>' + place['MONTH_'] + '</strong></li><br />';
          content += '<li> Days Open: <br /> <strong>' + place['DAYS'] + '</strong></li><br />';
          content += '<li> Times: <br /> <strong>' + place['STARTTIME'] + ' - ' + place['ENDTIME'] + '</strong></li><br />';
      }
      
      content += '<li> Borough: <br /> <strong>' + place['Borough'] + '</strong></li><br />';
      content += '<li> Zip Code: <br /> <strong>' + place['Zip Code'] + '</strong></li><br />';  
      content += '</ul>' +
                 '</div>' +
                    '</div>' + 
                        '</span>';
                        
      return content;
  }

  function displayMarkers(map, filename, color) {
    loadJSONData(filename, function(data) {
      data.forEach(function(place) {
        var content = handleContent(filename, place);
        var latitude = place['lat'];
        var longitude = place['lng'];
        map.addMarker({
          lat: latitude,
          lng: longitude,
          icon: 'assets/icons/' + color + '-dot.png',
          click: function(e) {
            $("#panel").html(content);
            map.setCenter(latitude, longitude);
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