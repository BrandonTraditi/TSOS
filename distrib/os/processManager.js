///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager(waitQueue, readyQueue, processArray, runAll) {
            if (waitQueue === void 0) { waitQueue = new TSOS.Queue(); }
            if (readyQueue === void 0) { readyQueue = new TSOS.Queue(); }
            if (processArray === void 0) { processArray = new Array(); }
            if (runAll === void 0) { runAll = false; }
            this.waitQueue = waitQueue;
            this.readyQueue = readyQueue;
            this.processArray = processArray;
            this.runAll = runAll;
        }
        ;
        //public currentPCB: TSOS.PCB;
        ProcessManager.prototype.createProcess = function (program) {
            var partitionIndex = _MemoryManager.getAvailbepartitions();
            if (partitionIndex != -1) {
                //PID counter
                _PID++;
                //Create new pcb
                var pcb = new TSOS.PCB(_PID);
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
                _Control.pcbAdd(pcb);
                _Control.memoryUpdate();
            }
            else {
                _StdOut.putText("Memory is full.");
            }
        };
        ProcessManager.prototype.runProcess = function (pcb) {
            if (this.runAll == false) {
                //this.readyQueue.enqueue(pcb);
                pcb.state = "Running";
                _CPU.loadProgram(pcb);
                _Control.cpuUpdate();
                //Debugging
                //console.log("Run Process pcb: ", pcb);
                //console.log("Ready queue: ", this.readyQueue);
                //_CPU.isExecuting = true;
            }
            else {
                console.log("runall is true");
                console.log("Wait queue size: ", _ProcessManager.waitQueue.getSize());
                this.readyQueue.enqueue(pcb);
                pcb.state = "Running";
                _CPU.loadProgram(pcb);
                _CPU.isExecuting = true;
            }
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
