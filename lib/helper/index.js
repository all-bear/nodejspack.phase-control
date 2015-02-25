module.exports = function (settings) {
    return {
        isFunctionAssync: function (func) {
            return /^function\s*?.*?\s*?\(done\)/.test(func.toString());
        },
        log: function (message) {
            if (settings.logEnable) {
                console.log(message);
            }
        }
    }
};