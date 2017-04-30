'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('OrganitionCtrl', function($scope, $interval, $http, $location, healthCareBusinessConstants, ApiService, $rootScope) {
    var vm = this;
    // error call back method.
    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $scope.showLoader = false;
    };

    // success Call back method
    var searchSuccessCallback = function(res) {
      vm.locations = res.data;
    };

    var searchObj = {
      "city": '',
      "state": '',
      "activeFlag": false
    };
    vm.searchEmployee = function() {
      searchObj.city = vm.city || '';
      searchObj.state = vm.state || '';
      searchObj.activeFlag = Boolean(vm.status) || false;
      if (vm.city || vm.state || vm.status) {
        ApiService.post(healthCareBusinessConstants.SEARCH_LOCATION, searchObj).then(searchSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        vm.errorMsg = 'Please Enter Name/Employee Id/SSN';
      }
    };

    var getLocationsSb = function(res) {
      vm.locations = res.data;
    };

    vm.getLocations = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.GET_LOCATIONS + '?page=' + pagenumber).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };

    vm.addNew = function() {
      $location.path('locationsMore');
      localStorage.setItem('locationsDetails', angular.toJson({}));
    };

    vm.cancelBtnclick = function() {
      $location.path('organition');
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
    };

    var fd = new FormData();
    $scope.uploadFile = function(files) {
      fd.append("uploadingFiles", files[0]);
    };

    vm.fileuploadObject = {};
    vm.createAttachment = function() {
      $scope.showLoader = true;
      var url = healthCareBusinessConstants.SAVE_DOC;
      fd.append('description', vm.fileuploadObject.shortdescription);
      fd.append('notes', vm.fileuploadObject.notes);
      fd.append('expiryDate', vm.fileuploadObject.expiry);
      fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
      fd.append('documentCategory', 'abc');

      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        })
        .then(function(res) {
          vm.hideAttachmentCreate();
          vm.companyDetailsObj['documents'].push(res.data);
           $scope.showLoader = false;
        }, function(res) {
          alert('document upload fail!');
           $scope.showLoader = false;
        });
    };
    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    var getCompaniesSb = function(res) {
      vm.companyDetailsObj = res.data[0];
      vm.companyDetailsObj.dateOfIncorporation = new Date(vm.companyDetailsObj.dateOfIncorporation);
    };

    vm.getCompanies = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.GET_COMPANIES + '?page=' + pagenumber).then(getCompaniesSb, errorCallback).finally(finalCallBack);
    };

    vm.organitionDetailsView = function(obj) {
      localStorage.setItem('locationsDetails', angular.toJson(obj));
      $location.path('locationsMore');
    };

     vm.providerMore = function (items, type) {
      localStorage.setItem("providerMoreInfo", JSON.stringify(items));
      localStorage.setItem("licenseType", type)
      $location.path("providermore");
    };

    // vm.organitionCompanyDetailsView = function(obj) {
    //   localStorage.setItem('companyDetails', angular.toJson(obj));
    //   $location.path('companyMore');
    // };
    //save button click
    var saveUserSuccessCallback = function() {
      vm.viewmode = true;
    };

    vm.saveBtnClick = function() {
       $scope.showLoader = true;
      ApiService.post(healthCareBusinessConstants.GET_COMPANIES, vm.companyDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
    };

    vm.addOtherIdentifier = function() {
      vm.companyDetailsObj.otherIdentifications.push({
        "identifierName": "",
        "identifierNumber": ""
      });
    };


    $interval(function() {
      vm.determinateValue += 1;
      if (vm.determinateValue > 100) {
        vm.determinateValue = 20;
      }
    }, 100);

    vm.init = function() {



       vm.provider = {
        licenseType: {
          medicalLicence:[],
          dealLicence: [],
          malpracticeInsurance:[]
        }
      };
      var providerresponseObj = angular.fromJson(localStorage.getItem('providerResObj'));
      //console.log(vm.providerresponseObj);
      //providerresponseObj['objectName'];
 
      if(providerresponseObj) {
        var temp = {
          license: providerresponseObj,
          licenseTypeId: null,
          objectValue: providerresponseObj['objectName']
        };
        vm.personalDetailsObj.provider.licenseType.push(temp);  
      }
      for (var i = 0; i < vm.personalDetailsObj.provider.licenseType.length; i++) {
        if(vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() === "MEDICAL") {
          vm.provider.licenseType.medicalLicence.push(vm.personalDetailsObj.provider.licenseType[i]);
        } else if(vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() == "DEA_LICENSE") {
          vm.provider.licenseType.dealLicence.push(vm.personalDetailsObj.provider.licenseType[i]);
        } else if(vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() == "MALPRACTICE_INSURANCE") {
          vm.provider.licenseType.malpracticeInsurance.push(vm.personalDetailsObj.provider.licenseType[i]);
        }
      }

      vm.activated = true;
      vm.determinateValue = 20;
      vm.pageNo = 0;
      vm.getLocations(0);
      vm.getCompanies(0);
      vm.viewmode = true;
      vm.myDate = new Date();
      vm.hideAttachmentCreate();
      vm.getStates();
      vm.companyDetailsObj = {
        'otherIdentifications': [{
          "identifierName": "",
          "identifierNumber": ""
        }]
      };
      vm.entityTypes = [{ id:"SCorporation", name: 'S corporation' }, {id:'CCorporation', name: 'C corporation' }];
    };

    vm.init();
  });
