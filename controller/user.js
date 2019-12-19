const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, password) => {
    // escape 防止 sql 注入
    username = escape(username)
    password = genPassword(password)
    password = escape(password)
    const sql = `SELECT username, realname FROM USERS WHERE username=${username} and password=${password};`

    const rows = await exec(sql)
    return rows[0] || {}
    
}

module.exports = {
    login
}