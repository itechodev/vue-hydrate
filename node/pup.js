const puppeteer = require('puppeteer');

puppeteer.launch({
    headless: true
}).then(async (browser) => {
    const page = await browser.newPage();
    
    var ret = new Promise(async (res, rej) => {
        // Expose a handler to the page
        var timer = null;
        await page.exposeFunction('renderEvent', (id, content) => {
            console.log(`Event fired: ${id}, htmlContent: ${content}`);
            // cancel the timer
            clearTimeout(timer);
            res({id, content});
        });

        timer = setTimeout(() => {
            console.log('Timer done');
            rej();
        }, 2000);
        await page.goto('http://localhost:8080');
    });

    var res = await ret;
    console.log('Result', res);
    await browser.close();
    
    // await page.setContent(htmlContent);
    
    // console.log(await page.content());


    // Get the "viewport" of the page, as reported by the page.
    //     const list = await page.evaluate(() => {

    //         var ret = [];
    //         var list = document.querySelectorAll('[v-data]');
    //         for (var i = 0; i < list.length; i++) {
    //             var l = list[i];
    //             if (l.nodeType == Node.ELEMENT_NODE) {
    //                 var value = l.attributes.getNamedItem("v-data").value;
    //                 // l.attributes.removeNamedItem('v-data');

    //                 var data;
    //                 try {
    //                     data = (new Function('return ' + value)).call(window);
    //                     console.log('Data function', data);
    //                 }
    //                 catch (err) {
    //                     console.error('Could not execute v-data expression. ', err);
    //                 }

    //                 ret.push([value, l.outerHTML, data]);

    //             }
    //         }
    //         return ret;
    //   });

    //   var com = compiler.compile(list[0][1]);
    //   console.log('com:', com);
    //   console.log('list:', list);


    
    
});