function StatusBoard() {
    this.init();
}

StatusBoard.prototype.init = function () {
    this.board = {};
};

StatusBoard.prototype.add = function (id, status, message) {
    this.board[id] = {
        status: status,
        message: message
    };
};

StatusBoard.prototype.remove = function (id) {
    delete this.board[id];
};

StatusBoard.prototype.get = function (id) {
    return this.board[id];
};

StatusBoard.prototype.refresh = function () {
    this.init();
};

StatusBoard.prototype.show = function (id, $target) {
    if (!this.get(id)) return;
    $target.attr('title', this.get(id).message);
};

var statusBoard = new StatusBoard();

export { statusBoard as StatusBoard };