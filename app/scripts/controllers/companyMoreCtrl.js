'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:locationsMoreCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('companyMoreCtrl', function ($scope, $location) {
    var vm = this;

    vm.cancelBtnclick = function () {
      $location.path('organition');
    };

    vm.editBtnClick = function () {
      vm.viewmode = false;
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

    vm.init = function () {
      vm.companyDetailsObj = angular.fromJson(localStorage.getItem('companyDetails'));
      vm.viewmode = true;
      vm.myDate = new Date();
      vm.hideAttachmentCreate();
    };

    vm.init();

  });
