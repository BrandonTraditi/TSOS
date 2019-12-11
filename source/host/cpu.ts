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
                this.Acc = 10;
                _Memory.memory[109]= "8D";
                console.log("instruction: ",this.instruction);
                //console.log("partition index: ", this.partitionIndex);
                console.log("PC before run: ", this.ProgramCounter);
                console.log("Acc before run: ", this.Acc);
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
                }else if(this.instruction == "AE"){
                    //load x reg from memory
                }else if(this.instruction == "A0"){
                    //load y reg with constant
                }else if(this.instruction == "AC"){
                   //load y reg from memory
                }else if(this.instruction == "EC"){
                  //compare byte at address to x reg, set z flag
                }else if(this.instruction == "D0"){
                    //Branch N bytesif z flag = 0
                }else if(this.instruction == "EE"){
                   //increment byte
                }else if(this.instruction == "FF"){
                   //system call
                }else if(this.instruction == "EA"){
                  //no op
                }else if(this.instruction == "00"){
                  //break program
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
