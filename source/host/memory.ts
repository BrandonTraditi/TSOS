///<reference path="../globals.ts" />

module TSOS{

    export class Memory{
        public memory = [];
        public init(): void{
            this.memory = new Array(768);
            for(var i= 0; i < this.memory.length; i++){
                this.memory[i]= "00";
            }
        }
    }
}