///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   //A..Z
                 ((keyCode >= 97) && (keyCode <= 123))) { //a..z
                    //lowercase character display
                    chr = String.fromCharCode(keyCode+ 32);
                    //check for shift key and adjust accordingly
                    if(isShifted){
                        chr = String.fromCharCode(keyCode)
                    }
                    _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 8)                      ||   //backspace
                        (keyCode == 38)                     ||   // up
                        (keyCode == 40)                     ||   // down
                        (keyCode == 13)                     ||   // enter
                        (keyCode == 9)                      ||   // tab
                        (keyCode == 222)) {                     //single quote
                if (keyCode == 48 && isShifted){
                    chr = ")";
                }else if (keyCode == 49 && isShifted){
                    chr = "!";
                } else if (keyCode == 50 && isShifted){
                    chr = "@";
                }else if (keyCode == 51 && isShifted){
                    chr = "#";
                }else if (keyCode == 52 && isShifted){
                    chr = "$";
                }else if (keyCode == 53 && isShifted){
                    chr = "%";
                }else if (keyCode == 54 && isShifted){
                    chr = "^";
                }else if (keyCode == 55 && isShifted){
                    chr = "&";
                }else if (keyCode == 56 && isShifted){
                    chr = "*";
                }else if (keyCode == 57 && isShifted){
                    chr = "(";
                }else if (keyCode == 222){
                    chr = "'";
                }else if (keyCode == 222 && isShifted){
                    chr = "\"";
                }else{
                    chr = String.fromCharCode(keyCode);
                }
            _KernelInputQueue.enqueue(chr);
            }
        }
    }
}
