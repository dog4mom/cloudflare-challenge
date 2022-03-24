const express = require('express')
const puppeteer = require('puppeteer-extra')
const bodyParser = require('body-parser')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')

puppeteer.use(StealthPlugin())
puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 3000

app.get('/',async (req, res) => {
    try {
        const {url}  = req.query
        console.log(url)
        const cookies = await getCookie(url)
        let cookie = ""
        cookies.forEach(value => {
            cookie += value.name+"="+value.value+"; "
        });
        console.log(cookie)
        return res.json({"cookie":cookie})
    } catch (e) {
        return res.json({"message":e})
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const getCookie = async (url) => {
    try {
        const browser = await puppeteer.launch({ headless: false ,args: ['--no-sandbox'],})
            const page = await browser.newPage()
            await page.setViewport({ width: 800, height: 600 })
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36')
            await page.goto(url)
            await page.waitForTimeout(6000)
            let cookies = await page.cookies()
            await browser.close()
            return Promise.resolve(cookies)
    } catch (e) {
        return Promise.reject(e)
    }
}