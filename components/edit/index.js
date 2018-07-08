import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

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
            <View style={{flex:1,padding:10}}>
                <Jiro
                    label={'我不是标题党'}
                    borderColor={'#9b537a'}
                    inputStyle={{ color: 'white' }}
                    onChangeText={(text) => { this.setState({标题: text}) }}
                />
                <Jiro
                    label={'说点什么呢？'}
                    style={s}
                    borderColor={'#b57830'}
                    inputStyle={[{ color: 'white' },s]}
                    multiline={true}
                    onChangeText={(text) => { this.setState({内容: text}) }}
                    //onFocus={()=>{this.setState({尺寸:true})}}
                />
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