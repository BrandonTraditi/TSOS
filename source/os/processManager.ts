///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS{
    
    export class ProcessManager{

        constructor(
            public waitQueue: TSOS.Queue = new Queue(),
            public readyQueue: TSOS.Queue = new Queue(),
            public processArray: PCB[] = new Array(),
            public runAll: boolean = false
        ){};


        //public currentPCB: TSOS.PCB;

        public createProcess(program: Array<string>): void{
            var partitionIndex = _MemoryManager.getAvailbepartitions();

            if(partitionIndex != -1){

                //PID counter
                _PID++;
                //Create new pcb
                var pcb = new PCB(_PID);
                //Push pcb to process array
                this.processArray.push(pcb);
                //after finding available partition, assign it to pcb
                pcb.partitionIndex = partitionIndex;
                //write process to memory with assigned index
                _MemoryManager.writeProgramToMemory(pcb.partitionIndex, program);
                //add pcb to wait queue 
                this.waitQueue.enqueue(pcb);
                this.readyQueue.enqueue(pcb);
                console.log(this.waitQueue);
                console.log(this.readyQueue);
                pcb.state = "Waiting";
                //set indtruction registry 
                pcb.instructionReg = _Memory.readMemory(pcb.partitionIndex, pcb.programCounter);
                //set location
                pcb.location = "MEMORY";
                //used for debugging
                //console.log("pcb: ", pcb);
                //console.log("program: ", program);
                //console.log("Wait queue ", this.waitQueue);
                //console.log("Wait Queue Size: ", this.waitQueue.getSize());
                //console.log("process array: ", this.processArray);
                
            }else{
                _StdOut.putText("Memory is full.");
            }


        }

        public runProcess(pcb:PCB): void{
            if(this.runAll == false){
                //this.readyQueue.enqueue(pcb);
                pcb.state = "Running";
                _CPU.loadProgram(pcb);
                _CPU.isExecuting = true;
                //Debugging
                //console.log("Run Process pcb: ", pcb);
                //console.log("Ready queue: ", this.readyQueue);
                //_CPU.isExecuting = true;
            }else{
                console.log("runall is true");
                console.log("Wait queue size: ", _ProcessManager.waitQueue.getSize());

                    this.readyQueue.enqueue(pcb);
                    pcb.state = "Running";
                    _CPU.loadProgram(pcb);
                    _CPU.isExecuting = true;
            }
        }

        /*public runAllProccesses(): void{


                console.log("pcbRun: ", _ProcessManager.waitQueue.dequeue());
            }*/



    }

}