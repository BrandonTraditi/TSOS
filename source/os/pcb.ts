 ///<reference path="../globals.ts" />

module TSOS{
    //Creates a PCB Framework with all neccessary variables
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

        //Makes a new pcb with pid inputted
        constructor(p){
            this.pid = p;
        }
    }
}