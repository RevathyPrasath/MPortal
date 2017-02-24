'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function($scope, $rootScope, $location, ApiService, healthCareBusinessConstants) {
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

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    vm.cancelBtnclick = function() {
      $location.path("personal");
    };

    vm.addNewDocument = function() {
      vm.attachmentCreateViewmode = true;
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

    vm.getLocationsSb = function(res) {
      vm.locations = res.data;
    };

    vm.getLocations = function() {
      ApiService.get(healthCareBusinessConstants.LOCATIONS).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };

    vm.init = function() {
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      vm.viewmode = true;
      vm.personalDetailsObj.myDate = new Date();
      //vm.getLocations();
    };

    vm.init();

  });
