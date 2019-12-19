class BaseModel {
    constructor(data, message) {
        if(typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }

        if(data) {
            this.data = data
        }

        if(message) {
            this.message = message
        }

    }
}

class SuccessModel extends BaseModel {     // extends继承父类
    constructor(data, message) {
        super(data, message)                // 执行父类的constructor
        this.errno = 0
    }
}

class ErrorModel extends BaseModel {     // extends继承父类
    constructor(data, message) {
        super(data, message)              // 执行父类的constructor
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}