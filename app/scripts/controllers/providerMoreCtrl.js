angular.module('healthCareApp').controller('providerMoreCtrl', function($scope, $location) {
	var vm = this;
	var showLicence = localStorage.getItem("licenseType");

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
    $location.path('personal');
  };

  vm.savePersonal = function() {
    vm.personalDetailsObj.dateOfBirth = (vm.personalDetailsObj.dateOfBirth) ? vm.personalDetailsObj.dateOfBirth.getTime() : 0;
    ApiService.post(healthCareBusinessConstants.PERSONAL, vm.personalDetailsObj).then(savePersonalSuccessCallback, errorCallback).finally(finalCallBack);
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
        vm.personalDetailsObj.document.push(res.data);
        //vm.locationsDetailsObj['documents'].push(res.data)
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

  vm.init = function() {
    vm.moreinfo = JSON.parse(localStorage.getItem("providerMoreInfo"));
    vm.providerViewMode = true;
    vm.attachmentCreateViewmode = false;
  };

  vm.init();
})