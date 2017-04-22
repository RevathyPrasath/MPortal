angular.module('healthCareApp').controller('providerMoreCtrl', function($scope, $location, healthCareBusinessConstants, ApiService, $http) {
	var vm = this;
	var showLicence = localStorage.getItem("licenseType");

  var errorCallback = function(error) {
    vm.errorMsg = error.data.message;
    console.log("login response::", error);
  };

  // final call back method called no matter success or failure
  var finalCallBack = function(res) {
    console.log('finalCallBack', res);
  };

  if(showLicence == 'MEDICAL') {
    vm.showmedicalLicense = true;
  } else if (showLicence == 'DEA_LICENSE') {
    vm.showdealLicense = true;
  } else if (showLicence == 'MALPRACTICE_INSURANCE') {
    vm.showmalpracticeLicense = true;
  };

  vm.showAttachmentCreate = function() {
  	vm.attachmentCreateViewmode = true;
  };

  var savePersonalSuccessCallback = function() {
    console.log("personal saved successfully");
    $location.path('personnalDetails');
  };

  vm.savePersonal = function() {
    vm.moreinfo.license.licenseDate = (vm.moreinfo.license.licenseDate) ? vm.moreinfo.license.licenseDate.getTime() : 0;
    ApiService.post(healthCareBusinessConstants.CREATE_LICENSE, vm.moreinfo).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
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
        vm.moreinfo.license.licenseDocuments.push(res.data);
      }, function(res) {
        alert('document upload fail!');
      });
  };

  vm.cancelBtnclick = function() {
    $location.path("personnalDetails");
  };

  vm.editBtnClick = function() {
    vm.providerViewMode = false;
    vm.showmedicalLicense = false;
    vm.showdealLicense = false;
    vm.showmalpracticeLicense = false;
    if(showLicence == 'MEDICAL') {
      vm.EditMedicalLicense = true;
    } else if (showLicence == 'DEA_LICENSE') {
      vm.EditDealLicense = true;
    } else if (showLicence == 'MALPRACTICE_INSURANCE') {
      vm.EditMalpracticeLicense = true;
    };
  };

  var getStatesSb = function(res) {
    vm.states = res.data;
  };

  vm.getStates = function() {
    ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
  };

  vm.init = function() {
    vm.moreinfo = JSON.parse(localStorage.getItem("providerMoreInfo"));
    if (Object.keys(vm.moreinfo).length) {
      vm.providerViewMode = true;
      vm.moreinfo.license['licenseDate'] = new Date(vm.moreinfo.license.expiryDate);
      } else {
        vm.editBtnClick();
        vm.moreinfo = { "licenseTypeId": null, "objectValue": "", "provider": null, "license": { "licenseId": null, "state": "", "licenseNo": "", "expiryDate": null, "isDue": null, "notes": "", "carrier": null, "address": null, "policyNumber": null, "objectName": null, "pageNumber": null, "total": null, "size": null, "licenseDocuments": [] }, "createdOn": null, "createdBy": "SYSTEM", "updatedOn": null, "updatedBy": null };
        // vm.moreinfo['document'] = [];
      }
    vm.attachmentCreateViewmode = false;
    vm.getStates();
  };

  vm.init();
})