///<reference path="../globals.ts" />
///<reference path="queue.ts" />


module TSOS{
    export class cpuScheduler{
        constructor(
        public quantum: number = _DefaultQuantum,
        public algorithm: string = _SchedAlgo,
        public nextPCB: TSOS.PCB = null,
        ){};

        public roundRobin(){
            var pcb: PCB = _CPU.currentPCB;
            _ProcessManager.readyQueue.enqueue(pcb); 
            console.log("RR PCB: ", pcb);
            this.nextPCB = _ProcessManager.readyQueue.dequeue();
            console.log("Dequeue ready queue: ", this.nextPCB);
            console.log(_ProcessManager.readyQueue);
            //var tempQueue: TSOS.Queue = new Queue();
            //tempQueue.enqueue(pcb);
            //console.log("Temp Queue: ", tempQueue);
            if(_ProcessManager.readyQueue.getSize() > 0){
                this.nextPCB.state = "Running";
                _RoundRobinCounter = 0;
                _CPU.loadProgram(this.nextPCB);
                _ProcessManager.readyQueue.enqueue(pcb);
                console.log("ReInitalize Ready Queue: ", _ProcessManager.readyQueue);
            }

            _CPU.isExecuting = true;
        }

    }

}