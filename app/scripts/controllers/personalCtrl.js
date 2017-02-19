'use strict';
/**
 * @ngdoc function
 * @name healthCareApp.controller:PersonCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('PersonalCtrl', function($scope, $rootScope, ApiService, healthCareBusinessConstants, $location, $window) {
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    // success Call back method
    var searchSuccessCallback = function(res) {
      vm.personals = res.data;
    };

    vm.searchEmployee = function() {
      var searchObj = {
        "firstName": vm.firstName,
        "lastName": vm.lastName,
        "location": vm.location,
        "activeFlag": vm.status
      };
      if (vm.firstName || vm.lastName || vm.location || vm.status) {
        ApiService.post(healthCareBusinessConstants.PERSONAL_SEARCH_URL, searchObj).then(searchSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        vm.errorMsg = 'Please Enter Name/Employee Id/SSN';
      }
    };

    vm.pagination = function(pageno, selection) {
      console.log("Current page number::", pageno);
      if (selection == 'next') {
        vm.pageNo += 1;
      } else {
        vm.pageNo -= 1;
      }
      vm.getPersonals(vm.pageNo);
    };

    vm.disabled = function(pageno, selection) {
      return vm.pageNo == 0;
    };

    vm.active = function() {
      if (vm.personals && vm.personals[0].total) {
        return vm.pageNo == 0 && vm.pageNo <= vm.personals[0].total / 20;
      }
    };

    var getPersonalsSb = function(res) {
      vm.personals = res.data;
    };

    vm.getPersonals = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.PERSONAL + '?page=' + pagenumber).then(getPersonalsSb, errorCallback).finally(finalCallBack);
    };

    vm.fnViewMore = function (obj) {
      console.log(obj);
      localStorage.setItem('personnalDetails', angular.toJson(obj));
      $location.path('personnalDetails');
    };

    vm.init = function() {
      $rootScope.loading = true;
      vm.pageNo = 0;
      $rootScope.hideNavbar = false;
      vm.getPersonals(0);
    };

    vm.init();
  });