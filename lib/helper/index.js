exports.isFunctionAssync = function(func) {
    return /^function\s*?.*?\s*?\(done\)/.test(func.toString());
};