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
        //Create a constructor object to mimic those values found in a pcb
        function Cpu(currentPCB, ProgramCounter, Acc, partitionIndex, Xreg, Yreg, Zflag, isExecuting, instruction) {
            if (currentPCB === void 0) { currentPCB = null; }
            if (ProgramCounter === void 0) { ProgramCounter = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (partitionIndex === void 0) { partitionIndex = -1; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (instruction === void 0) { instruction = 'NA'; }
            this.currentPCB = currentPCB;
            this.ProgramCounter = ProgramCounter;
            this.Acc = Acc;
            this.partitionIndex = partitionIndex;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.instruction = instruction;
        }
        Cpu.prototype.init = function () {
        };
        //Load in the pcb and set to current pcb
        Cpu.prototype.loadProgram = function (pcb) {
            this.currentPCB = pcb;
            //Updates constructor object with values from pcb sent in
            this.ProgramCounter = this.currentPCB.programCounter;
            this.instruction = this.currentPCB.instructionReg;
            this.Acc = this.currentPCB.accumulator;
            this.partitionIndex = this.currentPCB.partitionIndex;
            this.Xreg = this.currentPCB.x;
            this.Yreg = this.currentPCB.y;
            this.Zflag = this.currentPCB.z;
            //Resets round robin counter as it is a new run command
            _RoundRobinCounter = 0;
            //Set isExecuting to true to trigger a cpuCycle on kernelClockPulse
            this.isExecuting = true;
        };
        //Updates the pcb block
        Cpu.prototype.updatePCB = function () {
            //Make sure block is not null
            if (this.currentPCB !== null) {
                //Keeps currentPCB updated after a command is ran
                this.currentPCB.programCounter = this.ProgramCounter;
                this.currentPCB.instructionReg = this.instruction;
                this.currentPCB.accumulator = this.Acc;
                this.currentPCB.x = this.Xreg;
                this.currentPCB.y = this.Yreg;
                this.currentPCB.z = this.Zflag;
            }
        };
        //Where the magic happens
        Cpu.prototype.cycle = function () {
            //Make sure currentPCB is not null and executing is true
            if (this.currentPCB !== null && this.isExecuting == true) {
                //Kernel Trace
                _Kernel.krnTrace('CPU cycle');
                //get instruction from reading memory location
                var currentInstruction = _MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter).toUpperCase();
                this.instruction = currentInstruction.toString();
                //Debugging used during making specific op codes work:
                //this.Acc = 10;
                //_Memory.memory[174]= "A9";
                //this.Yreg = 169;
                //this.Xreg = 1;
                //this.ProgramCounter = 50;
                //this.Xreg = 2;
                //this.Yreg = 2;
                //console.log("instruction: ",this.instruction);
                //console.log("ZFlag: ", this.Zflag);
                //console.log("partition index: ", this.partitionIndex);
                //console.log("PC before run: ", this.ProgramCounter);
                //console.log("Acc before run: ", this.Acc);
                //console.log("Memory array: ", _Memory.memory);
                //Decide what to do with instruction
                //load acc with a constant
                if (this.instruction == "A9") {
                    //Get the next op code in program
                    var nextHex = this.ProgramCounter + 1;
                    //Set accumulator with op code found in next hex in decimal form
                    this.Acc = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, nextHex), 16);
                    //Update program counter
                    this.ProgramCounter += 2;
                    //debugging 
                    //console.log("A9 ran: ", this.currentPCB); 
                    //console.log("PC after A9: ", this.ProgramCounter); 
                    //console.log("Acc after A9 run: ", this.Acc); //A9 = 169            
                    //load acc from memory
                }
                else if (this.instruction == "AD") {
                    //Get the next op code in the program
                    var nextHex = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Load accumulator with op code in decimal form
                    this.Acc = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, nextHex), 16);
                    //Update program counter
                    this.ProgramCounter += 3;
                    //debugging
                    //console.log("AD ran: ", this.currentPCB); 
                    //console.log("PC after AD: ", this.ProgramCounter); 
                    //console.log("Hex variable: ", hex);//AD = 173
                    //console.log("Acc after AD run: ", this.Acc);//should return spot 173 in array to acc  
                    //store acc in memory
                }
                else if (this.instruction == "8D") {
                    //Get the next op code in the program
                    var nextHex = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Write value in acc to the nextHex in hex form
                    _Memory.writeByte(this.partitionIndex, nextHex, this.Acc.toString(16));
                    //Uodate program Counter
                    this.ProgramCounter += 3;
                    //Debugging    
                    //console.log("Hex value: ", hexDec);//8D = 141
                    //console.log("Memory array: ", _Memory.memory);//should have 8d in spot 141 on array
                    //console.log("Byte data: ", this.Acc.toString(16));
                    //add contents from address to acc
                }
                else if (this.instruction == "6D") {
                    //Get the next op code from program
                    var nextHex = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Set that op code to the accumulator in decimal form
                    this.Acc += parseInt(_MemoryAccessor.readMemory(this.partitionIndex, nextHex), 16);
                    //Update the program counter
                    this.ProgramCounter += 3;
                    //Debugging
                    //console.log("Hex decimal: ", hexDec); //6D = 109
                    //console.log("Memory array: ", _Memory.memory);
                    //console.log("Acc after: ", this.Acc);
                    // load x reg with constant
                }
                else if (this.instruction == "A2") {
                    //Set xReg to the op code found in the next op code in decimnal form
                    this.Xreg = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Update program counter
                    this.ProgramCounter += 2;
                    //Debugging    
                    //console.log("Xreg value: ", this.Xreg);//A2 = 162 
                    //load x reg from memory  
                }
                else if (this.instruction == "AE") {
                    //Get next op code in decimal form
                    var xMem = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Set xreg to the decimal form of the next op codes location
                    this.Xreg = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, xMem), 16);
                    //Update program counter
                    this.ProgramCounter += 3;
                    //Debugging    
                    //console.log("xMem: ", xMem);//AE = 174
                    //console.log("Xreg value: ", this.Xreg);
                    //load y reg with constant    
                }
                else if (this.instruction == "A0") {
                    //Set Yreg to the decimal form of the next op code
                    this.Yreg = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Update program counter
                    this.ProgramCounter += 2;
                    //Debugging    
                    //console.log("Yreg value: ", this.Yreg);//A0 = 160
                    //load y reg from memory  
                }
                else if (this.instruction == "AC") {
                    //Get the decimal form of the next op code
                    var nextHex = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Set the Yreg to the decimal found above
                    this.Yreg = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, nextHex), 16);
                    //Update program counter
                    this.ProgramCounter += 3;
                    //Debugging
                    //console.log("yMem: ", yMem);//AC = 172
                    //console.log("Yreg value: ", this.Yreg);
                    //compare byte at address to x reg, set z flag
                }
                else if (this.instruction == "EC") {
                    //Get the next hex in decimal form  
                    var nextHex = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Set variable byte to the decimal form of the above's location in memory
                    var byte = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, nextHex), 16);
                    //Do a comparison
                    if (byte == this.Xreg) {
                        this.Zflag = 1;
                    }
                    else {
                        this.Zflag = 0;
                    }
                    //Increment program counter
                    this.ProgramCounter += 3;
                    //Debugging
                    //console.log("hex: ", hex);//EC = 236
                    //console.log("byte: ", byte);
                    //console.log("xReg: ", this.Xreg);
                    //console.log("zFlag: ", this.Zflag);
                    //Branch N bytes if z flag = 0
                }
                else if (this.instruction == "D0") {
                    //If Zflag is 0 then branch
                    if (this.Zflag === 0) {
                        //Get branch decimal from next op code
                        var branchN = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                        //Get new Branch program counter
                        var branchPC = this.ProgramCounter + branchN;
                        //Make sure that new branch is not past memory size and set accordingly                            
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
                        //if Zflag does not equal 0 do not branch
                        this.ProgramCounter += 2;
                    }
                    //Debugging
                    //console.log("BranchN: ", branchN);//D0 = 208
                    //console.log("BranchPC: ", branchPC);
                    //console.log("Program Counter: ", this.ProgramCounter);
                    //increment byte
                }
                else if (this.instruction == "EE") {
                    //Get next hex in decimal form
                    var nextHex = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter + 1), 16);
                    //Set variable hexLoc to the decimal form of the above's location in memory
                    var hexLoc = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, nextHex), 16);
                    //Increment it
                    hexLoc++;
                    //Now write the byte found in nextHex with hexLoc value in hex form
                    _Memory.writeByte(this.partitionIndex, nextHex, hexLoc.toString(16));
                    //Increment program counter
                    this.ProgramCounter += 3;
                    //Debugging
                    //console.log("HexDec: ", hexDec);//EE = 238
                    //console.log("HexLoc: ", hexLoc);
                    //console.log("Memory spot: ", _MemoryAccessor.readMemory(this.partitionIndex, hexDec));
                    //console.log(_Memory.memory);
                    //system call
                }
                else if (this.instruction == "FF") {
                    //If xreg is equal to 1
                    if (this.Xreg === 1) {
                        //output the Yreg value in hex
                        _StdOut.putText(this.Yreg.toString());
                        //push to output array that will be displayed at the end of program
                        OutputArray.push(this.Yreg.toString());
                        //Increment program counter
                        this.ProgramCounter++;
                        //If xreg is equal to 2
                    }
                    else if (this.Xreg === 2) {
                        //Set y to the value in the yReg
                        var y = this.Yreg;
                        //Establish an output string
                        var output = "";
                        //Get the opcode in decimal form from the location of the value in the yReg
                        var opCode = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, this.Yreg), 16);
                        //While the opcode doesnt equal 0
                        while (opCode != 0) {
                            //Add the op code to the output string 
                            output += String.fromCharCode(opCode);
                            //Increment y
                            y++;
                            //Get the opcode in decimal form from the location of the value in y
                            opCode = parseInt(_MemoryAccessor.readMemory(this.partitionIndex, y), 16);
                        }
                        //Output the individual code
                        _StdOut.putText(output);
                        //push code to the output array to be displayed at the end
                        OutputArray.push(output);
                        //increment program counter
                        this.ProgramCounter++;
                    }
                    else {
                        //if xreg doesnt equal 1 or 2 just increment program counter 
                        this.ProgramCounter++;
                    }
                    //Advance line
                    _Console.advanceLine();
                    //Debugging
                    //console.log("output array: ", OutputArray);                    
                    //no op
                }
                else if (this.instruction == "EA") {
                    //just increment counter
                    this.ProgramCounter++;
                    //Break program 
                }
                else if (this.instruction == "00") {
                    //Increment program counter
                    this.ProgramCounter++;
                    //Set the pcb state to terminated as it is done running
                    this.currentPCB.state = "Terminated";
                    //stop executing
                    this.isExecuting = false;
                    //Join all the outputs into a string
                    var out = OutputArray.join("");
                    //Output the results
                    _StdOut.putText(out);
                    _Console.advanceLine();
                    _OsShell.putPrompt();
                    //Update Pcb
                    _Control.pcbUpdate(this.currentPCB);
                }
                else {
                    //if code not found make an alert and stop executing
                    _StdOut.putText("Not an applical instruction: " + _MemoryAccessor.readMemory(this.partitionIndex, this.ProgramCounter));
                    this.isExecuting = false;
                }
            }
            //Update the pcb with constructor values
            this.updatePCB();
            //keep pcb/cpu/memory all updated
            _Control.cpuUpdate();
            _Control.memoryUpdate();
            _Control.pcbUpdate(this.currentPCB);
            //Update the round robin counter
            _RoundRobinCounter++;
            //Check if round robin is on
            if (_TurnOnRR == true) {
                //If the counter is equal to the quantum set an interrupt
                if (_RoundRobinCounter == _DefaultQuantum) {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(ROUNDROBIN_IRQ, 0));
                }
            }
            //Debugging
            //console.log("Quantum COunter: ", _RoundRobinCounter);
            //console.log("Default Quantum: ", _DefaultQuantum);
            //console.log("current PCB: ", this.currentPCB);
            //console.log("Memory array: ", _Memory.memory);
        }; //end cycle
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
