'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:personalCtrl
 * @description
 * # personalCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('personalMoreCtrl', function($scope, $rootScope, $http, $filter, $location, ApiService, healthCareBusinessConstants, $mdDialog, UtilService, $interval) {
    var vm = this;
    var errorCallback = function(error) {
      if (error.data && error.data.message)
        vm.errorMsg = error.data.message;
      if (vm.errorMsg) {
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
      vm.fileuploadObject = {};
      vm.fileuploadObject.trackExpiry = false;
      vm.attachmentCreateViewmode = true;
      vm.showDeleteDoc = false;
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
      vm.personalDetailsObj.dateOfBirth = (vm.personalDetailsObj.dateOfBirth) ? new Date(vm.personalDetailsObj.dateOfBirth).getTime() : 0;
      if (!vm.viewmode && localStorage.getItem("addMode") != 'true') {
        ApiService.post(healthCareBusinessConstants.PERSONAL_UPDATE, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
      } else if (localStorage.getItem("addMode") == 'true') {
        ApiService.post(healthCareBusinessConstants.PERSONAL, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
      }
    };

    var fd = new FormData();
    $scope.uploadFile = function(files) {
      fd.append("uploadingFiles", files[0]);
    };

    vm.fileuploadObject = {};
    vm.fileuploadObject.trackExpiry = false;


    vm.checkExpireValidation = function() {
      if (vm.fileuploadObject.trackExpiry) {
        if (vm.fileuploadObject.expiry) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    };

    var getPersonalId = function() {
      if (JSON.parse(localStorage.getItem("personnalDetails")).personId) {
        return JSON.parse(localStorage.getItem("personnalDetails")).personId;
      } else {
        return 0;
      }
    };

    vm.createAttachment = function(doc) {
      if (vm.checkExpireValidation()) {
        $scope.showLoader = true;
        var url = null;
        var newDoc = false;
        if (!vm.showDeleteDoc) {
          newDoc = true;
          url = healthCareBusinessConstants.SAVE_DOC;
        } else {
          newDoc = false;
          url = healthCareBusinessConstants.UPDATE_DOC;
          fd.append('documentUrl', vm.fileuploadObject.url);
          fd.append('documentName', vm.fileuploadObject.documentName);
        }
        var docId = (vm.fileuploadObject.docId ? vm.fileuploadObject.docId : 0);
        fd.append('description', vm.fileuploadObject.shortdescription);
        fd.append('notes', vm.fileuploadObject.notes);
        if (vm.fileuploadObject.expiry) {
          fd.append('expiryDate', vm.fileuploadObject.expiry);
        } else {
          fd.append('expiryDate', new Date(0));
        }
        fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
        fd.append('documentCategory', 'PERSONAL');
        fd.append('category', 'PERSONAL');
        fd.append('docID', docId);
        fd.append('id', getPersonalId());

        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
          })
          .then(function(res) {
            vm.hideAttachmentCreate();
            $scope.showLoader = false;
            if (newDoc) {
              vm.personalDetailsObj['documents'].push(res.data);
              vm.savePersonal();
            } else {
              for (var i = 0; i < vm.personalDetailsObj['documents'].length; i++) {
                if (vm.personalDetailsObj['documents'][i].documentId === docId) {
                  vm.personalDetailsObj['documents'][i] = res.data;
                  vm.savePersonal();
                }
              }
            }
            fd.delete('description');
            fd.delete('notes');
            fd.delete('expiryDate');
            fd.delete('trackExpiryDate');
            fd.delete('documentCategory');
            fd.delete('docID');
            UtilService.errorMessage('document upload success!');
          }, function(res) {
            $scope.showLoader = false;
            UtilService.errorMessage('document upload fail!');
          });
      } else {
        UtilService.errorMessage('Please select Expiry Date!');
      }
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

    var getSpecialitiesScb = function(res) {
      vm.specialities = res.data;
    };

    //get specialities
    var getSpecialities = function() {
      var url = healthCareBusinessConstants.SPECIALTY_LIST;
      ApiService.get(url).then(getSpecialitiesScb, errorCallback);
    };

    vm.providerMore = function(items, type) {
      localStorage.setItem("providerMoreTempData", JSON.stringify(vm.personalDetailsObj));
      if (!vm.viewmode) {
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
      $scope.showLoader = false;
      UtilService.errorMessage('Successfully document removed!!');
      for (var i = 0; i < vm.personalDetailsObj.documents.length; i++) {
        if (vm.personalDetailsObj.documents[i].documentId == vm.fileuploadObject.docId) {
          vm.personalDetailsObj.documents.splice(i, 1);
          vm.attachmentCreateViewmode = false;
          vm.fileuploadObject = {
            shortdescription: '',
            notes: '',
            trackExpiry: '',
            expiry: ''
          }
        }
      }
    };

    vm.documentRemove = function(docId) {
      $scope.showLoader = true;
      var url = healthCareBusinessConstants.DELETE_DOC + docId;
      ApiService.delete(url).then(docremoveScb, errorCallback);
    };

    vm.providerClick = function() {
      vm.personalDetailsObj.provider = {
        npi: "",
        credential: "",
        name: "",
        specialist: "",
        taxonomy: "",
        licenseType: []
      };
    };

    function findWithAttr(array, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i].license.licenseId === value) {
          return i;
        }
      }
      return -1;
    }

    vm.viewDoc = function(obj) {
      vm.attachmentCreateViewmode = true;
      vm.fileuploadObject = {
        shortdescription: obj.license[0].shortDescription,
        notes: obj.license[0].notes,
        trackExpiry: obj.license[0].isDue,
        url: obj.documentUrl,
        docId: obj.documentId,
        documentName: obj.documentName
      }
      if (obj.license[0].expiryDate !== 0) {
        vm.fileuploadObject['expiry'] = new Date(obj.license[0].expiryDate)
      }
      vm.showDeleteDoc = true;
    };

    vm.init = function() {
      vm.licensetype = localStorage.getItem("licenseType");
      console.log('licensetype===============>', vm.licensetype);
      vm.determinateValue = 20;
      vm.personalDetailsObj = angular.fromJson(localStorage.getItem('personnalDetails'));
      if (Object.keys(angular.fromJson(localStorage.getItem('providerMoreTempData'))).length) {
        vm.personalDetailsObj = angular.fromJson(localStorage.getItem('providerMoreTempData'));
      }

      if (Object.keys(vm.personalDetailsObj).length) {
        if (localStorage.getItem("fromProvider")) {
          vm.viewmode = false;
          var providerresponseObj = angular.fromJson(localStorage.getItem('providerResObj'));
          if (providerresponseObj) {
            var temp = {
              license: providerresponseObj,
              licenseTypeId: null,
              objectValue: providerresponseObj['objectName']
            };
            for (var i = 0; i < vm.personalDetailsObj.provider.licenseType.length; i++) {
              if (vm.personalDetailsObj.provider.licenseType[i].license.licenseId == providerresponseObj.licenseId) {
                temp.licenseTypeId = vm.personalDetailsObj.provider.licenseType[i].licenseTypeId;
                vm.personalDetailsObj.provider.licenseType[i] = temp;
                break;
              }
            };
            if (findWithAttr(vm.personalDetailsObj.provider.licenseType, providerresponseObj.licenseId) == -1) {
              vm.personalDetailsObj.provider.licenseType.push(temp);
            }
            vm.savePersonal();
          }
        } else {
          vm.viewmode = true;
        }
        vm.personalDetailsObj.addressId.phone = parseInt(vm.personalDetailsObj.addressId.phone);
        vm.personalDetailsObj.dateOfBirth = new Date(vm.personalDetailsObj.dateOfBirth);
        vm.personalDetailsObj.myDate = new Date();
        vm.provider = {
          licenseType: {
            medicalLicence: [],
            dealLicence: [],
            malpracticeInsurance: []
          }
        };

        if (vm.personalDetailsObj.provider) {
          for (var i = 0; i < vm.personalDetailsObj.provider.licenseType.length; i++) {
            if (vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() === "MEDICAL") {
              vm.provider.licenseType.medicalLicence.push(vm.personalDetailsObj.provider.licenseType[i]);
            } else if (vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() == "DEA_LICENSE") {
              vm.provider.licenseType.dealLicence.push(vm.personalDetailsObj.provider.licenseType[i]);
            } else if (vm.personalDetailsObj.provider.licenseType[i].objectValue.toUpperCase() == "MALPRACTICE_INSURANCE") {
              vm.provider.licenseType.malpracticeInsurance.push(vm.personalDetailsObj.provider.licenseType[i]);
            }
          }
        }
      } else {
        vm.addMode = true;
        vm.viewmode = false;
        vm.personalDetailsObj = {};
        vm.personalDetailsObj['employeeId'] = { 'status': true };
        vm.personalDetailsObj['documents'] = [];
      }
      vm.getLocations();
      vm.getStates();
      getSupervisors();
      getSpecialities();
      //temp
      vm.credentials = [{ id: 1, name: 'MD' }, { id: 2, name: 'DO' }, { id: 3, name: 'PA' }, { id: 4, name: 'NPP' }];
    };
    vm.init();
  });