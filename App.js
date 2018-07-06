import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    BackHandler,
    DeviceEventEmitter,
    NativeModules
} from 'react-native';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {
    Scene,
    Router,
    Actions,
    Reducer,
    Overlay,
    Tabs,
    Stack,
} from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Entypo';
import storage from './components/utils/storageUtil';

import home from './components/home/'
import customNavBar from './components/customNav/'
import splashPage from "./components/splashPage";

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
        alignItems: 'center',
    },
    navigationBar:{
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: '#dadada',
        elevation: 0,
        height: 44,
    },
    navigationBarTitle:{
        fontSize: 18,
        fontWeight: 'normal',
        color: '#222',
        textAlign: 'center',
        alignSelf: 'center',
        flex:1
    }
});

const reducerCreate = params => {
    const defaultReducer = new Reducer(params);
    return (state, action) => {
        console.log('ACTION:', action);
        return defaultReducer(state, action);
    };
};

const getSceneStyle = () => ({
    backgroundColor: '#F5FCFF',
    shadowOpacity: 1,
    shadowRadius: 3,
});

export default class App extends Component{

    constructor(props) {
        super(props);
        if(Platform.OS == 'ios') {
            global.配置 = props.配置?props.配置:{};
        }else{
            global.配置 = props.配置?JSON.parse(props.配置):{};
        }

        this.项目名 = props.配置.项目名称||"";
    }

    render() {
        return (
            <Router
                createReducer={reducerCreate}
                getSceneStyle={getSceneStyle}>

                <Overlay key="overlay">
                    <Scene key="root" hideNavBar gesturesEnabled={false}
                           transitionConfig={() => ({
                               screenInterpolator: (props) => {
                                   switch (props.scene.route.params.direction) {
                                       case 'vertical':
                                           return CardStackStyleInterpolator.forVertical(props);
                                       case 'fade':
                                           return CardStackStyleInterpolator.forFade(props);
                                       case 'none':
                                           return CardStackStyleInterpolator.forInitial
                                       case 'horizontal':
                                       default:
                                           return CardStackStyleInterpolator.forHorizontal(props)
                                   }
                               }
                           })}
                    >
                        <Scene key="启动页" component={splashPage} title="启动" initial direction="fade"/>
                        <Scene key="主界面" component={home} title="我的世界" hideNavBar={false} navBar={customNavBar} />

                    </Scene>
                </Overlay>
            </Router>
        );
    }
}

AppRegistry.registerComponent('myworld', () => App);
