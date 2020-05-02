const puppeteer = require('puppeteer');
const compiler = require('vue-template-compiler');

const htmlContent = `
  <!doctype html>
  <html>
    <head><meta charset='UTF-8'><title>Test</title></head>
    <body>
    <div v-data="getData()">Test</div>
    
    <script>
        function getData() {
            return {count: 10};
        }
    </script>

    </body>
  </html>
`;

puppeteer.launch({
    headless: false
}).then(async (browser) => {
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    console.log(await page.content());

    // Get the "viewport" of the page, as reported by the page.
  const list = await page.evaluate(() => {

        var ret = [];
        var list = document.querySelectorAll('[v-data]');
        for (var i = 0; i < list.length; i++) {
            var l = list[i];
            if (l.nodeType == Node.ELEMENT_NODE) {
                var value = l.attributes.getNamedItem("v-data").value;
                // l.attributes.removeNamedItem('v-data');
                
                var data;
                try {
                    data = (new Function('return ' + value)).call(window);
                    console.log('Data function', data);
                }
                catch (err) {
                    console.error('Could not execute v-data expression. ', err);
                }

                ret.push([value, l.outerHTML, data]);

            }
        }
        return ret;
  });

  var com = compiler.compile(list[0][1]);
  console.log('com:', com);
  console.log('list:', list);

  await browser.close();

});