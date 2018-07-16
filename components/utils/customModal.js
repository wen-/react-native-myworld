import React from 'react'
import {
    Modal,
    View,
    Text,
    TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types';
import {模态框样式} from "../styles";

class CustomModal extends React.Component {

    static propTypes = {
        显示: PropTypes.bool,
        显示方式: PropTypes.string,
        文本: PropTypes.string,
        按钮配置: PropTypes.array
    };

    static defaultProps = {
        显示:false,
        显示方式:'fade',
        文本:"默认值",
        按钮配置:[],
    };

    render() {

        return (
            <View>
                <Modal visible={this.props.显示}
                       animationType={this.props.显示方式}
                       transparent = {true}
                       onRequestClose={()=> this.props.隐藏模态框()} >
                    <View style={模态框样式.背景色}>
                        <View style={模态框样式.主体}>
                            <View style={模态框样式.文本框}>
                                {
                                    this.props.文本.split('\\n').map((item, i)=>{
                                        let marginT = i==1?{marginTop:10}:{};
                                        return(
                                            <Text style={[模态框样式.文本内容,marginT]} key={i}>{item}</Text>
                                        )
                                    })
                                }
                            </View>

                            {
                                this.props.按钮配置&&(this.props.按钮配置.length>0)?
                                    <View style={模态框样式.底部}>
                                        {
                                            this.props.按钮配置.map((item, i) => {
                                                let s = i>0?{borderLeftWidth:.5,borderColor:"#e5e5e5"}:{};
                                                return (
                                                    <TouchableOpacity
                                                        style={[模态框样式.按钮,s]}
                                                        underlayColor="#aaa"
                                                        onPress={()=>{item.事件(item.参数)}}
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
        );
    }

}

export {CustomModal};