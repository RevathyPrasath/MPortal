'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('StatusCtrl', function($rootScope, ApiService, healthCareBusinessConstants, $location) {
    var vm = this;

    // success Call back method
    function operationsSuccessCallback(response) {
      console.log(response);
      vm.operationsData = response.data;
    };

    function administrationSuccessCallback(response) {
      console.log(response);
      vm.administrationData = response.data;
    };

    function personalSuccessCallback(response) {
      console.log(response);
      vm.personalres = response.data;
      vm.personalData = response.data;
    };

    // error call back method.
    function errorCallback(error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    function finalCallBack(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    vm.statusSelected = function(selectedTab) {
      vm.selected = selectedTab;
      if (selectedTab === 'ADMINISTRATION') {
        vm.personalData = vm.administrationData
      } else if (selectedTab === 'OPERATIONS') {
        vm.personalData = vm.operationsData
      } else {
        vm.personalData = vm.personalres
      }
    };

    vm.isActive = function(selectedTab) {
      //console.log(selectedTab);
      return vm.selected == selectedTab
    }

    var CommonDataSave = function(obj) {
      localStorage.setItem('personnalDetails', angular.toJson(obj.data));
      localStorage.setItem("providerMoreTempData", JSON.stringify({}));
      localStorage.setItem("fromProvider", '');
      localStorage.setItem("addMode", false);
    }

    var PersonalStatusMoreSb = function(obj) {
      CommonDataSave(obj)
      $location.path('personnalDetails');
    };

    var CompanyStatusMoreSb = function(obj) {
      CommonDataSave(obj)
      $location.path('organition');
    }

    var UsersStatusMoreSb = function(obj) {
      CommonDataSave(obj)
      $location.path('userdetails');
    }

    var LocationStatusMoreSb = function(obj) {
      CommonDataSave(obj)
      $location.path('locationsMore');
    }

    vm.providerMore = function(items, type) {
      localStorage.setItem("licenseType", type);
      if (items.objectValue == 'PERSONAL') {
        ApiService.get(healthCareBusinessConstants.PERSONAL_STATUS_MORE + items.id).then(PersonalStatusMoreSb, errorCallback).finally(finalCallBack);
      } else if (items.objectValue == 'COMPANY') {
        ApiService.get(healthCareBusinessConstants.COMPANY_STATUS_MORE + items.id).then(CompanyStatusMoreSb, errorCallback).finally(finalCallBack);
      } else if (items.objectValue == 'USERS') {
        ApiService.get(healthCareBusinessConstants.USER_STATUS_MORE + items.id).then(UsersStatusMoreSb, errorCallback).finally(finalCallBack);
      } else if (items.objectValue == 'LOCATION') {
        ApiService.get(healthCareBusinessConstants.LOCATIONS_STATUS_MORE + items.id).then(LocationStatusMoreSb, errorCallback).finally(finalCallBack);
      }
    };

    vm.init = function() {
      ApiService.get(healthCareBusinessConstants.ADMINISTRATION_STATUS).then(administrationSuccessCallback, errorCallback).finally(finalCallBack);
      ApiService.get(healthCareBusinessConstants.OPERATIONS_STATUS).then(operationsSuccessCallback, errorCallback).finally(finalCallBack);
      ApiService.get(healthCareBusinessConstants.PERSONAL_STATUS).then(personalSuccessCallback, errorCallback).finally(finalCallBack);
    };
    vm.init();
  });