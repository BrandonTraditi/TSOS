///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />
var TSOS;
(function (TSOS) {
    var memoryAccessor = /** @class */ (function () {
        function memoryAccessor() {
            this.memory = _Memory.memory;
        }
        memoryAccessor.prototype.init = function () {
        };
        // read memory block in particular partition 
        memoryAccessor.prototype.readMemory = function (partition, PC) {
            var location = PC;
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            return _Memory.memory[location];
        };
        //slice location to get the block of the program
        memoryAccessor.prototype.getProgram = function (partition, PC) {
            var location = PC;
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            return _Memory.memory.slice(location, location + 255);
        };
        return memoryAccessor;
    }());
    TSOS.memoryAccessor = memoryAccessor;
})(TSOS || (TSOS = {}));
