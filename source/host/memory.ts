///<reference path="../globals.ts" />

module TSOS{

    export class Memory{

        public memory = [];

        public init(): void{
            //array of 3 blocks of memory
            this.memory = new Array(768);
            //fills each block of memory with 00 to begin
            for(var i= 0; i < this.memory.length; i++){
                this.memory[i]= "00";
            }
            
        }
        //used from write funtion to write the block of the program
        public writeByte(partition: number, location: number, byteData: string): void {
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            this.memory[location] = byteData;
        }
        //uses writebyte to write program block
        public write(partition: number, program): void{
            for(let i = 0; i < program.length; i++){
                this.writeByte(partition, i, program[i]);
            }
            _Control.memoryUpdate();

        }
        //clears all memory
        public clearMemory(): void{
            for(let i = 0; i < this.memory.length; i++){
                this.memory[i] = "00";
            } 
            
            for(let i = 0; i < _MemoryManager.partitions.length; i ++){
                _MemoryManager.partitions[i].available = true;
            }
        }
        //clears particular memory block based on partition index
        public clearMemoryPartition(partition: number): void{
           if(partition == 0){
               for(var i = 0; i < 256; i++){
                   this.memory[i] = "00"
               }
           }else if(partition == 1){
               for(var i = 256; i < 512; i++){
                   this.memory[i] = "00"
               }
           }else if(partition == 2){
               for(var i = 513; i < 768; i++){
                   this.memory[i] = "00"
               }
           }
            _MemoryManager.partitions[partition].available = true;
        }


    }
}