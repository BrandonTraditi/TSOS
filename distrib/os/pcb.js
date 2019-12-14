///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var PCB = /** @class */ (function () {
        function PCB(p) {
            this.state = "New";
            this.programCounter = 0;
            this.instructionReg = null;
            this.accumulator = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.location = null;
            this.partitionIndex = -1;
            this.pid = p;
        }
        PCB.prototype.updatePCB = function (PC, IR, Acc, xReg, Yreg, Zflag) {
            this.programCounter = PC;
            this.instructionReg = IR;
            this.accumulator = Acc;
            this.x = xReg;
            this.y = Yreg;
            this.z = Zflag;
        };
        return PCB;
    }());
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
