const router = require('koa-router')()

router.prefix('/api/blog')

const { 
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', async (ctx, next) => {
    let author = ctx.query.author || ""
    const keyword = ctx.query.keyword || ""

    if(ctx.query.isadmin) {
        console.log('is admin')

        if(ctx.session.username === null) {
            console.error('is admin but no login')
            ctx.body = new ErrorModel('未登录')
            return
        }

        author = ctx.session.username
    }

    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)
})

router.get('/detail', async (ctx, next) => {
    let id = ctx.query.id
    const data = await getDetail(id)
    ctx.body = new SuccessModel(data)
})


router.post('/new', loginCheck, async (ctx, next) => {
    let body = ctx.request.body
    body.author = ctx.session.username
    const data = await newBlog(body)
    ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx, next) => {
    let val = await updateBlog(ctx.query.id, ctx.request.body)

    if(val) {
        ctx.body = new SuccessModel()
    }else{
        ctx.body = new ErrorModel('更新失败')
    }
})

router.post('/del', loginCheck, async (ctx, next) => {
    const author = ctx.session.username
    let id = ctx.query.id
    const result = await delBlog(id, author)
    if(result) {
        ctx.body = new SuccessModel()
    }else{
        ctx.body = new ErrorModel('删除失败')
    }
})

module.exports = router