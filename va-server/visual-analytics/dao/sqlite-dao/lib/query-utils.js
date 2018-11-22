

const DEFAULT = 'default';
const SQLITE = 'sqlite';

const mode = SQLITE;

function getQuery(stmts, selector) {
    Object.values(stmts).forEach((x, i) => {
        const invalidKey = Object.keys(x).filter((y, j) => {
            return [DEFAULT, SQLITE].indexOf(y) === -1;
        });

        if (invalidKey.length > 0) throw new Error('invalid query statements map');
    });
    if (stmts[selector] && stmts[selector][mode]) return stmts[selector][mode];
    if (stmts[selector] && stmts[selector][DEFAULT]) return stmts[selector][DEFAULT];
    throw new Error('invalid query statement');
}

module.exports = {
    getQuery: getQuery
};
