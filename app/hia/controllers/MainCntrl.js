app.controller("MainController", ['$scope', '$http', '$timeout', '$window', '$location', 'fileReader',
    'cfpLoadingBar', '$rootScope', 'appService', 'mainService', 'growlService', '$q',
    function ($scope, $http, $timeout, $window, $location, fileReader, cfpLoadingBar, $rootScope, appService, mainService, growlService, $q) {

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
        $scope.address = [];
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

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

        $scope.generateTicketStausChart = function () {

            for (ticket of $scope.ticketList) {
                if (ticket.status == 'open') {
                    $scope.openTicketCount++;
                } else if (ticket.status == 'close') {
                    $scope.closeTicketCount++;
                } else if (user.role == 'rejected') {
                    $scope.rejectedTicketCount++
                } else if (ticket.status == 'in-progress') {
                    $scope.inProgress++;
                }
            }

            var statusArray = [];
            for (var i = 0; i < $scope.ticketList.length; i++) {
                statusArray.push($scope.ticketList[i].status);
            }



            var chart = c3.generate({
                bindto: d3.select("#modelTicketStatusChart"),
                data: {
                    columns: [
                        ['Open', $scope.openTicketCount],
                        ['In-Progress', $scope.inProgress],
                        ['Rejected', $scope.rejectedTicketCount],
                        ['Closed', $scope.closeTicketCount],
                    ],
                    type: 'pie',
                }
            });
        }

        $scope.generateAssetWiseChart = function () {
            var requestTypeArray = [];
            for (var i = 0; i < $scope.ticketList.length; i++) {
                requestTypeArray.push($scope.ticketList[i].requestType);
            }


            var distances = {};
            $.map(requestTypeArray, function (e, i) {
                distances[e] = (distances[e] || 0) + 1;
            });
            var lengthAry = [];
            for (var i = 0; i < requestTypeArray.length; i++) {
                lengthAry.push(distances[requestTypeArray[i]]);
            }

            var addrArray = new Array();
            for (var i = 0; i < requestTypeArray.length; i++) {
                var newAry = [];
                newAry.push(requestTypeArray[i]);
                newAry.push(lengthAry[i]);
                addrArray.push(newAry);
            }
            var chart = c3.generate({
                bindto: d3.select("#modelAssetWiseChart"),
                data: {
                    columns: addrArray,
                    type: 'pie',
                }
            });
        }

        $scope.updateBarChart = function () {
            var monthlyReport = [];

            var roadArray = [];
            for (var i = 0; i < $scope.ticketList.length; i++) {
                //if ($scope.ticketList[i].requestType == "roads")
                //    roadArray.push
                monthlyReport.push({
                    monthName: getMonthName($scope.ticketList[i].createdOn),
                    requestType: $scope.ticketList[i].requestType
                });
            }

            var sortedArry = monthlyReport.sort(sortByMonth);

            var janArray = [];
            var febArray = [];
            var marAry = [];
            var mayAry = [];
            var aprAry = [];
            var juneAry = [];
            var julyAry = [];
            var augAry = [];
            var sepAry = [];
            var octAry = [];
            var novAry = [];
            var decAry = [];

            for (var i = 0; i < sortedArry.length; i++) {
                if (sortedArry[i].monthName == monthNames[0])
                    janArray.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[1])
                    febArray.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[2])
                    marAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[3])
                    aprAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[4])
                    mayAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[5])
                    juneAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[6])
                    julyAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[7])
                    augAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[8])
                    sepAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[9])
                    octAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[10])
                    novAry.push(sortedArry[i].requestType);
                if (sortedArry[i].monthName == monthNames[11])
                    decAry.push(sortedArry[i].requestType);
            }

            var chartColorArray = new Array();
            chartColorArray.push("#1dd09c");
            chartColorArray.push("#8c7cac");
            chartColorArray.push("#9c3773");
            chartColorArray.push("#9c3773");
            chartColorArray.push("#9c3773");
            chartColorArray.push("#9c3773");

            var chart = c3.generate({
                bindto: d3.select("#modelBar"),
                padding: {
                    bottom: 30
                },
                data: {
                    rows: [
                        //['Jan', getcount(janArray, "roads"), getcount(janArray, "streetLight"), getcount(janArray, "dustbin"), getcount(janArray, "dustbin"), getcount(janArray, "garden"), getcount(janArray, "others")],
                        //['Feb', getcount(febArray, "roads"), getcount(febArray, "streetLight"), getcount(febArray, "dustbin"), getcount(febArray, "dustbin"), getcount(febArray, "garden"), getcount(febArray, "others")],
                        //['Mar', getcount(marAry, "roads"), getcount(marAry, "streetLight"), getcount(marAry, "dustbin"), getcount(marAry, "dustbin"), getcount(marAry, "garden"), getcount(marAry, "others")],
                        //['Apr', getcount(aprAry, "roads"), getcount(aprAry, "streetLight"), getcount(aprAry, "dustbin"), getcount(aprAry, "dustbin"), getcount(aprAry, "garden"), getcount(aprAry, "others")],
                        //['May', getcount(mayAry, "roads"), getcount(mayAry, "streetLight"), getcount(mayAry, "dustbin"), getcount(mayAry, "dustbin"), getcount(mayAry, "garden"), getcount(mayAry, "others")],
                        //['June', getcount(juneAry, "roads"), getcount(juneAry, "streetLight"), getcount(juneAry, "dustbin"), getcount(juneAry, "dustbin"), getcount(juneAry, "garden"), getcount(juneAry, "others")],
                        //['July', getcount(julyAry, "roads"), getcount(julyAry, "streetLight"), getcount(julyAry, "dustbin"), getcount(julyAry, "dustbin"), getcount(julyAry, "garden"), getcount(julyAry, "others")],
                        //['Aug', getcount(augAry, "roads"), getcount(augAry, "streetLight"), getcount(augAry, "dustbin"), getcount(augAry, "dustbin"), getcount(augAry, "garden"), getcount(augAry, "others")],
                        //['Sep', getcount(sepAry, "roads"), getcount(sepAry, "streetLight"), getcount(sepAry, "dustbin"), getcount(sepAry, "dustbin"), getcount(sepAry, "garden"), getcount(sepAry, "others")],
                        //['Oct', getcount(octAry, "roads"), getcount(octAry, "streetLight"), getcount(octAry, "dustbin"), getcount(octAry, "dustbin"), getcount(octAry, "garden"), getcount(octAry, "others")],
                        //['Nov', getcount(novAry, "roads"), getcount(novAry, "streetLight"), getcount(novAry, "dustbin"), getcount(novAry, "dustbin"), getcount(novAry, "garden"), getcount(novAry, "others")],
                        //['Dec', getcount(decAry, "roads"), getcount(decAry, "streetLight"), getcount(decAry, "dustbin"), getcount(decAry, "dustbin"), getcount(decAry, "garden"), getcount(decAry, "others")]
                        ['roads', "streetLight", "dustbin", "garden", "others"],
                        [getcount(janArray, "roads"), getcount(janArray, "streetLight"), getcount(janArray, "dustbin"), getcount(janArray, "garden"), getcount(janArray, "others")],
                        [getcount(febArray, "roads"), getcount(febArray, "streetLight"), getcount(febArray, "dustbin"), getcount(febArray, "garden"), getcount(febArray, "others")],
                        [getcount(marAry, "roads"), getcount(marAry, "streetLight"), getcount(marAry, "dustbin"), getcount(marAry, "garden"), getcount(marAry, "others")],
                        [getcount(aprAry, "roads"), getcount(aprAry, "streetLight"), getcount(aprAry, "dustbin"), getcount(aprAry, "garden"), getcount(aprAry, "others")],
                        [getcount(mayAry, "roads"), getcount(mayAry, "streetLight"), getcount(mayAry, "dustbin"), getcount(mayAry, "garden"), getcount(mayAry, "others")],
                        [getcount(juneAry, "roads"), getcount(juneAry, "streetLight"), getcount(juneAry, "dustbin"), getcount(juneAry, "garden"), getcount(juneAry, "others")],
                        [getcount(julyAry, "roads"), getcount(julyAry, "streetLight"), getcount(julyAry, "dustbin"), getcount(julyAry, "garden"), getcount(julyAry, "others")],
                        [getcount(augAry, "roads"), getcount(augAry, "streetLight"), getcount(augAry, "dustbin"), getcount(augAry, "garden"), getcount(augAry, "others")],
                        [getcount(sepAry, "roads"), getcount(sepAry, "streetLight"), getcount(sepAry, "dustbin"), getcount(sepAry, "garden"), getcount(sepAry, "others")],
                        [getcount(octAry, "roads"), getcount(octAry, "streetLight"), getcount(octAry, "dustbin"), getcount(octAry, "garden"), getcount(octAry, "others")],
                        [getcount(novAry, "roads"), getcount(novAry, "streetLight"), getcount(novAry, "dustbin"), getcount(novAry, "garden"), getcount(novAry, "others")],
                        [getcount(decAry, "roads"), getcount(decAry, "streetLight"), getcount(decAry, "dustbin"), getcount(decAry, "garden"), getcount(decAry, "others")]            
                    ],
                    type: 'bar'
                },
                bar: {
                    width: {
                        ratio: 0.5
                    }
                },
                //color: {
                //    pattern: chartColorArray
                //},
                legend: {
                    show: true
                },
                axis: {
                    x: {
                        type: 'category',
                        categories: monthNames
                    }
                }
            });
        }

        $scope.getTickets = function () {
            $scope.totalTickets = 0;
            $scope.openTicketCount = 0;
            $scope.closeTicketCount = 0;
            $scope.rejectedTicketCount = 0;
            $scope.inProgress = 0;

            appService.getTickets().success(function (response) {
                $scope.ticketList = response;
                $scope.totalTickets = $scope.ticketList.length;

                $scope.getAddressByLatLong();
                $scope.updateBarChart();
                $scope.generateTicketStausChart();
                $scope.generateAssetWiseChart();
            });

        }

        $scope.getAddressByLatLong = function () {
            var promises = [];

            for (var i = 0; i < $scope.ticketList.length; i++) {
                var geocoder = new google.maps.Geocoder();
                var location = new google.maps.LatLng($scope.ticketList[i].latitude, $scope.ticketList[i].longitude);
                //promises.push(
                geocoder.geocode({ 'latLng': location }, $scope.generatePieAreaChart)
                //);
            }
            //return promises;
        }

        $scope.generatePieAreaChart = function (results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                //for (var i = 0; i < results.length; i++) {
                var add = results[0].formatted_address;
                var ary = add.split(',');
                if (ary.length > 4)
                    $scope.address.push(ary[ary.length - 4]);
                //}
            }
            if ($scope.address.length == $scope.ticketList.length) {
                var distances = {};
                $.map($scope.address, function (e, i) {
                    distances[e] = (distances[e] || 0) + 1;
                });
                var lengthAry = [];
                for (var i = 0; i < $scope.address.length; i++) {
                    lengthAry.push(distances[$scope.address[i]]);
                }

                var addrArray = new Array();
                for (var i = 0; i < $scope.address.length; i++) {
                    var newAry = [];
                    newAry.push($scope.address[i]);
                    newAry.push(lengthAry[i]);
                    addrArray.push(newAry);
                }

                var chart = c3.generate({
                    bindto: d3.select("#modelAreaChart"),
                    data: {
                        columns: addrArray,
                        type: 'pie',
                    }
                });
            }
        }

        var getMonthName = function (d) {
            var date = new Date(d);
            return monthNames[date.getMonth()]
        }

        var sortByMonth = function (a, b) {
            if (monthNames.indexOf(a.monthName) < monthNames.indexOf(b.monthName))
                return -1;
            if (monthNames.indexOf(a.monthName) > monthNames.indexOf(b.monthName))
                return 1;
            return 0;
        }

        var getcount = function (a, b) {
            var result = 0;
            for (var i = 0; i < a.length; i++)
                if (a[i] == b)
                    result++;
            return result;
        }
    }]);