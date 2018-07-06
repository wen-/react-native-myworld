const 模态框样式 = {
    背景色:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'rgba(0,0,0,.3)'
    },
    主体:{
        alignItems:"center",
        width:"60%",
        maxWidth:480,
        borderRadius:10,
        backgroundColor:"rgba(255,255,255,1)",
    },
    文本框:{
        paddingTop:20,
        paddingBottom:20,
        paddingLeft:15,
        paddingRight:15,
    },
    文本内容:{
        color: '#333',
        fontSize:14,
        lineHeight:18,
        backgroundColor:"transparent"
    },
    底部:{
        flexDirection: 'row',
        borderTopWidth:.5,
        borderColor:"#ccc",
    },
    按钮:{
        paddingTop: 15,
        paddingBottom:15,
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
}

const 字体样式 = {
    黑色:{
        color:"#000"
    }
}

const 布局样式 = {
    f1:{
        flex:1
    }
}

export {模态框样式,字体样式,布局样式}