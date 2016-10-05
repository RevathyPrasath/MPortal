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

  	vm.addPerson = function (obj) {
      console.log(obj);
      ApiService.post(healthCareBusinessConstants.ADD, obj).then(successAddCallback, errorCallback).finally(finalCallBack);
    };

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

    //add user Success
    function successAddCallback (response) {
      console.log(response);
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
      $('a[data-target="#profile"]').tab('show');
      vm.details = {
  "employeeID": 1,
  "empType": "Supervisor",
  "field": "GSFSDFS SFSF",
  "document": [
    {
      "documentID": "9",
      "created_date": null,
      "updated_date": null,
      "created_id": null,
      "updated_id": null,
      "filename": null,
      "filebytes": null
    }
  ],
  "provider": {
    "providerID": 1,
    "specialty": "Cardio",
    "npi": "Y",
    "taxonomy": "H123455",
    "credentials": "xxxxx",
    "medlicense": {
      "medLicState": "CA",
      "medLicExpDate": "2016-09-29",
      "created_date": "2016-09-29",
      "updated_date": "2016-09-29",
      "created_id": "rev",
      "updated_id": "rev",
      "medLicNumber": 12345678,
      "medID": 1,
      "document": [
        {
          "documentID": "3",
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "filename": null,
          "filebytes": null
        },
        {
          "documentID": "4",
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "filename": null,
          "filebytes": null
        }
      ],
      "state": "CA",
      "expiryDate": "2016-09-29"
    },
    "dealicense": {
      "deaLicName": "DEA LICENSE",
      "deaLicAddress": null,
      "deaLicTelephone": 0,
      "deaLicFax": 0,
      "deaLicEmail": null,
      "deaLicExpDate": "2016-09-29",
      "deaLicNumber": 34343535353,
      "document": [
        {
          "documentID": "10",
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "filename": null,
          "filebytes": null
        }
      ],
      "created_date": "2016-09-29",
      "updated_date": "2016-09-29",
      "created_id": "rev",
      "updated_id": "rev",
      "deaID": 1,
      "address": {
        "streetAddress": null,
        "city": null,
        "state": null,
        "country": null,
        "zip": 0,
        "phoneNumber": null,
        "faxNumber": null,
        "emailID": null,
        "created_date": null,
        "updated_date": null,
        "created_id": null,
        "updated_id": null,
        "addressID": 2
      },
      "name": "DEA LICENSE",
      "email": null,
      "fax": 0,
      "deaaddress": null,
      "telephone": 0,
      "expiryDate": "2016-09-29"
    },
    "malprctlnce": {
      "malPrctID": 1,
      "malInsName": "MALPRATCICE INSURANCE",
      "malInsAddress": null,
      "malInsExpiryDate": "2016-09-29",
      "malInsPolicyNumber": 1234567777,
      "malInsPolicyDoc": [
        {
          "documentID": "5",
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "filename": null,
          "filebytes": null
        },
        {
          "documentID": "7",
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "filename": null,
          "filebytes": null
        }
      ],
      "malInsFaceSheet": [
        {
          "documentID": "8",
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "filename": null,
          "filebytes": null
        }
      ],
      "created_date": "2016-09-29",
      "updated_date": "2016-09-29",
      "created_id": "rev",
      "updated_id": "rev",
      "address": {
        "streetAddress": "WILBUR RD",
        "city": "TO",
        "state": "CA",
        "country": "US",
        "zip": 91360,
        "phoneNumber": "805-111-2345",
        "faxNumber": "805-111-2345",
        "emailID": "RRRRR@gmail.com",
        "created_date": "2016-09-29",
        "updated_date": "2016-09-29",
        "created_id": "rev",
        "updated_id": "rev",
        "addressID": 1
      }
    },
    "created_date": "2016-09-29",
    "updated_date": "2016-09-29",
    "created_id": "rev",
    "updated_id": "rev"
  },
  "created_date": "2016-09-29",
  "updated_date": "2016-09-29",
  "created_id": "rev",
  "updated_id": "rev",
  "person": {
    "personID": 1,
    "firstNm": "",
    "lastNm": "SIV",
    "middleNm": null,
    "birthDt": "2016-09-29",
    "gender": "M",
    "status": "Active",
    "empAddress": null,
    "created_date": "2016-09-29",
    "updated_date": "2016-09-29",
    "created_id": "Rev",
    "updated_id": "Rev",
    "address": {
      "streetAddress": "WILBUR RD",
      "city": "TO",
      "state": "CA",
      "country": "US",
      "zip": 91360,
      "phoneNumber": "805-111-2345",
      "faxNumber": "805-111-2345",
      "emailID": "RRRRR@gmail.com",
      "created_date": "2016-09-29",
      "updated_date": "2016-09-29",
      "created_id": "rev",
      "updated_id": "rev",
      "addressID": 3
    },
    "ssn": 12353546466
  }
};
  		console.log("Edit Employee Object::",editObj);      
  	};

  	vm.deleteEmployye = function (obj, index) {
  		//ajax call for delete employee.
  		var temp = angular.copy(obj);
  		vm.users.splice(index,1);
  		$rootScope.loading = true;
      ApiService.get(healthCareBusinessConstants.DELETE_URL + "?empID=" + temp.employeeID).then(deleteSuccessCallback, errorCallback).finally(finalCallBack);
  	};

  	// success Call back for delete method
    function deleteSuccessCallback (response) {
      vm.init();
    };

    vm.init = function () {
      $rootScope.loading = true;
      var searchObj = { "employeeID": null, "empType": null, "field": null, "statusCheck":null, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "provider": { "providerID": null, "specialty": null, "npi": "Y", "taxonomy": null, "credentials": null, "medlicense": { "medLicState": null, "medLicExpDate": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "medLicNumber": null, "medID": null, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }, { "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "state": null, "expiryDate": null }, "dealicense": { "deaLicName": null, "deaLicAddress": null, "deaLicTelephone": 0, "deaLicFax": 0, "deaLicEmail": null, "deaLicExpDate": null, "deaLicNumber": 34343535353, "document": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "deaID": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "name": null, "email": null, "fax": null, "deaaddress": null, "telephone": null, "expiryDate": null }, "malprctlnce": { "malPrctID": null, "malInsName": null, "malInsAddress": null, "malInsExpiryDate": null, "malInsPolicyNumber": null, "malInsPolicyDoc": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }, { "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "malInsFaceSheet": [{ "documentID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "filename": null, "filebytes": null }], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null } }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "person": { "personID": null, "firstNm": null, "lastNm": null, "middleNm": null, "birthDt": null, "gender": null, "status": null, "empAddress": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "ssn": null } };
      ApiService.post(healthCareBusinessConstants.SEARCH_URL, searchObj).then(successCallback, errorCallback).finally(finalCallBack);
    };

    vm.init();
  });