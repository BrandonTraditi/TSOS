///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="processManager.ts" />
///<reference path="memoryManager.ts" />
///<reference path="pcb.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new ShellCommand(this.shellDate,
                                  "date",
                                  "- Displays the Date.");
            this.commandList[this.commandList.length] = sc;

            //whereami
            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  "- Finds your soul");   
            this.commandList[this.commandList.length] = sc;

            //SuperBowl Prediction
            sc = new ShellCommand(this.shellPrediction,
                                 "prediction",
                                 "- Prediction for SuperBowl LIV");
            this.commandList[this.commandList.length] = sc;
            
            //Status
            sc = new ShellCommand(this.shellStatus,
                                 "status",
                                "- Updates status");
            this.commandList[this.commandList.length] = sc;
            
            //BSOD
            sc = new ShellCommand(this.shellBSOD,
                                "bluedeath",
                                "- Displays BSOD error");
            this.commandList[this.commandList.length] = sc;

            //Load
            sc = new ShellCommand(this.shellLoad,
                                 "load",
                                "- Validates users code");
            this.commandList[this.commandList.length] = sc;

            //Run
            sc = new ShellCommand(this.shellRun,
                                 "run",
                                 "- Runs a specific proccess");
            this.commandList[this.commandList.length] = sc;

            //Run all
            sc = new ShellCommand(this.shellRunAll,
                                "runall",
                                "- Runs all proccess'");
            this.commandList[this.commandList.length] = sc;
                        
            //clear memory
            sc = new ShellCommand(this.shellClearMem,
                                 "clearmem",
                                "- Clears all memory");
            this.commandList[this.commandList.length] = sc;
            
            //PS
            sc = new ShellCommand(this.shellPS,
                                "ps",
                                "- Displays all PID");
            this.commandList[this.commandList.length] = sc;

            //kill
            sc = new ShellCommand(this.shellKill,
                                 "killpid",
                                "- Kills a certain PID");
            this.commandList[this.commandList.length] = sc;

            //Kill all
            sc = new ShellCommand(this.shellKillAll,
                                 "killall",
                                 "- Kills all PIDS");
            this.commandList[this.commandList.length] = sc;

            //RR on
             sc = new ShellCommand(this.shellRRon,
                                "rr",
                                "- <on | off> - Turns the RR scheduling on or off.");
             this.commandList[this.commandList.length] = sc;            

            //Quantum
            sc = new ShellCommand(this.shellQuantum,
                                 "quantum",
                                 "- Select a quantum for RR");
            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    case "ver":
                        _StdOut.putText("Displays the current version Data.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shut down the virtual OS but leaves the underlying host/hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("Displays the Manual page for <topic>.");
                        break;
                    case "trace":
                        _StdOut.putText("<on | off> - Turns the OS trace on or off.");
                        break;
                    case "mrot13":
                        _StdOut.putText("Does rot13 obfuscation on <string>.");
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the prompt.");
                        break;
                    case "date":
                        _StdOut.putText("Displays the date and time.");
                        break;
                    case "status":
                        _StdOut.putText("Displays new status update");
                        break;
                    case "whereami":
                        _StdOut.putText("Finds where your soul is.");
                        break;
                    case "prediction":
                        _StdOut.putText("Super Bowl LIV prediction");
                        break;
                    case "BSOD":
                        _StdOut.putText("Initalizes BSOD error");
                        break;
                    case "load":
                        _StdOut.putText("Validate and load user program");
                        break;
                    case "run":
                        _StdOut.putText("Runs a specific process");
                        break;
                    case "runall":
                        _StdOut.putText("Runs all Proccess'")
                        break;
                    case "clearmem":
                        _StdOut.putText("Clears all memory");
                        break;
                    case "ps":
                        _StdOut.putText("Shows proccess'");
                        break;
                    case "kill":
                        _StdOut.putText("Kill a certain PID");
                        break;
                    case "killall":
                        _StdOut.putText("Kills all process'");
                        break;
                    case "rr":
                        _StdOut.putText("<on | off> - Turns the RR scheduling on or off.");
                        break;
                    case "quantum":
                        _StdOut.putText("Sets quantum for RR'")
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args: string[]) {
            var d = new Date();
            _StdOut.putText(d.toString());
        }

        public shellWhereAmI(args: string[]) {
            _StdOut.putText("Follow your soul, it knows the way");
        }

        public shellPrediction(args: string[]) {
            _StdOut.putText("Superbowl LIV predictions:Patriots 24 - Packers 10");
        }

        public shellStatus(args){
            var s = "";
            for(var i = 0; i < args.length; i++){
                s = s + " " + args[i];
            }
            Utils.statusUpdate(s);
        }

        public shellBSOD(args){
            _Kernel.krnTrapError("BSOD has been initalized!");
        }

        public shellLoad(args){
            //get user input and store in a var to check
            var userInput = (<HTMLInputElement>document.getElementById("taProgramInput")).value;
            //store all valid hex char into array to check user input to
            var validHex = [" ","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
            //if/else for input 
            if(userInput == ""){
                _StdOut.putText("Please input a program. ");
            }else{
                //nested for loops to check user input to the valid hex array
                var counter = 0;
                for(var i = 0; i < userInput.length; i++){
                    var currChar = userInput.charAt(i);
                    for(var j = 0; j < validHex.length; j++){
                        if(currChar.toUpperCase() == validHex[j]){
                            counter++;
                        }
                    }
                }
            }

            //split array of Hex into individual codes
            var program = userInput.split(" ");
            

            //Check if code is valid Hex
            if(counter == userInput.length){
                //Alert it is valid and create a new process                 
                _ProcessManager.createProcess(program);
                if(_Loaded = true){
                    _StdOut.putText("This is valid hex. Loaded with PID: " + _PID);
                }
                    
            }else{
                _StdOut.putText("Program not loaded.");
            }

        }

        public shellRun(args){
            if(args.length > 0){
                var pid = args[0];
                var tempQueue: TSOS.Queue = new Queue();
                var pcbRun: PCB = null;
                var inQueue: boolean = false;

                //Get pcb from wait queue
                while(_ProcessManager.waitQueue.getSize() > 0){
                    //waitPCB is equal to the last section of the waitqueue
                    var waitPcb = _ProcessManager.waitQueue.dequeue();
                    //if they match change in queue to true and put the pcb from wait queue into pcbRun
                    if(waitPcb.pid == pid){
                        pcbRun = waitPcb;
                        inQueue = true;
                    //if pid do not match save pcb in temp queue and check pid to next pcb
                    }else{
                        tempQueue.enqueue(waitPcb);
                    }
                }
                //requeue pcb if put in tempqueue
                while(tempQueue.getSize() > 0){
                    _ProcessManager.waitQueue.enqueue(tempQueue.dequeue());
                }
                //if pcb is put in queue, run it
                if(inQueue){
                    _ProcessManager.runProcess(pcbRun);
                }else{
                    _StdOut.putText("Pid not found.");
                }
            }else{
                _StdOut.putText("Please supply a Pid");
            }
        }

        public shellRunAll(){
            console.log("runall initiated");
            _TurnOnRR = true;
            _KernelInterruptQueue.enqueue(new Interrupt(ROUNDROBIN_IRQ, 0));
            /*while(_ProcessManager.processArray.length > 0){
                var pcbRun: PCB = null;
                pcbRun = _ProcessManager.processArray.pop();
            }
            _CPU.loadProgram(pcbRun);
            console.log(_ProcessManager.processArray);
            console.log(_ProcessManager.processArray.length);

            for(var i; i < _ProcessManager.processArray.length; i++){
                var pcbRun = _ProcessManager.processArray[i];
                _CPU.loadProgram(pcbRun);

                console.log("Array Size: ", _ProcessManager.processArray.length);
                console.log("Proccess array: ", _ProcessManager.processArray);
            }*/
        }

        
        public shellClearMem(args) {
            let clear = args.toString();
            console.log(_Memory.memory);

            if(clear === "0"){
                _Memory.clearMemoryPartition(0);
                _StdOut.putText("Memory partition 0 cleared. ");                
            }else if(clear === "1"){
                _Memory.clearMemoryPartition(1);
                _StdOut.putText("Memory partition 1 cleared. ");
            }else if(clear === "2"){
                _Memory.clearMemoryPartition(2);
                _StdOut.putText("Memory partition 2 cleared. ");
            }else{
                _Memory.clearMemory();
                _StdOut.putText("All Memory partitions cleared. ");
            }
            console.log(_Memory.memory);
        }

        public shellPS() {
            for(var i = 0; i < _ProcessManager.processArray.length; i++){
                var pidPA = _ProcessManager.processArray[i].pid;
                _StdOut.putText("PID: " + pidPA);
                _Console.advanceLine();
            }
    
        }

        public shellKill(args) {

        }

        public shellKillAll(){

        }
        public shellRRon(args){
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        _TurnOnRR = true;
                        _StdOut.putText("Round Robin scheduling has been turned on.");
                        console.log(_TurnOnRR);
                        break;
                    case "off":
                        _TurnOnRR = false;
                        _StdOut.putText("Round Robin scheduling has been turned off.");
                        console.log(_TurnOnRR);
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: RR <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: rr <on | off>");
            }
        }

        public shellQuantum(args){
            if(args.length > 0){
                _DefaultQuantum = args[0];
                _StdOut.putText("Quantum is set to  " + _DefaultQuantum);
            }else{
                _StdOut.put("Please enter a valid number");
            }

        }

    

    }
}
