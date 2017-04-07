"use strict";

(function () {
    var arr = [1, 2, 3];
    var foo = function foo() {
        for (var _len = arguments.length, n = Array(_len), _key = 0; _key < _len; _key++) {
            n[_key] = arguments[_key];
        }

        Array.of.apply(Array, n.concat([1, 2, 3, 4, 5]));
    };

    var Base = function Base(a) {
        babelHelpers.classCallCheck(this, Base);

        this.a = 1;
    };
})();