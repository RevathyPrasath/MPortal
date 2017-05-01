'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function($scope, $rootScope, $http, $filter, $location, ApiService, healthCareBusinessConstants, $mdDialog) {
    var vm = this;
    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    vm.cancelBtnclick = function() {
      $location.path("personal");
    };

    vm.addNewDocument = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
    };

    // vm.createAttachment = function() {
    //   // make an api for adding the new attachment
    //   vm.hideAttachmentCreate();
    // };

    var getLocationsSb = function(res) {
      vm.locations = res.data;
    };

    vm.getLocations = function() {
      ApiService.get(healthCareBusinessConstants.GET_LOCATIONS_LIST).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };

    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    // Save personal flow starts
    var savePersonalSuccessCallback = function() {
      console.log("personal saved successfully");
      $location.path('personal');
    };

    vm.savePersonal = function() {
      vm.personalDetailsObj.dateOfBirth = (vm.personalDetailsObj.dateOfBirth) ? vm.personalDetailsObj.dateOfBirth.getTime() : 0;
      if(!vm.viewmode) {
        ApiService.put(healthCareBusinessConstants.PERSONAL, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        ApiService.post(healthCareBusinessConstants.PERSONAL, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
      }
    };

    var fd = new FormData();
    $scope.uploadFile = function(files) {
      fd.append("uploadingFiles", files[0]);
    };

    vm.fileuploadObject = {};
    vm.createAttachment = function() {
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
          if(vm.personalDetailsObj['document'] && vm.personalDetailsObj['document'].length) {
            vm.personalDetailsObj['document'].push(res.data);
          } else {
            vm.personalDetailsObj['document'] = [];
            vm.personalDetailsObj['document'].push(res.data);
          }
          
          //vm.locationsDetailsObj['documents'].push(res.data)
        }, function(res) {
          alert('document upload fail!');
        });
    };

    // Save personal flow ends
    var getSupervisorsScb = function(res) {
      vm.supervisorList = res.data;
    };

    //List of supervisor
    var getSupervisors = function() {
      var url = healthCareBusinessConstants.SUPERVISOR_LIST;
      ApiService.get(url).then(getSupervisorsScb, errorCallback)
    };

    var getSpecialitiesScb = function(res){
      vm.specialities = res.data;
    };

    //get specialities
    var getSpecialities = function() {
      var url = healthCareBusinessConstants.SPECIALTY_LIST;
      ApiService.get(url).then(getSpecialitiesScb, errorCallback);
    };

    vm.providerMore = function (items, type) {
      if(!vm.viewmode) {
        localStorage.setItem("providerMoreInfo", JSON.stringify(items));
        localStorage.setItem("licenseType", type);
        localStorage.setItem("frompage", 'personnalDetails');
        $location.path("providermore");
      } else {
        return;
      }
    };

    vm.init = function() {
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      if (Object.keys(vm.personalDetailsObj).length) {
        vm.viewmode = true;
        vm.personalDetailsObj.dateOfBirth = new Date(vm.personalDetailsObj.dateOfBirth);
        vm.personalDetailsObj.myDate = new Date();
      } else {
        vm.viewmode = false;
        vm.personalDetailsObj = {};
        vm.personalDetailsObj['document'] = [];
      }
      vm.getLocations();
      vm.getStates();
      getSupervisors();
      getSpecialities();
      //temp 
      vm.taxonomies = [{id:1, name:'2086S0129X'}];
      vm.credentials = [{id:1, name:'MD'}, {id:2, name:'DR'}];
      //vm.personalDetailsObj.provider.licenseType
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
    };

    vm.init();

  });
