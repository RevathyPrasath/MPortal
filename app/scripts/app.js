'use strict';

/**
 * @ngdoc overview
 * @name healthCareApp
 * @description
 * # healthCareApp
 *
 * Main module of the application.
 */
angular
  .module('healthCareApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/statusReport', {
        templateUrl: 'views/statusReport.html',
        controller: 'StatusReportCtrl',
        controllerAs: 'statusReport'
      })
      .otherwise({
        redirectTo: '/login'
      })

      $httpProvider.interceptors.push(function($q, $cookies) {
        return {
         'request': function(config) {
            config.headers['authorization'] = 'Bearer '+ localStorage.getItem('jwtToken');
            return config;
          }
        };
      });
  });
