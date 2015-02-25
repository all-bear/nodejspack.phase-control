var bootable = require('../lib/bootable');

function checkFunctionRun() {
    return global.testFunctionMessage.shift() == 'function_run';
}

function checkFunctionThis(target) {
    return global.testFunctionThis.shift() == target;
}

function checkFunctionFile(file) {
    return global.testFunctionFile.shift() == file;
}

function refreshFunctionRun() {
    global.testFunctionMessage = [];
    global.testFunctionThis = [];
    global.testFunctionFile = [];
}

describe('bootable', function () {
    var targetObj = bootable({});

    beforeEach(function () {
        targetObj = bootable({});
        refreshFunctionRun();
    });

    describe('bootable with function', function () {
        var testFunc = require('./test_requireds/01_required');

        it('function must run', function () {
            targetObj.phase('phase', testFunc);
            expect(checkFunctionRun()).toBe(true);
        });

        it('function must be same as target', function () {
            targetObj.phase('phase', testFunc);
            expect(checkFunctionThis(targetObj)).toBe(true);
        });
    });
    describe('bootable with path to file', function () {
        it('function must run', function () {
            targetObj.phase('phase', './test_requireds/01_required');
            expect(checkFunctionRun()).toBe(true);
        });

        it('function must be same as target', function () {
            targetObj.phase('phase', './test_requireds/01_required');
            expect(checkFunctionThis(targetObj)).toBe(true);
        });

        it('function file must be good', function () {
            targetObj.phase('phase', './test_requireds/01_required');
            expect(checkFunctionFile('01_required.js')).toBe(true);
        });

        it('must throw error on wrong path', function () {
            expect(function () {
                targetObj.phase('phase', './test_requireds/lalalalal.js');
            }).toThrow('Wrong path');
        });
    });
    describe('bootable with path to directory', function () {
        it('function must run', function () {
            targetObj.phase('phase', './test_requireds');
            expect(checkFunctionRun()).toBe(true);
            expect(checkFunctionRun()).toBe(true);
        });

        it('function must be same as target', function () {
            targetObj.phase('phase', './test_requireds');
            expect(checkFunctionThis(targetObj)).toBe(true);
            expect(checkFunctionThis(targetObj)).toBe(true);
        });

        it('function file must be good', function () {
            targetObj.phase('phase', './test_requireds');
            expect(checkFunctionFile('01_required.js')).toBe(true);
            expect(checkFunctionFile('02_required.js')).toBe(true);
        });

        it('must throw error on wrong path', function () {
            expect(function () {
                targetObj.phase('phase', './test_requireds/lalalalal');
            }).toThrow('Wrong path');
        });
    });

    describe('bootable with async function', function () {
        it('function must run', function () {
            targetObj.phase('phase', './test_requireds_async/01_required_1000ms');
            expect(checkFunctionRun()).toBe(true);
        });
        expect(function () {
            targetObj.phase('phase', './test_requireds_async/02_required_9000ms');
        }).toThrow('Function run time ends');
    });

});