'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('MainCtrl', function ($rootScope, $scope) {
  	$rootScope.hideNavbar = false;
  	var vm = this;
  	vm.addNewTab = function(){
  		$('a[data-target="#profile"]').tab('show');
  	}
		vm.viewList = function(){
  		$('a[data-target="#vileList"]').tab('show');
  	}
  });
