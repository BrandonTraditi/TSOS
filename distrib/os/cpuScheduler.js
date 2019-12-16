///<reference path="../globals.ts" />
///<reference path="../os/queue.ts" />
///<reference path="../host/cpu.ts" />
///<reference path="../os/pcb.ts" />
var TSOS;
(function (TSOS) {
    var cpuScheduler = /** @class */ (function () {
        function cpuScheduler(
        //Sets quantum equal to the assigned quantum
        quantum, 
        //sets a scheduled algorith to a string..In this case it will always be RR but if implementing more scheduling features we would use to adjust
        algorithm, 
        //Creates a null PCB
        nextPCB) {
            if (quantum === void 0) { quantum = _DefaultQuantum; }
            if (algorithm === void 0) { algorithm = _SchedAlgo; }
            if (nextPCB === void 0) { nextPCB = null; }
            this.quantum = quantum;
            this.algorithm = algorithm;
            this.nextPCB = nextPCB;
        }
        ;
        cpuScheduler.prototype.check = function () {
            if (_RoundRobinCounter == _DefaultQuantum) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(ROUNDROBIN_IRQ, 0));
            }
        };
        //The Round robin scheduler
        cpuScheduler.prototype.roundRobin = function () {
            //Sets pcb to the current pcb running
            var pcb = _CPU.currentPCB;
            //Set the pcb state to waiting
            pcb.state = "Waiting";
            //Pushes the pcb to the back of the readyqueue 
            _ProcessManager.readyQueue.enqueue(pcb);
            //Sets the nextPCB to run to the pcb in the front of the ready queue using shift
            this.nextPCB = _ProcessManager.readyQueue.dequeue();
            //Debugging
            //console.log("Dequeue ready queue: ", this.nextPCB);
            //console.log(_ProcessManager.readyQueue);
            //If the readyqueue is bigger than 0 then switch
            if (_ProcessManager.readyQueue.getSize() > 0) {
                //Set the next pcb state to running 
                this.nextPCB.state = "Running";
                //Load the next pcb to the cpu to be run
                _CPU.loadProgram(this.nextPCB);
                //Debugging
                //_ProcessManager.readyQueue.enqueue(pcb);
                //console.log("ReInitalize Ready Queue: ", _ProcessManager.readyQueue);
            }
            //Set isexecuting back to true to involk the cycle()
            _CPU.isExecuting = true;
        };
        return cpuScheduler;
    }());
    TSOS.cpuScheduler = cpuScheduler;
})(TSOS || (TSOS = {}));
