/**
 * angular-virtual-keyboard
 * An AngularJs Virtual Keyboard Interface based on GreyWyvern VKI
 * @version v0.4.2
 * @author the-darc <darc.tec@gmail.com>
 * @link https://github.com/the-darc/angular-virtual-keyboard
 * @license MIT
 */
(function (angular) {

/* jshint ignore:start */

/* ********************************************************************
 **********************************************************************
 * HTML Virtual Keyboard Interface Script - v1.49
 *   Copyright (c) 2011 - GreyWyvern
 *
 * Add a script-driven keyboard interface to text fields, password
 * fields and textareas.
 *
 * NOTE: The code below has been slightly modified to accommodate the needs of the
 *       angular-virtual-keyboard directive.
 *
 *       See http://www.greywyvern.com/code/javascript/keyboard for examples,
 *       usage instructions and the original 'Virtual Keyboard Interface' Code.
 *
 * Keyboard Credits
 *   - Yiddish (Yidish Lebt) keyboard layout by Simche Taub (jidysz.net)
 *   - Urdu Phonetic keyboard layout by Khalid Malik
 *   - Yiddish keyboard layout by Helmut Wollmersdorfer
 *   - Khmer keyboard layout by Sovann Heng (km-kh.com)
 *   - Dari keyboard layout by Saif Fazel
 *   - Kurdish keyboard layout by Ara Qadir
 *   - Assamese keyboard layout by Kanchan Gogoi
 *   - Bulgarian BDS keyboard layout by Milen Georgiev
 *   - Basic Japanese Hiragana/Katakana keyboard layout by Damjan
 *   - Ukrainian keyboard layout by Dmitry Nikitin
 *   - Macedonian keyboard layout by Damjan Dimitrioski
 *   - Pashto keyboard layout by Ahmad Wali Achakzai (qamosona.com)
 *   - Armenian Eastern and Western keyboard layouts by Hayastan Project (www.hayastan.co.uk)
 *   - Pinyin keyboard layout from a collaboration with Lou Winklemann
 *   - Kazakh keyboard layout by Alex Madyankin
 *   - Danish keyboard layout by Verner KjÃ¦rsgaard
 *   - Slovak keyboard layout by Daniel Lara (www.learningslovak.com)
 *   - Belarusian and Serbian Cyrillic keyboard layouts by Evgeniy Titov
 *   - Bulgarian Phonetic keyboard layout by Samuil Gospodinov
 *   - Swedish keyboard layout by HÃ¥kan Sandberg
 *   - Romanian keyboard layout by Aurel
 *   - Farsi (Persian) keyboard layout by Kaveh Bakhtiyari (www.bakhtiyari.com)
 *   - Burmese keyboard layout by Cetanapa
 *   - Bosnian/Croatian/Serbian Latin/Slovenian keyboard layout by Miran Zeljko
 *   - Hungarian keyboard layout by Antal Sall 'Hiromacu'
 *   - Arabic keyboard layout by Srinivas Reddy
 *   - Italian and Spanish (Spain) keyboard layouts by dictionarist.com
 *   - Lithuanian and Russian keyboard layouts by Ramunas
 *   - German keyboard layout by QuHno
 *   - French keyboard layout by Hidden Evil
 *   - Polish Programmers layout by moose
 *   - Turkish keyboard layouts by offcu
 *   - Dutch and US Int'l keyboard layouts by jerone
 *
 */

var VKI = function(customConfig, layout, deadKeys, keyInputCallback) {
  var self = this;
  var config = customConfig || {};
  self.keyInputCallback = keyInputCallback || function(){};

  this.VKI_version = "1.49";
  this.VKI_showVersion = config.showVersion !== undefined ? config.showVersion : false;
  this.VKI_target = false;
  this.VKI_shift = this.VKI_shiftlock = false;
  this.VKI_altgr = this.VKI_altgrlock = false;
  this.VKI_dead = false;
  this.VKI_deadBox = true; // Show the dead keys checkbox
  this.VKI_deadkeysOn = config.deadkeysOn !== undefined ? config.deadkeysOn : true;  // Turn dead keys on by default
  this.VKI_numberPad = config.numberPad !== undefined ? config.numberPad : false;  // Allow user to open and close the number pad
  this.VKI_numberPadOn = false;  // Show number pad by default
  this.VKI_kts = this.VKI_kt = config.kt || 'US International';  // Default keyboard layout
  this.VKI_langAdapt = !config.kt;  // Use lang attribute of input to select keyboard (Will be used if no keyboard layout was defined in custom config)
  this.VKI_size = config.size >=1 && config.size <= 5 ? config.size : 3;  // Default keyboard size (1-5)
  this.VKI_sizeAdj = config.sizeAdj === false ? false : true;  // Allow user to adjust keyboard size
  this.VKI_clearPasswords = false;  // Clear password fields on focus
  this.VKI_imageURI = config.imageURI !== undefined ? config.imageURI : "";  // If empty string, use imageless mode
  this.VKI_clickless = 0;  // 0 = disabled, > 0 = delay in ms
  this.VKI_activeTab = 0;  // Tab moves to next: 1 = element, 2 = keyboard enabled element
  this.VKI_keyCenter = config.keyCenter || 3;
  this.VKI_forcePosition = config.forcePosition || false;
  this.VKI_relative = config.relative === false ? false : true;

  this.VKI_isIE = /*@cc_on!@*/false;
  this.VKI_isIE6 = /*@if(@_jscript_version == 5.6)!@end@*/false;
  this.VKI_isIElt8 = /*@if(@_jscript_version < 5.8)!@end@*/false;
  this.VKI_isWebKit = RegExp("KHTML").test(navigator.userAgent);
  this.VKI_isOpera = RegExp("Opera").test(navigator.userAgent);
  this.VKI_isMoz = (!this.VKI_isWebKit && navigator.product == "Gecko");

  this.VKI_enterSubmit = config.enterSubmit || false; // true to Submit forms when Enter is pressed. Fn to execute a custom function.
  this.VKI_showKbSelect = config.showKbSelect || false; // Defaults to hide keyboard selection combobox

  /* ***** i18n text strings ************************************* */
  this.VKI_i18n = config.i18n;


  /* ***** Create keyboards ************************************** */
  // - Lay out each keyboard in rows of sub-arrays.  Each sub-array
  //   represents one key.
  //
  // - Each sub-array consists of four slots described as follows:
  //     example: ["a", "A", "\u00e1", "\u00c1"]
  //
  //          a) Normal character
  //          A) Character + Shift/Caps
  //     \u00e1) Character + Alt/AltGr/AltLk
  //     \u00c1) Character + Shift/Caps + Alt/AltGr/AltLk
  //
  //   You may include sub-arrays which are fewer than four slots.
  //   In these cases, the missing slots will be blanked when the
  //   corresponding modifier key (Shift or AltGr) is pressed.
  //
  // - If the second slot of a sub-array matches one of the following
  //   strings:
  //     "Tab", "Caps", "Shift", "Enter", "Bksp",
  //     "Alt" OR "AltGr", "AltLk"
  //   then the function of the key will be the following,
  //   respectively:
  //     - Insert a tab
  //     - Toggle Caps Lock (technically a Shift Lock)
  //     - Next entered character will be the shifted character
  //     - Insert a newline (textarea), or close the keyboard
  //     - Delete the previous character
  //     - Next entered character will be the alternate character
  //     - Toggle Alt/AltGr Lock
  //
  //   The first slot of this sub-array will be the text to display
  //   on the corresponding key.  This allows for easy localisation
  //   of key names.
  //
  // - Layout dead keys (diacritic + letter) should be added as
  //   property/value pairs of objects with hash keys equal to the
  //   diacritic.  See the "this.VKI_deadkey" object below the layout
  //   definitions.  In each property/value pair, the value is what
  //   the diacritic would change the property name to.
  //
  // - Note that any characters beyond the normal ASCII set should be
  //   entered in escaped Unicode format.  (eg \u00a3 = Pound symbol)
  //   You can find Unicode values for characters here:
  //     http://unicode.org/charts/
  //
  // - To remove a keyboard, just delete it, or comment it out of the
  //   source code. If you decide to remove the US International
  //   keyboard layout, make sure you change the default layout
  //   (this.VKI_kt) above so it references an existing layout.
  this.VKI_layout = layout;


  /* ***** Define Dead Keys ************************************** */
  // - Lay out each dead key set as an object of property/value
  //   pairs.  The rows below are wrapped so uppercase letters are
  //   below their lowercase equivalents.
  //
  // - The property name is the letter pressed after the diacritic.
  //   The property value is the letter this key-combo will generate.
  //
  // - Note that if you have created a new keyboard layout and want
  //   it included in the distributed script, PLEASE TELL ME if you
  //   have added additional dead keys to the ones below.
  this.VKI_deadkey = deadKeys;


  /* ***** Define Symbols **************************************** */
  this.VKI_symbol = {
    '\u00a0': "NB\nSP", '\u200b': "ZW\nSP", '\u200c': "ZW\nNJ", '\u200d': "ZW\nJ"
  };


  /* ***** Layout Number Pad ************************************* */
  this.VKI_numpad = [
    [["$"], ["\u00a3"], ["\u20ac"], ["\u00a5"]],
    [["7"], ["8"], ["9"], ["/"]],
    [["4"], ["5"], ["6"], ["*"]],
    [["1"], ["2"], ["3"], ["-"]],
    [["0"], ["."], ["="], ["+"]]
  ];

  function hasSelectionStartEnd(elem) {
    var hasSelection = false;
    try {
      hasSelection = !isNaN(elem.selectionStart) && !isNaN(elem.selectionEnd);
    } catch(e) {};
    return hasSelection;
  }


  /* ****************************************************************
   * Attach the keyboard to an element
   *
   */
  self.attachVki = function(elem) {
    if (elem.getAttribute("VKI_attached")) return false;
    if (self.VKI_imageURI) {
      var keybut = document.createElement('img');
          keybut.src = self.VKI_imageURI;
          keybut.alt = self.VKI_i18n['01'];
          keybut.className = "keyboardInputInitiator";
          keybut.title = self.VKI_i18n['01'];
          keybut.elem = elem;
          keybut.onclick = function(e) {
            e = e || event;
            if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
            self.VKI_show(this.elem);
          };
      elem.parentNode.insertBefore(keybut, (elem.dir == "rtl") ? elem : elem.nextSibling);
    } else {
      elem.onfocus = function() {
        if (self.VKI_target != this) {
          if (self.VKI_target) self.VKI_close(false);
          self.VKI_show(this);
        }
      };
      elem.onclick = function() {
        if (!self.VKI_target) self.VKI_show(this);
      }
    }
    elem.setAttribute("VKI_attached", 'true');
    if (self.VKI_isIE) {
      elem.onclick = elem.onselect = elem.onkeyup = function(e) {
        if ((e || event).type != "keyup" || !this.readOnly)
          this.range = document.selection.createRange();
      };
    }
    VKI_addListener(elem, 'click', function(e) {
      if (self.VKI_target == this) {
        e = e || event;
        if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
      } return false;
    }, false);
    if (self.VKI_isMoz)
      elem.addEventListener('blur', function() { this.setAttribute('_scrollTop', this.scrollTop); }, false);

    VKI_addListener(document.documentElement, 'click', function(e) { self.VKI_close(false); }, false);

    // Attach close event handler.
    angular.element(elem).bind('VKI_close', function(){self.VKI_close(false);});
  };


  /* ****************************************************************
   * Common mouse event actions
   *
   */
  function VKI_mouseEvents(elem) {
    if (elem.nodeName == "TD") {
      if (!elem.click) elem.click = function() {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
      };
      elem.VKI_clickless = 0;
      VKI_addListener(elem, 'dblclick', function() { return false; }, false);
    }
    VKI_addListener(elem, 'mouseover', function() {
      if (this.nodeName == "TD" && self.VKI_clickless) {
        var _self = this;
        clearTimeout(this.VKI_clickless);
        this.VKI_clickless = setTimeout(function() { _self.click(); }, self.VKI_clickless);
      }
      if (self.VKI_isIE) this.className += " hover";
    }, false);
    VKI_addListener(elem, 'mouseout', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className = this.className.replace(/ ?(hover|pressed) ?/g, "");
    }, false);
    VKI_addListener(elem, 'mousedown', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className += " pressed";
    }, false);
    VKI_addListener(elem, 'mouseup', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className = this.className.replace(/ ?pressed ?/g, "");
    }, false);
  }


  /* ***** Build the keyboard interface ************************** */
  this.VKI_keyboard = document.createElement('table');
  // this.VKI_keyboard.id = "keyboardInputMaster";
  this.VKI_keyboard.className = "keyboardInputMaster";
  if (this.VKI_relative) {
    self.VKI_keyboard.className += ' relativeKeyboard';
  }
  this.VKI_keyboard.dir = "ltr";
  this.VKI_keyboard.cellSpacing = "0";
  this.VKI_keyboard.reflow = function() {
    this.style.width = "50px";
    var foo = this.offsetWidth;
    this.style.width = "";
  };
  VKI_addListener(this.VKI_keyboard, 'click', function(e) {
    e = e || event;
    if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
    return false;
  }, false);

  if (!this.VKI_layout[this.VKI_kt])
    return alert('No keyboard named "' + this.VKI_kt + '"');

  this.VKI_langCode = {};
  var thead = document.createElement('thead');
    var tr = document.createElement('tr');
      var th = document.createElement('th');
          th.colSpan = "2";

        if (self.VKI_showKbSelect) {
          var kbSelect = document.createElement('div');
              kbSelect.title = this.VKI_i18n['02'];
            VKI_addListener(kbSelect, 'click', function() {
              var ol = this.getElementsByTagName('ol')[0];
              if (!ol.style.display) {
                  ol.style.display = "block";
                var li = ol.getElementsByTagName('li');
                for (var x = 0, scr = 0; x < li.length; x++) {
                  if (VKI_kt == li[x].firstChild.nodeValue) {
                    li[x].className = "selected";
                    scr = li[x].offsetTop - li[x].offsetHeight * 2;
                  } else li[x].className = "";
                } setTimeout(function() { ol.scrollTop = scr; }, 0);
              } else ol.style.display = "";
            }, false);
              kbSelect.appendChild(document.createTextNode(this.VKI_kt));
              kbSelect.appendChild(document.createTextNode(this.VKI_isIElt8 ? " \u2193" : " \u25be"));
              kbSelect.langCount = 0;
            var ol = document.createElement('ol');
              for (ktype in this.VKI_layout) {
                if (typeof this.VKI_layout[ktype] == "object") {
                  if (!this.VKI_layout[ktype].lang) this.VKI_layout[ktype].lang = [];
                  for (var x = 0; x < this.VKI_layout[ktype].lang.length; x++)
                    this.VKI_langCode[this.VKI_layout[ktype].lang[x].toLowerCase().replace(/-/g, "_")] = ktype;
                  var li = document.createElement('li');
                      li.title = this.VKI_layout[ktype].name;
                    VKI_addListener(li, 'click', function(e) {
                      e = e || event;
                      if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
                      this.parentNode.style.display = "";
                      self.VKI_kts = self.VKI_kt = kbSelect.firstChild.nodeValue = this.firstChild.nodeValue;
                      self.VKI_buildKeys();
                      self.VKI_position(true);
                    }, false);
                    VKI_mouseEvents(li);
                      li.appendChild(document.createTextNode(ktype));
                    ol.appendChild(li);
                  kbSelect.langCount++;
                }
              } kbSelect.appendChild(ol);
            if (kbSelect.langCount > 1) th.appendChild(kbSelect);
          this.VKI_langCode.index = [];
          for (prop in this.VKI_langCode)
            if (prop != "index" && typeof this.VKI_langCode[prop] == "string")
              this.VKI_langCode.index.push(prop);
          this.VKI_langCode.index.sort();
          this.VKI_langCode.index.reverse();
        }

        if (this.VKI_numberPad) {
          var span = document.createElement('span');
              span.appendChild(document.createTextNode("#"));
              span.title = this.VKI_i18n['00'];
            VKI_addListener(span, 'click', function() {
              kbNumpad.style.display = (!kbNumpad.style.display) ? "none" : "";
              self.VKI_position(true);
              self.VKI_target.focus();
            }, false);
            VKI_mouseEvents(span);
            th.appendChild(span);
        }

        this.VKI_kbsize = function(e) {
          self.VKI_size = Math.min(5, Math.max(1, self.VKI_size));
          self.VKI_keyboard.className = self.VKI_keyboard.className.replace(/ ?keyboardInputSize\d ?/, "");
          if (self.VKI_size != 2) self.VKI_keyboard.className += " keyboardInputSize" + self.VKI_size;
          self.VKI_position(true);
          if (self.VKI_isOpera) self.VKI_keyboard.reflow();
        };
        if (this.VKI_sizeAdj) {
          var small = document.createElement('small');
              small.title = this.VKI_i18n['10'];
            VKI_addListener(small, 'click', function() {
              --self.VKI_size;
              self.VKI_kbsize();
              self.VKI_target.focus();
            }, false);
            VKI_mouseEvents(small);
              small.appendChild(document.createTextNode(this.VKI_isIElt8 ? "\u2193" : "\u21d3"));
            th.appendChild(small);
          var big = document.createElement('big');
              big.title = this.VKI_i18n['11'];
            VKI_addListener(big, 'click', function() {
              ++self.VKI_size;
              self.VKI_kbsize();
              self.VKI_target.focus();
            }, false);
            VKI_mouseEvents(big);
              big.appendChild(document.createTextNode(this.VKI_isIElt8 ? "\u2191" : "\u21d1"));
            th.appendChild(big);
        }

        var span = document.createElement('span');
            span.appendChild(document.createTextNode(this.VKI_i18n['07']));
            span.title = this.VKI_i18n['08'];
          VKI_addListener(span, 'click', function() {
            self.VKI_target.value = "";
            self.VKI_target.focus();
            self.keyInputCallback();
            return false;
          }, false);
          VKI_mouseEvents(span);
          th.appendChild(span);

        var strong = document.createElement('strong');
            strong.appendChild(document.createTextNode('X'));
            strong.title = this.VKI_i18n['06'];
          VKI_addListener(strong, 'click', function() { self.VKI_close(true); }, false);
          VKI_mouseEvents(strong);
          th.appendChild(strong);

        tr.appendChild(th);
      thead.appendChild(tr);
  this.VKI_keyboard.appendChild(thead);

  var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
      var keyboardsArea = document.createElement('td');
      keyboardsArea.className = 'keyboardsArea';

        var keyboardsTable = document.createElement('table');
          var keyboardsTr = document.createElement('tr');

            /** keyboardInputText ***********************************************************/
            var kbTextPad = document.createElement('td');
            kbTextPad.className = 'keyboardInputTextPad';
              var div = document.createElement('div');

              if (this.VKI_deadBox) {
                var label = document.createElement('label');
                  var checkbox = document.createElement('input');
                      checkbox.type = "checkbox";
                      checkbox.title = this.VKI_i18n['03'] + ": " + ((this.VKI_deadkeysOn) ? this.VKI_i18n['04'] : this.VKI_i18n['05']);
                      checkbox.defaultChecked = this.VKI_deadkeysOn;
                    VKI_addListener(checkbox, 'click', function() {
                      this.title = self.VKI_i18n['03'] + ": " + ((this.checked) ? self.VKI_i18n['04'] : self.VKI_i18n['05']);
                      self.VKI_modify("");
                      return true;
                    }, false);
                    label.appendChild(checkbox);
                      checkbox.checked = this.VKI_deadkeysOn;
                  div.appendChild(label);
                this.VKI_deadkeysOn = checkbox;
              } else this.VKI_deadkeysOn.checked = this.VKI_deadkeysOn;

              if (this.VKI_showVersion) {
                var vr = document.createElement('var');
                    vr.title = this.VKI_i18n['09'] + " " + this.VKI_version;
                    vr.appendChild(document.createTextNode("v" + this.VKI_version));
                  div.appendChild(vr);
              }
            kbTextPad.appendChild(div);
            /*********************************************************** keyboardInputText **/

            /** keyboardInputNumpad ***********************************************************/
            var kbNumpad = document.createElement('td');
                kbNumpad.className = "keyboardInputNumpad";
            // kbNumpad.id = "keyboardInputNumpad";
              if (!this.VKI_numberPadOn) kbNumpad.style.display = "none";
              var ntable = document.createElement('table');
              ntable.cellSpacing = "0";
                var ntbody = document.createElement('tbody');
                for (var x = 0; x < this.VKI_numpad.length; x++) {
                  var ntr = document.createElement('tr');
                    for (var y = 0; y < this.VKI_numpad[x].length; y++) {
                      var ntd = document.createElement('td');
                        VKI_addListener(ntd, 'click', VKI_keyClick, false);
                        VKI_mouseEvents(ntd);
                          ntd.appendChild(document.createTextNode(this.VKI_numpad[x][y]));
                        ntr.appendChild(ntd);
                    }
                  ntbody.appendChild(ntr);
                }
              ntable.appendChild(ntbody);
            kbNumpad.appendChild(ntable);
            /*********************************************************** keyboardInputNumpad **/
          keyboardsTr.appendChild(kbTextPad);
          keyboardsTr.appendChild(kbNumpad);

        keyboardsTable.appendChild(keyboardsTr);
      keyboardsArea.appendChild(keyboardsTable);
    tr.appendChild(keyboardsArea);
  tbody.appendChild(tr);
  this.VKI_keyboard.appendChild(tbody);

  if (this.VKI_isIE6) {
    this.VKI_iframe = document.createElement('iframe');
    this.VKI_iframe.style.position = "absolute";
    this.VKI_iframe.style.border = "0px none";
    this.VKI_iframe.style.filter = "mask()";
    this.VKI_iframe.style.zIndex = "999999";
    this.VKI_iframe.src = this.VKI_imageURI;
  }


  /* ****************************************************************
   * Private table cell attachment function for generic characters
   *
   */
  function VKI_keyClick() {
    var done = false, character = "\xa0";
    if (this.firstChild.nodeName.toLowerCase() != "small") {
      if ((character = this.firstChild.nodeValue) == "\xa0") return false;
    } else character = this.firstChild.getAttribute('char');
    if (self.VKI_deadkeysOn.checked && self.VKI_dead) {
      if (self.VKI_dead != character) {
        if (character != " ") {
          if (self.VKI_deadkey[self.VKI_dead][character]) {
            self.VKI_insert(self.VKI_deadkey[self.VKI_dead][character]);
            done = true;
          }
        } else {
          self.VKI_insert(self.VKI_dead);
          done = true;
        }
      } else done = true;
    } self.VKI_dead = false;

    if (!done) {
      if (self.VKI_deadkeysOn.checked && self.VKI_deadkey[character]) {
        self.VKI_dead = character;
        this.className += " dead";
        if (self.VKI_shift) self.VKI_modify("Shift");
        if (self.VKI_altgr) self.VKI_modify("AltGr");
      } else self.VKI_insert(character);
    } self.VKI_modify("");
    return false;
  }


  /* ****************************************************************
   * Build or rebuild the keyboard keys
   *
   */
  this.VKI_buildKeys = function() {
    this.VKI_shift = this.VKI_shiftlock = this.VKI_altgr = this.VKI_altgrlock = this.VKI_dead = false;
    var container = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0];
    var tables = container.getElementsByTagName('table');
    for (var x = tables.length - 1; x >= 0; x--) container.removeChild(tables[x]);

    for (var x = 0, hasDeadKey = false, lyt; lyt = this.VKI_layout[this.VKI_kt].keys[x++];) {
      var table = document.createElement('table');
          table.cellSpacing = "0";
        if (lyt.length <= this.VKI_keyCenter) table.className = "keyboardInputCenter";
        var tbody = document.createElement('tbody');
          var tr = document.createElement('tr');
            for (var y = 0, lkey; lkey = lyt[y++];) {
              var td = document.createElement('td');
                if (this.VKI_symbol[lkey[0]]) {
                  var text = this.VKI_symbol[lkey[0]].split("\n");
                  var small = document.createElement('small');
                      small.setAttribute('char', lkey[0]);
                  for (var z = 0; z < text.length; z++) {
                    if (z) small.appendChild(document.createElement("br"));
                    small.appendChild(document.createTextNode(text[z]));
                  } td.appendChild(small);
                } else td.appendChild(document.createTextNode(lkey[0] || "\xa0"));

                var className = [];
                if (this.VKI_deadkeysOn.checked)
                  for (key in this.VKI_deadkey)
                    if (key === lkey[0]) { className.push("deadkey"); break; }
                if (lyt.length > this.VKI_keyCenter && y == lyt.length) className.push("last");
                if (lkey[0] == " " || lkey[1] == " ") className.push("space");
                  td.className = className.join(" ");

                switch (lkey[1]) {
                  case "Caps": case "Shift":
                  case "Alt": case "AltGr": case "AltLk":
                    VKI_addListener(td, 'click', (function(type) { return function() { self.VKI_modify(type); return false; }})(lkey[1]), false);
                    break;
                  case "Tab":
                    VKI_addListener(td, 'click', function() {
                      if (self.VKI_activeTab) {
                        if (self.VKI_target.form) {
                          var target = self.VKI_target, elems = target.form.elements;
                          self.VKI_close(false);
                          for (var z = 0, me = false, j = -1; z < elems.length; z++) {
                            if (j == -1 && elems[z].getAttribute("VKI_attached")) j = z;
                            if (me) {
                              if (self.VKI_activeTab == 1 && elems[z]) break;
                              if (elems[z].getAttribute("VKI_attached")) break;
                            } else if (elems[z] == target) me = true;
                          } if (z == elems.length) z = Math.max(j, 0);
                          if (elems[z].getAttribute("VKI_attached")) {
                            self.VKI_show(elems[z]);
                          } else elems[z].focus();
                        } else self.VKI_target.focus();
                      } else self.VKI_insert("\t");
                      return false;
                    }, false);
                    break;
                  case "Bksp":
                    VKI_addListener(td, 'click', function() {
                      self.VKI_target.focus();
                      if (self.VKI_target.setSelectionRange && hasSelectionStartEnd(self.VKI_target) && !self.VKI_target.readOnly) {
                        var rng = [self.VKI_target.selectionStart, self.VKI_target.selectionEnd];
                        if (rng[0] < rng[1]) rng[0]++;
                        self.VKI_target.value = self.VKI_target.value.substr(0, rng[0] - 1) + self.VKI_target.value.substr(rng[1]);
                        self.VKI_target.setSelectionRange(rng[0] - 1, rng[0] - 1);
                      } else if (self.VKI_target.createTextRange && !self.VKI_target.readOnly) {
                        try {
                          self.VKI_target.range.select();
                        } catch(e) { self.VKI_target.range = document.selection.createRange(); }
                        if (!self.VKI_target.range.text.length) self.VKI_target.range.moveStart('character', -1);
                        self.VKI_target.range.text = "";
                      } else self.VKI_target.value = self.VKI_target.value.substr(0, self.VKI_target.value.length - 1);
                      if (self.VKI_shift) self.VKI_modify("Shift");
                      if (self.VKI_altgr) self.VKI_modify("AltGr");
                      self.VKI_target.focus();
                      self.keyInputCallback();
                      return true;
                    }, false);
                    break;
                  case "Enter":
                    VKI_addListener(td, 'click', function() {
                      if (self.VKI_target.nodeName != "TEXTAREA") {
                        if (typeof self.VKI_enterSubmit === 'function') {
                          self.VKI_enterSubmit.apply({}, [self.VKI_target.value]);
                        } else if (self.VKI_enterSubmit && self.VKI_target.form) {
                          for (var z = 0, subm = false; z < self.VKI_target.form.elements.length; z++)
                            if (self.VKI_target.form.elements[z].type == "submit") subm = true;
                          if (!subm) self.VKI_target.form.submit();
                        }
                        self.VKI_close(false);
                      } else self.VKI_insert("\n");
                      return true;
                    }, false);
                    break;
                  default:
                    VKI_addListener(td, 'click', VKI_keyClick, false);

                } VKI_mouseEvents(td);
                tr.appendChild(td);
              for (var z = 0; z < 4; z++)
                if (this.VKI_deadkey[lkey[z] = lkey[z] || ""]) hasDeadKey = true;
            } tbody.appendChild(tr);
          table.appendChild(tbody);
        container.appendChild(table);
    }
    if (this.VKI_deadBox)
      this.VKI_deadkeysOn.style.display = (hasDeadKey) ? "inline" : "none";
    if (this.VKI_isIE6) {
      this.VKI_iframe.style.width = this.VKI_keyboard.offsetWidth + "px";
      this.VKI_iframe.style.height = this.VKI_keyboard.offsetHeight + "px";
    }
  };

  this.VKI_buildKeys();
  VKI_addListener(this.VKI_keyboard, 'selectstart', function() { return false; }, false);
  this.VKI_keyboard.unselectable = "on";
  if (this.VKI_isOpera)
    VKI_addListener(this.VKI_keyboard, 'mousedown', function() { return false; }, false);


  /* ****************************************************************
   * Controls modifier keys
   *
   */
  this.VKI_modify = function(type) {
    switch (type) {
      case "Alt":
      case "AltGr": this.VKI_altgr = !this.VKI_altgr; break;
      case "AltLk": this.VKI_altgr = 0; this.VKI_altgrlock = !this.VKI_altgrlock; break;
      case "Caps": this.VKI_shift = 0; this.VKI_shiftlock = !this.VKI_shiftlock; break;
      case "Shift": this.VKI_shift = !this.VKI_shift; break;
    } var vchar = 0;
    if (!this.VKI_shift != !this.VKI_shiftlock) vchar += 1;
    if (!this.VKI_altgr != !this.VKI_altgrlock) vchar += 2;

    var tables = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0].getElementsByTagName('table');
    for (var x = 0; x < tables.length; x++) {
      var tds = tables[x].getElementsByTagName('td');
      for (var y = 0; y < tds.length; y++) {
        var className = [], lkey = this.VKI_layout[this.VKI_kt].keys[x][y];

        switch (lkey[1]) {
          case "Alt":
          case "AltGr":
            if (this.VKI_altgr) className.push("pressed");
            self.VKI_target.focus();
            break;
          case "AltLk":
            if (this.VKI_altgrlock) className.push("pressed");
            self.VKI_target.focus();
            break;
          case "Shift":
            if (this.VKI_shift) className.push("pressed");
            self.VKI_target.focus();
            break;
          case "Caps":
            if (this.VKI_shiftlock) className.push("pressed");
            self.VKI_target.focus();
            break;
          case "Tab":
          case "Bksp":
            self.VKI_target.focus();
          case "Enter":
          break;
          default:
            if (type) {
              tds[y].removeChild(tds[y].firstChild);
              if (this.VKI_symbol[lkey[vchar]]) {
                var text = this.VKI_symbol[lkey[vchar]].split("\n");
                var small = document.createElement('small');
                    small.setAttribute('char', lkey[vchar]);
                for (var z = 0; z < text.length; z++) {
                  if (z) small.appendChild(document.createElement("br"));
                  small.appendChild(document.createTextNode(text[z]));
                } tds[y].appendChild(small);
              } else tds[y].appendChild(document.createTextNode(lkey[vchar] || "\xa0"));
            }
            if (this.VKI_deadkeysOn.checked) {
              var character = tds[y].firstChild.nodeValue || tds[y].firstChild.className;
              if (this.VKI_dead) {
                if (character == this.VKI_dead) className.push("pressed");
                if (this.VKI_deadkey[this.VKI_dead][character]) className.push("target");
              }
              if (this.VKI_deadkey[character]) className.push("deadkey");
            }
        }

        if (y == tds.length - 1 && tds.length > this.VKI_keyCenter) className.push("last");
        if (lkey[0] == " " || lkey[1] == " ") className.push("space");
        tds[y].className = className.join(" ");
      }
    }
  };


  /* ****************************************************************
   * Insert text at the cursor
   *
   */
  this.VKI_insert = function(text) {
    this.VKI_target.focus();
    if (this.VKI_target.maxLength) this.VKI_target.maxlength = this.VKI_target.maxLength;
    if (typeof this.VKI_target.maxlength == "undefined" ||
        this.VKI_target.maxlength < 0 ||
        this.VKI_target.value.length < this.VKI_target.maxlength) {
      if (this.VKI_target.setSelectionRange && hasSelectionStartEnd(this.VKI_target) && !this.VKI_target.readOnly && !this.VKI_isIE) {
        var rng = [this.VKI_target.selectionStart, this.VKI_target.selectionEnd];
        this.VKI_target.value = this.VKI_target.value.substr(0, rng[0]) + text + this.VKI_target.value.substr(rng[1]);
        if (text == "\n" && this.VKI_isOpera) rng[0]++;
        this.VKI_target.setSelectionRange(rng[0] + text.length, rng[0] + text.length);
      } else if (this.VKI_target.createTextRange && !this.VKI_target.readOnly) {
        try {
          this.VKI_target.range.select();
        } catch(e) { this.VKI_target.range = document.selection.createRange(); }
        this.VKI_target.range.text = text;
        this.VKI_target.range.collapse(true);
        this.VKI_target.range.select();
      } else this.VKI_target.value += text;
      if (this.VKI_shift) this.VKI_modify("Shift");
      if (this.VKI_altgr) this.VKI_modify("AltGr");
      this.VKI_target.focus();
      this.keyInputCallback();
    } else if (this.VKI_target.createTextRange && this.VKI_target.range)
      this.VKI_target.range.select();
  };


  /* ****************************************************************
   * Show the keyboard interface
   *
   */
  this.VKI_show = function(elem) {
    if (!this.VKI_target) {
      this.VKI_target = elem;
      if (this.VKI_langAdapt && this.VKI_target.lang) {
        var chg = false, sub = [], lang = this.VKI_target.lang.toLowerCase().replace(/-/g, "_");
        for (var x = 0, chg = false; !chg && x < this.VKI_langCode.index.length; x++)
          if (lang.indexOf(this.VKI_langCode.index[x]) == 0 && self.VKI_showKbSelect)
            chg = kbSelect.firstChild.nodeValue = this.VKI_kt = this.VKI_langCode[this.VKI_langCode.index[x]];
        if (chg) this.VKI_buildKeys();
      }
      if (this.VKI_isIE) {
        if (!this.VKI_target.range) {
          this.VKI_target.range = this.VKI_target.createTextRange();
          this.VKI_target.range.moveStart('character', this.VKI_target.value.length);
        } this.VKI_target.range.select();
      }
      try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}
      if (this.VKI_clearPasswords && this.VKI_target.type == "password") this.VKI_target.value = "";

      var elem = this.VKI_target;
      this.VKI_target.keyboardPosition = "absolute";
      do {
        if (VKI_getStyle(elem, "position") == "fixed") {
          this.VKI_target.keyboardPosition = "fixed";
          break;
        }
      } while (elem = elem.offsetParent);

      if (this.VKI_isIE6) document.body.appendChild(this.VKI_iframe);
      document.body.appendChild(this.VKI_keyboard);
      this.VKI_keyboard.style.position = this.VKI_target.keyboardPosition;
      if (this.VKI_isOpera) this.VKI_keyboard.reflow();

      this.VKI_position(true);
      if (self.VKI_isMoz || self.VKI_isWebKit) this.VKI_position(true);
      this.VKI_target.blur();
      this.VKI_target.focus();

      this.VKI_closeOthers();
    } else this.VKI_close(false);
  };

  /* ****************************************************************
   * For triggering close to non-focused virtual keyboard elements
   *
   */
  this.VKI_closeOthers = function() {
    function fireCloseEvent(angularElement) {
      if(angularElement.getAttribute('VKI_attached') === 'true' && !angular.equals(self.VKI_target, angularElement)) {
        var inputChild = angular.element(angularElement);
        inputChild.triggerHandler('VKI_close');
      }
    }
    angular.forEach(angular.element(document).find('input'), fireCloseEvent);
    angular.forEach(angular.element(document).find('textarea'), fireCloseEvent);
  };

  /* ****************************************************************
   * Position the keyboard
   *
   */
  this.VKI_position = function(force) {
    if (!self.VKI_relative) {
      self.VKI_keyboard.style.position = 'fixed';
      self.VKI_keyboard.style.bottom = '0px';
      self.VKI_keyboard.style.left = '0px';
      self.VKI_keyboard.style.width = '100%';
      return;
    }
    if (self.VKI_target) {
      var kPos = VKI_findPos(self.VKI_keyboard), wDim = VKI_innerDimensions(), sDis = VKI_scrollDist();
      var place = false, fudge = self.VKI_target.offsetHeight + 3;
      if (self.VKI_forcePosition === 'top') {
        fudge = -self.VKI_keyboard.offsetHeight - 3;
      }
      if (force !== true) {
        if (kPos[1] + self.VKI_keyboard.offsetHeight - sDis[1] - wDim[1] > 0 && self.VKI_forcePosition !== 'bottom') {
          place = true;
          fudge = -self.VKI_keyboard.offsetHeight - 3;
        } else if (kPos[1] - sDis[1] < 0) place = true;
      }
      if (place || force === true) {
        var iPos = VKI_findPos(self.VKI_target), scr = self.VKI_target;
        while (scr = scr.parentNode) {
          if (scr == document.body) break;
          if (scr.scrollHeight > scr.offsetHeight || scr.scrollWidth > scr.offsetWidth) {
            if (!scr.getAttribute("VKI_scrollListener")) {
              scr.setAttribute("VKI_scrollListener", true);
              VKI_addListener(scr, 'scroll', function() { self.VKI_position(true); }, false);
            } // Check if the input is in view
            var pPos = VKI_findPos(scr), oTop = iPos[1] - pPos[1], oLeft = iPos[0] - pPos[0];
            var top = oTop + self.VKI_target.offsetHeight;
            var left = oLeft + self.VKI_target.offsetWidth;
            var bottom = scr.offsetHeight - oTop - self.VKI_target.offsetHeight;
            var right = scr.offsetWidth - oLeft - self.VKI_target.offsetWidth;
            self.VKI_keyboard.style.display = (top < 0 || left < 0 || bottom < 0 || right < 0) ? "none" : "";
            if (self.VKI_isIE6) self.VKI_iframe.style.display = (top < 0 || left < 0 || bottom < 0 || right < 0) ? "none" : "";
          }
        }
        self.VKI_keyboard.style.top = iPos[1] - ((self.VKI_target.keyboardPosition == "fixed" && !self.VKI_isIE && !self.VKI_isMoz) ? sDis[1] : 0) + fudge + "px";
        self.VKI_keyboard.style.left = Math.max(10, Math.min(wDim[0] - self.VKI_keyboard.offsetWidth - 25, iPos[0])) + "px";
        if (self.VKI_isIE6) {
          self.VKI_iframe.style.width = self.VKI_keyboard.offsetWidth + "px";
          self.VKI_iframe.style.height = self.VKI_keyboard.offsetHeight + "px";
          self.VKI_iframe.style.top = self.VKI_keyboard.style.top;
          self.VKI_iframe.style.left = self.VKI_keyboard.style.left;
        }
      }
      if (force === true) self.VKI_position();
    }
  };


  /* ****************************************************************
   * Close the keyboard interface
   *
   */
  this.VKI_close = function(keepFocus) {
    if (this.VKI_target) {
      try {
        this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard);
        if (this.VKI_isIE6) this.VKI_iframe.parentNode.removeChild(this.VKI_iframe);
      } catch (e) {}
      if (this.VKI_showKbSelect) {
        if (this.VKI_kt != this.VKI_kts) {
          kbSelect.firstChild.nodeValue = this.VKI_kt = this.VKI_kts;
          this.VKI_buildKeys();
        } kbSelect.getElementsByTagName('ol')[0].style.display = "";;
      }
      if (keepFocus) {
        this.VKI_target.focus();
      }
      if (this.VKI_isIE) {
        setTimeout(function() { self.VKI_target = false; }, 0);
      } else this.VKI_target = false;
    }
  };


  /* ***** Private functions *************************************** */
  function VKI_addListener(elem, type, func, cap) {
    if (elem.addEventListener) {
      elem.addEventListener(type, function(e) { func.call(elem, e); }, cap);
    } else if (elem.attachEvent)
      elem.attachEvent('on' + type, function() { func.call(elem); });
  }

  function VKI_findPos(obj) {
    var curleft = curtop = 0, scr = obj;
    while ((scr = scr.parentNode) && scr != document.body) {
      curleft -= scr.scrollLeft || 0;
      curtop -= scr.scrollTop || 0;
    }
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return [curleft, curtop];
  }

  function VKI_innerDimensions() {
    if (self.innerHeight) {
      return [self.innerWidth, self.innerHeight];
    } else if (document.documentElement && document.documentElement.clientHeight) {
      return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    } else if (document.body)
      return [document.body.clientWidth, document.body.clientHeight];
    return [0, 0];
  }

  function VKI_scrollDist() {
    var html = document.getElementsByTagName('html')[0];
    if (html.scrollTop && document.documentElement.scrollTop) {
      return [html.scrollLeft, html.scrollTop];
    } else if (html.scrollTop || document.documentElement.scrollTop) {
      return [html.scrollLeft + document.documentElement.scrollLeft, html.scrollTop + document.documentElement.scrollTop];
    } else if (document.body.scrollTop)
      return [document.body.scrollLeft, document.body.scrollTop];
    return [0, 0];
  }

  function VKI_getStyle(obj, styleProp) {
    if (obj.currentStyle) {
      var y = obj.currentStyle[styleProp];
    } else if (window.getComputedStyle)
      var y = window.getComputedStyle(obj, null)[styleProp];
    return y;
  }


  VKI_addListener(window, 'resize', this.VKI_position, false);
  VKI_addListener(window, 'scroll', this.VKI_position, false);
  this.VKI_kbsize();

  // VKI_addListener(window, 'load', function() {
  //   setTimeout(VKI_buildKeyboardInputs, 5);
  // }, false);

  /* ***** Find tagged input & textarea elements ***************** */
  // FIXME: REMOVE THE COMMENTED CODE ABOVE AND CREATE A DIRECTIVE WITH CONFIGURATION
  //        "restrict: class" TO REPLACE THE REMOVED FEATURE.
  // function VKI_buildKeyboardInputs() {
  //   var inputElems = [
  //     document.getElementsByTagName('input'),
  //     document.getElementsByTagName('textarea')
  //   ];
  //   for (var x = 0, elem; elem = inputElems[x++];)
  //     for (var y = 0, ex; ex = elem[y++];)
  //       if (ex.nodeName == "TEXTAREA" || ex.type == "text" || ex.type == "password")
    //      if (ex.className.indexOf("keyboardInput") > -1) self.VKI_attach(ex);

  //   VKI_addListener(document.documentElement, 'click', function(e) { self.VKI_close(true); }, false);
  // }
  // VKI_addListener(window, 'load', VKI_buildKeyboardInputs, false);


  return self;
};

/* jshint ignore:end */

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

})(angular);
