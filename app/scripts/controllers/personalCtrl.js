'use strict';
/**
 * @ngdoc function
 * @name healthCareApp.controller:PersonCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('PersonalCtrl', function($scope, $rootScope, ApiService, healthCareBusinessConstants, $location, $window, UtilService) {
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      if(vm.errorMsg) {
        UtilService.errorMessage(vm.errorMsg);
      } else {
       UtilService.errorMessage("Something went wrong!!");
     }
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      $rootScope.loading = false;
      console.log('finalCallBack', res);
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
        UtilService.errorMessage('Please enter search details!!');
        //vm.errorMsg = 'Please Enter Name/Employee Id/SSN';
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
      if (vm.personals && vm.personals[0] && vm.personals[0].total) {
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
      //console.log(obj);
      localStorage.setItem('personnalDetails', angular.toJson(obj));
      localStorage.setItem("providerMoreTempData", JSON.stringify({}));
      localStorage.setItem("fromProvider", '');
      localStorage.setItem("addMode", false);
      $location.path('personnalDetails');
    };

    vm.fnAdd = function () {
      localStorage.setItem("providerMoreTempData", JSON.stringify({}));
      localStorage.setItem('personnalDetails', angular.toJson({}));
      localStorage.setItem("addMode", true);
      $location.path('personnalDetails');
    };

    //added by Sai
      vm.providerMore = function(items) {
        ApiService.get(healthCareBusinessConstants.PERSONAL_STATUS_MORE + items.personId).then(PersonalStatusMoreSb, errorCallback).finally(finalCallBack);
    
    };

    var PersonalStatusMoreSb = function(obj) {
      CommonDataSave(obj)
      $location.path('personnalDetails');
    };

     var CommonDataSave = function(obj) {
      localStorage.setItem('personnalDetails', angular.toJson(obj.data));
      localStorage.setItem("providerMoreTempData", JSON.stringify({}));
      localStorage.setItem("fromProvider", '');
      localStorage.setItem("addMode", false);
    }

    vm.init = function() {
      $rootScope.loading = true;
      vm.pageNo = 0;
      $rootScope.hideNavbar = false;
      vm.getPersonals(0);
    };

    vm.init();
  });