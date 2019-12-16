///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="../host/memoryAccessor.ts" />
var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager(
        //Establish a ready queue for all proccess in memory
        readyQueue, 
        //Establish a resident list for all proccesses loaded
        residentList, 
        //Runall used for runall command
        runAll) {
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (residentList === void 0) { residentList = new Array(); }
            if (runAll === void 0) { runAll = false; }
            this.readyQueue = readyQueue;
            this.residentList = residentList;
            this.runAll = runAll;
        }
        ;
        //Creates a new PCB object with inputted program
        ProcessManager.prototype.createProcess = function (program) {
            //Assign the new PCB a partition of memory
            var partitionIndex = _MemoryManager.getAvailbepartitions();
            //If there is a parition open. Create the proccess in there.
            if (partitionIndex != -1) {
                //PID counter increments. This should not reset.
                _PID++;
                //Create new pcb with a pid
                var pcb = new TSOS.PCB(_PID);
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
            }
            else {
                //If available partition returns -1 then the memory is full.
                _StdOut.putText("Memory is full.");
            }
        };
        ProcessManager.prototype.runProcess = function (pcb) {
            //If run all is false we just run one program
            if (this.runAll == false) {
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
            }
            else {
                //Set the pcb state from ready to running
                pcb.state = "Running";
                //load the pcb to the cpu 
                _CPU.loadProgram(pcb);
                //Update the HTML table
                _Control.cpuUpdate();
                //_TurnOnRR = true;
                //_KernelInterruptQueue.enqueue(new Interrupt(ROUNDROBIN_IRQ, 0));
                /*
                console.log("runall is true");
                console.log("Array Size: ", this.residentList.length);
                console.log("Proccess array: ", this.residentList);
                */
            }
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
