'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:UserdetailsCtrl
 * @description
 * # AdminCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('UserdetailsCtrl', function($rootScope, $scope, healthCareBusinessConstants, ApiService, $location) {
    $rootScope.hideNavbar = false;
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      if (error && error.data) {
        vm.errorMsg = error.data.message;
      }
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
    };

    var getUsersSb = function(res) {
      vm.users = res.data;
    };

    vm.getPersonals = function() {
      ApiService.get(healthCareBusinessConstants.GET_USERS).then(getUsersSb, errorCallback).finally(finalCallBack);
    };

    vm.cancelBtnclick = function() {
      $location.path('admin');
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


    vm.init = function() {
      vm.userDetailsObj = angular.fromJson(localStorage.getItem('userdetails'));
      if (Object.keys(vm.userDetailsObj).length) {
        vm.viewmode = true;
      } else {
        vm.viewmode = false;
      }
      vm.roles = [{ role: 'ADMINISTRATOR' }, { role: 'USER' }];
      console.log(vm.userdetailsObj);
    };

    vm.init();

  });
