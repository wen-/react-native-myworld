import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Linking,
    TouchableOpacity,
    ScrollView,
    Modal,
    Platform
} from 'react-native'
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Entypo';
import {接口配置} from '../request/domain';
import {checkUpdate} from "../request/checkUpdate";
import {c_download_file, c_openfile} from "../utils/common";
import {模态框样式} from "../styles";

import Spinkit from 'react-native-spinkit';

var styles = {
    container: {
        flex: 1
    },
    wrapper: {
        height:200,
        backgroundColor:"red",
    },
    slide: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#000',
        fontSize: 30,
        fontWeight: 'bold'
    },
    loadingView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,.5)'
    },

    loadingImage: {
        width: 60,
        height: 60
    }
}

export default class extends Component {
    constructor(props) {
        super(props);
        this.state={
            模态框配置:{
                显示:false,
                文本:"test",
                按钮配置:[{"文字":"取消","事件":"隐藏模态框"},{"文字":"确定","事件":"隐藏模态框"}],
            },
            更新内容:{},
            实现功能:[
                ["检测网络状态","剪贴板"],
                ["地理位置","分享"]
            ]
        };
        this.loadHandle = this.loadHandle.bind(this)
    }
    componentDidMount(){
        this.check();
    }
    jump = (link)=>{
        //调用系统浏览器打开外部地址
        Linking.canOpenURL(link).then(supported => {
            if (!supported) {
                console.log('不能打开外部地址:' + link);
            } else {
                return Linking.openURL(link);
            }
        }).catch(function(err){
            console.error('打开外部地址出错了:', err);
        });
    };

    loadHandle (i) {
        let loadQueue = this.state.loadQueue
        loadQueue[i] = 1
        this.setState({
            loadQueue
        })
    }

    check(){
        let _模态框配置 = this.state.模态框配置;
        _模态框配置.文本 = "正在检查更新...";
        _模态框配置.按钮配置 = null;
        this.state.模态框配置 = _模态框配置;
        this.显示模态框(2000);

        checkUpdate(function (res) {
            console.log("检查更新返回：",res);
            if(res){
                let _模态框配置 = this.state.模态框配置;
                _模态框配置.显示 = true;
                _模态框配置.文本 = "发现新版本：\\n"+ res.更新内容;
                if(res.强制更新 == "是"){
                    _模态框配置.按钮配置 = [{"文字":"立即更新","事件":"立即更新","参数":res.地址}];
                }else{
                    _模态框配置.按钮配置 = [{"文字":"下次再说","事件":"隐藏模态框"},{"文字":"立即更新","事件":"立即更新","参数":res.地址}];
                }
                this.自动隐藏模态框 &&　clearTimeout(this.自动隐藏模态框);
                this.setState({模态框配置:_模态框配置,更新内容:res});
            }
        }.bind(this));
    }

    立即更新(url){
        if(Platform.OS == "ios"){
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('不能打开更新链接' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(function(err){
                console.error('打开更新链接出错了', err);
            });
        }else{
            let _模态框配置 = this.state.模态框配置;
            _模态框配置.文本 = "正在下载...";
            _模态框配置.按钮配置 = null;
            this.state.模态框配置 = _模态框配置;
            this.显示模态框(2000);
            c_download_file(url,function (path,mime) {
                c_openfile(path,mime);
            });
        }
    }

    显示模态框(showtime){
        let _模态框配置 = this.state.模态框配置;
        _模态框配置.显示 = true;
        this.setState({模态框配置:_模态框配置});
        if(showtime && parseInt(showtime) > 0){
            this.自动隐藏模态框 = setTimeout(function () {
                let _模态框配置 = this.state.模态框配置;
                _模态框配置.显示 = false;
                this.setState({模态框配置:_模态框配置});
            }.bind(this),showtime);
        }
    }
    隐藏模态框(){
        this.自动隐藏模态框 &&　clearTimeout(this.自动隐藏模态框);
        if(this.state.更新内容.强制更新 && this.state.更新内容.强制更新 == "是"){
            return;
        }
        let _模态框配置 = this.state.模态框配置;
        _模态框配置.显示 = false;
        this.setState({模态框配置:_模态框配置});
    }
    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    <View>
                        <Text>我的世界</Text>
                    </View>
                </ScrollView>

                <View>
                    <Modal visible={this.state.模态框配置.显示}
                           animationType={'fade'}
                           transparent = {true}
                           onRequestClose={()=> this.隐藏模态框()} >
                        <View style={模态框样式.背景色}>
                            <View style={模态框样式.主体}>
                                <View style={模态框样式.文本框}>
                                    {
                                        this.state.模态框配置.文本.split('\\n').map((item, i)=>{
                                            let marginT = i==1?{marginTop:10}:{};
                                            return(
                                                <Text style={[模态框样式.文本内容,marginT]} key={i}>{item}</Text>
                                            )
                                        })
                                    }
                                </View>

                                {
                                    this.state.模态框配置.按钮配置?
                                        <View style={模态框样式.底部}>
                                            {
                                                this.state.模态框配置.按钮配置.map((item, i) => {
                                                    let s = i>0?{borderLeftWidth:.5,borderColor:"#e5e5e5"}:{};
                                                    return (
                                                        <TouchableOpacity
                                                            style={[模态框样式.按钮,s]}
                                                            underlayColor="#aaa"
                                                            onPress={()=>{this[item.事件](item.参数)}}
                                                            key={i}>
                                                            <Text style={{color:'#555'}}>{item.文字}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>:null
                                }

                            </View>
                        </View>
                    </Modal>
                </View>

            </View>
        )
    }
}
