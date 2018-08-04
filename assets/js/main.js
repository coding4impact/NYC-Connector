$(function() {
  var submitButton = $("#search");
  var addressField = $("#address");
  var clearAllButton = $("#clear_all");

  function loadJSONData(path, callback) {
    $.getJSON('/json_files/' + path + '.json', function(data) {
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
      
      var content = '<div id="content" class="bg-primary pt-2">'+
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