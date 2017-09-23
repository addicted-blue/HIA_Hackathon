app

    .controller('rolesCtrl', function($scope, $timeout, $state, growlService, appService, $http){
        
        
        /*$scope.userList = {};
        $scope.ticket = {};
        $scope.ticket.requestType = 'select';
        
        $scope.clearTicket = function(){
            $scope.ticket.requestType = 'select';
            $scope.ticket.description = '';
            $scope.ticket.address = '';
        }*/
        
        $scope.addTicket = function(){
            console.log($scope.ticket);
            
            var data = {
                'requestType': $scope.ticket.requestType,
                'description': $scope.ticket.description,
                'address': $scope.ticket.address,
                'createdBy': localStorage.getItem('id'),
                'latitude': $scope.ticket.latitude,
                'longitude': $scope.ticket.longitude
            };
            
            appService.saveTicket(data).then(function(response){
                //$scope.loadUsers();
                growlService.growl('Ticket is created', 'inverse');
            });
            
        }
        
        $scope.loadUsers = function(){
            
            $scope.totalAccounts = 0;
            $scope.userCount = 0;
            $scope.adminCount = 0;
            $scope.vendorCount = 0;
            
            appService.getUsers().success(function(response){
                $scope.userList = response;
                $scope.totalAccounts = $scope.userList.length;
                for(user of $scope.userList){
                    if(user.role == 'user'){
                        $scope.userCount++
                    }else if(user.role == 'vendor'){
                        $scope.vendorCount++
                    }else if(user.role == 'admin'){
                        $scope.adminCount++
                    }
                }
            });
        }
        
        $scope.loadUsers();
    
        
    
        $scope.updateUserRole = function(user){
            
            var data = {'_id': user._id, 'role': user.role};
            
            appService.updateUserRole(data).then(function(response){
                $scope.loadUsers();
                growlService.growl(user.name+' is now '+user.role, 'inverse');
            });
             
        }
        
        
        
        
        

        
    });
        