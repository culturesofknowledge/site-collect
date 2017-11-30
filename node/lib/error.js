function EmloError(msg){
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);

    this.message = msg;

    console.error( this.stack );
}

module.exports = EmloError;