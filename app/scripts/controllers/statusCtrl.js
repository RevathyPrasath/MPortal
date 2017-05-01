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
    function successCallback(response) {
      console.log(response);
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
    };

    vm.isActive = function(selectedTab) {
      console.log(selectedTab);
      return vm.selected == selectedTab
    }

    vm.providerMore = function (items, type) {
      localStorage.setItem("providerMoreInfo", JSON.stringify(items));
      localStorage.setItem("licenseType", type);
      localStorage.setItem("frompage", 'status');
      //$location.path(localStorage.getItem("status"));
      $location.path("providermore");
    };

    vm.init =  function(){
      ApiService.get(healthCareBusinessConstants.PERSONAL_STATUS).then(successCallback, errorCallback).finally(finalCallBack); 
    };
    vm.init();
});