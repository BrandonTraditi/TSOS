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

module TSOS {

    export class Cpu {

        constructor(public ProgramCounter: number = 0,
                    public Acc: number = 0,
                    public partitionIndex: number = -1,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public currentPCB: TSOS.PCB = null,
                    public instruction: string = 'NA') {

        }

        public init(): void {
        }

        //Load program. Gets called in runProcess 
        public loadProgram(pcb: TSOS.PCB): void{
            this.currentPCB = pcb;
            //this.currentPCB.state = "Running";
            this.loadFromPCB();

        }

        //Updates pcb to now run in cycle
        public loadFromPCB(): void{
            this.ProgramCounter = this.currentPCB.programCounter;
            this.Acc = this.currentPCB.accumulator;
            this.partitionIndex = this.currentPCB.partitionIndex;
            this.Xreg = this.currentPCB.x;
            this.Yreg = this.currentPCB.y;
            this.Zflag = this.currentPCB.z;
        }

        public updatePCB(): void{
            if(this.currentPCB !== null){
                this.currentPCB.updatePCB(this.ProgramCounter, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                //need to create memory display and update here
            }
        }

        public cycle(): void {
            console.log("cycle executing");
            console.log("current PCB: ", this.currentPCB);
            if(this.currentPCB !== null && this.isExecuting == true){
               _Kernel.krnTrace('CPU cycle');
               // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
                
                //get instruction
                var currentInstruction = _Memory.readMemory(this.partitionIndex, this.ProgramCounter).toUpperCase();
                this.instruction = currentInstruction;

                //Debugging
                //this.Acc = 10;
                //_Memory.memory[238]= "A9";
                //this.ProgramCounter = 50;
                console.log("instruction: ",this.instruction);
                //console.log("ZFlag: ", this.Zflag);
                //console.log("partition index: ", this.partitionIndex);
                //console.log("PC before run: ", this.ProgramCounter);
                //console.log("Acc before run: ", this.Acc);
                console.log("Memory array: ", _Memory.memory);

                //Decide what to do with instruction
                if(this.instruction == "A9"){

                    //load acc with a constant
                    this.Acc = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    this.ProgramCounter++;

                    //debugging
                    console.log("A9 ran: ", this.currentPCB); 
                    console.log("PC after A9: ", this.ProgramCounter); 
                    console.log("Acc after A9 run: ", this.Acc); //A9 = 169            

                }else if(this.instruction == "AD"){
                    //load acc from memory
                    let hex = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    this.Acc = parseInt(_Memory.readMemory(this.partitionIndex, hex), 16);
                    this.ProgramCounter++;

                    //debugging
                    console.log("AD ran: ", this.currentPCB); 
                    console.log("PC after AD: ", this.ProgramCounter); 
                    console.log("Hex variable: ", hex);//AD = 173
                    console.log("Acc after AD run: ", this.Acc);//should return spot 173 in array to acc  


                }else if(this.instruction == "8D"){
                    //store acc in memory
                    let hexDec = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    _Memory.writeByte(this.partitionIndex, hexDec, this.Acc.toString(16));
                    this.ProgramCounter++;

                    console.log("Hex value: ", hexDec);//8D = 141
                    console.log("Memory array: ", _Memory.memory);//should have 8d in spot 141 on array
                    console.log("Byte data: ", this.Acc.toString(16));

                }else if(this.instruction == "6D"){
                    //add contents from address to acc 
                    let hexDec = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    this.Acc += parseInt(_Memory.readMemory(this.partitionIndex, hexDec), 16);
                    this.ProgramCounter++

                    console.log("Hex decimal: ", hexDec); //6D = 109
                    console.log("Memory array: ", _Memory.memory);
                    console.log("Acc after: ", this.Acc);


                }else if(this.instruction == "A2"){
                    // load x reg with constant
                    this.Xreg = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    this.ProgramCounter++;

                    console.log("Xreg value: ", this.Xreg);//A2 = 162 

                }else if(this.instruction == "AE"){
                    //load x reg from memory
                    let xMem = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    this.Xreg = parseInt(_Memory.readMemory(this.partitionIndex, xMem), 16);
                    this.ProgramCounter++;

                    console.log("xMem: ", xMem);//AE = 174
                    console.log("Xreg value: ", this.Xreg);

                }else if(this.instruction == "A0"){
                    //load y reg with constant
                    this.Yreg = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                    this.ProgramCounter++;

                    console.log("Yreg value: ", this.Yreg);//A0 = 160

                }else if(this.instruction == "AC"){
                   //load y reg from memory
                   let yMem = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                   this.Yreg = parseInt(_Memory.readMemory(this.partitionIndex, yMem), 16);
                   this.ProgramCounter++;

                   console.log("yMem: ", yMem);//AC = 172
                   console.log("Yreg value: ", this.Yreg);

                }else if(this.instruction == "EC"){
                  //compare byte at address to x reg, set z flag
                  let hex = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                  let byte = parseInt(_Memory.readMemory(this.partitionIndex, hex), 16);

                  //comparison
                  if(byte === this.Xreg){
                      this.Zflag = 1;
                  }else{
                      this.Zflag = 0;
                  }
                  this.ProgramCounter++;

                  console.log("hex: ", hex);//EC = 236
                  console.log("byte: ", byte);
                  console.log("xReg: ", this.Xreg);
                  console.log("zFlag: ", this.Zflag);

                }else if(this.instruction == "D0"){
                    //Branch N bytes if z flag = 0
                    if(this.Zflag === 0){
                        var branchN = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                        var branchPC = this.ProgramCounter + branchN;
                        
                        if(branchPC > _MemoryPartitionSize - 1){
                            this.ProgramCounter = branchPC - _MemoryPartitionSize;
                        }else{
                            this.ProgramCounter = branchPC;
                        }

                    }else{
                        this.ProgramCounter++;
                    }

                    console.log("BranchN: ", branchN);//D0 = 208
                    console.log("BranchPC: ", branchPC);
                    console.log("Program Counter: ", this.ProgramCounter);


                }else if(this.instruction == "EE"){
                   //increment byte
                   let hexDec = parseInt(_Memory.readMemory(this.partitionIndex, this.ProgramCounter), 16);
                   let hexLoc = parseInt(_Memory.readMemory(this.partitionIndex, hexDec), 16);
                   hexLoc ++;
                   _Memory.writeByte(this.partitionIndex, hexDec, hexLoc.toString(16));
                   this.ProgramCounter++;

                   console.log("HexDec: ", hexDec);//EE = 238
                   console.log("HexLoc: ", hexLoc);
                   console.log("Memory spot: ", _Memory.readMemory(this.partitionIndex, hexDec));
                   console.log(_Memory.memory);

                }else if(this.instruction == "FF"){
                   //system call


                }else if(this.instruction == "EA"){
                  //no op
                  this.ProgramCounter++;

                }else if(this.instruction == "00"){
                  //break program
                  this.ProgramCounter++;
                  this.isExecuting = false;

                }else{
                  _StdOut.putText("Not an applical instruction: " + _Memory.readMemory(this.partitionIndex, this.ProgramCounter));
                  this.isExecuting = false;
            }          
            
            } 
            //keep pcb updated
            this.updatePCB();

            

            //Need to create/upodate memory display

        }//end cycle
    }
}
