///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />
///<reference path="../host/memory.ts" />
///<reference path="../os/memoryManager.ts" />
///<reference path="../host/devices.ts" />
/* ------------
     Control.ts

     Requires globals.ts.

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
            function timeDisplay() {
                var time = new Date();
                document.getElementById("timeDisplay").innerHTML = time.toString();
                var timeOut = setTimeout(timeDisplay, 500);
            }
            timeDisplay();
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init(); //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
            TSOS.Utils.statusUpdate("Host Online");
            _Control.memoryUpdate();
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.prototype.cpuUpdate = function () {
            //Get cpu table
            var table = document.getElementById("cpuTable");
            table.deleteRow(1);
            var row = table.insertRow(1);
            // PC
            row.insertCell(0).innerHTML = _CPU.currentPCB.programCounter.toString();
            // ACC
            row.insertCell(1).innerHTML = _CPU.currentPCB.accumulator.toString();
            // IR
            row.insertCell(2).innerHTML = _CPU.currentPCB.instructionReg;
            // x
            row.insertCell(3).innerHTML = _CPU.currentPCB.x.toString();
            // y
            row.insertCell(4).innerHTML = _CPU.currentPCB.y.toString();
            // z
            row.insertCell(5).innerHTML = _CPU.currentPCB.z.toString();
        };
        Control.prototype.pcbAdd = function (pcb) {
            //Get pcb Table
            var table = document.getElementById("pcbTable");
            //If its the first pcb delete the first "example row"
            if (_PID == 0) {
                table.deleteRow(1);
            }
            //Get a new row and insert data
            var row = table.insertRow();
            //pid
            row.insertCell(0).innerHTML = pcb.pid.toString();
            // state
            row.insertCell(1).innerHTML = pcb.state;
            // pc
            row.insertCell(2).innerHTML = pcb.programCounter.toString();
            // acc
            row.insertCell(3).innerHTML = pcb.accumulator.toString();
            //IR
            row.insertCell(4).innerHTML = pcb.instructionReg;
            // location
            row.insertCell(5).innerHTML = pcb.location;
            // x
            row.insertCell(6).innerHTML = pcb.x.toString();
            // y
            row.insertCell(7).innerHTML = pcb.y.toString();
            // z
            row.insertCell(8).innerHTML = pcb.z.toString();
        };
        //still working 
        Control.prototype.pcbUpdate = function (pcb) {
            //if pcb is not terminated we update that row
            if (pcb.state != "Terminated") {
                var table = document.getElementById("pcbTable");
                var tableLength = table.rows.length;
                for (var i = 0; i < tableLength; i++) {
                    var row = table.rows[i].cells;
                    if (parseInt(row[0].innerHTML) == pcb.pid) {
                        row[1].innerHTML = pcb.state;
                        row[2].innerHTML = pcb.programCounter.toString();
                        row[3].innerHTML = pcb.accumulator.toString();
                        row[4].innerHTML = pcb.instructionReg;
                        row[5].innerHTML = pcb.location;
                        row[6].innerHTML = pcb.x.toString();
                        row[7].innerHTML = pcb.y.toString();
                        row[8].innerHTML = pcb.z.toString();
                        break;
                    }
                }
            }
        };
        Control.prototype.memoryUpdate = function () {
            //Get table
            var table = document.getElementById("memoryTable");
            table.innerHTML = "";
            var index = 0;
            for (var i = 0; i < _MemorySize; i += 8) {
                // create a new row ands add 0 or 00 where necessary
                var hex = i.toString(16);
                if (hex.length == 1) {
                    hex = "0" + hex;
                }
                if (hex.length == 2) {
                    hex = "00" + hex;
                }
                //need to account for the first column in the row
                var newRow = table.insertRow(i / 8);
                newRow.insertCell(0).innerHTML = "0X" + hex;
                for (var j = 1; j < 9; j++) {
                    // create a new cell
                    newRow.insertCell(j).innerHTML = _Memory.memory[index];
                    index++;
                }
            }
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
