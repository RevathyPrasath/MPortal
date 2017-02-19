'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function($scope, $location) {
    var vm = this;
    // vm.urlParams = JSON.parse($location.search().obj);
    // console.log($location.search().obj);
    // vm.readOnlyInput = true;
    // vm.fnEditPersonnal = function() {
    //   vm.readOnlyInput = false;
    // }
    // vm.states = ['California', 'NewYork', 'London'];
    // vm.supervisors = ['superVisor', 'xyz', 'abc'];
    // vm.locations = [null, 'xyz', 'abc'];

    vm.init = function() {
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      vm.viewmode = true;
      vm.roles = [{ role: 'ADMINISTRATOR' }, { role: 'USER' }];
    };

    vm.init();

  });
