///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, currentPCB, instruction) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (currentPCB === void 0) { currentPCB = null; }
            if (instruction === void 0) { instruction = 'NA'; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.currentPCB = currentPCB;
            this.instruction = instruction;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.updatePCB = function () {
            if (this.currentPCB !== null) {
                this.currentPCB.updatePCB(this.PC, this.Xreg, this.Yreg, this.Xreg, this.Zflag);
                //need to create memory display and update here
            }
        };
        Cpu.prototype.cycle = function () {
            console.log("cycle executing");
            if (this.currentPCB !== null && this.isExecuting == true) {
                _Kernel.krnTrace('CPU cycle');
                // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
                //get instruction
                var currentInstruction = _Memory.readMemory(this.currentPCB.partitionIndex, this.PC).toUpperCase();
                this.instruction = currentInstruction;
                console.log(this.instruction);
                //Decide what to do with instruction
                if (this.instruction == "A9") {
                    //load acc with a constant
                }
                else if (this.instruction == "AD") {
                    //load acc from memory
                }
                else if (this.instruction == "8D") {
                    //store acc in memory
                }
                else if (this.instruction == "6D") {
                    //add contents from address to acc 
                }
                else if (this.instruction == "A2") {
                    // load x reg with constant
                }
                else if (this.instruction == "AE") {
                    //load x reg from memory
                }
                else if (this.instruction == "A0") {
                    //load y reg with constant
                }
                else if (this.instruction == "AC") {
                    //load y reg from memory
                }
                else if (this.instruction == "EC") {
                    //compare byte at address to x reg, set z flag
                }
                else if (this.instruction == "D0") {
                    //Branch N bytesif z flag = 0
                }
                else if (this.instruction == "EE") {
                    //increment byte
                }
                else if (this.instruction == "FF") {
                    //system call
                }
                else if (this.instruction == "EA") {
                    //no op
                }
                else if (this.instruction == "00") {
                    //break program
                }
                else {
                    _StdOut.putText("Not an applical instruction:" + _Memory.readMemory(this.currentPCB.partitionIndex, this.PC));
                    this.isExecuting = false;
                }
            }
            //keep pcb updated
            if (this.currentPCB !== null) {
                this.updatePCB();
            }
            //Need to create/upodate memory display
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
