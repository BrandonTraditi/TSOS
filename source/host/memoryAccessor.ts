///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />

module TSOS{

    export class MemoryAccessor{

        public init(){
        }
        
        // read memory block in particular partition from memory array 
        public readMemory(partition: number, PC: number): string {
            //Sets location to program counter 
            let location = PC;
            //If else based on partition and adjusts location based on partition
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            //Returns the hex in that location
            return _Memory.memory[location];
        }
        //slice location to get the block of the program from memory array
        public getProgram(partition: number, PC: number){

            //Sets location to program counter 
            let location = PC;
            //If else based on partition and adjusts location based on partition
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            //Slices the block of memory
            return _Memory.memory.slice(location, location + 255);
        }
        
    }
}