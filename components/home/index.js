import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    Linking,
    TouchableOpacity,
    Modal,
    Platform,
    RefreshControl,
    ActivityIndicator,
    DeviceEventEmitter
} from 'react-native'
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/Entypo';
import {接口配置} from '../request/domain';
import {checkUpdate} from "../request/checkUpdate";
import {c_download_file, c_openfile} from "../utils/common";
import {模态框样式} from "../styles";

import Timeline from 'react-native-timeline-listview'
import {CustomModal} from '../utils/customModal'
import {Realm,m_getNote} from '../model/'

import Spinkit from 'react-native-spinkit';

var styles = {
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight:10,
        backgroundColor:'#efefef'
    },
    list: {
        flex: 1,
    },
    title:{
        color:"#000",
        fontSize:14,
        marginLeft: 10,
    },
    descriptionContainer:{
        flexDirection: 'row',
        paddingRight: 30
    },
    image:{
        width: 50,
        height: 50,
        borderRadius: 25
    },
    textDescription: {
        marginLeft: 10,
        color: 'gray'
    }
}

export default class extends Component {
    constructor(props) {
        super(props);

        this.renderTime = this.renderTime.bind(this)
        this.renderCircle = this.renderCircle.bind(this)
        this.renderDetail = this.renderDetail.bind(this)
        this.onEventPress = this.onEventPress.bind(this)
        this.onEndReached = this.onEndReached.bind(this)
        this.renderFooter = this.renderFooter.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.滚动事件 = this.滚动事件.bind(this)
        this.data = [
            {time: '2018-07-08', title: '欢迎来到我的世界', description: '这一年的这一天你来到的我的世界.'},
        ]

        this.state={
            模态框配置:{
                显示:false,
                文本:"test",
                按钮配置:[{"文字":"取消","事件":"隐藏模态框"},{"文字":"确定","事件":"隐藏模态框"}],
            },
            更新内容:{},

            isRefreshing: false,
            waiting: false,
            data: this.data
        };

    }
    componentDidMount(){
        this.check();
        this.onEndReached();
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
                    _模态框配置.按钮配置 = [{"文字":"立即更新","事件":this.立即更新.bind(this),"参数":res.地址}];
                }else{
                    _模态框配置.按钮配置 = [{"文字":"下次再说","事件":this.隐藏模态框.bind(this)},{"文字":"立即更新","事件":this.立即更新.bind(this),"参数":res.地址}];
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

    onRefresh(){
        this.setState({isRefreshing: true});
        //refresh to initial data
        setTimeout(() => {
            //refresh to initial data
            this.setState({
                data: this.data,
                isRefreshing: false
            });
        }, 2000);
    }

    onEndReached() {
        if (!this.state.waiting) {
            this.setState({waiting: true});

            //fetch and concat data
            m_getNote("note","",function (data) {
                this.setState({
                    waiting: false,
                    data: data,
                });
            });
            // setTimeout(() => {
            //
            //     //refresh to initial data
            //     var data = this.state.data.concat(
            //         [
            //             {time: '2018-07-08', title: '第一次记录', description: '记录生活中的点点滴滴！'}
            //         ]
            //     )
            //
            //     this.setState({
            //         waiting: false,
            //         data: data,
            //     });
            // }, 2000);
        }
    }

    renderFooter() {
        if (this.state.waiting) {
            return <ActivityIndicator />;
        } else {
            return <Text>~</Text>;
        }
    }

    onEventPress(data){
        console.log("data:",data);
    }

    renderTime(rowData, sectionID, rowID){
        return(
            <View style={{marginTop:20}}>
                <Text style={{fontSize:8,textAlign: 'center', backgroundColor:'#cccccc', color:'white', padding:5, borderRadius:10}}>{rowData.time}</Text>
            </View>
        )
    }

    renderCircle(rowData, sectionID, rowID){
        console.log("rowData:",rowData);
        return(
            <View style={{width:12,height:12,borderRadius:10,position:"absolute",left:60,marginTop:24,backgroundColor:"#b57830",justifyContent:"center",alignItems:"center"}}>
                <View style={{width:6,height:6,borderRadius:10,backgroundColor:"white"}}></View>
            </View>
        )
    }

    renderDetail(rowData, sectionID, rowID) {
        let title = <Text style={[styles.title]}>{rowData.title}</Text>
        var desc = null
        if(rowData.description && rowData.imageUrl){
            desc = (
                <View style={styles.descriptionContainer}>
                    <Image source={{uri: rowData.imageUrl}} style={styles.image}/>
                    <Text style={[styles.textDescription]}>{rowData.description}</Text>
                </View>
            )
        }else{
            desc = (
                <View style={styles.descriptionContainer}>
                    <Text style={[styles.textDescription]}>{rowData.description}</Text>
                </View>
            )
        }

        return (
            <View style={{flex:1}}>
                {title}
                {desc}
            </View>
        )
    }

    滚动事件(e){
        console.log(e.nativeEvent);
        if(e.nativeEvent.contentOffset.y <= 110){
            let _透明度 = e.nativeEvent.contentOffset.y/100;
            console.log("透明度：",_透明度);
            DeviceEventEmitter.emit('改变导航透明度',{透明度:_透明度})
        }
    }

    render(){

        return (
            <View style={styles.container}>
                <Timeline
                    style={styles.list}
                    data={this.state.data}
                    circleSize={10}
                    circleColor='rgb(45,156,219)'
                    lineColor='rgb(45,156,219)'
                    lineStyle={{marginLeft:15,paddingLeft:15}}
                    timeContainerStyle={{minWidth:40, marginTop: 20}}
                    timeStyle={{fontSize:8,textAlign: 'center', backgroundColor:'#cccccc', color:'white', padding:5, borderRadius:10}}
                    descriptionStyle={{color:'gray'}}
                    detailContainerStyle={{marginTop:20, paddingLeft: 5, paddingRight: 5, backgroundColor: "#ffffff", borderRadius: 10}}
                    options={{
                        style:{paddingTop:5},
                        refreshControl: (
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.onRefresh}
                            />
                        ),
                        renderFooter: this.renderFooter,
                        onEndReached: this.onEndReached,
                        onScroll: this.滚动事件
                    }}
                    innerCircle={'dot'}
                    onEventPress={this.onEventPress}
                    renderDetail={this.renderDetail}
                    renderCircle={this.renderCircle}
                    renderTime={this.renderTime}
                />

                <CustomModal {...this.state.模态框配置} 隐藏模态框={this.隐藏模态框.bind(this)} />
            </View>
        );

    }
}
