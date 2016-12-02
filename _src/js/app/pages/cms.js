module.exports = function() {
    var element = document.getElementById('chapters_editor');
    var chapterSchema = require('../schema/chapters.json');
    var chapterValues = require('../../../hbs/data/dynamic/chapters.json');
    var editor = new JSONEditor(element, { 
        schema: chapterSchema,
        startval: chapterValues
    }); 
    console.log(editor.getValue());
} 