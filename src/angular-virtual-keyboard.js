angular.module('angular-virtual-keyboard', [])
.service('ngVirtualKeyboardService', [function() {
	return {
		attach: function(element, config) {
			var vki = new VKI(config);
			vki.VKI_attach(element);
		}
	};
}])
.directive('ngVirtualKeyboard', ['ngVirtualKeyboardService', function(ngVirtualKeyboardService) {
	return {
		restrict: 'A',
		scope: {
			config: '=ngVirtualKeyboard'
		},
		link: function(scope, elements) {
			ngVirtualKeyboardService.attach(elements[0], scope.config);
		}
	}
}]);
