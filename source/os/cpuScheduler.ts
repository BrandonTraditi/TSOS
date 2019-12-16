///<reference path="../globals.ts" />
///<reference path="queue.ts" />


module TSOS{
    export class cpuScheduler{
        constructor(
        //Sets quantum equal to the assigned quantum
        public quantum: number = _DefaultQuantum,
        //sets a scheduled algorith to a string..In this case it will always be RR but if implementing more scheduling features we would use to adjust
        public algorithm: string = _SchedAlgo,
        //Creates a null PCB
        public nextPCB: TSOS.PCB = null,
        ){};

        //The Round robin scheduler
        public roundRobin(){
            //Sets pcb to the current pcb running
            var pcb: PCB = _CPU.currentPCB;
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
            if(_ProcessManager.readyQueue.getSize() > 0){
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
        }

    }

}