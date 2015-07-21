angular.module('angular-virtual-keyboard', [])
.constant('VKI_CONFIG', {
	/*jshint maxlen:500 */
	// layout
	'layout': {
		'US International': {
			'name': 'US International', 'keys': [
				[['`', '~'], ['1', '!', '\u00a1', '\u00b9'], ['2', '@', '\u00b2'], ['3', '#', '\u00b3'], ['4', '$', '\u00a4', '\u00a3'], ['5', '%', '\u20ac'], ['6', '^', '\u00bc'], ['7', '&', '\u00bd'], ['8', '*', '\u00be'], ['9', '(', '\u2018'], ['0', ')', '\u2019'], ['-', '_', '\u00a5'], ['=', '+', '\u00d7', '\u00f7'], ['Bksp', 'Bksp']],
				[['Tab', 'Tab'], ['q', 'Q', '\u00e4', '\u00c4'], ['w', 'W', '\u00e5', '\u00c5'], ['e', 'E', '\u00e9', '\u00c9'], ['r', 'R', '\u00ae'], ['t', 'T', '\u00fe', '\u00de'], ['y', 'Y', '\u00fc', '\u00dc'], ['u', 'U', '\u00fa', '\u00da'], ['i', 'I', '\u00ed', '\u00cd'], ['o', 'O', '\u00f3', '\u00d3'], ['p', 'P', '\u00f6', '\u00d6'], ['[', '{', '\u00ab'], [']', '}', '\u00bb'], ['\\', '|', '\u00ac', '\u00a6']],
				[['Caps', 'Caps'], ['a', 'A', '\u00e1', '\u00c1'], ['s', 'S', '\u00df', '\u00a7'], ['d', 'D', '\u00f0', '\u00d0'], ['f', 'F'], ['g', 'G'], ['h', 'H'], ['j', 'J'], ['k', 'K'], ['l', 'L', '\u00f8', '\u00d8'], [';', ':', '\u00b6', '\u00b0'], ['\'', '"', '\u00b4', '\u00a8'], ['Enter', 'Enter']],
				[['Shift', 'Shift'], ['z', 'Z', '\u00e6', '\u00c6'], ['x', 'X'], ['c', 'C', '\u00a9', '\u00a2'], ['v', 'V'], ['b', 'B'], ['n', 'N', '\u00f1', '\u00d1'], ['m', 'M', '\u00b5'], [',', '<', '\u00e7', '\u00c7'], ['.', '>'], ['/', '?', '\u00bf'], ['Shift', 'Shift']],
				[[' ', ' ', ' ', ' '], ['Alt', 'Alt']]
			],
		'lang': ['en'] }
	},
	// deadkey
	'deadkey': {
		'~': { // Tilde / Stroke
			'a': '\u00e3', 'l': '\u0142', 'n': '\u00f1', 'o': '\u00f5',
			'A': '\u00c3', 'L': '\u0141', 'N': '\u00d1', 'O': '\u00d5'
		},
		'^': { // Circumflex
			'a': '\u00e2', 'e': '\u00ea', 'i': '\u00ee', 'o': '\u00f4', 'u': '\u00fb', 'w': '\u0175', 'y': '\u0177',
			'A': '\u00c2', 'E': '\u00ca', 'I': '\u00ce', 'O': '\u00d4', 'U': '\u00db', 'W': '\u0174', 'Y': '\u0176'
		},
		'`' : { // Grave
			'a': '\u00e0', 'e': '\u00e8', 'i': '\u00ec', 'o': '\u00f2', 'u': '\u00f9', '\u00fc': '\u01dc',
			'A': '\u00c0', 'E': '\u00c8', 'I': '\u00cc', 'O': '\u00d2', 'U': '\u00d9', '\u00dc': '\u01db'
		},
		'\'': { // Acute
			'a': '\u00e1', 'e': '\u00e9', 'i': '\u00ed', 'o': '\u00f3', 'u': '\u00fa', 'y': '\u00fd', '\u03b1': '\u03ac', '\u03b5': '\u03ad', '\u03b7': '\u03ae', '\u03b9': '\u03af', '\u03bf': '\u03cc', '\u03c5': '\u03cd', '\u03c9': '\u03ce', '\u00fc': '\u01d8',
			'A': '\u00c1', 'E': '\u00c9', 'I': '\u00cd', 'O': '\u00d3', 'U': '\u00da', 'Y': '\u00dd', '\u0391': '\u0386', '\u0395': '\u0388', '\u0397': '\u0389', '\u0399': '\u038a', '\u039f': '\u038c', '\u03a5': '\u038e', '\u03a9': '\u038f', '\u00dc': '\u01d7'
		},
		'\u00b4': { // Acute
			'a': '\u00e1', 'e': '\u00e9', 'i': '\u00ed', 'o': '\u00f3', 'u': '\u00fa', 'y': '\u00fd', '\u03b1': '\u03ac', '\u03b5': '\u03ad', '\u03b7': '\u03ae', '\u03b9': '\u03af', '\u03bf': '\u03cc', '\u03c5': '\u03cd', '\u03c9': '\u03ce', '\u00fc': '\u01d8',
			'A': '\u00c1', 'E': '\u00c9', 'I': '\u00cd', 'O': '\u00d3', 'U': '\u00da', 'Y': '\u00dd', '\u0391': '\u0386', '\u0395': '\u0388', '\u0397': '\u0389', '\u0399': '\u038a', '\u039f': '\u038c', '\u03a5': '\u038e', '\u03a9': '\u038f', '\u00dc': '\u01d7'
		},
		'\u00a8': { // Trema
			'a': '\u00e4', 'e': '\u00eb', 'i': '\u00ef', 'o': '\u00f6', 'u': '\u00fc', 'y': '\u00ff', '\u03b9': '\u03ca', '\u03c5': '\u03cb', '\u016B': '\u01D6', '\u00FA': '\u01D8', '\u01D4': '\u01DA', '\u00F9': '\u01DC',
			'A': '\u00c4', 'E': '\u00cb', 'I': '\u00cf', 'O': '\u00d6', 'U': '\u00dc', 'Y': '\u0178', '\u0399': '\u03aa', '\u03a5': '\u03ab', '\u016A': '\u01D5', '\u00DA': '\u01D7', '\u01D3': '\u01D9', '\u00D9': '\u01DB',
			'\u304b': '\u304c', '\u304d': '\u304e', '\u304f': '\u3050', '\u3051': '\u3052', '\u3053': '\u3054', '\u305f': '\u3060', '\u3061': '\u3062', '\u3064': '\u3065', '\u3066': '\u3067', '\u3068': '\u3069',
			'\u3055': '\u3056', '\u3057': '\u3058', '\u3059': '\u305a', '\u305b': '\u305c', '\u305d': '\u305e', '\u306f': '\u3070', '\u3072': '\u3073', '\u3075': '\u3076', '\u3078': '\u3079', '\u307b': '\u307c',
			'\u30ab': '\u30ac', '\u30ad': '\u30ae', '\u30af': '\u30b0', '\u30b1': '\u30b2', '\u30b3': '\u30b4', '\u30bf': '\u30c0', '\u30c1': '\u30c2', '\u30c4': '\u30c5', '\u30c6': '\u30c7', '\u30c8': '\u30c9',
			'\u30b5': '\u30b6', '\u30b7': '\u30b8', '\u30b9': '\u30ba', '\u30bb': '\u30bc', '\u30bd': '\u30be', '\u30cf': '\u30d0', '\u30d2': '\u30d3', '\u30d5': '\u30d6', '\u30d8': '\u30d9', '\u30db': '\u30dc'
		}
	},
	// DEFAULT layout
	kt: 'US International',
	i18n: {
		'00': 'Display Number Pad',
		'01': 'Display virtual keyboard interface',
		'02': 'Select keyboard layout',
		'03': 'Dead keys',
		'04': 'On',
		'05': 'Off',
		'06': 'Close the keyboard',
		'07': 'Clear',
		'08': 'Clear this input',
		'09': 'Version',
		'10': 'Decrease keyboard size',
		'11': 'Increase keyboard size'
	},
	relative: true,
	sizeAdj: true
})
.service('ngVirtualKeyboardService', ['VKI_CONFIG', function(VKI_CONFIG) {
	/*globals VKI */
	return {
		attach: function(element, config, inputCallback) {
			config = config || {};
			config.i18n = config.i18n || VKI_CONFIG.i18n;
			config.kt = config.kt || VKI_CONFIG.kt;
			config.relative = config.relative === false ? false : VKI_CONFIG.relative;
			config.keyCenter = config.keyCenter || VKI_CONFIG.keyCenter;
			config.sizeAdj = config.sizeAdj === false ? false : VKI_CONFIG.sizeAdj;

			var vki = new VKI(config, VKI_CONFIG.layout, VKI_CONFIG.deadkey, inputCallback);
			vki.attachVki(element);
		}
	};
}])
.directive('ngVirtualKeyboard', ['ngVirtualKeyboardService', '$timeout', '$injector',
	function(ngVirtualKeyboardService, $timeout, $injector) {
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
			if ($injector.has('UAParser')) {
				var UAParser = $injector.get('UAParser');
				var results = new UAParser().getResult();
				var isMobile = results.device.type === 'mobile' || results.device.type === 'tablet';
                isMobile = isMobile || (results.os && (results.os.name === 'Android'));
                isMobile = isMobile || (results.os && (results.os.name === 'iOS'));
				if (isMobile && scope.config.showInMobile !== true) {
					return;
				}
			}

			ngVirtualKeyboardService.attach(elements[0], scope.config, function() {
				$timeout(function() {
					ngModelCtrl.$setViewValue(elements[0].value);
				});
			});
		}
	};
}]);
