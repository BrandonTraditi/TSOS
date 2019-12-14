 ///<reference path="../globals.ts" />

module TSOS{
    export class PCB{
        public pid: number;
        public state: string = "New";
        public programCounter: number = 0;
        public instructionReg: string = null;
        public accumulator: number = 0;
        public x: number = 0;
        public y: number = 0;
        public z: number = 0;
        public location: string = null;
        public partitionIndex: number = -1;

        constructor(p){
            this.pid = p;
        }

       public updatePCB(PC: number, IR: string, Acc: number, xReg: number, Yreg: number, Zflag: number): void{
            this.programCounter = PC;
            this.instructionReg = IR;
            this.accumulator = Acc;
            this.x = xReg;
            this.y = Yreg;
            this.z = Zflag;
        }
    }
}