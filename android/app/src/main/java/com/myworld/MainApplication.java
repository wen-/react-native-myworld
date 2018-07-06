package com.myworld;

import com.baidu.mobstat.StatService;
import com.facebook.react.ReactApplication;
import com.react.rnspinkit.RNSpinkitPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.microsoft.codepush.react.CodePush;
import com.baidu.reactnativemobstat.RNBaiduMobStatPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.liuchungui.react_native_umeng_push.UmengPushApplication;
import com.liuchungui.react_native_umeng_push.UmengPushPackage;

import org.android.agoo.huawei.HuaWeiRegister;
import org.android.agoo.xiaomi.MiPushRegistar;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends UmengPushApplication implements ReactApplication {
	private static final UmengPushPackage pushPackage = new UmengPushPackage();

	private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

		@Override
		protected String getJSBundleFile() {
			return CodePush.getJSBundleFile();
		}

		@Override
		public boolean getUseDeveloperSupport() {
			return BuildConfig.DEBUG;
		}

		@Override
		protected List<ReactPackage> getPackages() {
			String RN版本更新密钥 = BuildConfig.RN版本更新密钥;
			return Arrays.<ReactPackage>asList(
					new SplashScreenReactPackage(),
					new MainReactPackage(),
					new RNSpinkitPackage(),
					new RNDeviceInfo(),
					new RNFetchBlobPackage(),
					new CodePush(RN版本更新密钥, getApplicationContext(), BuildConfig.DEBUG),
					new RNBaiduMobStatPackage(),
					pushPackage
			);
		}

		@Override
		protected String getJSMainModuleName() {
			return "index";
		}
	};

	@Override
	public ReactNativeHost getReactNativeHost() {
		return mReactNativeHost;
	}

	@Override
	public void onCreate() {
		super.onCreate();
		SoLoader.init(this, /* native exopackage */ false);
		StatService.start(this);

		//友盟推送自定义资源包名
		String packageName = "com.myworld";
		mPushAgent.setResourcePackageName(packageName);
		//华为通道
		HuaWeiRegister.register(this);
		//小米通道
		MiPushRegistar.register(this, BuildConfig.小米AppID, BuildConfig.小米AppKey);
	}

	public static UmengPushPackage getReactPackage() {
		return pushPackage;
	}
}