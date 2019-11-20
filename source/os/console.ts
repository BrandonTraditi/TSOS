///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public lastXPosition = [0],
                    public currentYPosition = _DefaultFontSize,
                    public backspaceCount = 0,
                    public backspaceCanvasData = [],
                    public shellArray = [],
                    public cmdIndex = 0,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    //Adds command to array for up and down keys to navigate
                    this.shellArray.push(this.buffer);
                    //constantly keep command index equal to the
                    this.cmdIndex = this.shellArray.length-1;
                    // ... and reset our buffer.
                    this.buffer = "";

                // backspace key pressed
                } else if (chr == String.fromCharCode(8)){
                    //backspace count is greater than 0 
                    if(this.backspaceCount != 0){
                        //revert back to data before last char was written
                        _DrawingContext.putImageData(this.backspaceCanvasData.pop(),0,0);
                        //go back to x position
                        this.currentXPosition = this.lastXPosition.pop();
                        //update backspacecount
                        this.backspaceCount --;
                    }
                    //update buffer to acount for backspace
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                
                //tab key is pressed
                } else if(chr == String.fromCharCode(9)){
                    var index = 0;
                    var counter = 0;
                    //List of shell Commands to check with whats in current buffer
                    var shellCommands = ["ver", "help", "shutdown", "cls", "man", "trace", "rot13", "prompt", "date", "whereami", "prediction", "status", "bsod"];
                    //loop to check if buffer index char = shell list command 
                    for(var i = 0; i < shellCommands.length; i++){
                        var temp = 0;
                        for(var j = 0; j < this.buffer.length; j++){
                            if(this.buffer.charAt(j) == shellCommands[i].charAt(j)){
                                temp++
                            }else{
                                break;
                            }
                            
                        }
                        if(temp > counter){
                            index = i;
                            counter = temp;
                        }
                    }
                    //Match for a command and print it to buffer
                    if(counter !=0){
                        var print = shellCommands[index].substring(counter);
                        for(var i = 0; i < print.length; i++){
                            this.backspaceCanvasData.push(_DrawingContext.getImageData(0,0, _Canvas.width, _Canvas.height));
                            this.putText(print.charAt(i));
                            this.buffer+= print.charAt(i);
                            
                        }
                    }


                }else if (chr == String.fromCharCode(38) || chr == String.fromCharCode(40)){
                    var cmd;
                    //up key
                    if(chr == String.fromCharCode(38)){
                        //check if index does not equal length of array
                        if(this.cmdIndex != this.shellArray.length -1){
                            //finds the start of the array and stops
                            if(this.cmdIndex - 1 < 0){
                                cmd = this.shellArray[this.cmdIndex];
                                this.cmdIndex = 0;
                            //going downward on the index/array reciting each command
                            }else{
                                cmd = this.shellArray[this.cmdIndex];
                                this.cmdIndex --;
                            }
                        //should be the last command entered
                        }else{
                            cmd = this.shellArray[this.cmdIndex];
                            this.cmdIndex --;
                        }
                    //down key
                    }else{
                        if(this.cmdIndex != this.shellArray.length-1){
                            cmd = this.shellArray[this.cmdIndex+1];
                            this.cmdIndex ++;
                        }
                    }
                    //have to delete the characters from the buffer if its not empty
                    if(this.buffer.length > 0){
                        for(var i = 0; i < this.buffer.length; i++){
                            this.currentXPosition = this.lastXPosition.pop();
                            _DrawingContext.putImageData(this.backspaceCanvasData.pop(),0,0);
                            this.backspaceCount --;
                        }
                        this.buffer = "";
                    }
                    //draw the command on to the canvas
                    for(var i = 0; i < cmd.length; i++){
                        this.backspaceCanvasData.push(_DrawingContext.getImageData(0,0,_Canvas.width, _Canvas.height));
                        this.putText(cmd.charAt(i));
                        this.buffer += cmd.charAt(i);
                        this.backspaceCount++;
                    }
                    
                }else {
                    // This is a "normal" character, so reference image data for backspace
                    this.backspaceCanvasData.push(_DrawingContext.getImageData(0,0,_Canvas.width,_Canvas.height));
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                    //update backspace count
                    this.backspaceCount++;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                //line wrapping
                if(this.currentXPosition >= 490){
                    this.advanceLine();
                }

                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                this.lastXPosition.push(this.currentXPosition);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            //scrolling implementation
            if(this.currentYPosition > _Canvas.height){
                var currScreen = _DrawingContext.getImageData(0,20,_Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(currScreen,0,0);
                this.currentYPosition = 490;
            }
        }
    }
 }
