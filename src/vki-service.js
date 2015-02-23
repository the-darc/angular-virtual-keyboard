angular.module('angular-virtual-keyboard', [])
.service('ngVirtualKeyboardService', [function() {
	var localVKI = VKI();

	return {
		VKI_attach: VKI_attach,
		VKI_close: VKI_close,
		setConfig: function(config) {
			//TODO
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
			ngVirtualKeyboardService.VKI_attach(elements[0]);
		}
	}
}]);
