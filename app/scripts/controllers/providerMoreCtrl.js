angular.module('healthCareApp').controller('providerMoreCtrl', function($scope) {
	var vm = this;
	$scope.moreinfo = JSON.parse(localStorage.getItem("providerMoreInfo"));
	var showLicence = localStorage.getItem("licenseType");
	  if(showLicence == 'MEDICAL') {
        $scope.showmedicalLicense = true;
      } else if (showLicence == 'DEA_LICENSE') {
        $scope.showdealLicense = true;
      } else if (showLicence == 'MALPRACTICE_INSURANCE') {
        $scope.showmalpracticeLicense = true;
      };

      vm.viewMode = true;
      vm.attachmentCreateViewmode = false;
      vm.showAttachmentCreate = function() {
     	 vm.attachmentCreateViewmode = true;
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
})