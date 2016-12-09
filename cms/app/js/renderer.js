// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const jsoneditor = require('./js/jsoneditor.min.js');

var element = document.getElementById('editor_holder');

var editor = new JSONEditor(element, { 
    schema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "name": {
            "type": "string"
            }
        },
        "required": [
            "name"
        ]
    },
    startval: {
        "name": "silas"
    }
}); 