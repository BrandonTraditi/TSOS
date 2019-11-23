///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var memoryManager = /** @class */ (function () {
        function memoryManager(partitions) {
            if (partitions === void 0) { partitions = [
                {
                    available: true,
                    index: 0,
                    base: 0,
                    limit: 255
                },
                {
                    available: true,
                    index: 1,
                    base: 256,
                    limit: 511
                },
                {
                    available: true,
                    index: 2,
                    base: 512,
                    limit: 767
                }
            ]; }
            this.partitions = partitions;
        }
        ;
        memoryManager.prototype.writeProgramToMemory = function (parition, program) {
            _Memory.write(parition, program);
        };
        memoryManager.prototype.getAvailbepartitions = function () {
            if (this.partitions[0].available) {
                this.partitions[0].available = false;
                return this.partitions[0].index;
            }
            else if (this.partitions[1].available) {
                this.partitions[1].available = false;
                return this.partitions[1].index;
            }
            else if (this.partitions[2].available) {
                this.partitions[2].available = false;
                return this.partitions[2].index;
            }
            else {
                return -1;
            }
        };
        return memoryManager;
    }());
    TSOS.memoryManager = memoryManager;
})(TSOS || (TSOS = {}));
