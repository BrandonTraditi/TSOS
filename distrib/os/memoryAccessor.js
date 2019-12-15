///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(memory) {
            if (memory === void 0) { memory = []; }
            this.memory = memory;
        }
        ;
        Memory.prototype.init = function () {
            this.memory = _Memory.memory;
        };
        // read memory block in particular partition 
        Memory.prototype.readMemory = function (partition, PC) {
            var location = PC;
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            return this.memory[location];
        };
        //slice location to get the block of the program
        Memory.prototype.getProgram = function (partition, PC) {
            var location = PC;
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            return this.memory.slice(location, location + 255);
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
