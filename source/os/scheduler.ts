///<reference path="../globals.ts" />
///<reference path="queue.ts" />

/*
module TSOS{
    export class cpuScheduler{
        constructor(
        public quantum: number = _DefaultQuantum,
        public counter: number = 0,
        public algorithm: string = _SchedAlgo,
        ){};

        public getProcess(): void{
            _CPU.currentPCB = _ProcessManager.readyQueue.dequeue();
            _CPU.currentPCB.state = "Running";
        }

        public loadProccess(): void{
            _CPU.currentPCB.state = "Ready";
            _ProcessManager.readyQueue.enqueue(_CPU.currentPCB);
        }

        public roundRobin(){
            if (this.counter === 0){
                _KernelInputQueue.enqueue(new Interrupt(UNLOAD_PROCCESS_IRQ, 0));
            }else if(this.counter == this.quantum){
                if(_ProcessManager.readyQueue.isEmpty()){
                    //get curr pcb and put it back on the queue
                    if(_CPU.currentPCB.state != "Terminated")
                    _KernelInterruptQueue.enqueue(new Interrupt(LOAD_PROCCESS_IRQ, 0));
                }
                _KernelInterruptQueue.enqueue(new Interrupt(UNLOAD_PROCCESS_IRQ, 0));
            }

            this.counter = 0;
        }

    }

}*/