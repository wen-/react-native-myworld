import React, { Component } from 'react';
import {
    View,
    AppState,
    Linking,
    NativeModules,
    NetInfo,
    Image,Text,
    Platform, StyleSheet, Dimensions,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Swiper from 'react-native-swiper';
import UmengPush from 'react-native-umeng-push';
const { width, height } = Dimensions.get('window');
var SplashScreen = NativeModules.SplashScreen;

//获取DeviceToken
UmengPush.getDeviceToken(deviceToken => {
    console.log("deviceToken: ", deviceToken);
    if(deviceToken){
        global.deviceToken = deviceToken;
        //保存推送设备号(deviceToken);
    }
});

//接收到推送消息回调
UmengPush.didReceiveMessage(message => {
    console.log("didReceiveMessage:", message);
    let newMessage = {};
    if (Platform.OS == 'ios') {
        newMessage.title = (message.aps&&message.aps.alert&&message.aps.alert.title)||"";
        newMessage.msg = (message.aps&&message.aps.alert&&message.aps.alert.body)||"";
        newMessage.msg_id = message.d||"";
        newMessage.ext = JSON.parse(message.ext)||"";
    }else{
        try{
            message.body = JSON.parse(message.body);
            newMessage.title = (message.body&&message.body.title)||"";
            newMessage.msg = (message.body&&message.body.text)||"";
            newMessage.msg_id = message.msg_id||"";
            let extra = JSON.parse(message.extra);
            if(extra.ext){
                newMessage.ext = extra.ext;
            }else{
                newMessage.ext = extra;
            }
        }catch(err){
            console.log(err);
        }
    }
});

//点击推送消息打开应用回调
UmengPush.didOpenMessage(message => {
    console.log("didOpenMessage:", message);
    if (Platform.OS == 'android') {
        try{
            let extra = JSON.parse(message.extra);
            if(extra.ext){
                message.ext = extra.ext;
            }else{
                message.ext = message.extra;
            }
        }catch(err){
            console.log("解释二级JSON出错:",err);
            return;
        }
    }else{
        message.ext = message.ext?message.ext:JSON.stringify(message);
    };
    console.log("message.ext:", message.ext);
    if(message.ext){
        try{
            let ext = JSON.parse(message.ext);
            if(ext.类型 == "页面" && ext.地址){
                Actions.通用页({path: ext.地址,标题:ext.标题});
            }else if(ext.类型 == "外部地址" && ext.地址){
                //调用系统浏览器打开外部地址
                Linking.canOpenURL(ext.地址).then(supported => {
                    if (!supported) {
                        console.log('不能打开外部地址' + ext.地址);
                    } else {
                        return Linking.openURL(ext.地址);
                    }
                }).catch(function(err){
                    console.error('打开外部地址出错了', err);
                });
            }
        }catch(err){
            console.log(err);
        }
    }

});

class SplashPage extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            index:0,
            over:false,
            showsPagination:true,
        }
    }

    componentWillMount(){
        // storage.load({
        //     key: 'showSplash',
        // }).then(ret => {
        //     if(!ret){
        //         SplashScreen.hide();
        //         Actions.主界面();
        //     }
        // }).catch(err => {
        //     SplashScreen.hide();
        //     storage.save({
        //         key: 'showSplash',
        //         data: false
        //     });
        // });
        SplashScreen.hide();
    }

    componentDidMount(){
        //SplashScreen.hide();
        AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'active') {
            //应用从后台回到前台要做的事情
        }
    };

    render() {
        return (
            <Swiper ref={"轮播组件"}
                showsPagination={this.state.showsPagination}
                     dot={<View style={{backgroundColor: 'rgba(255,255,255,.3)', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                     activeDot={<View style={{backgroundColor: '#fff', width: 30, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
                     paginationStyle={{
                         bottom: 50
                     }}
                    loop={false}
                    onMomentumScrollEnd = {(e,s,c)=>{
                        this.state.index = s.index;
                        if(this.state.index == 2){
                            this.setState({showsPagination : false});
                        }else{
                            this.setState({showsPagination : true});
                        }
                        console.log("onMomentumScrollEnd");
                    }}
                    onTouchStartCapture = {(e,s,c)=>{
                        this.state.index = s && s.index;
                        console.log("onTouchStartCapture");
                    }}
                    onTouchStart = {(e,s,c)=>{
                        console.log("onTouchStart",s);
                        this.state.over = true;
                    }}
                    onTouchEnd = {(e,s,c)=>{
                        console.log("onTouchEnd:",s);
                        if(this.state.index == 2 && this.state.over){
                            Actions.主界面();
                        }
                    }}>
                <View style={splash.slide}>
                    <Image
                        style={splash.image}
                        source={require('../assets/images/banner1.jpg')}
                    />
                </View>
                <View style={splash.slide}>
                    <Image
                        style={splash.image}
                        source={require('../assets/images/banner2.jpg')}
                    />
                </View>
                <View style={splash.slide}>
                    <Image
                        style={splash.image}
                        source={require('../assets/images/banner3.jpg')}
                    />
                    <Text style={splash.in}>进入</Text>
                </View>
            </Swiper>
        );
    }

}

const splash = StyleSheet.create({
    container: {

    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    image: {
        width,
        height,
    },
    in:{
        position:"absolute",
        bottom:40,
        paddingLeft:40,
        paddingRight:40,
        paddingBottom:10,
        paddingTop:10,
        backgroundColor:"#fff",
        color:"#333",
        borderRadius:40,
    }
});

export default SplashPage;
