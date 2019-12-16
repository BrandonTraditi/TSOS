///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />

module TSOS{

    export class MemoryAccessor{

        public init(){
        }
        
        // read memory block in particular partition 
        public readMemory(partition: number, PC: number): string {
            let location = PC;
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            return _Memory.memory[location];
        }
        //slice location to get the block of the program
        public getProgram(partition: number, PC: number){
            let location = PC;
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            return _Memory.memory.slice(location, location + 255);
        }
        
    }
}