///<reference path="../globals.ts" />
///<reference path="queue.ts" />
var TSOS;
(function (TSOS) {
    var cpuScheduler = /** @class */ (function () {
        function cpuScheduler(quantum, counter, algorithm, nextPCB) {
            if (quantum === void 0) { quantum = _DefaultQuantum; }
            if (counter === void 0) { counter = 0; }
            if (algorithm === void 0) { algorithm = _SchedAlgo; }
            if (nextPCB === void 0) { nextPCB = null; }
            this.quantum = quantum;
            this.counter = counter;
            this.algorithm = algorithm;
            this.nextPCB = nextPCB;
        }
        ;
        /* public getProcess(): void{
             _CPU.currentPCB = _ProcessManager.readyQueue.dequeue();
             _CPU.currentPCB.state = "Running";
         }
 
         public loadProccess(): void{
             _CPU.currentPCB.state = "Ready";
             _ProcessManager.readyQueue.enqueue(_CPU.currentPCB);
         }*/
        cpuScheduler.prototype.roundRobin = function (pcb) {
            var pcb = _CPU.currentPCB;
            console.log("RR PCB: ", pcb);
            var tempQueue = new TSOS.Queue();
            if (_ProcessManager.readyQueue.getSize() > 0) {
                this.nextPCB = _ProcessManager.readyQueue.dequeue();
                this.nextPCB.state = "Running";
            }
            _CPU.isExecuting = true;
            // if(_ProcessManager.readyQueue.getSize() > 0){
            // this.nextPCB = _ProcessManager.readyQueue.dequeue();
            //this.nextPCB.state = "Running";
            // _CPU.loadProgram(this.nextPCB);
            //}
        };
        return cpuScheduler;
    }());
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
