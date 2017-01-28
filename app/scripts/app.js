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
    'ngTouch',
    'ngMaterial'
  ])
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/operations', {
        templateUrl: 'views/operations.html',
        controller: 'OperationsCtrl',
        controllerAs: 'operations'
      })
      .when('/status', {
        templateUrl: 'views/status.html',
        controller: 'StatusCtrl',
        controllerAs: 'status'
      })
      .when('/personal', {
        templateUrl: 'views/personal.html',
        controller: 'PersonalCtrl',
        controllerAs: 'personal'
      })
      .when('/organition', {
        templateUrl: 'views/organition.html',
        controller: 'OrganitionCtrl',
        controllerAs: 'organition'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'admin'
      })
      .when('/userdetails', {
        templateUrl: 'views/userdetails.html',
        controller: 'UserdetailsCtrl',
        controllerAs: 'user'
      })
      .otherwise({
        redirectTo: '/login'
      })
    $httpProvider.interceptors.push(function($q, $cookies) {
      return {
        'request': function(config) {
          config.headers['authorization'] = 'Bearer ' + localStorage.getItem('jwtToken');
          return config;
        }
      };
    });
  });
