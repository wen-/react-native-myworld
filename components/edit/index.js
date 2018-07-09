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

export default class extends Component {
    constructor(props) {
        super(props);

        this.state={
            标题:"",
            内容:"",
            尺寸:false
        };
    }
    componentDidMount(){

    }

    render() {
        let s;
        if(this.state.尺寸){
            s = {flex:1}
        }
        return (
            <View style={{flex:1,padding:10,flexDirection:"row"}}>
                <TextInput placeholder={"标题不是必需的"} style={{backgroundColor:"#fff",marginBottom:20}}/>
                <TextInput placeholder={"写点什么呢？"} style={{flex:1,backgroundColor:"#fff"}} />
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