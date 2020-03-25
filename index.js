const path = require('path');
const fs = require('fs');
const qrcodePath = path.resolve('./qrcode/ct-20200325-10000-02');

const decodeImage = require('jimp').read;
const qrcodeReader = require('qrcode-reader');

function qrDecode(data){
    const checkdata = data.split('/');
    let val = checkdata[checkdata.length - 1];
    val = val.split('.')[0].split('-')[0];
    return new Promise((resolve, rej) => {
        decodeImage(data, function(err,image){
            if(err){
                rej('失败');
                return;
            }
            let decodeQR = new qrcodeReader();
            decodeQR.callback = function(errorWhenDecodeQR, result) {
                if (errorWhenDecodeQR) {
                    rej(data + '识别出错');
                    return;
                }
                if (!result){
                    rej(data + '内容不可识别！');
                    return;
                }else{
                    let res = result.result.split('=')[1]
                    if ( res !== val ) {
                        rej('识别结果与文件不匹配！')
                    } else {
                        console.log('success', val);
                        resolve()
                    }
                }
            };
            decodeQR.decode(image.bitmap);
        });
    })
    
}

fs.readdir(qrcodePath, async function(err, files){
    for (let index = 0; index < files.length; index++) {
        const element = files[index];
        try {
            await qrDecode((
                qrcodePath + '/' + element
            ));
        } catch (error) {
            console.log(error)
        }
    }
    console.log('数据检查结束！！！')
});



