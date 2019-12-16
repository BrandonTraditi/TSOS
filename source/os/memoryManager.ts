///<reference path="../globals.ts" />
///<reference path="../host/memoryAccessor.ts" />

module TSOS{
    export class memoryManager{

        constructor(
            public partitions = [     
                {available: true, index: 0, base: 0, limit: 255},
                {available: true, index: 1, base: 256, limit: 511},
                {available: true, index: 2, base: 512, limit: 767}
            ]

        ){};

        public writeProgramToMemory(parition: number, program): void{
            _Memory.write(parition, program);
        }

        public getAvailbepartitions(): number {

            if(this.partitions[0].available){
                this.partitions[0].available = false;
                return this.partitions[0].index;
            }
            else if (this.partitions[1].available){
                this.partitions[1].available = false;
                return this.partitions[1].index;
            }
            else if (this.partitions[2].available){
                this.partitions[2].available = false;
                return this.partitions[2].index;
            }
            else{
                return -1;
            }

        }
    }
}