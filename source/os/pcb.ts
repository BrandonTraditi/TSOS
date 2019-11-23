///<reference path="../globals.ts" />

module TSOS{
    export class PCB{
        public pid: number;
        public state: string = "New";
        public priority: number = 64;
        public programCounter: number = 0;
        public instructionReg: string = null;
        public accumlator: number = 0;
        public x: number = 0;
        public y: number = 0;
        public z: number = 0;
        public location: string = null;
        public partitionIndex: number = 0;

        constructor(p){
            this.pid = p;
        }
    }
}