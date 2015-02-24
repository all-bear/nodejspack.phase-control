module.exports = function () {
    global.testFunctionMessage.push('function_run');
    global.testFunctionThis.push(this);
    global.testFunctionFile.push('02_required.js');
};