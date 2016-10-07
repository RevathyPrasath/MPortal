'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:PersonCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('PersonCtrl', function ($scope, $rootScope, ApiService, healthCareBusinessConstants, $location, $window) {
  	var vm = this;


      
    
    vm.viewList = function(){
      $('a[data-target="#vileList"]').tab('show');
    }

  	$rootScope.hideNavbar = false;
    $rootScope.editEmployee = false;

    vm.addNewTab = function(){
      vm.editEmployee = false;
      vm.details = { "employeeID": null, "empType": null, "field": null, "document": [], "provider": { "providerID": null, "specialty": null, "npi": null, "taxonomy": null, "credentials": null, "medlicense": { "medLicState": null, "medLicExpDate": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "medLicNumber": null, "medID": null, "document": [], "state": null, "expiryDate": null }, "dealicense": { "deaLicName": null, "deaLicAddress": null, "deaLicTelephone": null, "deaLicFax": null, "deaLicEmail": null, "deaLicExpDate": null, "deaLicNumber": null, "document": [], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "deaID": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "name": null, "email": null, "fax": null, "deaaddress": null, "telephone": null, "expiryDate": null }, "malprctlnce": { "malPrctID": null, "malInsName": null, "malInsAddress": null, "malInsExpiryDate": null, "malInsPolicyNumber": null, "malInsPolicyDoc": [], "malInsFaceSheet": [], "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null } }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null }, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "person": { "personID": null, "firstNm": null, "lastNm": null, "middleNm": null, "birthDt": null, "gender": "M", "status": "Active", "empAddress": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "address": { "streetAddress": null, "city": null, "state": null, "country": null, "zip": null, "phoneNumber": null, "faxNumber": null, "emailID": null, "created_date": null, "updated_date": null, "created_id": null, "updated_id": null, "addressID": null }, "ssn": null } };
      $('a[data-target="#profile"]').tab('show');      
    }
     //file upload stuff.
    vm.uploadFile = function(name, model) {
      vm.name = name;
      vm.filename = model.name;
      var file = model;
      var fd = new FormData();
          fd.append('uploadingFiles', file);
      ApiService.post(healthCareBusinessConstants.SAVE_DOC, fd, {transformRequest: angular.identity, headers: {'Content-Type': undefined}}).then(fileSuccessCallback, errorCallback).finally(finalCallBack);
    };

    function fileSuccessCallback (response) {
      switch(vm.name) {
          case 'EmployeeDoc':
            if(vm.editEmployee) {
              vm.details.document = response.data;
            } else {
              vm.details.document.push(response.data[0]);
            }
            break;
          case 'Medlicense':
            if(vm.editEmployee) {
              vm.details.provider.medlicense.document = response.data;
            } else {
              vm.details.provider.medlicense.document.push(response.data[0]);
            }
            break;
          case 'Dealicense':
            if(vm.editEmployee) {
              vm.details.provider.dealicense.document = response.data;
            } else {
              vm.details.provider.dealicense.document.push(response.data[0]);
            }
            break;
          case 'MalInsPolicyDoc':
            if(vm.editEmployee) {
              vm.details.provider.malprctlnce.malInsPolicyDoc = response.data;
            } else {
              vm.details.provider.malprctlnce.malInsPolicyDoc.push(response.data[0]);
            }
            break;
          case 'MalInsFaceSheet':
            if(vm.editEmployee) {
              vm.details.provider.malprctlnce.malInsFaceSheet = response.data;
            } else {
              vm.details.provider.malprctlnce.malInsFaceSheet.push(response.data[0]);
            }
            break;
          default:
            console.log('Fileupload Default Case');
      }
    };

    vm.deleteFile = function (arr, obj, index) {
      $rootScope.loading = true;   
      var temp = angular.copy(obj);
      arr.splice(index, 1);   
      ApiService.get(healthCareBusinessConstants.DELETE_DOC + temp.documentID).then(deleteDocSuccessCallback, errorCallback).finally(finalCallBack);
      
    };

    function deleteDocSuccessCallback (res) {
      console.log('Delete Response', res);
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
      ApiService.post(healthCareBusinessConstants.EDIT_EMPLOYEE, vm.details).then(editSuccessCallback, editErrorCallback);
    };

    function editSuccessCallback (res) {
      console.log(res);
      $('a[data-target="#vileList"]').tab('show');
      $window.location.reload();
    };

    function editErrorCallback () {
      $rootScope.loading = true;
    };
    //cancel button click
    vm.cancel = function () {
      $('a[data-target="#vileList"]').tab('show');
      $rootScope.editEmployee = false;
      vm.init();
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
      debugger;
      //console.log(obj);
      //vm.details.person
      $rootScope.loading = true;
      var addObj = {
        "employeeID": null,
        "empType": vm.details.empType,
        "field": vm.details.field,
        "document": [
          {
            "documentID": null,
            "created_date": null,
            "updated_date": null,
            "created_id": null,
            "updated_id": null,
            "filename": null,
            "filebytes": null
          }
        ],
        "provider": {
          "providerID": null,
          "specialty": vm.details.provider.specialty,
          "npi": vm.details.provider.npi,
          "taxonomy": vm.details.provider.taxonomy,
          "credentials": vm.details.provider.credentials,
          "medlicense": {
            "medLicState": vm.details.provider.medlicense.medLicState,
            "medLicExpDate": vm.details.provider.medlicense.medLicExpDate,
            "created_date": null,
            "updated_date": null,
            "created_id": null,
            "updated_id": null,
            "medLicNumber": vm.details.provider.medlicense,
            "medID": vm.details.provider.medlicense.medID,
            "document": [
              {
                "documentID": vm.details.provider.medlicense.document.documentID,
                "created_date": null,
                "updated_date": null,
                "created_id": null,
                "updated_id": null,
                "filename": null,
                "filebytes": null
              }
            ],
            "state": vm.details.provider.medlicense.state,
            "expiryDate": vm.details.provider.medlicense.expiryDate
          },
          "dealicense": {
            "deaLicName": vm.details.provider.dealicense.deaLicName,
            "deaLicAddress": vm.details.provider.dealicense.deaLicAddress,
            "deaLicTelephone": vm.details.provider.dealicense.deaLicTelephone,
            "deaLicFax": vm.details.provider.dealicense.deaLicFax,
            "deaLicEmail": vm.details.provider.dealicense.deaLicEmail,
            "deaLicExpDate": vm.details.provider.dealicense.deaLicExpDate,
            "deaLicNumber": vm.details.provider.dealicense.deaLicNumber,
            "document": [
              {
                "documentID": null,
                "created_date": null,
                "updated_date": null,
                "created_id": null,
                "updated_id": null,
                "filename": null,
                "filebytes": null
              }
            ],
            "created_date": null,
            "updated_date": null,
            "created_id": null,
            "updated_id": null,
            "deaID": vm.details.provider.dealicense.deaID,
            "address": {
              "streetAddress": vm.details.provider.dealicense.address.streetAddress,
              "city": vm.details.provider.dealicense.address.city,
              "state": vm.details.provider.dealicense.address.state,
              "country": vm.details.provider.dealicense.address.country,
              "zip": vm.details.provider.dealicense.address.zip,
              "phoneNumber": vm.details.provider.dealicense.address.phoneNumber,
              "faxNumber": vm.details.provider.dealicense.address.faxNumber,
              "emailID": vm.details.provider.dealicense.address.emailID,
              "created_date": null,
              "updated_date": null,
              "created_id": null,
              "updated_id": null,
              "addressID": vm.details.provider.dealicense.address.addressID
            },
            "name": vm.details.provider.dealicense.name,
            "email": vm.details.provider.dealicense.email,
            "fax": vm.details.provider.dealicense.fax,
            "deaaddress": vm.details.provider.dealicense.deaaddress,
            "telephone": vm.details.provider.dealicense.telephone,
            "expiryDate": vm.details.provider.dealicense.expiryDate
          },
          "malprctlnce": {
            "malPrctID": vm.details.provider.malprctlnce.malPrctID,
            "malInsName": vm.details.provider.malprctlnce.malInsName,
            "malInsAddress": vm.details.provider.malprctlnce.malInsAddress,
            "malInsExpiryDate": vm.details.provider.malprctlnce.malInsExpiryDate,
            "malInsPolicyNumber": vm.details.provider.malprctlnce.malInsPolicyNumber,
            "malInsPolicyDoc": [
              {
                "documentID": null,
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
                "documentID": null,
                "created_date": null,
                "updated_date": null,
                "created_id": null,
                "updated_id": null,
                "filename": null,
                "filebytes": null
              }
            ],
            "created_date": null,
            "updated_date": null,
            "created_id": null,
            "updated_id": null,
            "address": {
              "streetAddress": vm.details.provider.malprctlnce.address.streetAddress,
              "city": vm.details.provider.malprctlnce.address.city,
              "state": vm.details.provider.malprctlnce.address.state,
              "country": vm.details.provider.malprctlnce.address.country,
              "zip": vm.details.provider.malprctlnce.address.zip,
              "phoneNumber": vm.details.provider.malprctlnce.address.phoneNumber,
              "faxNumber": vm.details.provider.malprctlnce.address.faxNumber,
              "emailID": vm.details.provider.malprctlnce.address.emailID,
              "created_date": null,
              "updated_date": null,
              "created_id": null,
              "updated_id": null,
              "addressID": vm.details.provider.malprctlnce.address.addressID
            }
          },
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null
        },
        "created_date": null,
        "updated_date": null,
        "created_id": null,
        "updated_id": null,
        "person": {
          "personID": null,
          "firstNm": vm.details.person.firstNm,
          "lastNm": vm.details.person.lastNm,
          "middleNm": vm.details.person.middleNm,
          "birthDt": vm.details.person.birthDt,
          "gender": vm.details.person.gender,
          "status": vm.details.person.status,
          "empAddress": vm.details.person.empAddress,
          "created_date": null,
          "updated_date": null,
          "created_id": null,
          "updated_id": null,
          "address": {
            "streetAddress": vm.details.person.address.streetAddress,
            "city": vm.details.person.address.city,
            "state": vm.details.person.address.state,
            "country": vm.details.person.address.country,
            "zip": vm.details.person.address.zip,
            "phoneNumber": vm.details.person.address.phoneNumber,
            "faxNumber": vm.details.person.address.faxNumber,
            "emailID": vm.details.person.address.emailID,
            "created_date": null,
            "updated_date": null,
            "created_id": null,
            "updated_id": null,
            "addressID": vm.details.person.address.addressID
          },
          "ssn": vm.details.person.ssn
        }
      };
      ApiService.post(healthCareBusinessConstants.ADD_EMPLOYEE, addObj).then(addSuccessCallback, errorCallback).finally(finalCallBack);
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