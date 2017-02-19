'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:locationsMoreCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('locationsMoreCtrl', function($scope, $location) {
    var vm = this;

    vm.cancelBtnclick = function () {
      $location.path('organition');
    };

    vm.editBtnClick = function () {
      vm.viewmode = false;
    };

    vm.init = function() {
      vm.locationsDetailsObj = angular.fromJson(localStorage.getItem('locationsDetails'));
      vm.viewmode = true;
      vm.roles = [{ role: 'ADMINISTRATOR' }, { role: 'USER' }];
    };

    vm.init();

  });
