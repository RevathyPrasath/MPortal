'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('AdminCtrl', function($rootScope, $scope, healthCareBusinessConstants, ApiService, $location) {
    $rootScope.hideNavbar = false;
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      if (error && error.data) {
        vm.errorMsg = error.data.message;
      }
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
    };

    var getUsersSb = function(res) {
      vm.users = res.data;
    };

    vm.getPersonals = function() {
      ApiService.get(healthCareBusinessConstants.GET_USERS).then(getUsersSb, errorCallback).finally(finalCallBack);
    };

    vm.userDetailsView = function(obj) {
      console.log(obj);
      localStorage.setItem('userdetails', angular.toJson(obj));
      $location.path('userdetails');
    };

    vm.addNew = function() {
      alert('add')
    };

    // success Call back method
    var searchSuccessCallback = function(res) {
      vm.users = res.data;
    };

    vm.searchUsers = function() {
      var searchObj = {
        "firstName": vm.firstName,
        "lastName": vm.lastName,
        "activeFlag": vm.status
      };
      if (vm.firstName || vm.lastName || vm.status) {
        ApiService.post(healthCareBusinessConstants.SEARCH_USER, searchObj).then(searchSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        vm.errorMsg = 'Please Enter Valid Name';
      }
    };


    vm.init = function() {
      vm.getPersonals();
    };

    vm.init();
  });
