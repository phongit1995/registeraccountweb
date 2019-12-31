let request = require('request-promise');
let fs = require('fs');
let path= require('path');
let common = require('./common');
let usersModels = require('./models');
const cheerio = require('cheerio')
let indexpage = async( req,res)=>{
    if(req.session.image){
        try {
            fs.unlinkSync(path.join(__dirname,'./../public/images/')+req.session.image)
        } catch (error) {
            
        }
    }
    let {image,sessions} = await getInfo();
    req.session.image = image;
    if(req.session.number>5){
        req.session.number=0
    }
    console.log(sessions);
    req.session.mysessions = sessions;
    res.render('index',{image:image,message:req.flash('message'),number:req.session.number});
}
let createaccount = async (req,res)=>{
    if(req.session.image){
        try {
            fs.unlinkSync(path.join(__dirname,'./../public/images/')+req.session.image);
            delete req.session.image ;
        } catch (error) {
            console.log(error);
        }
    }
    let {captcha} = req.body ;
    let session =  req.session.mysessions ;
    console.log(session);
    let resutRegister = await registeraccount(session,captcha);
    if(resutRegister){
        req.flash('message','success');
    }else{
        req.flash('message','error');
    }
    if(req.session.number){
        req.session.number++;
    }
    else {
        req.session.number=1;
    }
    console.log(resutRegister);
    res.redirect('/');
}
module.exports = {
    indexpage,createaccount
}
async function getInfo (){
    let option = {
        url:'https://chimbuom.us/assets/captcha.php',
        qs: { r: '8688' },
        method:'get',
        headers: 
        { 'cache-control': 'no-cache',
          Connection: 'keep-alive',
          'Accept-Encoding': 'gzip, deflate',
          Host: 'chimbuom.us',
          'Postman-Token': '660096e6-fec5-4d00-b412-7711eb7b2e9d,4ab63499-1097-402d-9ad3-8a3433453ab8',
          'Cache-Control': 'no-cache',
          Accept: '*/*',
          'User-Agent': 'PostmanRuntime/7.20.1',
          'Content-Type': 'application/x-www-form-urlencoded' 
        },
        resolveWithFullResponse: true ,
        encoding: 'binary'
    }
    let baseDir = path.join(__dirname,'./../public/images/');
    let dataRes = await request(option);
    let nameFile = `${makeid(5)}.jpeg`;
    let sessions = dataRes.headers['set-cookie'].join(";");
    sessions = common.parseCookie(sessions);
    fs.writeFileSync(baseDir+ nameFile,dataRes.body,'binary');
    return {image:nameFile, sessions:sessions} ;
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
 async function registeraccount(session,captch){
    let username= makeid(6).toLowerCase();
    let password = makeid(6).toLowerCase();
    console.log(username ,captch);
    // let password = 'phongvip';
    let options ={ 
            url: 'https://chimbuom.us/registration.php',
            method: 'POST',
            headers: 
            { 'cache-control': 'no-cache',
            Connection: 'keep-alive',
            Cookie: session.replace(';',''),
            Host: 'chimbuom.us',
            'Cache-Control': 'no-cache',
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded' 
            },
            form: 
            { account: username,
            password: password,
            sex: 'm',
            captcha: captch,
            submit: 'Đăng ký' 
            } };
       
        let result = await request(options);
        console.log(result);
        let $ = cheerio.load(result);
        let ID = $('#container > div.menu > b:nth-child(3)').text();
        let usernameget = $('#container > div.menu > b:nth-child(5)').text();
        let passwordget = $('#container > div.menu > b:nth-child(7)').text();
        console.log(ID ,usernameget,passwordget);
        if(!ID){
            console.log("lỗi");
            return false ;
        }else{
            await usersModels.addNewUser({username:usernameget,password:passwordget,idweb:ID,type:1})
            return true;
        }
}