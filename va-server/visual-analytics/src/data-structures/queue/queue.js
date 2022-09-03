/* -----------------------------------------------------
 *  queue.js
 *  Created by hyunseok.oh@samsung.com on 2018-02-22.
 * ----------------------------------------------------*/

function Queue() {
    this.data = [];
}

Queue.prototype.push = function (data) {
    this.data.push(data);
};

Queue.prototype.front = function () {
    if (this.data.length) return this.data[0];
    return undefined;
};

Queue.prototype.pop = function () {
    return this.data.shift();
};

Queue.prototype.size = function () {
    return this.data.length;
};

Queue.prototype.empty = function () {
    return this.data.length == 0;
};

export { Queue };
