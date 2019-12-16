///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />
var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
        }
        MemoryAccessor.prototype.init = function () {
        };
        // read memory block in particular partition from memory array 
        MemoryAccessor.prototype.readMemory = function (partition, PC) {
            //Sets location to program counter 
            var location = PC;
            //If else based on partition and adjusts location based on partition
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            //Returns the hex in that location
            return _Memory.memory[location];
        };
        //slice location to get the block of the program from memory array
        MemoryAccessor.prototype.getProgram = function (partition, PC) {
            //Sets location to program counter 
            var location = PC;
            //If else based on partition and adjusts location based on partition
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            //Slices the block of memory
            return _Memory.memory.slice(location, location + 255);
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
