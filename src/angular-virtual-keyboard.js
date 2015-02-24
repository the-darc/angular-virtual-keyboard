angular.module('angular-virtual-keyboard', [])
.service('ngVirtualKeyboardService', [function() {
	return {
		attach: function(element, config, inputCallback) {
			var vki = new VKI(config, inputCallback);
			vki.VKI_attach(element);
		}
	};
}])
.directive('ngVirtualKeyboard', ['ngVirtualKeyboardService', '$timeout', function(ngVirtualKeyboardService, $timeout) {
	return {
		restrict: 'A',
		require : '?ngModel',
		scope: {
			config: '=ngVirtualKeyboard'
		},
		link: function(scope, elements, attrs, ngModelCtrl) {
			if(!ngModelCtrl){
				return;
			}

			// Don't show virtual keyboard in mobile devices (default)
			var parser = new UAParser();
			var device = parser.getDevice();
			var isMobile = device.type === 'mobile' || device.type === 'tablet';
			if (isMobile && attrs.vkForceMobile === undefined) {
				return;
			}

			ngVirtualKeyboardService.attach(elements[0], scope.config, function() {
				$timeout(function() {
					ngModelCtrl.$setViewValue(elements[0].value);
				});
			});
		}
	}
}]);
