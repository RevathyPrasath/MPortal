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

    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      console.log("logout response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    var logoutSb = function(){

    };

    vm.navigate = function(name) {
      $location.path(name);
    };
    vm.logout = function() {
   		//$rootScope.loading = true;
   		//var obj = {
			// 	"user_name": "ADMIN",
			// 	"password": "1234"
			// };
			$location.path('login');
			localStorage.clear();
    	//ApiService.get(healthCareBusinessConstants.LOG_OUT).then(logoutSb, errorCallback).finally(finalCallBack);
    };

  });
