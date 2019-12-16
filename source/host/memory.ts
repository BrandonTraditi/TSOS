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
        //used from write funtion to write the byte of Data
        public writeByte(partition: number, location: number, byteData: string): void {

            //If else based on partition and adjusts location based on partition
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            //Writes the byte inputted to that location
            this.memory[location] = byteData;
        }
        //uses writebyte to write whole program 
        public write(partition: number, program): void{

            //for loop that will use write byte to input each op code into memory
            for(let i = 0; i < program.length; i++){
                this.writeByte(partition, i, program[i]);
            }
            //Update memory HTML 
            _Control.memoryUpdate();

        }
        //clears all memory
        public clearMemory(): void{

            //For loop that cycles through the memory and sets all locations to 00
            for(let i = 0; i < this.memory.length; i++){
                this.memory[i] = "00";
            } 
            //sets the memory partition back to turn when it is cleared
            for(let i = 0; i < _MemoryManager.partitions.length; i ++){
                _MemoryManager.partitions[i].available = true;
            }
        }
        //clears particular memory block based on partition index
        public clearMemoryPartition(partition: number): void{
           //If else based on partition and clears the associated partition block of memory
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
           //Sets partition to true again
            _MemoryManager.partitions[partition].available = true;
        }


    }
}