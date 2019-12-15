///<reference path="../globals.ts" />
///<reference path="queue.ts" />
var TSOS;
(function (TSOS) {
    var cpuScheduler = /** @class */ (function () {
        function cpuScheduler(quantum, algorithm, nextPCB) {
            if (quantum === void 0) { quantum = _DefaultQuantum; }
            if (algorithm === void 0) { algorithm = _SchedAlgo; }
            if (nextPCB === void 0) { nextPCB = null; }
            this.quantum = quantum;
            this.algorithm = algorithm;
            this.nextPCB = nextPCB;
        }
        ;
        cpuScheduler.prototype.roundRobin = function () {
            var pcb = _CPU.currentPCB;
            _ProcessManager.readyQueue.enqueue(pcb);
            console.log("RR PCB: ", pcb);
            this.nextPCB = _ProcessManager.readyQueue.dequeue();
            console.log("Dequeue ready queue: ", this.nextPCB);
            console.log(_ProcessManager.readyQueue);
            //var tempQueue: TSOS.Queue = new Queue();
            //tempQueue.enqueue(pcb);
            //console.log("Temp Queue: ", tempQueue);
            if (_ProcessManager.readyQueue.getSize() > 0) {
                this.nextPCB.state = "Running";
                //_RoundRobinCounter = 0;
                _CPU.loadProgram(this.nextPCB);
                //_ProcessManager.readyQueue.enqueue(pcb);
                console.log("ReInitalize Ready Queue: ", _ProcessManager.readyQueue);
            }
            _CPU.isExecuting = true;
        };
        return cpuScheduler;
    }());
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
