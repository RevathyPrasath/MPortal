angular.module('healthCareApp').factory('UtilService', function($mdToast) {
 	return {
    errorMessage: function (content) {
      var toast = $mdToast.simple()
      .textContent(content)
      .action('X')
      .hideDelay(5000)
      .highlightAction(true)
      .highlightClass('md-accent')
      .position("left right");
      $mdToast.show(toast).then(function(response) {
        if ( response == 'ok' ) {
          $mdToast.hide();
        }
      });
    }
  }
});