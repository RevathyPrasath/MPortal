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
      if (vm.errorMsg) {
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

    var saveUserSuccessCallback = function() {
      $scope.showLoader = false;
      UtilService.errorMessage('user details saved!!');
      $location.path('admin');
    };

    vm.saveBtnClick = function() {
      if (vm.userDetailsObj.password == vm.userDetailsObj.confirmPassword) {
        if (vm.userDetailsObj.lastName && vm.userDetailsObj.firstName && vm.userDetailsObj.userName && vm.userDetailsObj.email && vm.userDetailsObj.password) {
          $scope.showLoader = true;
          ApiService.post(healthCareBusinessConstants.GET_USERS, vm.userDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
        } else {
          UtilService.errorMessage('Please Enter the required fields.');
        }
      } else {
        UtilService.errorMessage('password and confirm password should be same!!');
      }

    };

    vm.showAttachmentCreate = function() {
      vm.fileuploadObject = {};
      vm.fileuploadObject.trackExpiry = false;
      vm.attachmentCreateViewmode = true;
      vm.showDeleteDoc = false;
    };

    vm.hideAttachmentCreate = function() {
      vm.attachmentCreateViewmode = false;
    };

    var fd = new FormData();
    $scope.uploadFile = function(files) {
      fd.append("uploadingFiles", files[0]);
    };

    // update doc
    vm.fileuploadObject = {};
    vm.fileuploadObject.trackExpiry = false;

    vm.checkExpireValidation = function() {
      if (vm.fileuploadObject.trackExpiry) {
        if (vm.fileuploadObject.expiry) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };

    vm.createAttachment = function(doc) {
      if(vm.checkExpireValidation()) {
      $scope.showLoader = true;
      var url = null;
      var newDoc = false;
      if (!vm.showDeleteDoc) {
        newDoc = true;
        url = healthCareBusinessConstants.SAVE_DOC;
      } else {
        newDoc = false;
        url = healthCareBusinessConstants.UPDATE_DOC;
        fd.append('documentUrl', vm.fileuploadObject.url);
        fd.append('documentName', vm.fileuploadObject.documentName);
      }
      var docId = (vm.fileuploadObject.docId ? vm.fileuploadObject.docId : 0);
      fd.append('description', vm.fileuploadObject.shortdescription);
      fd.append('notes', vm.fileuploadObject.notes);
      fd.append('expiryDate', vm.fileuploadObject.expiry);
      fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
      fd.append('documentCategory', 'testing');
      fd.append('docID', docId);
      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        })
        .then(function(res) {
          vm.hideAttachmentCreate();
          $scope.showLoader = false;
          if (newDoc) {
            vm.userDetailsObj['documents'].push(res.data);
            vm.saveBtnClick();
          } else {
            for (var i = 0; i < vm.userDetailsObj['documents'].length; i++) {
              if (vm.userDetailsObj['documents'][i].documentId === docId) {
                vm.userDetailsObj['documents'][i] = res.data;
                vm.saveBtnClick();
              }
            }
          }
          UtilService.errorMessage('document upload success!');
        }, function(res) {
          $scope.showLoader = false;
          UtilService.errorMessage('document upload fail!');
        });
      } else {
        UtilService.errorMessage('Please select Expiry Date!');
      }
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
        expiry: new Date(obj.license[0].expiryDate),
        trackExpiry: obj.license[0].isDue,
        url: obj.documentUrl,
        docId: obj.documentId,
        documentName: obj.documentName
      }
      vm.showDeleteDoc = true;
      console.log(obj);
    };

    vm.init = function() {
      vm.determinateValue = 20;
      vm.userDetailsObj = angular.fromJson(localStorage.getItem('userdetails'));
      if (Object.keys(vm.userDetailsObj).length) {
        vm.viewmode = true;
      } else {
        vm.viewmode = false;
        vm.userDetailsObj = {};
        vm.userDetailsObj.status = true;
        vm.userDetailsObj['documents'] = [];
      }
      vm.roles = [{ role: 'ADMINISTRATOR' }, { role: 'USER' }];
      console.log(vm.userdetailsObj);
    };

    vm.init();
  });