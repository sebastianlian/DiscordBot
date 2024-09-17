let chalk;

(async () => {
    chalk = (await import('chalk')).default;
})();

function getChalk() {
    if (!chalk) {
        throw new Error("Chalk has not been initialized yet.");
    }
    return chalk;
}

module.exports = {
    getChalk
};