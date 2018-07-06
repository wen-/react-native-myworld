package com.myworld;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.umeng.message.UmengNotifyClickActivity;

import org.android.agoo.common.AgooConstants;

public class SysPushActivity extends UmengNotifyClickActivity {

	private static String TAG = SysPushActivity.class.getName();

	@Override
	protected void onCreate(Bundle bundle) {
		super.onCreate(bundle);
		setContentView(R.layout.activity_syspush);
	}

	@Override
	public void onMessage(Intent intent) {
		super.onMessage(intent);  //此方法必须调用，否则无法统计打开数
		String body = intent.getStringExtra(AgooConstants.MESSAGE_BODY);
		Log.i("SysPushActivity:", body);
		Bundle bundle=new Bundle();
		bundle.putString("PUSH_MSG", body);
		Intent intent1 = new Intent();
		intent1.setClass(this,MainActivity.class);
		intent1.putExtras(bundle);
		startActivity(intent1);
	}
}
