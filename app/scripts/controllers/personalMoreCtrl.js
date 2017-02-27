'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function ($scope, $rootScope, $location, ApiService, healthCareBusinessConstants) {
    var vm = this;
    var errorCallback = function (error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function (res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    vm.editBtnClick = function () {
      vm.viewmode = false;
    };

    vm.cancelBtnclick = function () {
      $location.path("personal");
    };

    vm.addNewDocument = function () {
      vm.attachmentCreateViewmode = true;
    };

    vm.showAttachmentCreate = function () {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function () {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
    };

    vm.createAttachment = function () {
      // make an api for adding the new attachment
      vm.hideAttachmentCreate();
    };

    var getLocationsSb = function (res) {
      vm.locations = res.data;
    };

    vm.getLocations = function () {
      ApiService.get(healthCareBusinessConstants.GET_LOCATIONS_LIST).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };

    var getStatesSb = function (res) {
      vm.states = res.data;
    };

    vm.getStates = function () {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    // Save personal flow starts

    var savePersonalSuccessCallback = function () {
      console.log("personal saved successfully");
      $location.path('personal');
    };

    vm.savePersonal = function () {
      vm.personalDetailsObj.dateOfBirth = (vm.personalDetailsObj.dateOfBirth) ? vm.personalDetailsObj.dateOfBirth.getTime() : 0;
      ApiService.post(healthCareBusinessConstants.PERSONAL, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
    };

    // Save personal flow ends

    vm.init = function () {
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      if (Object.keys(vm.personalDetailsObj).length) {
        vm.viewmode = true;
        vm.personalDetailsObj.myDate = new Date();
      } else {
        vm.viewmode = false;
      }

      vm.getLocations();
      vm.getStates();
    };

    vm.init();

  });
