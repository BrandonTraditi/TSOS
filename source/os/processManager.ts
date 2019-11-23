///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS{
    
    export class ProcessManager{

        constructor(
            public waitQueue: TSOS.Queue = new Queue(),
            public processArray: PCB[] = new Array()
        ){};

        public currentPCB: TSOS.PCB;

        public createProcess(program: Array<string>, priority?): void{
            var partitionIndex = _MemoryManager.getAvailbepartitions();

            if(partitionIndex != -1){

                _PID++;
                var pcb = new PCB(_PID);
                this.processArray.push(pcb);
                pcb.partitionIndex = partitionIndex;
                if(priority != null){
                    pcb.priority = Number(priority)
                }else{
                    pcb.priority = 64;
                }
                _MemoryManager.writeProgramToMemory(pcb.partitionIndex, program);
                this.waitQueue.enqueue(pcb);
                pcb.instructionReg = _Memory.readMemory(pcb.partitionIndex, pcb.programCounter);
                pcb.location = "MEMORY";
                console.log("pcb", pcb);
                console.log("program: ", program);
            }else{
                _StdOut.putText("Program not loaded");
            }


        }



    }

}