app.service('appService', ['$http', function($http){
	var s = this; 
	
	s.fetchExcelData = function(){
		return $http.get('/api/getExcelData/1');
	}
    
    s.getCurrentUser = function(){
        return $http.get('/api/users/current');
    }
    
    s.getDashboard = function(){
        return $http.get('/dashboard');
    }
    
    s.getUsers = function(){
        return $http.get('/getUsers');
    }
    
    s.getTicketById = function(id){
    	return $http.get('/getTicketsById/'+id);
    }
    
    s.getTickets = function(id){
    	return $http.get('/getTickets');
    }
    
    s.getVendors = function(id){
    	return $http.get('/getVendors');
    }
    
    
    s.updateUserRole = function(data){
        var result = '/updateUserRole';
        return $http({
            method: 'PUT',
            url: result,
            data: data
        });
    }
    
    s.assignedTicket = function(data){
        var result = '/assignedTicket';
        return $http({
            method: 'PUT',
            url: result,
            data: data
        });
    }
    
    s.closeTicket = function(data){
        var result = '/closeTicket';
        return $http({
            method: 'PUT',
            url: result,
            data: data
        });
    }
   
    
    s.getAssignedTicketsById = function(id){
    	return $http.get('/getAssignedTicketsById/'+id);
    }
    
    s.saveTicket = function(data){
        var result = '/saveTicket';
        return $http({
            method: 'POST',
            url: result,
            data: data
        });
    }
    
    
    
		 
}]);