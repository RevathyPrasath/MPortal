'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:locationsMoreCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('companyMoreCtrl', function($scope, $location, ApiService, healthCareBusinessConstants) {
    var vm = this;

    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    vm.cancelBtnclick = function() {
      $location.path('organition');
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
    };

    vm.createAttachment = function() {
      // make an api for adding the new attachment
      vm.hideAttachmentCreate();
    };

    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    vm.init = function() {
      vm.companyDetailsObj = angular.fromJson(localStorage.getItem('companyDetails'));
      vm.viewmode = true;
      vm.myDate = new Date();
      vm.hideAttachmentCreate();
      vm.getStates();
    };

    vm.init();

  });
