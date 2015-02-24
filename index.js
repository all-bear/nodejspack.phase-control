var fs = require('fs');
var path = require('path');
var callsite = require('callsite');


function functionStrategy(func, target) {
    func.call(target);
}

function fileStrategy(fileName, target) {
    var func = require(fileName);

    functionStrategy(func, target);
}

function directoryStrategy(folderName, target) {
    var files = fs.readdirSync(folderName);

    files.forEach(function (filePath) {
        fileStrategy(path.resolve(folderName, filePath), target);
    });
}

module.exports = function (target) {
    if (!target) {
        throw new Error('Null target parameter');
    }

    if (typeof target != 'object' && typeof target != 'function') {
        throw new Error('Wrong target parameter type');
    }

    target['phase'] = function (phaseName, applyToTarget) {
        if (typeof applyToTarget == 'function') {
            functionStrategy(applyToTarget, target);
            return;
        }

        if (typeof applyToTarget == 'string') {
            var stack = callsite();
            var callerFuncDir = path.dirname(stack[1].getFileName());

            var requirePath = path.resolve(callerFuncDir, applyToTarget);
            var stat = null;

            try {
                stat = fs.statSync(requirePath);
            } catch (e1) {
                try {
                    requirePath += '.js';
                    stat = fs.statSync(requirePath);
                } catch (e2) {
                    throw new Error('Wrong path');
                }
            }

            if (stat.isFile()) {
                fileStrategy(requirePath, target);
                return;
            }

            if (stat.isDirectory()) {
                directoryStrategy(requirePath, target);
                return;
            }

            throw new Error('Wrong require file type');
        }
    };

    return target;
};