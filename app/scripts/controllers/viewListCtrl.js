'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('ViewListCtrl', function ($rootScope, ApiService, healthCareBusinessConstants, $location) {
  	var vm = this;
  	$rootScope.hideNavbar = false;
    console.log(vm.jwtToken);
  	vm.searchEmployee = function () {
     $rootScope.loading = true;
     var searchObj = { "empId": vm.employeeId, "empFirstName": vm.name, "empLastName": null, "tilte": null, "location": null, "supervisor": null, "phiAccess": null, "status": null, "system": null, "userName": null, "dob": null, "gender": null, "ssn": vm.ssn, "active": null, "createDt": null, "updatedDt": null, "updatedId": null };
      if(vm.employeeId || vm.name || vm.ssn){
        ApiService.post(healthCareBusinessConstants.SEARCH_URL, searchObj).then(successCallback, errorCallback).finally(finalCallBack);
      } else {
        vm.errorMsg = 'Please Enter Name/Employee Id/SSN';
        $rootScope.loading = false;
      }
  	};

     // success Call back method
    function successCallback (response) {
      console.log(response);
      vm.users = response.data;
    };

    // error call back method.
    function errorCallback (error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

     // final call back method called no matter success or failure
    function finalCallBack (res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

  	vm.editEmployye = function (editObj) {
      $('a[data-target="#profile"]').tab('show');
  		console.log("Edit Employee Object::",editObj);
      
  	};

  	vm.deleteEmployye = function (obj, index) {
  		//ajax call for delete employee.
  		vm.users.splice(index,1);
  	};

    vm.init = function () {
      $rootScope.loading = true;
      var searchObj = { "empId": null, "empFirstName": null, "empLastName": null, "tilte": null, "location": null, "supervisor": null, "phiAccess": null, "status": null, "system": null, "userName": null, "dob": null, "gender": null, "ssn": null, "active": null, "createDt": null, "updatedDt": null, "updatedId": null };
      ApiService.post(healthCareBusinessConstants.SEARCH_URL, searchObj).then(successCallback, errorCallback).finally(finalCallBack);
    };
    vm.init();
  });
