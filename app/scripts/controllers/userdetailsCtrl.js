'use strict';
/**
 * @ngdoc function
 * @name healthCareApp.controller:UserdetailsCtrl
 * @description
 * # AdminCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('UserdetailsCtrl', function($http, $rootScope, $scope, healthCareBusinessConstants, ApiService, $location) {
    $rootScope.hideNavbar = false;
    var vm = this;

    // error call back method.
    var errorCallback = function(error) {
      if (error && error.data) {
        vm.errorMsg = error.data.message;
      }
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
    };

    var getUsersSb = function(res) {
      vm.users = res.data;
    };

    vm.getPersonals = function() {
      ApiService.get(healthCareBusinessConstants.GET_USERS).then(getUsersSb, errorCallback).finally(finalCallBack);
    };

    vm.cancelBtnclick = function() {
      $location.path('admin');
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    var saveUserSuccessCallback = function () {
      console.log("personal saved successfully");
      $location.path('admin');
    };

    vm.saveBtnClick = function () {
      ApiService.post(healthCareBusinessConstants.GET_USERS, vm.userDetailsObj).then(saveUserSuccessCallback, errorCallback).finally(finalCallBack);
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
    };



$scope.uploadFile = function(files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("uploadingFiles", files[0]);

    $http.post(healthCareBusinessConstants.SAVE_DOC, fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    }).success(function(){
      alert('yes')
    }).error(function(){
      alert('error');
    });
};


    vm.files = [];
    vm.createAttachment = function() {
      var url = healthCareBusinessConstants.SAVE_DOC;
           var data = new FormData();
            // for (var i in vm.files) {
            //     data.append("uploadingFiles", vm.files[i]);
            // }
        // var data = new FormData();
        data.append('uploadingFiles', angular.toJson(vm.files[0]));
            // data.append('documentId', null);
            // data.append('person', null);
            // data.append('description', null);
            // data.append('createdOn', null);
            // data.append('createdBy', null);
            // data.append('updatedOn', null);
            // data.append('updatedBy', null);
            // data.append('license', null);
            // data.append('company', null);
            // data.append('documentUrl', null);
            // data.append('notes', null);
            // data.append('expiryDate', 1489686281597);
            // data.append('trackExpiryDate', true);
            // data.append('documentCategory', null);

            // // ADD LISTENERS.
            // var objXhr = new XMLHttpRequest();
            // objXhr.addEventListener("progress", updateProgress, false);
            // objXhr.addEventListener("load", transferComplete, false);

            // // SEND FILE DETAILS TO THE API.
            // objXhr.open("POST", url);
            // objXhr.send(data);

            $http.post(url, data, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            })
            .then(function(){
              alert('success!!');
            }, function(){
               alert('fail!!');
            });
      vm.hideAttachmentCreate();
    };

 // UPDATE PROGRESS BAR.
        function updateProgress(e) {
            if (e.lengthComputable) {
                document.getElementById('pro').setAttribute('value', e.loaded);
                document.getElementById('pro').setAttribute('max', e.total);
            }
        }

        // CONFIRMATION.
        function transferComplete(e) {
            alert("Files uploaded successfully.");
        }

    vm.init = function() {
      vm.userDetailsObj = angular.fromJson(localStorage.getItem('userdetails'));
      if (Object.keys(vm.userDetailsObj).length) {
        vm.viewmode = true;
      } else {
        vm.viewmode = false;
      }
      vm.roles = [{ role: 'ADMINISTRATOR' }, { role: 'USER' }];
      console.log(vm.userdetailsObj);
    };

    vm.init();
});