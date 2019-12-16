///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

module TSOS{
    
    export class ProcessManager{

        constructor(
            //Establish a ready queue for all proccess in memory
            public readyQueue: TSOS.Queue = new Queue(),
            //Establish a resident list for all proccesses loaded
            public residentList: PCB[] = new Array(),
            //Runall used for runall command
            public runAll: boolean = false
        ){};

        //Creates a new PCB object with inputted program
        public createProcess(program: Array<string>): void{
            //Assign the new PCB a partition of memory
            var partitionIndex = _MemoryManager.getAvailbepartitions();

            //If there is a parition open. Create the proccess in there.
            if(partitionIndex != -1){

                //PID counter increments. This should not reset.
                _PID++;
                //Create new pcb with a pid
                var pcb = new PCB(_PID);
                //Assign the pcb to a memory block
                pcb.partitionIndex = partitionIndex;
                //Write process to memory with assigned index
                _MemoryManager.writeProgramToMemory(pcb.partitionIndex, program);
                //Add the pcb to the ready queue 
                this.readyQueue.enqueue(pcb);
                //Add to the resident list
                this.residentList.push(pcb);
                //Set the pcb state to ready
                pcb.state = "Ready";
                //set indtruction registry
                pcb.instructionReg = _MemoryAccessor.readMemory(pcb.partitionIndex, pcb.programCounter);
                //set location.. will always stay in memory for this project
                pcb.location = "MEMORY";

                
                //Debugging

                //console.log("pcb: ", pcb);
                //console.log("program: ", program);
                //console.log("Resident list: ", this.residentList);
                
                //Update the html tables
                _Control.pcbAdd(pcb);
                _Control.memoryUpdate();
                
            }else{
                //If available partition returns -1 then the memory is full.
                _StdOut.putText("Memory is full.");
            }
        }


        public runProcess(pcb:PCB): void{
            //If run all is false we just run one program
            if(this.runAll == false){
                //Set the pcb state from ready to running
                pcb.state = "Running";
                //load the pcb to the cpu 
                _CPU.loadProgram(pcb);
                //Update the HTML table
                _Control.cpuUpdate();    
                
                
                //Debugging
                
                //console.log("Run Process pcb: ", pcb);
                //console.log("Ready queue: ", this.readyQueue);
                //_CPU.isExecuting = true;

            }else{
                /*
                console.log("runall is true");
                console.log("Array Size: ", this.residentList.length);
                console.log("Proccess array: ", this.residentList);

                for(var i; i < this.residentList.length; i++){
                    var pcbRun = this.residentList[i];
                    _CPU.loadProgram(pcbRun);*/
                }
            }
        }

    }
