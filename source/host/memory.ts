///<reference path="../globals.ts" />

module TSOS{

    export class Memory{
        public memory = [];

        public init(): void{
            //array of 3 blocks of memory
            this.memory = new Array(768);
            //fills each block of memory wi
            for(var i= 0; i < this.memory.length; i++){
                this.memory[i]= "00";
            }
        }

        public readMemory(partition: number, PC: number): string {
            let location = PC;
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            return this.memory[location];
        }

        public getProgram(partition: number, PC: number){
            let location = PC;
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            return this.memory.slice(location, location + 255);
        }

        public writeByte(partition: number, location: number, byteData: string): void {
            if(partition == 1){
                location += 256;
            }
            if(partition == 2){
                location += 512;
            }
            this.memory[location] = byteData;
        }

        public write(partition: number, program): void{
            for(let i = 0; i < program.length; i++){
                this.writeByte(partition, i, program[i]);
            }

        }

        public clearMemory(parition:number): void{
            for(let i = 0; i < this.memory.length; i++){
                this.memory[i] = "00";
            } 
            
            for(let i = 0; i < _MemoryManager.partitions.length; i ++){
                _MemoryManager.partitions[i].available = true;
            }
        }

        public clearMemoryPartition(partition: number): void{
            switch(partition){
                case 0:
                    for(let i = 0; i < 256; i++){
                        this.memory[i] = "00";
                    }
                    break;
                case 1:
                     for(let i = 256; i < 512; i++){
                        this.memory[i] = "00";
                    }
                    break;
                case 3:
                    for(let i = 513; i < 768; i++){
                        this.memory[i] = "00";
                    }
                    break;
            }
            _MemoryManager.partitions[partition].available = true;
        }


    }
}