'use strict';
/**
 * @ngdoc function
 * @name healthCareApp.controller:UserdetailsCtrl
 * @description
 * # AdminCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('UserdetailsCtrl', function($interval, $http, $rootScope, $scope, healthCareBusinessConstants, ApiService, $location, UtilService) {
    $rootScope.hideNavbar = false;
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      $scope.showLoader = false;
      if(vm.errorMsg) {
        UtilService.errorMessage(vm.errorMsg);
      } else {
        UtilService.errorMessage('Something went wrong!!');
      }
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      $scope.showLoader = false;
    };

    var getUsersSb = function(res) {
      vm.users = res.data;
    };

    vm.getPersonals = function() {
      $scope.showLoader = true;
      ApiService.get(healthCareBusinessConstants.GET_USERS).then(getUsersSb, errorCallback).finally(finalCallBack);
    };

    vm.cancelBtnclick = function() {
      $location.path('admin');
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    var saveUserSuccessCallback = function () {
      $scope.showLoader = false;
      UtilService.errorMessage('user details saved!!');
      $location.path('admin');
    };

    vm.saveBtnClick = function () {
      $scope.showLoader = true;
      if(vm.userDetailsObj.password == vm.userDetailsObj.confirmPassword) {
        ApiService.post(healthCareBusinessConstants.GET_USERS, vm.userDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        UtilService.errorMessage('password and confirm password should be same!!');
      }
      
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
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
    fd.append('expiryDate', vm.fileuploadObject.expiry);
    fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
    fd.append('documentCategory', 'abc');
    $http.post(url, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      })
      .then(function(res) {
        vm.hideAttachmentCreate();
        $scope.showLoader = false;
        vm.userDetailsObj['documents'].push(res.data);
        UtilService.errorMessage('document upload success!');
      }, function(res) {
        UtilService.errorMessage('document upload fail!');
      });
  };

  var docremoveScb = function(msg) {
    $scope.showLoader = false;
    UtilService.errorMessage('Successfully document removed!!');
  };

  vm.documentRemove = function(index, docId) {
    $scope.showLoader = true;
    vm.userDetailsObj.documents.splice(index, 1);
    var url = healthCareBusinessConstants.DELETE_DOC + docId;
    ApiService.delete(url).then(docremoveScb, errorCallback);
  };

  $interval(function() {
      vm.determinateValue += 1;
      if (vm.determinateValue > 100) {
        vm.determinateValue = 20;
      }
    }, 100);

  vm.init = function() {
    vm.determinateValue = 20;
    vm.userDetailsObj = angular.fromJson(localStorage.getItem('userdetails'));
    if (Object.keys(vm.userDetailsObj).length) {
      vm.viewmode = true;
    } else {
      vm.viewmode = false;
      vm.userDetailsObj = {};
      vm.userDetailsObj['documents'] = [];
    }
    vm.roles = [{ role: 'ADMINISTRATOR' }, { role: 'USER' }];
    console.log(vm.userdetailsObj);
  };

  vm.init();
});