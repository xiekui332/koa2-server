const { exec } = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keywords) => {
     let sql = `select * from blogs where 1=1 `
     if(author) {
        sql += `and author = '${author}' `
     }
     if(keywords) {
        sql += `and keywords like '%${keywords}%' `
     }

     // 列表一般倒序
     sql += `order by createtime desc`

     // 返回的是promise
     return await exec(sql)
}

const getDetail = async (id) => {
    let sql = `select * from blogs where id='${id}'`

    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    let title = xss(blogData.title)
    let content = blogData.content
    let createtime = blogData.createtime
    let author = blogData.author
    let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', '${createtime}', '${author}');`

    const insertData = await exec(sql)
    return {
        id:insertData.insertId
    }
}

const updateBlog = async (blogData = {}) => {
    let id = blogData.id
    let title = blogData.title
    let content = blogData.content
    let sql = `UPDATE blogs SET title='${title}', content='${content}' WHERE id='${id}';`

    const updateData = await exec(sql)

    if(updateData.affectedRows > 0) {
        return true
    }
    return false
}

const delBlog = async (id, delData = {}) => {
    const author = delData.author
    let sql = `DELETE FROM blogs WHERE id='${id}' and author='${author}';`

    const deleData = exec(sql)
    
    if(deleData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}