const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// 日志操作
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

// 先引入 session 下面进行链接
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('./conf/db')

const index = require('./routes/index')
const users = require('./routes/users')

const blog = require('./routes/blog')
const user = require('./routes/user')

// error handler
onerror(app)


// middlewares  处理 post 数据
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())

// 日志有关
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger 分析请求耗时
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// 记录日志
const ENV = process.env.NODE_ENv
if(ENV !== "production") {
	app.use(morgan('dev'))
}else{
	const logFileName = path.join(__dirname, 'logs', 'access.log')
	const writeStream = fs.createWriteStream(logFileName, {
		flags: 'a'
	})

	app.use(morgan('combined', {
		stream: writeStream
	}))
}

// 链接 redis 并存储
app.keys = ['Wsecret123#_']
app.use(session({
	// 配置cookie
	cookie:{
		path:'/',
		httpOnly:true,
		maxAge:24 * 60 * 60 * 1000
	},

	// 配置redis
	store:redisStore({
		all:`${REDIS_CONF.host}:${REDIS_CONF.port}`		// 配置应置于配置文件中
	})
}))

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
