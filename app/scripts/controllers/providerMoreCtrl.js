angular.module('healthCareApp').controller('providerMoreCtrl', function($scope,  $interval, $location, healthCareBusinessConstants, ApiService, $http, UtilService) {
	var vm = this;
	var showLicence = localStorage.getItem("licenseType");

  var errorCallback = function(error) {
    vm.errorMsg = error.data.message;
    $scope.showLoader = false;
    if(vm.errorMsg) {
      UtilService.errorMessage(vm.errorMsg);
    } else {
      UtilService.errorMessage('Something went wrong!!');
    }
  };

  // final call back method called no matter success or failure
  var finalCallBack = function(res) {
    console.log('finalCallBack', res);
  };

  vm.showAttachmentCreate = function() {
  	vm.attachmentCreateViewmode = true;
  };

  var savePersonalSuccessCallback = function(res) {
    $scope.showLoader = false;
    localStorage.setItem("providerResObj", JSON.stringify(res.data));
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
      "carrier": vm.moreinfo.license.carrier,
      "address": vm.moreinfo.license.address,
      "pageNumber": 0,
      "total": 0,
      "size": 0,
      "licenseDocuments": vm.moreinfo.license.licenseDocuments
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
        $scope.showLoader = false;
        UtilService.errorMessage('document uploaded successfully!!');
        vm.moreinfo.license.licenseDocuments.push(res.data);
      }, function(res) {
        $scope.showLoader = false;
        UtilService.errorMessage('document upload fail!!');
      });
  };

  /* doc remove */
  var docremoveScb = function(msg) {
    UtilService.errorMessage('Successfully document removed!!');
  };

  vm.documentRemove = function(index, docId) {
    var url = healthCareBusinessConstants.DELETE_DOC + docId;
    vm.moreinfo.license.licenseDocuments.splice(index, 1);
    ApiService.delete(url).then(docremoveScb, errorCallback);
  };
    
  vm.cancelBtnclick = function() {
    $location.path(localStorage.getItem("frompage"));
  };

  vm.editBtnClick = function() {
    vm.providerViewMode = false;
    vm.showmedicalLicense = false;
    vm.showdealLicense = false;
    vm.showmalpracticeLicense = false;
    if(showLicence == 'MEDICAL') {
      vm.EditMedicalLicense = true;
      vm.objectName = 'MEDICAL';
    } else if (showLicence == 'DEA_LICENSE') {
      vm.EditDealLicense = true;
      vm.objectName = 'DEA_LICENSE';
    } else if (showLicence == 'MALPRACTICE_INSURANCE') {
      vm.EditMalpracticeLicense = true;
      vm.objectName = 'MALPRACTICE_INSURANCE';
    } else if(showLicence == 'INSURANCE') {
      vm.EditMalpracticeLicense = true;
      vm.objectName = 'INSURANCE';
    };
  };

  var getStatesSb = function(res) {
    vm.states = res.data;
  };

  vm.getStates = function() {
    ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
  };

  vm.init = function() {
    vm.determinateValue = 20;
    if(showLicence == 'MEDICAL') {
      vm.showmedicalLicense = true;
    } else if (showLicence == 'DEA_LICENSE') {
      vm.showdealLicense = true;
    } else if (showLicence == 'MALPRACTICE_INSURANCE') {
      vm.showmalpracticeLicense = true;
    } else if(showLicence == 'INSURANCE'){
      vm.showmalpracticeLicense = true;
      vm.objectName = 'INSURANCE';
    }
    vm.moreinfo = JSON.parse(localStorage.getItem("providerMoreInfo"));
    if (Object.keys(vm.moreinfo).length && Object.keys(vm.moreinfo.license).length ) {
      vm.providerViewMode = true;
      vm.moreinfo.license['licenseDate'] = new Date(vm.moreinfo.license.expiryDate);
      } else {
        vm.editBtnClick();
        vm.moreinfo = { "licenseTypeId": null, "objectValue": "", "provider": null, "license": { "licenseId": null, "state": "", "licenseNo": "", "expiryDate": null, "isDue": null, "notes": "", "carrier": null, "address": null, "policyNumber": null, "objectName": null, "pageNumber": null, "total": null, "size": null, "licenseDocuments": [] }, "createdOn": null, "createdBy": "SYSTEM", "updatedOn": null, "updatedBy": null };
      }
    vm.attachmentCreateViewmode = false;
    vm.getStates();
  };

  vm.init();
})