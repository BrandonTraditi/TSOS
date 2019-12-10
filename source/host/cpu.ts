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
            this.loadFromPCB();

        }

        //Updates pcb to now run in cycle
        public loadFromPCB(): void{
            this.ProgramCounter = this.currentPCB.programCounter;
            this.Acc = this.currentPCB.accumlator;
            this.Xreg = this.currentPCB.x;
            this.Yreg = this.currentPCB.y;
            this.Zflag = this.currentPCB.z;
        }

        /*public updatePCB(): void{
            if(this.currentPCB !== null){
                this.currentPCB.updatePCB(this.ProgramCounter, this.Xreg, this.Yreg, this.Xreg, this.Zflag);
                //need to create memory display and update here
            }
        }*/

        public cycle(): void {
            console.log("cycle executing");
            console.log("current PCB: ", this.currentPCB);
            if(this.currentPCB !== null && this.isExecuting == true){
               _Kernel.krnTrace('CPU cycle');
               // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
                
                //get instruction
                var currentInstruction = _Memory.readMemory(this.currentPCB.partitionIndex, this.ProgramCounter).toUpperCase();
                this.instruction = currentInstruction;

                console.log("instruction:",this.instruction);

                //Decide what to do with instruction
                if(this.instruction == "A9"){

                    //load acc with a constant
                    this.currentPCB.programCounter++;
                    this.currentPCB.accumlator = parseInt(_Memory.readMemory(this.currentPCB.partitionIndex, this.ProgramCounter), 16);
                    this.currentPCB.programCounter++;
                    console.log("A9 ran: ", this.currentPCB);

                }else if(this.instruction == "AD"){
                    //load acc from memory
                }else if(this.instruction == "8D"){
                    //store acc in memory
                }else if(this.instruction == "6D"){
                    //add contents from address to acc 
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
                  _StdOut.putText("Not an applical instruction:"+ _Memory.readMemory(this.currentPCB.partitionIndex, this.ProgramCounter));
                  this.isExecuting = false;
            }          
            
            } 
            //keep pcb updated
            //if(this.currentPCB !== null){
               // this.updatePCB();

            //}

            //Need to create/upodate memory display

        }
    }
}
