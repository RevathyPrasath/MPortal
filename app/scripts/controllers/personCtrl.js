'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:PersonCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('PersonCtrl', function ($rootScope, ApiService, healthCareBusinessConstants, $location) {
  	var vm = this;
  	$rootScope.hideNavbar = false;
    $rootScope.editEmployee = false;

  	vm.searchEmployee = function () {
     $rootScope.loading = true;
     var searchObj =  { "employeeID": vm.employeeId, "empType": null, "field": null, "statusCheck":null, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "provider": { "providerID": null, "specialty": null, "npi": "Y", "taxonomy": null, "credentials": null, "medlicense": { "medLicState": null, "medLicExpDate": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "medLicNumber": null, "medID": null, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }, { "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "state": null, "expiryDate": null }, "dealicense": { "deaLicName": null, "deaLicAddress": null, "deaLicTelephone": 0, "deaLicFax": 0, "deaLicEmail": null, "deaLicExpDate": null, "deaLicNumber": 34343535353, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "deaID": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "name": null, "email": null, "fax": null, "deaaddress": null, "telephone": null, "expiryDate": null }, "malprctlnce": { "malPrctID": null, "malInsName": null, "malInsAddress": null, "malInsExpiryDate": null, "malInsPolicyNumber": null, "malInsPolicyDoc": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }, { "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "malInsFaceSheet": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null } }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "person": { "personID": null, "firstNm": null, "lastNm": vm.name, "middleNm": null, "birthDt": null, "gender": null, "status": null, "empAddress": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "ssn": vm.ssn } };
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
      if(error && error.data) {
        vm.errorMsg = error.data.message;
      }
     console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    function finalCallBack (res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

  	vm.editEmployye = function (editObj) {
      vm.editEmployee = true;
      $rootScope.editEmployee = true;
      console.log('editObj::',editObj);
      $('a[data-target="#profile"]').tab('show');
      vm.details = editObj; 
  	};

    //update employee details.
    vm.upDateUser = function () {
      $rootScope.loading = true;
      console.log("Edit Employee Object::", vm.details);
      ApiService.post(healthCareBusinessConstants.EDIT_EMPLOYEE, vm.details).then(editSuccessCallback, errorCallback).finally(finalCallBack);
    };

    function editSuccessCallback (res) {
      console.log(res);
      $('a[data-target="#vileList"]').tab('show');
    };

    //cancel button click
    vm.cancel = function () {
      $('a[data-target="#vileList"]').tab('show');
      $rootScope.editEmployee = false;
    };


   // Delete Employee
  	vm.deleteEmployye = function (obj, index) {
  		var temp = angular.copy(obj);
  		vm.users.splice(index,1);
  		$rootScope.loading = true;
      ApiService.get(healthCareBusinessConstants.DELETE_EMP + temp.employeeID).then(deleteSuccessCallback, errorCallback).finally(finalCallBack);
  	};

  	// success Call back for delete method
    function deleteSuccessCallback (response) {
      vm.init();
    };

    //add user
    vm.addPerson = function (obj) {
      //console.log(obj);
      $rootScope.loading = true;
      ApiService.post(healthCareBusinessConstants.ADD_EMPLOYEE, obj).then(addSuccessCallback, errorCallback).finally(finalCallBack);
    };

    function addSuccessCallback (res) {
      console.log(res);
      console.log('Bonds Enter!');
    };

    vm.init = function () {
      $rootScope.loading = true;
      var searchObj = { "employeeID": null, "empType": null, "field": null, "statusCheck":null, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "provider": { "providerID": null, "specialty": null, "npi": "Y", "taxonomy": null, "credentials": null, "medlicense": { "medLicState": null, "medLicExpDate": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "medLicNumber": null, "medID": null, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }, { "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "state": null, "expiryDate": null }, "dealicense": { "deaLicName": null, "deaLicAddress": null, "deaLicTelephone": 0, "deaLicFax": 0, "deaLicEmail": null, "deaLicExpDate": null, "deaLicNumber": 34343535353, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "deaID": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "name": null, "email": null, "fax": null, "deaaddress": null, "telephone": null, "expiryDate": null }, "malprctlnce": { "malPrctID": null, "malInsName": null, "malInsAddress": null, "malInsExpiryDate": null, "malInsPolicyNumber": null, "malInsPolicyDoc": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }, { "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "malInsFaceSheet": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null } }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "person": { "personID": null, "firstNm": null, "lastNm": null, "middleNm": null, "birthDt": null, "gender": null, "status": null, "empAddress": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "ssn": null } };
      ApiService.post(healthCareBusinessConstants.SEARCH_URL, searchObj).then(successCallback, errorCallback).finally(finalCallBack);
    };

    vm.init();
  });