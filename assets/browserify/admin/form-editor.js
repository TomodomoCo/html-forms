'use strict';

// load CodeMirror & plugins
const CodeMirror = require('codemirror');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/closetag.js');

let editor, element, dom, requiredFieldsInput, emailFieldsInput, previewFrame, previewDom;
const templateRegex = /\{\{ *(\w+)(?:\.([\w\.]+))? *(?:\|\| *(\w+))? *\}\}/g;

function init() {
    previewFrame = document.getElementById('hf-form-preview');
    previewFrame.addEventListener('load', setPreviewDom);
    setPreviewDom();
    
    element = document.getElementById('hf-form-editor');
    dom = document.createElement('form');
    requiredFieldsInput = document.getElementById('hf-required-fields');
    emailFieldsInput = document.getElementById('hf-email-fields');

    dom.innerHTML = element.value;
    editor = CodeMirror.fromTextArea(element, {
        selectionPointer: true,
        matchTags: { bothTags: true },
        mode: "htmlmixed",
        htmlMode: true,
        autoCloseTags: true,
        autoRefresh: true,
        styleActiveLine: true,
        matchBrackets: true,
    });

    editor.on('changes', debounce(updatePreview, 500));
    editor.on('changes', debounce(updateShadowDOM, 100));
    editor.on('blur', updatePreview);
    editor.on('blur', updateShadowDOM);
    editor.on('blur', updateFieldVariables);
    editor.on('blur', updateRequiredFields);
    editor.on('blur', updateEmailFields);

    document.getElementById('wpbody').addEventListener('click', updateFieldVariables);
    updateFieldVariables();
}

function setPreviewDom() {
    let frameContent = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDom = frameContent.querySelector('.hf-fields-wrap');
}

function getFieldVariableName(f) {
    return f.name.replace('[]', '').replace(/\[(\w+)\]/g, '.$1' )
}

function updateFieldVariables() {
    const fields = dom.querySelectorAll('input[name], select[name], textarea[name], button[name]');
    const fieldVariables = uniq([].map.call(fields, (f) => '[' +  getFieldVariableName(f) + ']'));

    [].forEach.call( document.querySelectorAll('.hf-field-names'), (el) => {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }

        let variableElements = fieldVariables.map((n) => {
            let el = document.createElement('code');
            el.innerText = n;
            return el;
        });

        variableElements.forEach((vel, i, arr) => {
            el.appendChild(vel);

            if( i < ( arr.length - 1 ) ) {
                el.appendChild(document.createTextNode(', '));
            }
        })
    });
}

function updatePreview() {
    let markup = editor.getValue();
    markup = markup.replace(templateRegex, function(s, m) {
        if(arguments[3]) {
            return arguments[3];
        }

        return '';
    });
    previewDom.innerHTML = markup;
}

function updateShadowDOM() {
    dom.innerHTML = editor.getValue();
}

function updateRequiredFields() {
    let fields = dom.querySelectorAll('[required]');
    let fieldNames = [].map.call(fields, getFieldVariableName);
    requiredFieldsInput.value = fieldNames.join(',');
}

function updateEmailFields() {
    let fields = dom.querySelectorAll('input[type="email"]');
    let fieldNames = [].map.call(fields, getFieldVariableName);
    emailFieldsInput.value = fieldNames.join(',');
}

function replaceSelection(str) {
    editor.replaceSelection(str);
    editor.focus();
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

export default {
    'init': init,
    'replaceSelection': replaceSelection,
};
