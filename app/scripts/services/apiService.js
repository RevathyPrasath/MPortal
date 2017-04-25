/**
 * Created by bujjibabu balga on 09/20/2016
 */
angular.module('healthCareApp').factory('ApiService', function($http) {
 	return {
    post: function (url, data, headers) {
      return $http.post(url, data, {'Content-Type': 'multipart/form-data'});
    },
    get: function (url, headers) {
    	return $http.get(url);
    },
    put: function (url, data, headers) {
      return $http.put(url, data, {'Content-Type': 'multipart/form-data'});
    }
  }
});