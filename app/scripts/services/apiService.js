/**
 * Created by bujjibabu balga on 09/20/2016
 */
angular.module('healthCareApp').factory('ApiService', function($http) {
 	return {
    post: function (url, data) {
      return $http.post(url, data);
    },
    get: function (url, headers) {
    	return $http.get(url);
    }
  }
});