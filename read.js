let request = require('request-promise');
let fs = require('fs');
let option ={
    url:'https://chimbuom.us/assets/captcha.php?r=2548',
    method:'get',
    resolveWithFullResponse: true,
    encoding: 'binary'
}
request(option).then(res=>{
    console.log(res.headers['set-cookie']);
    fs.writeFileSync(`${makeid(4)}.jpeg`,res.body,'binary');
})
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}