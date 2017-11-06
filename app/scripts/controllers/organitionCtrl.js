'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('OrganitionCtrl', function($scope, $interval, $http, $location, healthCareBusinessConstants, ApiService, $rootScope, UtilService) {
    var vm = this;
    // error call back method.
    var errorCallback = function(error) {
      if (error.data && error.data.message) {
        vm.errorMsg = error.data.message;
      }
      if (vm.errorMsg) {
        UtilService.errorMessage(vm.errorMsg);
      } else {
        UtilService.errorMessage('Something went wrong!!');
      }
    };

    var docremoveScb = function(msg) {
      vm.getCompanies(0);
      UtilService.errorMessage('Successfully document removed!!');
      for (var i = 0; i < vm.companyDetailsObj.documents.length; i++) {
        if (vm.companyDetailsObj.documents[i].documentId == vm.fileuploadObject.docId) {
          vm.companyDetailsObj.documents.splice(i, 1);
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
      var url = healthCareBusinessConstants.DELETE_DOC + docId;
     // vm.companyDetailsObj.documents.splice(index, 1);
      ApiService.delete(url).then(docremoveScb, errorCallback);
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
      "activeFlag": ""
    };

    vm.searchEmployee = function() {
      searchObj.city = vm.city || '';
      searchObj.state = vm.state || '';
      searchObj.activeFlag = Boolean(vm.status) || "";
      if (vm.city || vm.state || vm.status) {
        ApiService.post(healthCareBusinessConstants.SEARCH_LOCATION, searchObj).then(searchSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        UtilService.errorMessage('Enter valid details!!');
      }
    };

    var getLocationsSb = function(res) {
      vm.locations = res.data;
    };

    vm.getLocations = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.GET_LOCATIONS + '?page=' + pagenumber).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };

    vm.addNew = function() {
      //localStorage.setItem("companyTempData", JSON.stringify(vm.companyDetailsObj));
      //$location.path('locationsMore');

       localStorage.setItem('locationsDetails', angular.toJson({}));
        $location.path('locationsMore');

   //  if (!vm.viewmode) {
     //   localStorage.setItem('locationsDetails', angular.toJson({}));
    //    $location.path('locationsMore');
    //  } else {
    //   return;
     //  }
    };

    vm.cancelBtnclick = function() {
      $location.path('organition');
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    vm.showAttachmentCreate = function() {
      
       vm.fileuploadObject = {};
      vm.fileuploadObject.trackExpiry = false;
      vm.attachmentCreateViewmode = true;
      vm.showDeleteDoc = false;
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
        fd.append('documentCategory', 'testing');
        fd.append('docID', docId);
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
          })
          .then(function(res) {
            vm.hideAttachmentCreate();
            $scope.showLoader = false;
            if (newDoc) {
              vm.companyDetailsObj['documents'].push(res.data);
              vm.saveBtnClick();
            } else {
              for (var i = 0; i < vm.companyDetailsObj['documents'].length; i++) {
                if (vm.companyDetailsObj['documents'][i].documentId === docId) {
                  vm.companyDetailsObj['documents'][i] = res.data;
                  vm.saveBtnClick();
                }
              }
            }
            UtilService.errorMessage('document upload success!');
          }, function(res) {
            $scope.showLoader = false;
            UtilService.errorMessage('document upload fail!');
          });
      } else {
        UtilService.errorMessage('Please select Expiry Date!');
      }
    };

    vm.viewDoc = function(obj) {
      vm.attachmentCreateViewmode = true;
      vm.fileuploadObject = {
        shortdescription: obj.license[0].shortDescription,
        notes: obj.license[0].notes,
        expiry: new Date(obj.license[0].expiryDate),
        trackExpiry: obj.license[0].isDue,
        url: obj.documentUrl,
        docId: obj.documentId,
        documentName: obj.documentName
      }
        if (obj.license[0].expiryDate !== 0) {
        vm.fileuploadObject['expiry'] = new Date(obj.license[0].expiryDate)
      }
      vm.showDeleteDoc = true;
      console.log(obj);
    };
    
    // vm.createAttachment = function() {
    //   $scope.showLoader = true;
    //   var url = healthCareBusinessConstants.SAVE_DOC;
    //   fd.append('description', vm.fileuploadObject.shortdescription);
    //   fd.append('notes', vm.fileuploadObject.notes);
    //   fd.append('expiryDate', vm.fileuploadObject.expiry);
    //   fd.append('trackExpiryDate', vm.fileuploadObject.trackExpiry);
    //   fd.append('documentCategory', 'abc');
    //   $http.post(url, fd, {
    //       transformRequest: angular.identity,
    //       headers: { 'Content-Type': undefined }
    //     })
    //     .then(function(res) {
    //       vm.hideAttachmentCreate();
    //       if (vm.companyDetailsObj['documents']) {
    //         vm.companyDetailsObj['documents'].push(res.data);
    //       } else {
    //         vm.companyDetailsObj['documents'] = [];
    //         vm.companyDetailsObj['documents'].push(res.data);
    //       }

    //       $scope.showLoader = false;
    //     }, function(res) {
    //       //alert('document upload fail!');
    //       UtilService.errorMessage('document upload fail!');
    //       $scope.showLoader = false;
    //     });
    // };

    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };

    var getCompaniesSb = function(res) {
      if (res && res.data[0]) {
        vm.viewmode = true;
        vm.companyDetailsObj = res.data[0];
        vm.companyDetailsObj.dateOfIncorporation = new Date(vm.companyDetailsObj.dateOfIncorporation);
      } else {
        vm.viewmode = false;
      }
      if (vm.companyDetailsObj.addressId && vm.companyDetailsObj.addressId.phone) {
        vm.companyDetailsObj.addressId.phone = parseInt(vm.companyDetailsObj.addressId.phone);
      }
      var providerresponseObj = angular.fromJson(localStorage.getItem('providerResObj'));
      // if(providerresponseObj) {
      //   if(vm.companyDetailsObj && vm.companyDetailsObj.licenseType && vm.companyDetailsObj.licenseType.license) {
      //     vm.companyDetailsObj.licenseType.license.push(providerresponseObj);
      //   } else {
      //     vm.companyDetailsObj['licenseType'] = [];
      //     vm.companyDetailsObj['licenseType'].push(providerresponseObj);
      //   }
      // }

      if (providerresponseObj) {
        var temp = {
          license: providerresponseObj,
          licenseTypeId: null,
          objectValue: providerresponseObj['objectName']
        };
        vm.companyDetailsObj['licenseType'].push(temp);
      }

      //vm.licenseType.malpracticeInsurance.push(vm.companyDetailsObj.licenseType[0]);
      //licenseType
      /*if(vm.companyDetailsObj && vm.companyDetailsObj.licenseType) {
         for (var i = 0; i < vm.companyDetailsObj.licenseType.length; i++) {
          if(vm.companyDetailsObj.licenseType[i].objectValue.toUpperCase() === "MEDICAL") {
            vm.provider.licenseType.medicalLicence.push(vm.companyDetailsObj.licenseType[i]);
          } else if(vm.companyDetailsObj.licenseType[i].objectValue.toUpperCase() == "DEA_LICENSE") {
            vm.provider.licenseType.dealLicence.push(vm.companyDetailsObj.licenseType[i]);
          } else if(vm.companyDetailsObj.licenseType[i].objectValue.toUpperCase() == "MALPRACTICE_INSURANCE") {
            vm.provider.licenseType.malpracticeInsurance.push(vm.companyDetailsObj.licenseType[i]);
          }
        } 
      };*/
    };

    vm.getCompanies = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.GET_COMPANIES + '?page=' + pagenumber).then(getCompaniesSb, errorCallback).finally(finalCallBack);
    };

    vm.organitionDetailsView = function(obj) {
      localStorage.setItem('locationsDetails', angular.toJson(obj));
      $location.path('locationsMore');
    };

    vm.providerMore = function(items, type) {
      var license = {
        license: items
      }
      if (!vm.viewmode) {
        localStorage.setItem("providerMoreInfo", JSON.stringify(license));
        localStorage.setItem("licenseType", type);
        localStorage.setItem("frompage", 'organition');
        $location.path("providermore");
      } else {
        return;
      }
    };

    var saveUserSuccessCallback = function() {
      vm.viewmode = true;
    };

    vm.saveBtnClick = function() {
      $scope.showLoader = true;
      ApiService.post(healthCareBusinessConstants.GET_COMPANIES, vm.companyDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
    };

    vm.addOtherIdentifier = function() {
      if (vm.companyDetailsObj.otherIdentifications == undefined) {
        vm.companyDetailsObj['otherIdentifications'] = [];
        vm.companyDetailsObj.otherIdentifications.push({
          "identifierName": "",
          "identifierNumber": ""
        });
      } else {
        vm.companyDetailsObj.otherIdentifications.push({
          "identifierName": "",
          "identifierNumber": ""
        });
      }
    };

    $interval(function() {
      vm.determinateValue += 1;
      if (vm.determinateValue > 100) {
        vm.determinateValue = 20;
      }
    }, 100);

    vm.init = function() {
      vm.activated = true;
      vm.determinateValue = 20;
      vm.pageNo = 0;
      vm.viewmode = true;
      vm.myDate = new Date();
      vm.hideAttachmentCreate();
      vm.companyDetailsObj = {
        'otherIdentifications': [{
          "identifierName": "",
          "identifierNumber": ""
        }]
      };

      if (localStorage.getItem('companyTempData') && Object.keys(angular.fromJson(localStorage.getItem('companyTempData'))).length) {
        vm.companyDetailsObj = angular.fromJson(localStorage.getItem('companyTempData'));
        if (vm.companyDetailsObj && vm.companyDetailsObj.addressId) {
          vm.companyDetailsObj.addressId.phone = parseInt(vm.companyDetailsObj.addressId.phone);
        }
      }

      vm.getStates();
      vm.getLocations(0);
      vm.getCompanies(0);
      vm.entityTypes = [{ id: "SCorporation", name: 'S corporation' }, { id: 'CCorporation', name: 'C corporation' }];
    };

    vm.init();
  });