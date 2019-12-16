///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="processManager.ts" />
///<reference path="memoryManager.ts" />
///<reference path="pcb.ts" />
///<reference path="../host/memoryAccessor.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the Date.");
            this.commandList[this.commandList.length] = sc;
            //whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Finds your soul");
            this.commandList[this.commandList.length] = sc;
            //SuperBowl Prediction
            sc = new TSOS.ShellCommand(this.shellPrediction, "prediction", "- Prediction for SuperBowl LIV");
            this.commandList[this.commandList.length] = sc;
            //Status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "- Updates status");
            this.commandList[this.commandList.length] = sc;
            //BSOD
            sc = new TSOS.ShellCommand(this.shellBSOD, "bluedeath", "- Displays BSOD error");
            this.commandList[this.commandList.length] = sc;
            //Load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates users code");
            this.commandList[this.commandList.length] = sc;
            //Run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- Runs a specific proccess");
            this.commandList[this.commandList.length] = sc;
            //Run all
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all proccess'");
            this.commandList[this.commandList.length] = sc;
            //clear memory
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears all memory");
            this.commandList[this.commandList.length] = sc;
            //PS
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- Displays all PID");
            this.commandList[this.commandList.length] = sc;
            //kill
            sc = new TSOS.ShellCommand(this.shellKill, "killpid", "- Kills a certain PID");
            this.commandList[this.commandList.length] = sc;
            //Kill all
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "- Kills all PIDS");
            this.commandList[this.commandList.length] = sc;
            //RR on
            sc = new TSOS.ShellCommand(this.shellRRon, "rr", "- <on | off> - Turns the RR scheduling on or off.");
            this.commandList[this.commandList.length] = sc;
            //Quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "- Select a quantum for RR");
            this.commandList[this.commandList.length] = sc;
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
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
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
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
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
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
                        _StdOut.putText("Runs all Proccess'");
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
                        _StdOut.putText("Sets quantum for RR'");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        //Runs prompt command
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        //Provides the current date and time to the UI
        Shell.prototype.shellDate = function (args) {
            var d = new Date();
            _StdOut.putText(d.toString());
        };
        //Runs Where am I command that will output text
        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText("Follow your soul, it knows the way");
        };
        //Outputs super bowl prediction
        Shell.prototype.shellPrediction = function (args) {
            _StdOut.putText("Superbowl LIV predictions:Patriots 24 - Packers 10");
        };
        //Command that will update status UI message
        Shell.prototype.shellStatus = function (args) {
            var s = "";
            for (var i = 0; i < args.length; i++) {
                s = s + " " + args[i];
            }
            TSOS.Utils.statusUpdate(s);
        };
        //Issues a BSOD 
        Shell.prototype.shellBSOD = function (args) {
            _Kernel.krnTrapError("BSOD has been initalized!");
        };
        //Loads a program that is inputted to the User Program input
        Shell.prototype.shellLoad = function (args) {
            //get user input and store in a userInput to check for valid code
            var userInput = document.getElementById("taProgramInput").value;
            //store all valid hex char into array to check against user input to
            var validHex = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
            //if/else for input 
            if (userInput == " ") {
                _StdOut.putText("Please input a program. ");
            }
            else {
                //nested for loops to check user input to the valid hex array
                var counter = 0;
                for (var i = 0; i < userInput.length; i++) {
                    var currChar = userInput.charAt(i);
                    for (var j = 0; j < validHex.length; j++) {
                        if (currChar.toUpperCase() == validHex[j]) {
                            counter++;
                        }
                    }
                }
            }
            //split array of Hex to individual op codes. This is if a user inputted commands without spaces. 
            var program = userInput.split(" ");
            //Check if code is valid Hex
            if (counter == userInput.length) {
                //Create a new process                 
                _ProcessManager.createProcess(program);
                //Output that it is a valid input and the PID.
                if (_Loaded = true) {
                    _StdOut.putText("This is valid hex. Loaded with PID: " + _PID);
                }
            }
            else {
                _StdOut.putText("Program not loaded.");
            }
        };
        //Runs the process based on pid input
        Shell.prototype.shellRun = function (args) {
            //Check for valid input 
            if (args.length > 0) {
                //Establish a variable for the pid based on input
                var pid = args[0];
                //Establish a temp queue to use to load proccesses onto while looking for pid
                var tempQueue = new TSOS.Queue();
                //Set a pcb that will be ran
                var pcbRun = null;
                //If that pcb is in the queue it will be ran
                var inQueue = false;
                //Get pcb from ready queue
                while (_ProcessManager.readyQueue.getSize() > 0) {
                    //waitPCB is equal to the first index of the ready Queue
                    var waitPcb = _ProcessManager.readyQueue.dequeue();
                    //if the pid's match, change in queue to true and put the pcb from the ready queue into pcbRun
                    if (waitPcb.pid == pid) {
                        pcbRun = waitPcb;
                        inQueue = true;
                        //if pid do not match save pcb in temp queue and check pid to next pcb
                    }
                    else {
                        tempQueue.enqueue(waitPcb);
                    }
                }
                //push pcb if put in tempqueue
                while (tempQueue.getSize() > 0) {
                    _ProcessManager.readyQueue.enqueue(tempQueue.dequeue());
                }
                //if pcb is put in queue, run it
                if (inQueue) {
                    _ProcessManager.runProcess(pcbRun);
                }
                else {
                    _StdOut.putText("Pid not found.");
                }
                //Argument was invalid
            }
            else {
                _StdOut.putText("Please supply a Pid");
            }
        };
        //RunAll command
        Shell.prototype.shellRunAll = function () {
            console.log("runall initiated");
            var pcbRun = null;
            while (_ProcessManager.readyQueue.getSize() > 0) {
                _ProcessManager.runAll = true;
                pcbRun = _ProcessManager.readyQueue.dequeue();
                _ProcessManager.runProcess(pcbRun);
                console.log(pcbRun);
            }
        };
        Shell.prototype.shellClearMem = function (args) {
            //Set clear to the argument inputted which will be the partition index
            var clear = args.toString();
            //If it is equal to 0,1, or 2.. clear the respected partition index
            if (clear === "0") {
                _Memory.clearMemoryPartition(0);
                _StdOut.putText("Memory partition 0 cleared. ");
            }
            else if (clear === "1") {
                _Memory.clearMemoryPartition(1);
                _StdOut.putText("Memory partition 1 cleared. ");
            }
            else if (clear === "2") {
                _Memory.clearMemoryPartition(2);
                _StdOut.putText("Memory partition 2 cleared. ");
                //Else clear all partitions
            }
            else {
                _Memory.clearMemory();
                _StdOut.putText("All Memory partitions cleared. ");
            }
            //Update HTML with the new memory
            _Control.memoryUpdate();
            //Debugging
            //console.log(_Memory.memory);
        };
        //Display all ps
        Shell.prototype.shellPS = function () {
            for (var i = 0; i < _ProcessManager.residentList.length; i++) {
                var pidPA = _ProcessManager.residentList[i].pid;
                var pidState = _ProcessManager.residentList[i].state;
                _StdOut.putText("PID: " + pidPA + " With a state of " + pidState);
                _Console.advanceLine();
            }
        };
        //Kill a particular proccess
        Shell.prototype.shellKill = function (args) {
            if (args.length > 0) {
                var setting = args[0];
            }
        };
        //Kill all proccesses
        Shell.prototype.shellKillAll = function () {
        };
        //Turn on the round robin executing
        Shell.prototype.shellRRon = function (args) {
            //If on or off is inputted
            if (args.length > 0) {
                //Set input to setting
                var setting = args[0];
                //Run a switch case for on or off
                switch (setting) {
                    case "on":
                        //Turn RR on and alert the user
                        _TurnOnRR = true;
                        _StdOut.putText("Round Robin scheduling has been turned on.");
                        //console.log(_TurnOnRR);
                        break;
                    case "off":
                        //Turn RR off and alert the user
                        _TurnOnRR = false;
                        _StdOut.putText("Round Robin scheduling has been turned off.");
                        //console.log(_TurnOnRR);
                        break;
                    default:
                        //If input is not on or off alert the user
                        _StdOut.putText("Invalid arguement.  Usage: RR <on | off>.");
                }
                //If input is not on or off alert the user    
            }
            else {
                _StdOut.putText("Usage: rr <on | off>");
            }
        };
        //Set the quantum 
        Shell.prototype.shellQuantum = function (args) {
            //Check for an input in the argument
            if (args.length > 0) {
                //Set the quantum to the desired number
                _DefaultQuantum = args[0];
                _StdOut.putText("Quantum is set to  " + _DefaultQuantum);
                //If input is not a number alert the user
            }
            else {
                _StdOut.put("Please enter a valid number");
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
