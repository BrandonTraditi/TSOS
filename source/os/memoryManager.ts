///<reference path="../globals.ts" />

module TSOS{
    export class memoryManager{

        constructor(
            public partition = [

                {
                    available: true,
                    index: 0,
                    base: 0,
                    limit: 255
                },

                {
                    available: true,
                    index: 0,
                    base: 256,
                    limit: 511
                },

                {
                    available: true,
                    index: 0,
                    base: 512,
                    limit: 767
                }
            ]

        ){};

        
    }

}