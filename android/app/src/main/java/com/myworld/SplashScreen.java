package com.myworld;

import android.app.Activity;
import android.app.Dialog;
import android.widget.ImageView;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import static com.myworld.MainActivity.getResId;

public class SplashScreen {
	private static Dialog mSplashDialog;
	private static WeakReference<Activity> mActivity;
	private static RelativeLayout splash;
	private static ImageView img;

	/**
	 * 打开启动屏
	 */
	public static void show(final Activity activity, final boolean fullScreen) {
		if (activity == null) return;
		mActivity = new WeakReference<Activity>(activity);
		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (!activity.isFinishing()) {

					mSplashDialog = new Dialog(activity, fullScreen ? R.style.SplashScreen_Fullscreen : R.style.SplashScreen_SplashTheme);

					mSplashDialog.setContentView(R.layout.launch_screen);
					splash = (RelativeLayout) mSplashDialog.findViewById(R.id.splash_root);
					img = (ImageView) mSplashDialog.findViewById(R.id.iv_splash_logo);
					int splash_bg = getResId(BuildConfig.启动背景图, R.drawable.class);
					int img_logo = getResId(BuildConfig.启动背景图LOGO, R.drawable.class);
					splash.setBackgroundResource(splash_bg);
					img.setImageResource(img_logo);

					mSplashDialog.setCancelable(false);
					if (!mSplashDialog.isShowing()) {
						mSplashDialog.show();
					}
				}
			}
		});
	}

	/**
	 * 打开启动屏
	 */
	public static void show(final Activity activity) {
		show(activity, false);
	}

	/**
	 * 关闭启动屏
	 */
	public static void hide(Activity activity) {
		if (activity == null) {
			if (mActivity == null) {
				return;
			}
			activity = mActivity.get();
		}
		if (activity == null) return;

		activity.runOnUiThread(new Runnable() {
			@Override
			public void run() {
				if (mSplashDialog != null && mSplashDialog.isShowing()) {
					mSplashDialog.dismiss();
					mSplashDialog = null;
				}
			}
		});
	}

	/**
	 * 读取配置
	 */
	public static WritableMap config() {
		BuildConfig config = new BuildConfig();
		return getConfig(config);
	}

	public static WritableMap getConfig(Object obj){
		WritableMap msg = Arguments.createMap();
		Field[] fields = obj.getClass().getDeclaredFields();
		for (Field field:fields) {
			String name = field.getName();
			String type = field.getType().toString();
			Object val;
			try {
				// 获取原来的访问控制权限
				boolean accessFlag = field.isAccessible();
				// 修改访问控制权限
				field.setAccessible(true);

				try{
					val = field.get(obj);
					if(type.equals("interface java.util.Map")){
						Map<String,String> map = new HashMap((Map) val);
						WritableMap subjson = Arguments.createMap();
						for (String k : map.keySet()) {
							String v = map.get(k);
							subjson.putString(k,v);
						}
						msg.putMap(name,subjson);
					}else{
						msg.putString(name,val.toString());
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
		return msg;
	}


}
