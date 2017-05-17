'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function($scope, $rootScope, $http, $filter, $location, ApiService, healthCareBusinessConstants, $mdDialog, UtilService,  $interval) {
    var vm = this;
    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      if(vm.errorMsg) {
        UtilService.errorMessage(vm.errorMsg);
      } else {
        UtilService.errorMessage('Something went wrong!!');
      }
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $scope.showLoader = false;
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
      vm.attachmentCreateViewmode = false;
    };

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
      //console.log("personal saved successfully");
      $scope.showLoader = false;
      UtilService.errorMessage('Successfully saved personal details!!');
      $location.path('personal');
    };

    vm.savePersonal = function() {
      $scope.showLoader = true;
      console.log('vm.personalDetailsObj::', vm.personalDetailsObj);
      vm.personalDetailsObj.dateOfBirth = (vm.personalDetailsObj.dateOfBirth) ? vm.personalDetailsObj.dateOfBirth.getTime() : 0;
      if(!vm.viewmode) {
        ApiService.post(healthCareBusinessConstants.PERSONAL_UPDATE, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
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
      $scope.showLoader = true;
      var url = healthCareBusinessConstants.SAVE_DOC;
      fd.append('description', vm.fileuploadObject.shortdescription);
      fd.append('notes', vm.fileuploadObject.notes);
      fd.append('expiryDate', vm.fileuploadObject.expiry);
      fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
      fd.append('documentCategory', 'abc13');

      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined }
        }).then(function(res) {
          $scope.showLoader = false;
          vm.hideAttachmentCreate();
          UtilService.errorMessage('Successfully document uploaded!! ');
          if(vm.personalDetailsObj['documents']) {
            vm.personalDetailsObj.documents.push(res.data);
          } else {
            vm.personalDetailsObj = {
              'documents': [{'license' : []}]
            }
            vm.personalDetailsObj.documents.push({
              licence: res.data
            });
          }
        }, function(res) {
          $scope.showLoader = false;
          UtilService.errorMessage('document upload fail!');
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

     $interval(function() {
      vm.determinateValue += 1;
      if (vm.determinateValue > 100) {
        vm.determinateValue = 20;
      }
    }, 100);

    /* doc remove */
    var docremoveScb = function(msg) {
      UtilService.errorMessage('Successfully document removed!!');
    };

    vm.documentRemove = function(docId) {
      var url = healthCareBusinessConstants.DELETE_DOC + docId;
      ApiService.delete(url).then(docremoveScb, errorCallback);
    };

    vm.init = function() {
      vm.determinateValue = 20;
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      if (Object.keys(vm.personalDetailsObj).length) {
        vm.viewmode = true;
        vm.personalDetailsObj.dateOfBirth = new Date(vm.personalDetailsObj.dateOfBirth);
        vm.personalDetailsObj.myDate = new Date();
       vm.provider = {
        licenseType: {
          medicalLicence:[],
          dealLicence: [],
          malpracticeInsurance:[]
        }
      };
      var providerresponseObj = angular.fromJson(localStorage.getItem('providerResObj'));
      if(providerresponseObj) {
          var temp = {
            license: providerresponseObj,
            licenseTypeId: null,
            objectValue: providerresponseObj['objectName']
          };
          vm.personalDetailsObj.provider.licenseType.push(temp);  
        }
        if(vm.personalDetailsObj.provider) {
          for (var i = 0; i < vm.personalDetailsObj.provider.licenseType.length; i++) {
            if(vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() === "MEDICAL") {
              vm.provider.licenseType.medicalLicence.push(vm.personalDetailsObj.provider.licenseType[i]);
            } else if(vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() == "DEA_LICENSE") {
              vm.provider.licenseType.dealLicence.push(vm.personalDetailsObj.provider.licenseType[i]);
            } else if(vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() == "MALPRACTICE_INSURANCE") {
              vm.provider.licenseType.malpracticeInsurance.push(vm.personalDetailsObj.provider.licenseType[i]);
            }
          }
        }
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
      vm.credentials = [{id:1, name:'MD'}, {id:2, name:'DR'}];
    };
    vm.init();
  });