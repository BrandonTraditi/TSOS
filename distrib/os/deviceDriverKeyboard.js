///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = /** @class */ (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            var _this = 
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            _super.call(this) || this;
            _this.driverEntry = _this.krnKbdDriverEntry;
            _this.isr = _this.krnKbdDispatchKeyPress;
            return _this;
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || //A..Z
                ((keyCode >= 97) && (keyCode <= 123))) { //a..z
                //lowercase character display
                chr = String.fromCharCode(keyCode + 32);
                //check for shift key and adjust accordingly
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) || // digits
                (keyCode == 32) || // space
                (keyCode == 8) || //backspace
                (keyCode == 38) || // up
                (keyCode == 40) || // down
                (keyCode == 13) || // enter
                (keyCode == 9) || // tab
                (keyCode == 222)) { //single quote
                if (keyCode == 48 && isShifted) {
                    chr = ")";
                }
                else if (keyCode == 49 && isShifted) {
                    chr = "!";
                }
                else if (keyCode == 50 && isShifted) {
                    chr = "@";
                }
                else if (keyCode == 51 && isShifted) {
                    chr = "#";
                }
                else if (keyCode == 52 && isShifted) {
                    chr = "$";
                }
                else if (keyCode == 53 && isShifted) {
                    chr = "%";
                }
                else if (keyCode == 54 && isShifted) {
                    chr = "^";
                }
                else if (keyCode == 55 && isShifted) {
                    chr = "&";
                }
                else if (keyCode == 56 && isShifted) {
                    chr = "*";
                }
                else if (keyCode == 57 && isShifted) {
                    chr = "(";
                }
                else if (keyCode == 222) {
                    chr = "'";
                }
                else if (keyCode == 222 && isShifted) {
                    chr = "\"";
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    }(TSOS.DeviceDriver));
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
