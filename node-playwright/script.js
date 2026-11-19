require('dotenv').config()
const fs=require('fs')
const PASS=process.env.PASS
const EMAIL=process.env.EMAIL
const POST=require("./post.json")
const i=0;
const TYPE=POST[i].type
const TITLE=POST[i].title
const CONTENT=POST[i].content
const AUTH='./.auth'
const { chromium } = require('playwright');
const LoginPage='https://ruik.xin/login?redirect=%2F';
const IndexPage="https://ruik.xin/"
const NewPage="https://ruik.xin/forum/new"

async function login(context) {
  const page = await context.newPage();
  await page.goto(LoginPage);
	await page.getByLabel("邮箱").fill(EMAIL)
	await page.getByLabel("密码").fill(PASS)
	await page.getByRole("button",{name: "登 录"}).click()
	await page.getByRole("link",{name:'登录'}).waitFor({timeout:8000})
	await context.storageState({path: AUTH})
	return page
}

console.log("--------------------------------")
console.log("---------自动化发帖脚本---------")
console.log("--------------------------------");

(async ()=>{
	browser = await chromium.launch({headless: true,slowMo: 1000});
	const context= await browser.newContext( fs.existsSync(AUTH)? {storageState : AUTH} : {})
	let page=await context.newPage()
	await page.goto(IndexPage,{waitUntil: "networkidle"})
	const NotLoggedIn = await  page.getByRole("link",{name:'登录'}).first()
				.waitFor({timeout: 2000})
				.then(()=>true)
				.catch(()=>false)
	if(NotLoggedIn){
		console.log("登录已失效，正在重新登录")
		await login(context)
	}
	console.log("登录成功")

	//发帖
	await page.goto(NewPage)
	console.log("跳转到发帖页面\n......")
	const board= page.locator('label').filter({hasText:TYPE})
	await board.click()
	console.log("发帖类型为 "+TYPE )
	await page.getByRole("textbox",{name: "标题"}).fill(TITLE)
	console.log("---------------标题---------------")
	console.log(TITLE)
	await page.getByRole("textbox",{name: "正文"}).fill(CONTENT)
	console.log("---------------正文---------------")
	console.log(CONTENT)
	await page.getByRole("button",{name: "发 布"}).click()
	console.log("发送成功✌️")
	await browser.close()
})()
//<input autocomplete="username" inputmode="email" id="email" aria-required="true" class="ant-input ant-input-lg css-oc1rc0 ant-input-outlined css-var-_r_0_ ant-input-css-var" type="text" value="">
//<input autocomplete="current-password" id="password" aria-required="true" class="ant-input ant-input-lg css-oc1rc0" type="password">
//https://ruik.xin/
//<h2 id="daily-checkin-title" class="_title_yjfdu_19">每日签到</h2>
//<label class="_board_jehng_11 _boardActive_jehng_34"><input class="_radio_jehng_41" type="radio" value="chat" name="board"><span class="_boardName_jehng_52"><span class="_dot_jehng_61" style="background: rgb(138, 99, 196);"></span>灌水</span><span class="_boardHint_jehng_67">生活里的趣事</span></label>
