[![Bower version](https://badge.fury.io/bo/angular-virtual-keyboard.svg)](http://badge.fury.io/bo/angular-virtual-keyboard)
angular-virtual-keyboard
========================
AngularJS Constant for dependency injection of [UAParser.js](https://github.com/faisalman/ua-parser-js) whithout registering it in the global scope.

## Bower install

```sh
$ bower install angular-virtual-keyboard
```

## Dependencies

- Optional: [angular-useragent-parser](https://github.com/the-darc/angular-useragent-parser)  
_Obs.: Required to auto-hide the keyboard interface in mobile devices or to use the 'vk-force-mobile' configuration._

## How to use

1. Import the ```angular-virtual-keyboard.min.js``` script in your page.

2. Include the module ```angular-virtual-keyboard``` in your angular app.

2. Include the module ```angular-useragent-parser``` in your angular app. _Optional, used to auto hide the virtual keyboard interface in mobile devices._

3. Use the 'ng-virtual-keyboard' directive in any text fields, password fields or textareas:

```html
<input type='text' ng-model="yourModel" ng-virtual-keyboard/>
```

_See example in [demo code](https://github.com/the-darc/angular-virtual-keyboard/blob/master/demo/index.html)_

## License

The MIT License (MIT)

Copyright (c) 2015 Daniel Campos

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
