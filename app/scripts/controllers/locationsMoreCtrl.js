'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:locationsMoreCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('locationsMoreCtrl', function($scope, $rootScope, $http, $location, $interval, UtilService, ApiService, healthCareBusinessConstants) {
    var vm = this;

    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      $scope.showLoader = false;
      if(vm.errorMsg) {
        UtilService.errorMessage(vm.errorMsg);
      } else {
        UtilService.errorMessage('Something went wrong!!');
      }
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $scope.showLoader = false;
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
      $scope.showLoader = false;
      UtilService.errorMessage("locations saved successfully");
      //console.log("personal saved successfully");
      $location.path('organition');
    };

    vm.saveBtnClick = function() {
      $scope.showLoader = true;
      ApiService.post(healthCareBusinessConstants.GET_LOCATIONS, vm.locationsDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
    };

      vm.showAttachmentCreate = function() {
      vm.fileuploadObject = {};
      vm.fileuploadObject.trackExpiry = false;
      vm.attachmentCreateViewmode = true;
      vm.showDeleteDoc = false;
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
    vm.fileuploadObject.trackExpiry = false;
    vm.createAttachment = function() {
      $scope.showLoader = true;
      var url = healthCareBusinessConstants.SAVE_DOC;
      fd.append('description', vm.fileuploadObject.shortdescription);
      fd.append('notes', vm.fileuploadObject.notes);
       if (vm.fileuploadObject.expiry) {
          fd.append('expiryDate', vm.fileuploadObject.expiry);
        } else {
          fd.append('expiryDate', new Date(0));
        }
      fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
      fd.append('documentCategory', 'abc');

      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        })
        .then(function(res) {
          vm.hideAttachmentCreate();
          $scope.showLoader = false;
          vm.locationsDetailsObj['documents'].push(res.data)
        }, function(res) {
          $scope.showLoader = false;
          UtilService.errorMessage("document upload fail!");
        });
    };

    var docremoveScb = function(msg) {
      $scope.showLoader = false;
      UtilService.errorMessage('Successfully document removed!!');
    };

      vm.documentRemove = function(docId) {
      $scope.showLoader = true;
      var url = healthCareBusinessConstants.DELETE_DOC + docId;
      ApiService.delete(url).then(docremoveScb, errorCallback);
    };

    $interval(function() {
      vm.determinateValue += 1;
      if (vm.determinateValue > 100) {
        vm.determinateValue = 20;
      }
    }, 100);

    vm.viewDoc = function(obj) {
      vm.attachmentCreateViewmode = true;
      vm.fileuploadObject = {
        shortdescription: obj.license[0].shortDescription,
        notes: obj.license[0].notes,
        trackExpiry: obj.license[0].isDue,
        url: obj.documentUrl,
        docId: obj.documentId,
        documentName: obj.documentName
      }
      if (obj.license[0].expiryDate !== 0) {
        vm.fileuploadObject['expiry'] = new Date(obj.license[0].expiryDate)
      }
      vm.showDeleteDoc = true;
    };

    vm.init = function() {
       vm.determinateValue = 20;
      vm.getStates();
      vm.locationsDetailsObj = angular.fromJson(localStorage.getItem('locationsDetails'));
      if(vm.locationsDetailsObj && vm.locationsDetailsObj.addressId && vm.locationsDetailsObj.addressId.phone) {
        vm.locationsDetailsObj.addressId.phone = parseInt(vm.locationsDetailsObj.addressId.phone);
      }
      if (vm.locationsDetailsObj && Object.keys(vm.locationsDetailsObj).length) {
        vm.viewmode = true;
      } else {
        vm.viewmode = false;
        vm.locationsDetailsObj = {};
        vm.locationsDetailsObj['documents'] = [];
      }
    };
    vm.init();

  });
