module.exports = function (done) {
    setTimeout(function () {
        global.testFunctionMessage.push('function_run');
        global.testFunctionThis.push(this);
        global.testFunctionFile.push('01_required.js');

        done();
    }, 1000)
};