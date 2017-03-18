'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('OrganitionCtrl', function($location, healthCareBusinessConstants, ApiService, $rootScope) {
    var vm = this;
    // error call back method.
    var errorCallback = function(error) {
      vm.errorMsg = error.data.message;
      console.log("login response::", error);
    };

    // final call back method called no matter success or failure
    var finalCallBack = function(res) {
      console.log('finalCallBack', res);
      $rootScope.loading = false;
    };

    // success Call back method
    var searchSuccessCallback = function(res) {
      vm.personals = res.data;
    };

    vm.searchEmployee = function() {
      var searchObj = {
        "firstName": vm.firstName,
        "lastName": vm.lastName,
        "location": vm.location,
        "activeFlag": vm.status
      };
      if (vm.firstName || vm.lastName || vm.location || vm.status) {
        ApiService.post(healthCareBusinessConstants.PERSONAL_SEARCH_URL, searchObj).then(searchSuccessCallback, errorCallback).finally(finalCallBack);
      } else {
        vm.errorMsg = 'Please Enter Name/Employee Id/SSN';
      }
    };

    vm.pagination = function(pageno, selection) {
      console.log("Current page number::", pageno);
      if (selection == 'next') {
        vm.pageNo += 1;
      } else {
        vm.pageNo -= 1;
      }
      vm.getPersonals(vm.pageNo);
    };

    vm.disabled = function(pageno, selection) {
      return vm.pageNo == 0;
    };

    vm.active = function() {
      if (vm.personals && vm.personals[0].total) {
        return vm.pageNo == 0 && vm.pageNo <= vm.personals[0].total / 20;
      }
    };

    var getLocationsSb = function(res) {
      vm.locations = res.data;
    };

    vm.getLocations = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.GET_LOCATIONS + '?page=' + pagenumber).then(getLocationsSb, errorCallback).finally(finalCallBack);
    };




    vm.cancelBtnclick = function() {
      $location.path('organition');
    };

    vm.editBtnClick = function() {
      vm.viewmode = false;
    };

    vm.showAttachmentCreate = function() {
      vm.attachmentCreateViewmode = true;
    };

    vm.hideAttachmentCreate = function() {
      // remove or empty the attachment form data
      vm.attachmentCreateViewmode = false;
    };

    vm.createAttachment = function() {
      // make an api for adding the new attachment
      vm.hideAttachmentCreate();
    };

    var getStatesSb = function(res) {
      vm.states = res.data;
    };

    vm.getStates = function() {
      ApiService.get(healthCareBusinessConstants.GET_STATES_LIST).then(getStatesSb, errorCallback).finally(finalCallBack);
    };
    
    var getCompaniesSb = function(res) {
      vm.companyDetailsObj = res.data[0];
    };

    vm.getCompanies = function(pagenumber) {
      ApiService.get(healthCareBusinessConstants.GET_COMPANIES + '?page=' + pagenumber).then(getCompaniesSb, errorCallback).finally(finalCallBack);
    };

    vm.organitionDetailsView = function(obj) {
      localStorage.setItem('locationsDetails', angular.toJson(obj));
      $location.path('locationsMore');
    };

    vm.organitionCompanyDetailsView = function(obj) {
      localStorage.setItem('companyDetails', angular.toJson(obj));
      $location.path('companyMore');
    };

    vm.init = function() {
      vm.pageNo = 0;
      vm.getLocations(0);
      vm.getCompanies(0);
      vm.viewmode = true;
      vm.myDate = new Date();
      vm.hideAttachmentCreate();
      vm.getStates();
    };

    vm.init();
  });
