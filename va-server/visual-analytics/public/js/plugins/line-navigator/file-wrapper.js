; 
/* https://github.com/anpur/line-navigator Anton Purin MIT 2016 */
var createFileWrapper = function() {

    function FileWrapper (file, encoding) {
        var self = this;        

        // Node JS
        if (self.isNode(file)) {
            self.fs = require('fs');

            var StringDecoder = require('string_decoder').StringDecoder;
            self.string_decoder = new StringDecoder(encoding);

            if (self.fs.statSync(file) === undefined)
                throw "File '" + file + "' doesn't exists!";

            var fd = self.fs.openSync(file, 'r');
            
            self.readChunk = function (offset, length, callback) {
                var buffer = new Buffer(length);

                self.fs.read(fd, buffer, 0, length, offset, function (e, br) { callback(e, buffer, br); });
            };

            self.decode = function(buffer, callback) {
                callback(self.string_decoder.write(buffer));
            };

            self.getSize = function() {
                return self.fs.statSync(file)["size"];
            };
        } 

        // HTML5 File
        else if (self.isHtml5File(file)) {
            self.readChunk = function (offset, length, callback) {
                lastPosition = offset + length;
                var reader = new FileReader();

                reader.onloadend = function(progress) {
                    var buffer;
                    if (reader.result) {
                        buffer = new Int8Array(reader.result, 0);
                        buffer.slice = buffer.subarray;
                    }
                    callback(progress.err, buffer, progress.loaded);
                };

                reader.readAsArrayBuffer(file.slice(offset, offset + length));
            };

            self.decode = function(buffer, callback) {
                var reader = new FileReader();
                reader.onloadend = function(progress) {
                    callback(progress.currentTarget.result);
                };
                if (typeof encoding !== 'undefined') {
                    reader.readAsText(new Blob([buffer]), encoding);
                } else {
                    reader.readAsText(new Blob([buffer]));
                }
            };

            self.getSize = function() {
                return file.size;
            };
        } 
        // Unknown
        else {
            throw "Given file should be instance of the File class for browser \
            or a string containing a path to a file for Node.js, \
            but it is neither: [" + (typeof file) + "] " + file;
        }
    }

    FileWrapper.prototype.isNode = function (file) { 
        return typeof module !== 'undefined' && module.exports && typeof file === 'string'; 
    };

    FileWrapper.prototype.isHtml5File = function (file) { 
        return typeof File !== 'undefined' && file instanceof File; 
    }

    return FileWrapper;
}

// Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = createFileWrapper();
}
// AMD
else if (typeof define === 'function') {
    define(function(){
        return createFileWrapper();    
    });
}
// Vanilla
else {
    FileWrapper = createFileWrapper();
}