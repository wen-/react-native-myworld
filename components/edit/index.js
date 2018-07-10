import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';

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

export default class extends Component {
    constructor(props) {
        super(props);

        this.state={
            标题:"",
            内容:"",
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

    }

    输入框文字改变 = (关键词,elem) =>{
        let code = this.trim(关键词);
        let data = {};
        data[elem] = code;
        this.setState(data);
    };

    保存(){
        let teamData = {
            id:Date.now().toString(),
            title:this.state.标题,
            content:this.state.内容
        }
        m_saveNote(teamData,function (data) {
            console.log(data);
        });
    }

    render() {
        return (
            <View style={{flex:1,padding:10,flexDirection:"row"}}>
                <TextInput placeholder={"标题不是必需的"} onChangeText={(t)=>{this.输入框文字改变(t,"标题")}} style={{backgroundColor:"#fff",marginBottom:20}}/>
                <TextInput placeholder={"写点什么呢？"} onChangeText={(t)=>{this.输入框文字改变(t,"内容")}} style={{flex:1,backgroundColor:"#fff"}} />
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