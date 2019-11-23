///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager(waitQueue, processArray) {
            if (waitQueue === void 0) { waitQueue = new TSOS.Queue(); }
            if (processArray === void 0) { processArray = new Array(); }
            this.waitQueue = waitQueue;
            this.processArray = processArray;
        }
        ;
        ProcessManager.prototype.createProcess = function (program, priority) {
            var partitionIndex = _MemoryManager.getAvailbepartitions();
            if (partitionIndex != -1) {
                _PID++;
                var pcb = new TSOS.PCB(_PID);
                this.processArray.push(pcb);
                pcb.partitionIndex = partitionIndex;
                if (priority != null) {
                    pcb.priority = Number(priority);
                }
                else {
                    pcb.priority = 64;
                }
                _MemoryManager.writeProgramToMemory(pcb.partitionIndex, program);
                this.waitQueue.enqueue(pcb);
                pcb.instructionReg = _Memory.readMemory(pcb.partitionIndex, pcb.programCounter);
                pcb.location = "MEMORY";
                console.log("pcb", pcb);
                console.log("program: ", program);
            }
            else {
                _StdOut.putText("Program not loaded");
            }
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
