let request = require('request-promise');
let fs = require('fs');
let path= require('path');
let indexpage = async( req,res)=>{
    if(req.session.image){
        try {
            fs.unlinkSync(path.join(__dirname,'./../public/images/')+req.session.image)
        } catch (error) {
            
        }
       
    }
    let {image,cookie} = await getInfo();
    console.log(image ,cookie); 
    req.session.mysession = cookie ;
    req.session.image = image;

    res.render('index',{image:image});
}
let createaccount = async (req,res)=>{
    if(req.session.image){
        try {
            fs.unlinkSync(path.join(__dirname,'./../public/images/')+req.session.image);
        } catch (error) {
            
        }
    }
    console.log(req.body);
}
module.exports = {
    indexpage,createaccount
}
async function getInfo (){
    let option = {
        url:'https://chimbuom.us/assets/captcha.php?r=2548',
        method:'get',
        resolveWithFullResponse: true,
        encoding: 'binary'
    }
    let baseDir = path.join(__dirname,'./../public/images/');
    let dataRes = await request(option);
    let result = {};
    result.cookie = dataRes.headers['set-cookie'];
    let nameFile = `${makeid(5)}.jpeg`;
    fs.writeFileSync(baseDir+ nameFile,dataRes.body,'binary');
    result.image = nameFile;
    return result ;
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