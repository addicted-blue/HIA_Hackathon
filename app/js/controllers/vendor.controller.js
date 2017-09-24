app
    // =========================================================================
    // Base controller for common functions
    // =========================================================================

.controller('vendorTicketCtrl', function($scope, $http, appService, growlService){

    	$scope.searchTicket = '';
        $scope.userList = {};
            $scope.ticket = {};
            $scope.ticket.requestType = 'select';

            $scope.clearTicket = function(){
                $scope.ticket.requestType = 'select';
                $scope.ticket.description = '';
                $scope.ticket.address = '';
        }
        
        $scope.closeTicket = function(ticket, status){
        	
        	console.log(ticket);
        	var data = {
                    '_id': ticket._id,
                    'vendorComments' : ticket.comments,
                    'status': status
                };
                
                appService.closeTicket(data).then(function(response){
                    //$scope.loadUsers();
                	if(status == 'close'){                		
                		growlService.growl('Ticket Closed', 'inverse');
                	}else{
                		growlService.growl('Ticket Rejected', 'inverse');
                	}
                	
                	
                	
                    
                	$('#viewTicket').modal('toggle');
                });
        	
        }
            
        $scope.filterTicketOnStatus = function(status){
        	$scope.searchTicket = status;
        }
        
        $scope.selectedVendor = 'select';
        appService.getVendors().success(function(response){
            $scope.vendorList = response;
        });
        
        
        $scope.getAssignedTicketsById = function(id){
        	
        	$scope.totalTickets = 0;
            $scope.openTicketCount = 0;
            $scope.closeTicketCount = 0;
            $scope.inProgressTicketCount = 0;
        	
        	appService.getAssignedTicketsById(id).success(function(response){
                $scope.ticketList = response;
                $scope.totalTickets = $scope.ticketList.length;
                for(ticket of $scope.ticketList){
                    if(ticket.status == 'open'){
                        $scope.openTicketCount++;
                    }else if(ticket.status == 'close'){
                        $scope.closeTicketCount++;
                    }else if(ticket.status == 'in progress'){
                        $scope.inProgressTicketCount++
                    }
                }
                
        		/*if($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
        			$scope.$apply();*/
        		console.log(response);
            });
        	
        }
        
        
        $scope.viewTicket = function(ticket){
        	console.log(ticket);
        	$scope.activeTicket = ticket;
        	$('#viewTicket').modal();
        }
        
        $scope.getAssignedTicketsById(localStorage.getItem('id'));
        
        
        $scope.addTicket = function(){
            console.log($scope.ticket);
            
            var data = {
                'requestType': $scope.ticket.requestType,
                'description': $scope.ticket.description,
                'address': $scope.ticket.address,
                'createdBy': localStorage.getItem('id'),
                'createdByName': localStorage.getItem('name'),
                'latitude': $scope.ticket.latitude,
                'longitude': $scope.ticket.longitude
            };
            
            appService.saveTicket(data).then(function(response){
                //$scope.loadUsers();
                growlService.growl('Ticket is created', 'inverse');
                setTimeout(function(){
                	$scope.getTicketById(localStorage.getItem('id'));
                },1000);
                
            });
            
        }
        
        
        
        $scope.location = '';
    
        $scope.mapAddress = {};
        $scope.formattedAddress = '';
    
    
        $scope.getMaps = function(){
        console.log($scope.location);
    
        //var params = "address="+$scope.ticket.address+"&key:'AIzaSyCi2MrFl3CDtJu1UWNlPGlHlvY1Cop3MwM'";
        

        
        axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
        	params:{
                address:$scope.ticket.address,
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
            
        $scope.updateMap();
      });
    }
    
    $scope.updateMap = function(){
        $scope.addMarker({
          coords:{lat:$scope.mapAddress.geometry.location.lat,lng:$scope.mapAddress.geometry.location.lng}
        }, false);
    }
    
    $scope.options = {
        zoom:12,
        center:{lat:18.5941174,lng:73.7081759}
    }
    
    $scope.initMap = function(){
         $scope.maps = new google.maps.Map(document.getElementById('map'), $scope.options);
    }
    
    $scope.initMap();
    
    $scope.markers = [];
    
 // Listen for click on map
    google.maps.event.addListener($scope.maps, 'click', function(event){
      // Add marker
    	$scope.addMarker({coords:event.latLng}, true);
    });
    
    $scope.addMarker = function(props, isEvent){
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
        $scope.ticket.latitude = marker.position.lat();
        $scope.ticket.longitude = marker.position.lng();
        if(isEvent)
        	$scope.getAddressByLatLong($scope.ticket.latitude,  $scope.ticket.longitude);
        
        
      }
    
    
    for(var i = 0;i < $scope.markers.length;i++){
        // Add marker
        $scope.addMarker($scope.markers[i]);
      }
    
    $scope.setMapOnAll = function(map) {
        for (var i = 0; i < $scope.markers.length; i++) {
          if($scope.markers[i].setMap)
        	  $scope.markers[i].setMap(null);
       }
     }
    
    $scope.getAddressByLatLong = function(lat, log){
		var geocoder  = new google.maps.Geocoder(); 
		var location  = new google.maps.LatLng(lat, log);    // turn coordinates into an object          
		geocoder.geocode({'latLng': location}, $scope.callBack);
	  }
    
    $scope.callBack = function (results, status) {
		if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
			var add=results[0].formatted_address;   
			$scope.ticket.address =  add;
		}
		else
			$scope.ticket.address = "No address found";
		$scope.$apply();
    }
    
    
});