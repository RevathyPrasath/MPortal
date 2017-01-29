'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
    .controller('personalMore', function($scope, $location) {
        var vm = this;
        vm.urlParams = JSON.parse($location.search().obj);
        console.log($location.search().obj);
        vm.readOnlyInput = true;
        vm.fnEditPersonnal = function() {
            vm.readOnlyInput = false;
        }
        vm.states=['California','NewYork','London'];
        vm.supervisors=['superVisor','xyz','abc'];
        vm.locations=[null,'xyz','abc'];
    });
