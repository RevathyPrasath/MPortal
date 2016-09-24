'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:PersonCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('PersonCtrl', function ($rootScope, ApiService, healthCareBusinessConstants) {
  	var vm = this;
  	vm.addPerson = function (obj) {
      console.log(obj)
    };

  });
