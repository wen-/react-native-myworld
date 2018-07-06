package com.myworld;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MainActivity extends ReactActivity {
    WritableMap msg = Arguments.createMap();
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // 添加这一句
        super.onCreate(savedInstanceState);
        Bundle 传递过来的数据 = this.getIntent().getExtras();
        if(传递过来的数据 != null){
            if(传递过来的数据.containsKey("PUSH_MSG")){
                String PUSH_MSG = 传递过来的数据.getString("PUSH_MSG");
                Log.e("==MainActivity:==", PUSH_MSG);
                //遍历Json
                try {
                    JSONObject jsonObject = new JSONObject(PUSH_MSG);
                    Iterator<String> keys = jsonObject.keys();
                    String key;
                    while (keys.hasNext()) {
                        key = keys.next();
                        try {
                            msg.putString(key, jsonObject.get(key).toString());
                        }
                        catch (Exception e) {
                            Log.e("MainActivity:", "消息数据JSON二级转换出错-> "+PUSH_MSG);
                        }
                    }

                    new Thread(new Runnable() {
                        @Override
                        public void run() {

                            try {
                                Thread.sleep(1000);
                            } catch (InterruptedException e) {
                                e.printStackTrace();
                            }
                            Log.e("MainActivity:", "准备下发消息到RN-> "+msg.toString());
                            sendMsgToRN("DidOpenMessage", msg);
                        }
                    }).start();
                }catch (Exception e) {
                    Log.e("MainActivity:", "消息数据JSON转换出错-> "+PUSH_MSG);
                }

            }

        }else{
            Log.e("MainActivity:", "传递过来的数据为空");
        }
    }

    @Override
    protected String getMainComponentName() {
        return "myworld";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Nullable
            @Override
            protected Bundle getLaunchOptions() {
                String crypto_key = "FO1KQXmtxhlA6PKF";
                Bundle initialProps = new Bundle();
                //Bundle config = new Bundle();
                JSONObject config = new JSONObject();
                BuildConfig obj = new BuildConfig();
                Field[] fields = obj.getClass().getDeclaredFields();
                for (Field field:fields) {
                    String name = field.getName();
                    String type = field.getType().toString();
                    Log.e("type:",type);
                    Object val;
                    try {
                        // 获取原来的访问控制权限
                        boolean accessFlag = field.isAccessible();
                        // 修改访问控制权限
                        field.setAccessible(true);
                        try{
                            val = field.get(obj);
                            try {
                                if(type.equals("interface java.util.Map")){
                                    Map<String,String> map = new HashMap((Map) val);
                                    JSONObject subjson = new JSONObject();
                                    for (String k : map.keySet()) {
                                        String v = map.get(k);
                                        subjson.put(k,v);
                                    }
                                    config.putOpt(name,subjson);
                                }else{
                                    config.put(name,val);
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }catch (IllegalAccessException e){
                            e.printStackTrace();
                        }
                        // 恢复访问控制权限
                        field.setAccessible(accessFlag);
                    }catch (IllegalArgumentException ex){
                        ex.printStackTrace();
                    }
                }
                try{
                    config.put("AES_KEY",crypto_key);
                }catch (JSONException e) {
                    e.printStackTrace();
                }
                initialProps.putString("配置",config.toString());
                return initialProps;
            }
        };
    }

    public void sendMsgToRN(String eventName, @Nullable WritableMap params) {
        MainApplication.getReactPackage().uPushModule.sendEvent(eventName,params);
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
    }

    public static int getResId(String variableName, Class<?> c) {
        try {
            Field idField = c.getDeclaredField(variableName);
            return idField.getInt(idField);
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}
