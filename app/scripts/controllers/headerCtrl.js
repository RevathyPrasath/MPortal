'use strict';

/**
 * @ngdoc function
 * @name healthCareApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the healthCareApp
 */
angular.module('healthCareApp')
  .controller('HeaderCtrl', function ($location) {
  	var vm = this;

    vm.getClass = function (path) {
      return ($location.path().substr(0, path.length) === path) ? 'active' : '';
    };

  	//human Resource tab click.
  	vm.humanResource = function () {
  		$location.path('main');
  	};

  	vm.statusReport = function () {
  		$location.path('statusReport');
  	};

    var elemWidth, fitCount, varWidth = 0, ctr, $menu = $("ul#menu"), $collectedSet; 
    ctr = $menu.children().length;
    $menu.children().each(function() {
      varWidth += $(this).outerWidth();
    });
    collect();
    $(window).resize(collect);
    function collect() {
      elemWidth = $menu.width();
      fitCount = Math.floor((elemWidth / varWidth) * ctr)-3;
      $menu.children().css({"display": "block", "width": "auto"});
      $collectedSet = $menu.children(":gt(" + fitCount + ")");
      $("#submenu").empty().append($collectedSet.clone());  
      $collectedSet.css({"display": "none", "width": "0"});
    };
    
  });
