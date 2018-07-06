import {
    Platform,
} from 'react-native';
import * as DeviceInfo from 'react-native-device-info';
import {接口配置} from "./domain";
import {c_fetch} from "../utils/common";

const checkUpdate = function (fn) {
    let url = global.配置.域名 + 接口配置.update;
    c_fetch(url,{
        method:"GET",
        success: function (json) {
            console.log(json);
            let data;
            try{
                data = json && JSON.parse(json.data);
            }catch(err){
                console.log(err);
                return fn(null);
            }
            let buildVersion = DeviceInfo.getBuildNumber();
            let 版本 = 0;
            if(Platform.OS == "ios"){
                版本 = data.iOS && data.iOS.版本;
                if(buildVersion < 版本){
                    fn(data.iOS);
                }else{
                    fn(null);
                }
            }else{
                版本 = data.android  && data.android.版本;
                if(buildVersion < 版本){
                    fn(data.android);
                }else{
                    fn(null);
                }
            }
        },
        error:function (e) {
            console.log(e);
            fn(null);
        }
    });
}

export {checkUpdate}