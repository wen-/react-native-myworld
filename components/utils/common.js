import {
    PermissionsAndroid
} from 'react-native';
import CryptoJS from 'crypto-js/core';
import AES from 'crypto-js/aes';
import RNFetchBlob from 'rn-fetch-blob'

const c_aes = function (type,data) {
    let key = global.配置.AES_KEY;
    let iv = key.substring(0,16);
    let aes_data = "";
    key = CryptoJS.enc.Utf8.parse(key);
    iv = CryptoJS.enc.Utf8.parse(iv);
    if(type == "加密"){
        aes_data = AES.encrypt(data,key,{"iv":iv,"mode": CryptoJS.mode.CBC,"padding":CryptoJS.pad.Pkcs7});
        aes_data = aes_data.toString();
    }else{
        aes_data = AES.decrypt(data,key,{"iv":iv,"mode": CryptoJS.mode.CBC,"padding":CryptoJS.pad.Pkcs7});
        aes_data = aes_data.toString(CryptoJS.enc.Utf8);
    }
    return aes_data;
}

const c_fetch = function (url,{body="",success=function () {},error=function () {},method="POST"}={}) {
    let c = {};
    if(method=="POST"){
        try{
            if(body && body.data){
                body.data = c_aes("加密",body.data);
            }
            body = body?JSON.stringify(body):'';
        }catch (e) {
            console.log("参数错误");
        }
        c = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json', //参数形式为：'{"a":1,"b":2}'，服务端（php）通过file_get_contents('php://input')
                //'Content-Type': 'application/x-www-form-urlencoded',  //参数形式为：a=1&b=2，服务端（php）可以通过get或post获取
            },
            body:body,
        }
    }else{
        if(body){
            if(url.include("?")){
                url = url + "&" + body;
            }else{
                url = url + "?" + body;
            }
        }
    }
    return fetch(url, c).then(function(response){
        return response.json();
    }).then((responseJson) => {
        if(responseJson && responseJson.data){
            responseJson.data = c_aes("解密",responseJson.data);
        }
        success(responseJson)
    }).catch((err) => {
        error(err)
    });
}

async function requestStoragePermission(fun) {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
            console.log("许可授予");
            fun();
        } else {
            console.log("没有权限；拒绝访问");
        }
    } catch (err) {
        console.warn(err);
    }
}



const c_download_file = function(url,callback){
    let file_name_all = url.slice(url.lastIndexOf("\/")+1);
    if(!file_name_all){
        return callback(null);
    }
    let file_name_array = file_name_all.split(".");
    let file_name = file_name_array[0];
    let file_ext = getMimeType(file_name_array[1]);
    let dirs = RNFetchBlob.fs.dirs;
    let date = new Date();
    let ran = date.getFullYear()+(date.getMonth()+1)+date.getDate()+date.getHours()+date.getMinutes()+date.getSeconds();
    let filePath = `${dirs.DownloadDir}/${file_name}${ran}.${file_ext}`
    requestStoragePermission(()=>{
        RNFetchBlob.config({
            addAndroidDownloads : {
                useDownloadManager : true,
                title :file_name_all,
                description : '安装应用',
                mime : file_ext,
                path: RNFetchBlob.fs.dirs.DownloadDir,
                mediaScannable : true,
                notification : true,
            }
        }).fetch('GET', url,{
            'Cache-Control': 'no-store'
        }).then((resp) => {
            // the path of downloaded file
            callback(resp.path(),file_ext);
        });
    });

}

const c_openfile = function(path, mime) {
    RNFetchBlob.android.actionViewIntent(path, mime);
}

const getMimeType = function(type) {
    switch (type) {
        case "doc" :
            return "application/msword";
        case "docx" :
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        case "ppt":
            return "application/vnd.ms-powerpoint";
        case "pptx":
            return "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        case "xls" :
            return "application/vnd.ms-excel";
        case "xlsx" :
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        case "pdf" :
            return "application/pdf";
        case "png" :
            return "image/png";
        case "bmp" :
            return "application/x-MS-bmp";
        case "gif" :
            return "image/gif";
        case "jpg" :
            return "image/jpeg";
        case "jpeg" :
            return "image/jpeg";
        case "avi" :
            return "video/x-msvideo";
        case "aac" :
            return "audio/x-aac";
        case "mp3" :
            return "audio/mpeg";
        case "mp4" :
            return "video/mp4";
        case "apk" :
            return "application/vnd.android.package-archive";
        case "txt" :
        case "log" :
        case "h" :
        case "cpp" :
        case "js" :
        case "html" :
            return "text/plain";
        default:
            return "*/*";
    }
}

export {c_aes,c_fetch,c_download_file,getMimeType,c_openfile};