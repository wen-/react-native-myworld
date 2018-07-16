import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput,DeviceEventEmitter } from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {
    Kaede,
    Hoshi,
    Jiro,
    Isao,
    Madoka,
    Akira,
    Hideo,
    Kohana,
    Makiko,
    Sae,
    Fumi,
} from 'react-native-textinput-effects';

import {Realm,m_saveNote} from '../model/'
import {CustomModal} from '../utils/customModal'

export default class extends Component {
    constructor(props) {
        super(props);

        this.state={
            标题:"",
            内容:"",
            模态框配置:{
                显示:false,
                显示方式:'fade',
                文本:"test",
                按钮配置:[{"文字":"取消","事件":"隐藏模态框"},{"文字":"确定","事件":"隐藏模态框"}]
            },
            saveing:false
        };
    }

    componentWillMount(){
        this.订阅保存日志 = DeviceEventEmitter.addListener('保存日志', () => {this.保存()});
    }

    componentWillUnmount() {
        if(this.订阅保存日志) {
            this.订阅保存日志.remove();
        }
    }

    componentDidMount(){
        //this.state.模态框配置.文本 = "测试模态框";
        //this.state.模态框配置.按钮配置 = [{"文字":"取消","事件":this.隐藏模态框.bind(this)},{"文字":"确定","事件":this.隐藏模态框.bind(this)}];
    }
    trim (str) {
        if(str){
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        }else{
            return "";
        }
    }
    输入框文字改变 = (关键词,elem) =>{
        let code = this.trim(关键词);
        let data = {};
        data[elem] = code;
        this.setState(data);
    };

    保存(){
        if(this.state.saveing){
            return;
        }
        if(!this.state.内容){
            this.state.模态框配置.文本 = "写点什么吧，不写怎么保存？";
            this.state.模态框配置.按钮配置 = [];
            return this.显示模态框(2000);
        }
        let teamData = {
            id:Date.now().toString(),
            title:this.state.标题,
            content:this.state.内容
        }
        this.state.saveing = true;
        m_saveNote(teamData,function (data) {
            console.log(data);
            this.state.saveing = false;
            this.state.模态框配置.文本 = "保存成功！";
            this.state.模态框配置.按钮配置 = [];
            return this.显示模态框(1000);
        }.bind(this));
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
        let _模态框配置 = this.state.模态框配置;
        _模态框配置.显示 = false;
        this.setState({模态框配置:_模态框配置});
    }

    render() {
        return (
            <View style={{flex:1,padding:10}}>
                <TextInput placeholder={"标题不是必需的"} placeholderTextColor={"#ccc"} underlineColorAndroid="transparent" onChangeText={(t)=>{this.输入框文字改变(t,"标题")}} style={{color:"#000",backgroundColor:"#fff",marginBottom:20,borderColor:"#ccc",borderWidth:1,borderRadius:4}}/>
                <TextInput placeholder={"写点什么呢？"} placeholderTextColor={"#ccc"} underlineColorAndroid="transparent" onChangeText={(t)=>{this.输入框文字改变(t,"内容")}} style={{flex:1,color:"#000",backgroundColor:"#fff",borderColor:"#ccc",borderWidth:1,borderRadius:4,textAlign:"left",textAlignVertical:"top",}} multiline={true} />

                <CustomModal {...this.state.模态框配置} 隐藏模态框={this.隐藏模态框.bind(this)} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#efefef',
    },
});