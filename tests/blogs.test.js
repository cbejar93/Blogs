const Page = require("./helpers/page");

let page; 

beforeEach(async ()=> {
    page = await Page.build();
    await page.goto("localhost:3000");
});

afterEach(async() => {
    await page.close();
});



describe("when logged in", async () =>{

    beforeEach(async()=>{
        await page.login();
        await page.click("a.btn-floating");
    });

    test("can see form creation page", async()=> {
      
        const label = page.getContentsof("form label");
    
        expect(label).toEqual("Blog Title");
    });

    describe("when using valid inputs", async()=> {
        
        beforeEach(async()=>{
            await page.type(".title input", "my title");
            await page.type(".content input", "my content");
            await page.click("form button");
        })

        test("submitting takes user to review screen", async()=>{
            const text = await page.getContentsof("h5");
            expect(text).toEqual('Please confirm your enteries');
        })

        test("when submitting take it to blogs page", async()=>{
                await page.click("button.green");

                await page.waitFor("card");
                const title = await page.getContentsof('.card-title');

                expect(title).toEqual("my title");
        })
    })

    describe("when logged in and using invalid inputs", async()=>{
       beforeEach(async()=>{
           await page.click("form button");
       })
        test("form shows an error message", async()=> {
            const titleError = await page.getContentsof(".title .red-text");
            const conentError = await page.getContentsof(".content .red-text");

            expect(titleError).toEqual("You most provide a value");
            expect(conentError).toEqual("You most provide a value");
        })
    })

})

describe("when user is not signed in", async()=>{
    test('User cannot create blogpost', async()=>{
       const result = await page.evaluate(()=>{
            fetch('api/blogs',{
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: 'my title', content: 'my content'})
            }).then(res=> res.json());
        }

        )
    })
})