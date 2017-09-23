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
    
    
    s.updateUserRole = function(data){
        var result = '/updateUserRole';
        return $http({
            method: 'PUT',
            url: result,
            data: data
        });
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