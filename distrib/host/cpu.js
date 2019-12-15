///<reference path="../globals.ts" />
///<reference path="../os/cpuScheduler.ts" />
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
        function Cpu(ProgramCounter, Acc, partitionIndex, Xreg, Yreg, Zflag, isExecuting, currentPCB, instruction) {
            if (ProgramCounter === void 0) { ProgramCounter = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (partitionIndex === void 0) { partitionIndex = -1; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (currentPCB === void 0) { currentPCB = null; }
            if (instruction === void 0) { instruction = 'NA'; }
            this.ProgramCounter = ProgramCounter;
            this.Acc = Acc;
            this.partitionIndex = partitionIndex;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.currentPCB = currentPCB;
            this.instruction = instruction;
        }
        Cpu.prototype.init = function () {
        };
        //Load in the pcb and set to current pcb
        Cpu.prototype.loadProgram = function (pcb) {
            console.log("Load program pcb: ", pcb);
            this.currentPCB = pcb;
            //Updates constructor with values from pcb sent in
            this.ProgramCounter = this.currentPCB.programCounter;
            this.instruction = this.currentPCB.instructionReg;
            this.Acc = this.currentPCB.accumulator;
            this.Xreg = this.currentPCB.x;
            this.Yreg = this.currentPCB.y;
            this.Zflag = this.currentPCB.z;
            this.isExecuting = true;
        };
        Cpu.prototype.updatePCB = function () {
            if (this.currentPCB !== null) {
                //this.currentPCB.updatePCB(this.ProgramCounter, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                //need to create memory display and update 
                //Keeps currentPCB updated to then switch on and off 
                this.currentPCB.programCounter = this.ProgramCounter;
                this.currentPCB.instructionReg = this.instruction;
                this.currentPCB.accumulator = this.Acc;
                this.currentPCB.x = this.Xreg;
                this.currentPCB.y = this.Yreg;
                this.currentPCB.z = this.Zflag;
            }
        };
        Cpu.prototype.cycle = function () {
            //console.log("Process about to run: ", this.currentPCB);
            console.log("cycle executing");
            //console.log("current PCB: ", this.currentPCB); 
            if (this.currentPCB !== null && this.isExecuting == true) {
                _Kernel.krnTrace('CPU cycle');
                // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
                //get instruction
                var currentInstruction = _Memory.readMemory(this.partitionIndex, this.ProgramCounter).toUpperCase();
                this.instruction = currentInstruction.toString();
                //OutputArray = ["Your output: "];
                //Debugging
                //this.Acc = 10;
                //_Memory.memory[174]= "A9";
                //this.Yreg = 169;
                //this.Xreg = 1;
                //this.ProgramCounter = 50;
                //this.Xreg = 2;
                //this.Yreg = 2;
                console.log("instruction: ", this.instruction);
                //console.log("ZFlag: ", this.Zflag);
                //console.log("partition index: ", this.partitionIndex);
                //console.log("PC before run: ", this.ProgramCounter);
                //console.log("Acc before run: ", this.Acc);
                //console.log("Memory array: ", _Memory.memory);
                //Decide what to do with instruction
                if (this.instruction == "A9") {
                    //load acc with a constant
                    var nextHex_1 = this.ProgramCounter + 1;
                    //console.log("next hex: ", nextHex);
                    //console.log("Next hex value: ", parseInt(_Memory.readMemory(this.partitionIndex, nextHex), 16));
                    this.Acc = parseInt(_Memory.readMemory(this.partitionIndex, nextHex_1), 16);
                    //console.log("Acc: ", this.Acc);
                    this.ProgramCounter += 2;
                    //debugging 
                    //console.log("A9 ran: ", this.currentPCB); 
                    //console.log("PC after A9: ", this.ProgramCounter); 
                    //console.log("Acc after A9 run: ", this.Acc); //A9 = 169            
                }
                else if (this.instruction == "AD") {
                    //load acc from memory
                    var hex = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    this.Acc = parseInt(_Memory.readMemory(this.partitionIndex, hex), 16);
                    this.ProgramCounter += 3;
                    //debugging
                    //console.log("AD ran: ", this.currentPCB); 
                    //console.log("PC after AD: ", this.ProgramCounter); 
                    //console.log("Hex variable: ", hex);//AD = 173
                    //console.log("Acc after AD run: ", this.Acc);//should return spot 173 in array to acc  
                }
                else if (this.instruction == "8D") {
                    //store acc in memory
                    var hexDec = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    _Memory.writeByte(this.partitionIndex, hexDec, this.Acc.toString(16));
                    this.ProgramCounter += 3;
                    //console.log("Hex value: ", hexDec);//8D = 141
                    //console.log("Memory array: ", _Memory.memory);//should have 8d in spot 141 on array
                    //console.log("Byte data: ", this.Acc.toString(16));
                }
                else if (this.instruction == "6D") {
                    //add contents from address to acc 
                    var hexDec = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    this.Acc += parseInt(_Memory.readMemory(this.partitionIndex, hexDec), 16);
                    this.ProgramCounter += 3;
                    //console.log("Hex decimal: ", hexDec); //6D = 109
                    //console.log("Memory array: ", _Memory.memory);
                    //console.log("Acc after: ", this.Acc);
                }
                else if (this.instruction == "A2") {
                    // load x reg with constant
                    //console.log("this.ProgramCounter: ", this.ProgramCounter);
                    var nextHex = this.ProgramCounter + 1;
                    //console.log("next hex: ", nextHex);
                    //console.log("Next hex value: ", parseInt(_Memory.readMemory(this.partitionIndex, nextHex), 16));
                    this.Xreg = parseInt(_Memory.readMemory(this.partitionIndex, nextHex), 16);
                    this.ProgramCounter += 2;
                    //console.log("Xreg value: ", this.Xreg);//A2 = 162 
                }
                else if (this.instruction == "AE") {
                    //load x reg from memory
                    var xMem = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    this.Xreg = parseInt(_Memory.readMemory(this.partitionIndex, xMem), 16);
                    this.ProgramCounter += 3;
                    //console.log("xMem: ", xMem);//AE = 174
                    //console.log("Xreg value: ", this.Xreg);
                }
                else if (this.instruction == "A0") {
                    //load y reg with constant
                    this.Yreg = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    this.ProgramCounter += 2;
                    //console.log("Yreg value: ", this.Yreg);//A0 = 160
                }
                else if (this.instruction == "AC") {
                    //load y reg from memory
                    var yMem = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    this.Yreg = parseInt(_Memory.readMemory(this.partitionIndex, yMem), 16);
                    this.ProgramCounter += 3;
                    //console.log("yMem: ", yMem);//AC = 172
                    //console.log("Yreg value: ", this.Yreg);
                }
                else if (this.instruction == "EC") {
                    //compare byte at address to x reg, set z flag
                    //console.log("HexIndex: ", _Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1));
                    var hex = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    var byte = parseInt(_Memory.readMemory(this.partitionIndex, hex), 16);
                    //console.log("Hex: ", hex);
                    //console.log("byte: ", byte);
                    //console.log("xReg", this.Xreg);
                    //comparison
                    if (byte == this.Xreg) {
                        this.Zflag = 1;
                    }
                    else {
                        this.Zflag = 0;
                    }
                    this.ProgramCounter += 3;
                    //console.log("hex: ", hex);//EC = 236
                    //console.log("byte: ", byte);
                    //console.log("xReg: ", this.Xreg);
                    //console.log("zFlag: ", this.Zflag);
                }
                else if (this.instruction == "D0") {
                    //Branch N bytes if z flag = 0
                    //console.log("Branch index ", parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16));
                    if (this.Zflag === 0) {
                        var branchN = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                        var branchPC = this.ProgramCounter + branchN;
                        if (branchPC > _MemoryPartitionSize - 1) {
                            this.ProgramCounter = branchPC - _MemoryPartitionSize;
                            this.ProgramCounter += 2;
                        }
                        else {
                            this.ProgramCounter = branchPC;
                            this.ProgramCounter += 2;
                        }
                    }
                    else {
                        this.ProgramCounter += 2;
                    }
                    //console.log("BranchN: ", branchN);//D0 = 208
                    //console.log("BranchPC: ", branchPC);
                    //console.log("Program Counter: ", this.ProgramCounter);
                }
                else if (this.instruction == "EE") {
                    //increment byte
                    var hexDec = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    var hexLoc = parseInt(_Memory.readMemory(this.partitionIndex, hexDec), 16);
                    hexLoc++;
                    _Memory.writeByte(this.partitionIndex, hexDec, hexLoc.toString(16));
                    this.ProgramCounter += 3;
                    //console.log("HexDec: ", hexDec);//EE = 238
                    //console.log("HexLoc: ", hexLoc);
                    //console.log("Memory spot: ", _Memory.readMemory(this.partitionIndex, hexDec));
                    //console.log(_Memory.memory);
                }
                else if (this.instruction == "FF") {
                    //system call
                    //console.log("Xreg value: ", this.Xreg);
                    //console.log("Y reg value: ", this.Yreg);
                    //console.log("Y to string: ", this.Yreg.toString());
                    if (this.Xreg === 1) {
                        _StdOut.putText(this.Yreg.toString());
                        //_Console.advanceLine();
                        OutputArray.push(this.Yreg.toString());
                        this.ProgramCounter++;
                    }
                    else if (this.Xreg === 2) {
                        var y = this.Yreg;
                        var output = "";
                        var opCode = parseInt(_Memory.readMemory(this.partitionIndex, this.Yreg), 16);
                        //console.log("Op code value: ", opCode);
                        while (opCode != 0) {
                            output += String.fromCharCode(opCode);
                            y++;
                            opCode = parseInt(_Memory.readMemory(this.partitionIndex, y), 16);
                        }
                        console.log("Output: ", output);
                        _StdOut.putText(output);
                        //_Console.advanceLine();
                        OutputArray.push(output);
                        this.ProgramCounter++;
                    }
                    else {
                        this.ProgramCounter++;
                    }
                    console.log("output array: ", OutputArray);
                    _Console.advanceLine();
                }
                else if (this.instruction == "EA") {
                    //no op
                    this.ProgramCounter++;
                }
                else if (this.instruction == "00") {
                    //break program
                    this.ProgramCounter++;
                    this.isExecuting = false;
                    var out = OutputArray.join("");
                    _StdOut.putText(out);
                    _Console.advanceLine();
                    _OsShell.putPrompt();
                }
                else {
                    _StdOut.putText("Not an applical instruction: " + _Memory.readMemory(this.partitionIndex, this.ProgramCounter));
                    this.isExecuting = false;
                }
            }
            //keep pcb updated
            this.updatePCB();
            //_RoundRobinCounter++;
            /*if(_RoundRobinCounter > _DefaultQuantum){
                this.isExecuting = false;
                _CpuScheduler.roundRobin();
            }
            console.log("Quantum COunter: ", _RoundRobinCounter);
            console.log("Default Quantum: ", _DefaultQuantum);*/
            console.log("current PCB: ", this.currentPCB);
            console.log("Memory array: ", _Memory.memory);
            //Need to create/upodate memory display   
        }; //end cycle
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
