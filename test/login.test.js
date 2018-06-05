describe('反馈处理', () => {
  let page = null
  beforeAll(async () => {
    page = await browser.newPage()
    await page.goto(BASE_URL)
  })

  it('登录Dashboard', async () => {
    await page.click('#username')
    await page.type('#username', '15989211215')
    await page.click('#password')
    await page.type('#password', '123456')
    await page.click('div button')
    await page.waitFor(3000)
  })
})
