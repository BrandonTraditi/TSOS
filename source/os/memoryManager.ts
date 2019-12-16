///<reference path="../globals.ts" />
///<reference path="../host/memoryAccessor.ts" />

module TSOS{
    export class memoryManager{

        constructor(
            //Set a constructor to an array containing 3 paritions or blocks of memory
            public partitions = [     
                {available: true, index: 0, base: 0, limit: 255},
                {available: true, index: 1, base: 256, limit: 511},
                {available: true, index: 2, base: 512, limit: 767}
            ]

        ){};

        //Writes the program to the inputted partition
        public writeProgramToMemory(parition: number, program): void{
            _Memory.write(parition, program);
        }

        //Finds if there is an available partition of memory and outputs -1 if not
        public getAvailbepartitions(): number {

            //If 0 is availible set to not available and return 0
            if(this.partitions[0].available){
                this.partitions[0].available = false;
                return this.partitions[0].index;
            //If 1 is availible set to not available and return 1
            }else if (this.partitions[1].available){
                this.partitions[1].available = false;
                return this.partitions[1].index;
            //If 2 is availible set to not available and return 2
            }else if (this.partitions[2].available){
                this.partitions[2].available = false;
                return this.partitions[2].index;
            //Return -1
            }else{
                return -1;
            }

        }
    }
}