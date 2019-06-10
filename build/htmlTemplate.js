module.exports = (DEBUG, SSR, html = '', innerScript = '', scriptTags = '', linkTags = '', styleTags = '') => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <meta name="referrer" content="no-referrer"/>
            <style>
                html, body{
                    padding: 0;
                    margin: 0;
                    width: 100%;
                    height: 100%;
                }
                #app{
                    position: relative;
                }
            </style>
            ${linkTags}
            ${styleTags}
        </head>
        <body>
            <div id="app">${html}</div>
        </body>
        <script>
            window.__DEBUG__ = ${DEBUG};
            window.__SSR__ = ${SSR};
            ${innerScript}
        </script>
        ${scriptTags}
        </html>
    `;
};