/* -----------------------------------------------------
 *  stack.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-22.
 * ---------------------------------------------------- */

function Stack() {
    this.data = [];
}

Stack.prototype.push = function (data) {
    this.data.push(data);
};

Stack.prototype.top = function () {
    if (this.data.length) {
        return this.data[this.data.length - 1];
    }
    return undefined;
};

Stack.prototype.pop = function () {
    return this.data.pop();
};

Stack.prototype.size = function () {
    return this.data.length;
};

Stack.prototype.empty = function () {
    return this.data.length == 0;
};

export { Stack };
