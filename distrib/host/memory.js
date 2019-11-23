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
            //fills each block of memory wi
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
        };
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
        Memory.prototype.writeByte = function (partition, location, byteData) {
            if (partition == 1) {
                location += 256;
            }
            if (partition == 2) {
                location += 512;
            }
            this.memory[location] = byteData;
        };
        Memory.prototype.write = function (partition, program) {
            for (var i = 0; i < program.length; i++) {
                this.writeByte(partition, i, program[i]);
            }
        };
        Memory.prototype.clearMemory = function (parition) {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = "00";
            }
            for (var i = 0; i < _MemoryManager.partitions.length; i++) {
                _MemoryManager.partitions[i].available = true;
            }
        };
        Memory.prototype.clearMemoryPartition = function (partition) {
            switch (partition) {
                case 0:
                    for (var i = 0; i < 256; i++) {
                        this.memory[i] = "00";
                    }
                    break;
                case 1:
                    for (var i = 256; i < 512; i++) {
                        this.memory[i] = "00";
                    }
                    break;
                case 3:
                    for (var i = 513; i < 768; i++) {
                        this.memory[i] = "00";
                    }
                    break;
            }
            _MemoryManager.partitions[partition].available = true;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
