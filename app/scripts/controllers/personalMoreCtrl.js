'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function($scope, $rootScope, $http, $filter, $location, ApiService, healthCareBusinessConstants) {
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

    var getLocationsSb = function(res) {
      vm.locations = res.data;
    };

    vm.getLocations = function() {
      ApiService.get(healthCareBusinessConstants.GET_LOCATIONS_LIST).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };

    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    // Save personal flow starts
    var savePersonalSuccessCallback = function() {
      console.log("personal saved successfully");
      $location.path('personal');
    };

    vm.savePersonal = function() {
      vm.personalDetailsObj.dateOfBirth = (vm.personalDetailsObj.dateOfBirth) ? vm.personalDetailsObj.dateOfBirth.getTime() : 0;
      ApiService.post(healthCareBusinessConstants.PERSONAL, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
    };

    var fd = new FormData();
    $scope.uploadFile = function(files) {
      fd.append("uploadingFiles", files[0]);
    };

    vm.fileuploadObject = {};
    vm.createAttachment = function() {
      var url = healthCareBusinessConstants.SAVE_DOC;
      fd.append('description', vm.fileuploadObject.shortdescription);
      fd.append('notes', vm.fileuploadObject.notes);
      fd.append('expiryDate', vm.fileuploadObject.expiry);
      fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
      fd.append('documentCategory', 'abc');

      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        })
        .then(function(res) {
          vm.hideAttachmentCreate();
          vm.personalDetailsObj.document.push(res.data);
          //vm.locationsDetailsObj['documents'].push(res.data)
        }, function(res) {
          alert('document upload fail!');
        });
    };

    // Save personal flow ends

    vm.init = function() {
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      vm.personalDetailsObj.dateOfBirth = new Date(vm.personalDetailsObj.dateOfBirth);
      if (Object.keys(vm.personalDetailsObj).length) {
        vm.viewmode = true;
        vm.personalDetailsObj.myDate = new Date();
      } else {
        vm.viewmode = false;
        vm.personalDetailsObj = {};
        vm.personalDetailsObj['document'] = [];
      }
      vm.getLocations();
      vm.getStates();
    };

    vm.init();

  });
