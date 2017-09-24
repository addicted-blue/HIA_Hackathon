app
    // =========================================================================
    // Base controller for common functions
    // =========================================================================

.controller('ticketMapCtrl', function($scope, $http, appService){

    $scope.name = 'Sunny';
    
    $scope.location = '';
    
    $scope.mapAddress = {};
    $scope.formattedAddress = '';
    
    
    var markers = [];
    
    $scope.getTickets = function(){
    	
    	$scope.totalTickets = 0;
        $scope.openTicketCount = 0;
        $scope.closeTicketCount = 0;
        $scope.rejectedTicketCount = 0;
    	
    	appService.getTickets().success(function(response){
            $scope.ticketList = response;
            $scope.totalTickets = $scope.ticketList.length;
            for(ticket of $scope.ticketList){
                markers.push({
                	"coords":{
                		lat: parseFloat(ticket.latitude),
                		lng: parseFloat(ticket.longitude)
                	},
                	content: "("+ticket.requestType+") "+ticket.description
                })
            }
            
            for(var i = 0;i < markers.length;i++){
            	$scope.addMarker(markers[i]);
              }
    		console.log(markers);
        });
    	
    }
    
    $scope.addMarker = function(props){
        var marker = new google.maps.Marker({
          position:props.coords,
          map:$scope.maps,
          //icon:props.iconImage
        });
    	$scope.markers.push(marker);
        //Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open($scope.map, marker);
          });
        }
      }
    
    $scope.getTickets();
    
    
    $scope.getMaps = function(){
        console.log($scope.location);
    
        var params = "address="+$scope.location+"&key:'AIzaSyCi2MrFl3CDtJu1UWNlPGlHlvY1Cop3MwM'";
        

        
        axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        	params:{
                address:$scope.location,
                key:'AIzaSyCi2MrFl3CDtJu1UWNlPGlHlvY1Cop3MwM'
              }
        })
        .then(function(response){
        // Log full response
        console.log(response);
        $scope.mapAddress = response.data.results[0];
        $scope.formattedAddress = response.data.results[0].formatted_address;
        $scope.addressComponents = {};
        for(var row of response.data.results[0].address_components){
            $scope.addressComponents[row['types'][0]] = row.long_name;
        }
        
        /*$scope.updateMap();*/
      });
    }
    
    /*$scope.updateMap = function(){
        $scope.addMarker({
          coords:{lat:$scope.mapAddress.geometry.location.lat,lng:$scope.mapAddress.geometry.location.lng}
        }, false);
    }*/
    
    $scope.options = {
        zoom:12,
        center:{lat:18.5941174,lng:73.7081759}
    }
    
    $scope.initMap = function(){
         $scope.maps = new google.maps.Map(document.getElementById('ticketMap'), $scope.options);
    }
    
    $scope.initMap();
    
    $scope.markers = [];
    
 // Listen for click on map
    /*google.maps.event.addListener($scope.maps, 'click', function(event){
      // Add marker
    	$scope.addMarker({coords:event.latLng}, true);
    });*/
    
    /*$scope.addMarker = function(props, isEvent){
    	$scope.setMapOnAll(null)
        var marker = new google.maps.Marker({
          position:props.coords,
          map:$scope.maps,
          //icon:props.iconImage
        });
    	$scope.markers.push(marker);
        //Check for customicon
        if(props.iconImage){
          // Set icon image
          marker.setIcon(props.iconImage);
        }

        // Check content
        if(props.content){
          var infoWindow = new google.maps.InfoWindow({
            content:props.content
          });

          marker.addListener('click', function(){
            infoWindow.open(map, marker);
          });
        }
        if(isEvent)
        	$scope.getAddressByLatLong(marker.position.lat(),  marker.position.lng());
      }*/
    
    
    /*for(var i = 0;i < $scope.markers.length;i++){
        // Add marker
        $scope.addMarker($scope.markers[i]);
      }*/
    
    /*$scope.setMapOnAll = function(map) {
        for (var i = 0; i < $scope.markers.length; i++) {
          if($scope.markers[i].setMap)
        	  $scope.markers[i].setMap(null);
       }
     }*/
    
    /*$scope.getAddressByLatLong = function(lat, log){
		var geocoder  = new google.maps.Geocoder(); 
		var location  = new google.maps.LatLng(lat, log);    // turn coordinates into an object          
		geocoder.geocode({'latLng': location}, $scope.callBack);
	  }*/
    
    /*$scope.callBack = function (results, status) {
		if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
			var add=results[0].formatted_address;   
			$scope.location =  add;
		}
		else
			$scope.location = "No address found";
		$scope.$apply();
    }*/
});