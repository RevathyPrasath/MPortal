'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('HeaderCtrl', function ($location) {
  	var vm = this;

    vm.getClass = function (path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    };

  	//human Resource tab click.
  	vm.humanResource = function () {
  		$location.path('main');
  	};

  	vm.statusReport = function () {
  		$location.path('statusReport');
  	};

  });
