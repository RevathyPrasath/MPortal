'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:locationsMoreCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('companyMoreCtrl', function($scope, $location) {
    var vm = this;

    vm.cancelBtnclick = function () {
      $location.path('organition');
    };

    vm.editBtnClick = function () {
      vm.viewmode = false;
    };

    vm.init = function() {
      vm.companyDetailsObj = angular.fromJson(localStorage.getItem('companyDetails'));
      vm.viewmode = true;
    };

    vm.init();

  });
