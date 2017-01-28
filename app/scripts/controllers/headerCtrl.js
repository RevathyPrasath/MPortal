'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('HeaderCtrl', function($location) {
    var vm = this;

    vm.navigate = function(name) {
      $location.path(name);
    };

  });
