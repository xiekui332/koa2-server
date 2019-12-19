const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db.js')


const con = mysql.createConnection(MYSQL_CONF)

// 开始链接
con.connect()

// 统一执行sql语句函数
const exec = (sql) => {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err) {
                reject(err)
                return
            }
    
            resolve(result)
        })
    })
    
    return promise
}

module.exports = {
    exec,
    escape:mysql.escape  
}

