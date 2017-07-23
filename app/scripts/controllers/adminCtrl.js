'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('AdminCtrl', function($interval, $rootScope, UtilService, $scope, healthCareBusinessConstants, ApiService, $location) {
    $rootScope.hideNavbar = false;
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      $scope.showLoader = false;
      if (error && error.data) {
        vm.errorMsg = error.data.message;
      }
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $scope.showLoader = false;
    };

    var getUsersSb = function(res) {
      vm.users = res.data;
      $scope.showLoader = false;
    };

    vm.getPersonals = function() {
      $scope.showLoader = true;
      ApiService.get(healthCareBusinessConstants.GET_USERS).then(getUsersSb, errorCallback).finally(finalCallBack);
    };

    vm.userDetailsView = function(obj) {debugger;
      console.log(obj);
      localStorage.setItem('userdetails', angular.toJson(obj));
      $location.path('userdetails');
    };

    $interval(function() {
      vm.determinateValue += 1;
      if (vm.determinateValue > 100) {
        vm.determinateValue = 20;
      }
    }, 100);

    vm.addNew = function() {
     $location.path('userdetails');
     localStorage.setItem('userdetails', angular.toJson({}));
    };

    // success Call back method
    var searchSuccessCallback = function(res) {
      vm.users = res.data;
    };

    vm.searchUsers = function() {
      $scope.showLoader = true;
      var searchObj = {
        "firstName": vm.firstName,
        "lastName": vm.lastName,
        "activeFlag": vm.status
      };
      searchObj.firstName = vm.firstName || '';
      searchObj.lastName = vm.lastName || '';
      searchObj.activeFlag = Boolean(vm.status) || "";

      if (vm.firstName || vm.lastName || vm.status) {
        ApiService.post(healthCareBusinessConstants.SEARCH_USER, searchObj).then(searchSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        UtilService.errorMessage('Please Enter Valid Name!!');
       // vm.errorMsg = 'Please Enter Valid Name';
      }
    };

    vm.init = function() {
      vm.determinateValue = 20;
      vm.getPersonals();
    };

    vm.init();
  });