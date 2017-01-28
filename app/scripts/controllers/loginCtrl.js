'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('LoginCtrl', function($location, $rootScope, ApiService, healthCareBusinessConstants) {
    var vm = this;

    vm.login = function() {
      $rootScope.loading = true;
      var data = {
        "user_name": vm.username,
        "password": vm.password
      };
      ApiService.post(healthCareBusinessConstants.LOGIN_URL, data).then(successCallback, errorCallback).finally(finalCallBack);
    };

    // success Call back method
    function successCallback(response) {
      vm.username = '';
      vm.password = '';
      localStorage.clear();
      localStorage.setItem('jwtToken', response.data.jwtToken);
      localStorage.setItem('username', response.data.role);
      $location.path('main');
    };

    // error call back method.
    function errorCallback(error) {
      vm.username = '';
      vm.password = '';
      vm.errorMsg = 'Please check username/password and Try again';
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    function finalCallBack(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    $rootScope.hideNavbar = true;
  });
