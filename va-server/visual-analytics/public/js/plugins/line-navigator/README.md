# LineNavigator
[![Build Status](https://api.travis-ci.org/anpur/line-navigator.svg?branch=master)](https://travis-ci.org/anpur/line-navigator)
[![NPM:](https://img.shields.io/npm/v/line-navigator.svg)](https://www.npmjs.com/package/line-navigator)

A module to read text files (including extra large ones) in the browser and in Node.js line by line without loading whole file to the memory.

It accepts both **[HTML5 File](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications) for client side** and **file path for server side** in Node.JS.

Installation:

    npm install line-navigator --save

Check it out live in Tonic: [tonicdev.com/npm/line-navigator](https://tonicdev.com/npm/line-navigator). 

## Summary
Features:
- **Modular**: can be used in vanilla JS, Node.JS, Browserify.JS and as AMD module.
- **No file size limit**: LineNavigator doesn't try to read all file to the memory unlike ordinary [FileReader.readAsText()](https://developer.mozilla.org/en-US/docs/Web/API/FileReader.readAsText) which lags for big files and crashes for files larger than ~400 MB.
- **Random access by index**: repetitive access is optimized.
- **Embedded search tools**: allows searching by regular expessions, highlight matches, etc.
- **Position as per cent**: allows showing nice representation in the UI.
- **All line endings supported**: all types of line endings are supported even mixed together: `\n`, `\r\n`.

Contents:
- Sources as either [NPM package](https://www.npmjs.com/package/line-navigator) or as standalone files ([file-wrapper.js](https://github.com/anpur/line-navigator/blob/master/file-wrapper.js) and [line-navigator.js](https://github.com/anpur/line-navigator/blob/master/line-navigator.js))
- Examples of usage in [vanilla JS](https://github.com/anpur/line-navigator/tree/master/examples/client-vanilla), [Browserify.JS](https://github.com/anpur/line-navigator/tree/master/examples/client-browserify), [Require.JS](https://github.com/anpur/line-navigator/tree/master/examples/client-amd-require-js) and [Node.JS](https://github.com/anpur/line-navigator/tree/master/examples/server-node)
- Functional and unit [tests](https://github.com/anpur/line-navigator/tree/master/tests)

## API
All [examples](https://github.com/anpur/line-navigator/tree/master/examples) contain all methods invocation and comments, so you can use them as a reference.

### Constructor
Creates an instance of LineNavigator.
```
var navigator = new LineNavigator(file[, options]);
```
Where:
- `file` [HTML5 File](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications) for client side or a string with file path for server side.
- `options` dictionary which can contain the following keys:
    - `options.encoding` encoding name, default is 'utf8'
	- `options.chunkSize` size of chunk, default is 1024 * 4
	- `options.throwOnLongLines` return error when line is longer than chunkSize, otherwise it will be threated as several lines

### Read some lines
Reads optimal amount of lines (which depends on `chunkSize`). 
```
navigator.readSomeLines(indexToStartWith, function (err, index, lines, isEof, progress) {
	...
});
```
Where (including callback arguments):
- `indexToStartWith` index of first line to read
- `err` will be undefined if no error happenes
- `index` callback's representation of `indexToStartWith`
- `lines` an array of strings, where index of first one is `indexToStartWith`
- `isEof` a boolean which is true if end of file is reached
- `progress` a 0-100 per cent position of the last line in the chunk  

### Read lines
Reads exact amount of lines.
```
navigator.readLines(indexToStartWith, numberOfLines, function (err, index, lines, isEof, progress) {
	...
});
```
Where (including callback arguments):
- `indexToStartWith` an index of first line to read
- `numberOfLines` a number of lines wanted
- `err` will be undefined if no error happenes
- `index` callback's representation of `indexToStartWith`
- `lines` an array of strings, where index of first one is `indexToStartWith`
- `isEof` a boolean which is true if end of file is reached
- `progress` a 0-100 per cent position of the last line in chunk
Method will not return an error if the file contains less lines than requested, just less lines.

### Find
Finds first lines starting from given index which matches regex pattern.
```
navigator.find(regex, indexToStartWith, function(err, index, match) {
	...
});
```
Where (including callback arguments):
- `regex` regular expression to search for
- `indexToStartWith` an index of first line to read
- `err` will be undefined if no error happenes
- `index` callback's representation of `indexToStartWith`
- `match` a dictionary with the following structure:
    - `match.line` full line text
	- `match.offset` position of the match itself in this line
	- `match.length` length of the match itself in this line

### Find all
Finds all matches in file.
```
navigator.findAll(regex, indexToStartWith, limit, function (err, index, limitHit, results) {
	...
});
```
Where (including callback arguments):
- `regex` regular expression to search for
- `indexToStartWith` an index of first line to read
- `limit` max number of matches
- `err` will be undefined if no error happenes
- `index` callback's representation of `indexToStartWith`
- `results` array of matches, where each contains following:
    - `results[0].index` index of this line
	- `results[0].line` full line text
	- `results[0].offset` position of the match itself in this line
	- `results[0].length` length of the match itself in this line