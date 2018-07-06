package com.myworld;

import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

public class SplashScreenModule extends ReactContextBaseJavaModule {
    public SplashScreenModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "SplashScreen";
    }

    /**
     * 打开启动屏
     */
    @ReactMethod
    public void show() {
        SplashScreen.show(getCurrentActivity());
    }

    /**
     * 关闭启动屏
     */
    @ReactMethod
    public void hide() {
        SplashScreen.hide(getCurrentActivity());
    }

    /**
     * 跳转到系统设置
     */
    @ReactMethod
    public void settings() {
	    runOnUiThread(new Runnable() {
		    @Override
		    public void run() {
		        Intent intent =  new Intent(Settings.ACTION_AIRPLANE_MODE_SETTINGS);
			    getCurrentActivity().startActivity(intent);
	        }
	    });
    }

	/**
	 * 获取配置
	 */
	@ReactMethod
	public void config(Callback callback) {
		WritableMap msg = SplashScreen.config();
		callback.invoke(msg);
	}

}