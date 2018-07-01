const puppeteer = require('puppeteer');
let browser, page;

beforeEach( async ()=>{
    let browser = await puppeteer.launch({
        headless: false
    });
    let page = await browser.newPage();
    await page.goto("localhost:3000");
});

afterEach( async()=> {
    await browser.close();
});

test('header has correct text', async ()=> {
      

        const text = await page.$eval('a.brand-logo', el=> el.innerHTML);

        expect(text).toEqual('Blogster');
});

test("clicking log in start oauth flow", async()=>{
    await page.click('.right a');

    const url = await page.url();
    
    expect(url).toMatch(/accounts\.google\.com/)
})

test("when signed in, shows logout button", async()=>{
    const id="5b2bfc6f9340a20518553fd2";
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {user:id}
    };
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const Keygrip = require('keygrip');
    const keys = require("../config/keys")
    const keygrip = new Keygrip([keys.cookieKey])
    const sig = keygrip.sign("session=" + sessionString);

    await page.setCookie({name:'session', value: sessionString})
})