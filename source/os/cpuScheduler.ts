///<reference path="../globals.ts" />
///<reference path="queue.ts" />


module TSOS{
    export class cpuScheduler{
        constructor(
        public quantum: number = _DefaultQuantum,
        public counter: number = 0,
        public algorithm: string = _SchedAlgo,
        public nextPCB: TSOS.PCB = null,
        ){};

        public roundRobin(){
            var pcb: PCB = _CPU.currentPCB;
            console.log("RR PCB: ", pcb);
            var tempQueue: TSOS.Queue = new Queue();
            if(_ProcessManager.readyQueue.getSize() > 0){
                this.nextPCB = _ProcessManager.readyQueue.dequeue();
                this.nextPCB.state = "Running";
                
            }

            _CPU.isExecuting = true;
           // if(_ProcessManager.readyQueue.getSize() > 0){
               // this.nextPCB = _ProcessManager.readyQueue.dequeue();
                //this.nextPCB.state = "Running";
               // _CPU.loadProgram(this.nextPCB);
            //}
        }

    }

}