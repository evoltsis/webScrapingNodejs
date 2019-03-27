
// Web scraping in Node using puppeteer
const puppeteer = require('puppeteer');


(async function main(){
    try{

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36');

        await page.goto('https://edition.cnn.com/europe');
        //get all Europe CNN news
        await page.waitForSelector('section.zn.zn-europe-zone-2.zn-balanced.zn--idx-1.zn--ordinary.t-light.zn-has-one-container');
        const section = await page.$('section.zn.zn-europe-zone-2.zn-balanced.zn--idx-1.zn--ordinary.t-light.zn-has-one-container');
        const europeNews = await section.$$('div[data-analytics="Europe_grid-small_article_"]');
        
        for(let i = 0; i< europeNews.length; i++){
            //everytime return back to Europe news
            await page.goto('https://edition.cnn.com/europe');
            await page.waitForSelector('section.zn.zn-europe-zone-2.zn-balanced.zn--idx-1.zn--ordinary.t-light.zn-has-one-container');
            const section = await page.$('section.zn.zn-europe-zone-2.zn-balanced.zn--idx-1.zn--ordinary.t-light.zn-has-one-container');
            const europeNews = await section.$$('div[data-analytics="Europe_grid-small_article_"]');

            const news = europeNews[i];
            const button = await news.$('img.media__image.media__image--responsive');
            //click and go to the article page
            button.click(); 
           
            var success = true;
            //chech if it is an article with an author
            await page.waitForSelector('span.metadata__byline__author',{ timeout: 3000 }).then(() => {
                    //'SUCCESS'              
                }).catch(e => {
                    //'FAIL'
                    success = false;
                });

             if(success){

                const titleElement =  await page.$('h1.pg-headline');
                const authorElement =  await page.$('span.metadata__byline__author');
                const dateElement =  await page.$('p.update-time');
                //get title, author, upload date
                const title = await page.evaluate(titleElement => titleElement.innerText,titleElement);
                const author = await page.evaluate(authorElement => authorElement.innerText,authorElement);
                const date = await page.evaluate(dateElement => dateElement.innerText,dateElement);
                
                console.log(i+")\n"+"Title: "+title+"\nAuthor: "+author+"\nDate: "+ date);
                
             }
               
           
            
            
        }
        
    }catch(e){
        console.log("my error",e);
    }
    
})();
