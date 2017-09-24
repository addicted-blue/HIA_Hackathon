app.controller("MainController", ['$scope', '$http', '$timeout', '$window', 'mainService', '$location', 'fileReader', 'cfpLoadingBar', '$rootScope', 'appService', 'mainService', 'growlService', function ($scope, $http, $timeout, $window, mainService, $location, fileReader, cfpLoadingBar, $rootScope, appService, mainService, growlService) {

    if ($location.path() == '/') {
        if (!sessionStorage.getItem('user')) {
            $location.path('/login');
        }
    }

    var url1 = '';
    var count = 0;

    $scope.loggedInUser = {};
    $scope.graphs = {};
    $scope.graphs.programsClicked = false;
    $scope.graphs.homeClicked = true;
    $scope.graphs.isFileLoaded = false;
    $scope.graphs.count = 0;
    $scope.graphs.items = [];
    $scope.isLoginPage = false;
    $scope.x_gridPE = false;
    $scope.y_gridPE = false;
    $scope.originCities = new Array();
    $scope.destinationCities = new Array();

    $scope.logout = function () {
        growlService.growl('Shutting Down', 'inverse');
        setTimeout(function () {
            window.location = '/login';
        }, 3500);
    }

    appService.getDashboard().success(function (response) {
        $scope.dashboard = response;
    });

    appService.getCurrentUser().success(function (response) {
        $scope.loggedInUser = response;
        localStorage.setItem('role', response.role);
        localStorage.setItem('id', response._id);
        localStorage.setItem('name', response.name);
        growlService.growl('Welcome ' + response.name, 'inverse');

        $scope.roleDashboard(response.role);
    });

    $scope.roleDashboard = function (role) {
        for (key in $scope.dashboard) {
            if (key == role) {
                for (property in $scope.dashboard[key]) {
                    $scope['dashboard_' + property] = $scope.dashboard[key][property];
                }
            }
        }
    }

    $scope.now = function () {
        return typeof window.performance !== 'undefined'
            ? window.performance.now()
            : 0;
    }

    $scope.isPath = function (route) {
        return route === $location.path();

    }

    $scope.signOut = function () {
        if (sessionStorage.getItem('user')) {
            sessionStorage.removeItem('user');
        }
        $location.path('/login');
    }

    $scope.gridCheckBoxPE = function () {
        $scope.x_gridPE = !$scope.x_gridPE;
        $scope.y_gridPE = !$scope.y_gridPE;
        $scope.UpdateBarChart();
    }

    $scope.UpdateBarChart = function (obj) {
        var chartColorArray = new Array();
        chartColorArray.push("#1dd09c");
        chartColorArray.push("#8c7cac");
        chartColorArray.push("#9c3773");

        var chart = c3.generate({
            bindto: d3.select("#modelBar"),
            padding: {
                bottom: 30
            },
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 130, 100, 140, 200, 150, 50],
                    ['data3', 120, 150, 200, 300, -200, 100]
                ],
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            color: {
                pattern: chartColorArray
            }
        });

        $scope.generateTicketStausChart();
        $scope.generateAssetWiseChart();
        $scope.generatePieAreaChart();
    }

    $scope.generateTicketStausChart = function () {
        var chart = c3.generate({
            bindto: d3.select("#modelTicketStatusChart"),
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type: 'pie',
            }
        });
    }

    $scope.generateAssetWiseChart = function () {
        var chart = c3.generate({
            bindto: d3.select("#modelAssetWiseChart"),
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120]
                ],
                type: 'pie',
            }
        });
    }

    $scope.generatePieAreaChart = function () {
        var chart = c3.generate({
            bindto: d3.select("#modelAreaChart"),
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type: 'pie',
            }
        });
    }
    
    $scope.getTickets = function(){
    	
    	$scope.totalTickets = 0;
        $scope.openTicketCount = 0;
        $scope.closeTicketCount = 0;
        $scope.rejectedTicketCount = 0;
    	
    	appService.getTickets().success(function(response){
            $scope.ticketList = response;
            $scope.totalTickets = $scope.ticketList.length;
            for(ticket of $scope.ticketList){
                if(ticket.status == 'open'){
                    $scope.openTicketCount++;
                }else if(ticket.status == 'close'){
                    $scope.closeTicketCount++;
                }else if(user.role == 'rejected'){
                    $scope.rejectedTicketCount++
                }
            }
    		console.log(response);
        });
    	
    }
    

    // modelTicketStatusChart
    // modelAssetWiseChart
    //modelPieArea
}]);