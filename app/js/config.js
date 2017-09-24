app
    .config(function ($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home");


        $stateProvider
        
            //------------------------------
            // HOME
            //------------------------------
        
            .state ('home', {
                url: '/home',
                templateUrl: 'views/home.html',
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load ([
                            {
                                name: 'vendors',
                                insertBefore: '#app-level-js',
                                files: [
                                    'vendors/sparklines/jquery.sparkline.min.js'
                                ]
                            }
                        ])
                    }
                }
            })
        

            //------------------------------
            // DEFAULT
            //------------------------------
        
            .state ('default', {
                url: '/default',
                templateUrl: 'views/default.html'
            })
            
            //------------------------------
            // DEFAULT
            //------------------------------
        
            .state ('page1', {
                url: '/page1',
                templateUrl: 'views/page1.html'
            })
            
            //------------------------------
            // DEFAULT
            //------------------------------
        
            .state ('page2', {
                url: '/page2',
                templateUrl: 'views/page2.html'
            })
            
            //------------------------------
            // DEFAULT
            //------------------------------
        
            .state ('page3', {
                url: '/page3',
                templateUrl: 'views/page3.html'
            })
        
            .state ('roles', {
                url: '/roles',
                templateUrl: 'views/roles.html'
            })
            
            .state ('tickets', {
                url: '/tickets',
                templateUrl: 'views/tickets.html'
            })
            
            .state ('admin-ticket', {
                url: '/admin-ticket',
                templateUrl: 'views/admin-ticket.html'
            })
            
            .state ('vendor-ticket', {
                url: '/vendor-ticket',
                templateUrl: 'views/vendor-ticket.html'
            })
			
    });
