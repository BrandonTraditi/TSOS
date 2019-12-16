///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.init = function () {
        };
        // read memory block in particular partition 
        MemoryAccessor.prototype.readMemory = function (partition, PC) {
            console.log("Got Here");
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
        MemoryAccessor.prototype.getProgram = function (partition, PC) {
            var location = PC;
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            return _Memory.memory.slice(location, location + 255);
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
