const isFailStatus = ({ status }) => status === 'FAIL';
const getMessage = (f) => f.message || '';
const getFirstErrorMessageFromFunction = (fns) => {
    for (let msg of fns.filter(isFailStatus).map(getMessage)) {
        const s = msg.indexOf(':');
        const e = msg.indexOf('\n');
        if (s > -1 && e > -1) {
            return msg.substring(s + 2, e);
        }
    }
    return undefined;
};

const getErrorMessageFromJobStatus = (ans) => {
    for (let p of ans.processes.filter(isFailStatus)) {
        const msg = getFirstErrorMessageFromFunction(p.functions);
        if (msg) return msg;
    }
    return undefined;
};

module.exports = getErrorMessageFromJobStatus;
