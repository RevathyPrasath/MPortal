angular.module('healthCareApp').controller('providerMoreCtrl', function($scope, $interval, $location, healthCareBusinessConstants, ApiService, $http, UtilService) {
  var vm = this;
  var showLicence = localStorage.getItem("licenseType");

  var errorCallback = function(error) {
    vm.errorMsg = error.data.message;
    $scope.showLoader = false;
    if (vm.errorMsg) {
      UtilService.errorMessage(vm.errorMsg);
    } else {
      UtilService.errorMessage('Something went wrong!!');
    }
  };


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
    console.log(obj);
  };

  // final call back method called no matter success or failure
  var finalCallBack = function(res) {
    console.log('finalCallBack', res);
  };

  vm.showAttachmentCreate = function() {
    vm.fileuploadObject = {};
    vm.fileuploadObject.trackExpiry = false;
    vm.attachmentCreateViewmode = true;
    vm.showDeleteDoc = false;
  };

  var savePersonalSuccessCallback = function(res) {
    $scope.showLoader = false;
    localStorage.setItem("providerResObj", JSON.stringify(res.data));
    localStorage.setItem("fromProvider", true);
    console.log("personal saved successfully");
    $location.path(localStorage.getItem("frompage"));
  };

  $interval(function() {
    vm.determinateValue += 1;
    if (vm.determinateValue > 100) {
      vm.determinateValue = 20;
    }
  }, 100);


  vm.savePersonal = function() {
    $scope.showLoader = true;
    var providerSaveObj = {
      "licenseId": vm.moreinfo.license.licenseId,
      "state": vm.moreinfo.license.state,
      "licenseNo": vm.moreinfo.license.licenseNo,
      "expiryDate": (vm.moreinfo.license.licenseDate) ? vm.moreinfo.license.licenseDate.getTime() : 0,
      "isDue": vm.moreinfo.license.isDue,
      "notes": vm.moreinfo.license.notes,
      "policyNumber": vm.moreinfo.license.policyNumber,
      "objectName": vm.moreinfo.license.objectName || vm.objectName,
      "objectValue": vm.objectValue,
      "categoryType": vm.categoryType,
      "carrier": vm.moreinfo.license.carrier,
      "address": vm.moreinfo.license.address,
      "pageNumber": 0,
      "total": 0,
      "size": 0,
      "licenseDocuments": vm.moreinfo.license.licenseDocuments,
      "id": getId()
    }
    ApiService.post(healthCareBusinessConstants.CREATE_LICENSE, providerSaveObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
  };

  vm.hideAttachmentCreate = function() {
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

  var getId = function() {
    if (localStorage.getItem("providerMoreTempData") && (JSON.parse(localStorage.getItem("providerMoreTempData")).personId)) {
      return (JSON.parse(localStorage.getItem("providerMoreTempData")).personId);
    } else if (localStorage.getItem("providerMoreTempData") && (JSON.parse(localStorage.getItem("providerMoreTempData")).companyId)) {
      return (JSON.parse(localStorage.getItem("providerMoreTempData")).companyId);
    } else {
      return 0;
    }
  };

  vm.createAttachment = function(doc) {debugger;
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
      fd.append('documentCategory', vm.documentCategory);
      fd.append('category', vm.category);
      fd.append('docID', docId);
      fd.append('id', getId());

      $http.post(url, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      }).then(function(res) {
        vm.hideAttachmentCreate();
        $scope.showLoader = false;
        if(newDoc) {
          vm.moreinfo.license.licenseDocuments.push(res.data);
        } else {
          for (var i = 0; i < vm.moreinfo.license.licenseDocuments.length; i++) {
            if (vm.moreinfo.license.licenseDocuments[i].documentId === res.data.documentId) {
              vm.moreinfo.license.licenseDocuments[i] = res.data;
              //vm.savePersonal();
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

  var docremoveScb = function(msg) {
    $scope.showLoader = false;
    UtilService.errorMessage('Successfully document removed!!');
    for (var i = 0; i < vm.moreinfo.license.licenseDocuments.length; i++) {
      if (vm.moreinfo.license.licenseDocuments[i].documentId == vm.fileuploadObject.docId) {
        vm.moreinfo.license.licenseDocuments.splice(i, 1);
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
    //vm.moreinfo.license.licenseDocuments.splice(index, 1);
    ApiService.delete(url).then(docremoveScb, errorCallback);
  };

  /*  vm.documentRemove = function(index, docId) {
      var url = healthCareBusinessConstants.DELETE_DOC + docId;
      vm.moreinfo.license.licenseDocuments.splice(index, 1);
      ApiService.delete(url).then(docremoveScb, errorCallback);
    };*/

  vm.cancelBtnclick = function() {
    localStorage.setItem("fromProvider", true);
    $location.path(localStorage.getItem("frompage"));
  };

  vm.editBtnClick = function() {
    vm.providerViewMode = false;
    vm.showmedicalLicense = false;
    vm.showdealLicense = false;
    vm.showmalpracticeLicense = false;
    if (showLicence == 'MEDICAL') {
      vm.EditMedicalLicense = true;
      vm.objectValue = 'PERSONAL';
      vm.categoryType = 'PERSONAL';
      vm.objectName = 'MEDICAL';
    } else if (showLicence == 'DEA_LICENSE') {
      vm.EditDealLicense = true;
      vm.objectName = 'DEA_LICENSE';
      vm.objectValue = 'PERSONAL';
      vm.categoryType = 'PERSONAL';
    } else if (showLicence == 'MALPRACTICE_INSURANCE') {
      vm.EditMalpracticeLicense = true;
      vm.objectName = 'MALPRACTICE_INSURANCE';
      vm.objectValue = 'PERSONAL';
      vm.categoryType = 'PERSONAL';
    } else if (showLicence == 'INSURANCE') {
      vm.EditMalpracticeLicense = true;
      vm.objectName = 'INSURANCE';
      vm.objectValue = 'COMPANY';
      vm.categoryType = 'ADMINISTRATION';
    };
  };

  var getStatesSb = function(res) {
    vm.states = res.data;
  };

  vm.getStates = function() {
    ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
  };

  vm.init = function() {
    if(localStorage.getItem("frompage") == 'organition'){
      vm.documentCategory = 'COMPANY';
      vm.category = 'ADMINISTRATION';
      vm.objectValue = 'COMPANY';
    } else {
      vm.documentCategory = 'PERSONAL';
      vm.category = 'PERSONAL';
      vm.objectValue = 'PERSONAL';
    };
    vm.determinateValue = 20;
    if (showLicence == 'MEDICAL') {
      vm.showmedicalLicense = true;
    } else if (showLicence == 'DEA_LICENSE') {
      vm.showdealLicense = true;
    } else if (showLicence == 'MALPRACTICE_INSURANCE') {
      vm.showmalpracticeLicense = true;
    } else if (showLicence == 'INSURANCE') {
      vm.showmalpracticeLicense = true;
      vm.objectName = 'INSURANCE';
    }

    vm.moreinfo = JSON.parse(localStorage.getItem("providerMoreInfo"));
    if (Object.keys(vm.moreinfo).length && Object.keys(vm.moreinfo.license).length) {
      vm.providerViewMode = true;
      vm.moreinfo.license['licenseDate'] = new Date(vm.moreinfo.license.expiryDate);
    } else {
      vm.editBtnClick();
      vm.moreinfo = { "licenseTypeId": null, "objectValue": "", "provider": null, "license": { "licenseId": null, "state": "", "licenseNo": "", "expiryDate": null, "isDue": false, "notes": "", "carrier": null, "address": null, "policyNumber": null, "objectName": null, "pageNumber": null, "total": null, "size": null, "licenseDocuments": [] }, "createdOn": null, "createdBy": "SYSTEM", "updatedOn": null, "updatedBy": null };
    }
    vm.attachmentCreateViewmode = false;
    vm.getStates();
  };

  vm.init();
})