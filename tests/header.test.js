

const Page = require("./helpers/page");
let page;

beforeEach( async ()=>{
  
    page = await Page.build();
    await page.goto("localhost:3000");
});

afterEach( async()=> {
    await page.close();
});

test('header has correct text', async ()=> {
      
        const text = await page.getContentsof('a.brand-logo')

        expect(text).toEqual('Blogster');
});

test("clicking log in start oauth flow", async()=>{
    await page.click('.right a');

    const url = await page.url();
    
    expect(url).toMatch(/accounts\.google\.com/)
})

test("when signed in, shows logout button", async()=>{
   
    await page.login();
    const text = await page.$eval('a[href="auth/logout"]', el => el.innerHTML);
    
    expect(text).toEqual('logout');
})