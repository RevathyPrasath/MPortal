'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
    .controller('StatusReportCtrl', function($rootScope, ApiService, healthCareBusinessConstants) {
        var vm = this;
        vm.expaire = function(value) {
            $rootScope.loading = true;
            if (value == 'Staff') {
                ApiService.post(healthCareBusinessConstants.STAFF, {}).then(successCallback, errorCallback).finally(finalCallBack);
            } else {
                ApiService.post(healthCareBusinessConstants.FACILITY, {}).then(successCallback, errorCallback).finally(finalCallBack);
            }
        };

        // success Call back method
        function successCallback(response) {
            console.log(response);
            vm.expaireData = response.data;
        };

        // error call back method.
        function errorCallback(error) {
            vm.errorMsg = error.data.message;
            console.log("login response::", error);
        };

        // final call back method called no matter success or failure
        function finalCallBack(res) {
            console.log('finalCallBack', res);
            $rootScope.loading = false;
        };
        vm.statusSelected = function(selectedTab) {
            vm.selected = selectedTab;
        }
        vm.isActive = function(selectedTab) {
            console.log(selectedTab);
            return vm.selected == selectedTab
        }
        vm.expaire('Staff');
    });
