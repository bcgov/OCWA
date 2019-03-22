var docs = {};

docs.getDocHTML = function(version){
    var html = '<!DOCTYPE html>\n' +
        '<html>\n' +
        '  <head>\n' +
        '    <title>Request API - Documentation '+version+'</title>\n' +
        '    <!-- needed for adaptive design -->\n' +
        '    <meta charset="utf-8"/>\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">\n' +
        '\n' +
        '    <!--\n' +
        '    ReDoc doesn\'t change outer page styles\n' +
        '    -->\n' +
        '    <style>\n' +
        '      body {\n' +
        '        margin: 0;\n' +
        '        padding: 0;\n' +
        '      }\n' +
        '    </style>\n' +
        '  </head>\n' +
        '  <body>\n' +
        '    <redoc spec-url=\'/'+version+'/spec/api-docs.yaml\'></redoc>\n' +
        '    <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"> </script>\n' +
        '  </body>\n' +
        '</html>';
    return html;
};

module.exports = docs;