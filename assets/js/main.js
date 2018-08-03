$(function() {
  var submitButton = $("#search");
  var addressField = $("#address");
  var clearAllButton = $("#clear_all");

  function loadJSONData(path, callback) {
    $.getJSON(window.location.href + '/json_files/' + path + '.json', function(data) {
      callback(data);
    });
  }

  function handleContent(type, place) {
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
              
      }
      var content = '<div id="content" class="bg-light pt-2">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h4 id="firstHeading" class="firstHeading">' + place['Name'] +'</h4>'+
            '<div id="bodyContent">'+
            '<ol>' + 
            '<li> Type: ' + factype + '</li>' +
            '<li> Address: ' + place['Address'] + '</li>' + 
            '</ol>'+
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
          icon: 'http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png',
          infoWindow: {
            content: content
          },
          click: function(e) {
            console.log("clicked!");
          }
        });
    });
  });
  }

  function zoomMap(map) {
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
      $("input:checkbox:checked").each(function(box) {
        var id = $(this).attr("id");
        if(id === "soup_kitchens_checkbox") {
          displayMarkers(map, 'soup_kitchens', 'red');
        }
        if(id === "senior_centers_checkbox") {
          displayMarkers(map, 'senior_centers', 'blue');
        }
        if(id === "snap_centers_checkbox") {
          displayMarkers(map, 'snap_centers', 'yellow');
        }
        if(id === "food_pantries_checkbox") {
          displayMarkers(map, 'food_pantries', 'orange');
        }
        if(id === "food_scraps_checkbox") {
          displayMarkers(map, 'food_scraps', 'green');
        }
      });   
    });
  }

  function filterCategories(map) {
    $("input:checkbox").click(function(e) {
      map.removeMarkers();
      $("input:checkbox:checked").each(function(box) {
        var id = $(this).attr("id");
        if(id === "soup_kitchens_checkbox") {
          displayMarkers(map, 'soup_kitchens', 'red');
        }
        if(id === "senior_centers_checkbox") {
          displayMarkers(map, 'senior_centers', 'blue');
        }
        if(id === "snap_centers_checkbox") {
          displayMarkers(map, 'snap_centers', 'yellow');
        }
        if(id === "food_pantries_checkbox") {
          displayMarkers(map, 'food_pantries', 'orange');
        }
        if(id === "food_scraps_checkbox") {
          displayMarkers(map, 'food_scraps', 'green');
        }
      });
    });
  }

  function clearFilters(map) {
    clearAllButton.click(function(e) {
      map.removeMarkers();
      $("input:checkbox").each(function(box) {
        $(this).prop("checked", false);
      })
    });
  }

  function init() {
      var map = new GMaps({
        el: '#map',
        lat: 40.7128,
        lng: -74.0060,
        zoom: 11
      });
      console.log(config.TEST);
      displayMarkers(map, 'senior_centers', 'blue');
      displayMarkers(map, 'snap_centers', 'yellow');
      displayMarkers(map, 'soup_kitchens', 'red');
      displayMarkers(map, 'food_pantries', 'orange');
      displayMarkers(map, 'food_scraps', 'green');
      displayMarkers(map, 'homeless_shelters', 'purple');
      displayMarkers(map, 'clothing_shelters', 'pink');
      zoomMap(map);
      clearFilters(map);
      
  }



  init();
  });
