'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:locationsMoreCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('locationsMoreCtrl', function($scope, $rootScope, $http, $location, ApiService, healthCareBusinessConstants) {
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

    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    //save button click
    var saveUserSuccessCallback = function() {
      console.log("personal saved successfully");
      $location.path('organition');
    };

    vm.saveBtnClick = function() {
      ApiService.post(healthCareBusinessConstants.GET_LOCATIONS, vm.locationsDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
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
          vm.locationsDetailsObj['documents'].push(res.data)
        }, function(res) {
          alert('document upload fail!');
        });
    };
    vm.init = function() {
      vm.getStates();
      vm.locationsDetailsObj = angular.fromJson(localStorage.getItem('locationsDetails'));
      if (Object.keys(vm.locationsDetailsObj).length) {
        vm.viewmode = true;
      } else {
        vm.viewmode = false;
        vm.locationsDetailsObj = {};
        vm.locationsDetailsObj['documents'] = [];
      }
    };
    vm.init();

  });
