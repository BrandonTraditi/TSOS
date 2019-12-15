///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            this.memory = [];
        }
        Memory.prototype.init = function () {
            //array of 3 blocks of memory
            this.memory = new Array(768);
            //fills each block of memory with 00 to begin
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
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
        //used from write funtion to write the block of the program
        Memory.prototype.writeByte = function (partition, location, byteData) {
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            this.memory[location] = byteData;
        };
        //uses writebyte to write program block
        Memory.prototype.write = function (partition, program) {
            for (var i = 0; i < program.length; i++) {
                this.writeByte(partition, i, program[i]);
            }
            _Control.memoryUpdate();
        };
        //clears all memory
        Memory.prototype.clearMemory = function () {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
            for (var i = 0; i < _MemoryManager.partitions.length; i++) {
                _MemoryManager.partitions[i].available = true;
            }
        };
        //clears particular memory block based on partition index
        Memory.prototype.clearMemoryPartition = function (partition) {
            if (partition == 0) {
                for (var i = 0; i < 256; i++) {
                    this.memory[i] = "00";
                }
            }
            else if (partition == 1) {
                for (var i = 256; i < 512; i++) {
                    this.memory[i] = "00";
                }
            }
            else if (partition == 2) {
                for (var i = 513; i < 768; i++) {
                    this.memory[i] = "00";
                }
            }
            _MemoryManager.partitions[partition].available = true;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
