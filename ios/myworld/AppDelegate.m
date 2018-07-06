/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import "SplashScreen.h"
#import "BaiduMobStat.h"
#import <AdSupport/ASIdentifierManager.h>

#import "UMPush/UMessage.h"
#import "UMCommon/UMConfigure.h"
#import <UserNotifications/UserNotifications.h>
#import "RCTUmengPush.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  NSDictionary *config_plist = @{@"配置":infoDictionary};
  NSString *_v = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
  NSString *_b = [infoDictionary objectForKey:@"CFBundleVersion"];
  UIWebView* webView = [[UIWebView alloc] initWithFrame:CGRectZero];
  NSString *oldAgent = [webView stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
  NSString *newAgent = [[NSString alloc] initWithFormat:@"%@%@%@%@%@", oldAgent, @" WEN-/", _v, @".", _b];
  NSDictionary *dictionary = [[NSDictionary alloc] initWithObjectsAndKeys:newAgent, @"UserAgent", nil];
  [[NSUserDefaults standardUserDefaults] registerDefaults:dictionary];
  
  NSString *百度统计AppId = [infoDictionary objectForKey:@"百度统计AppId"];
  NSString *友盟推送AppKey = [infoDictionary objectForKey:@"友盟推送AppKey"];
  
  // 百度移动统计
  // 启用广告标识符，增强应用统计数据的准确性
  [[BaiduMobStat defaultStat] setAdid:[[[ASIdentifierManager sharedManager] advertisingIdentifier] UUIDString]];
  // Debug和Release配置分别设置不同渠道名
#ifdef DEBUG
  [[BaiduMobStat defaultStat] setChannelId:@"苹果开发"];
#else
  [[BaiduMobStat defaultStat] setChannelId:@"苹果"];
#endif
  
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  UMessageRegisterEntity * entity = [[UMessageRegisterEntity alloc] init];
  //type是对推送的几个参数的选择，可以选择一个或者多个。默认是三个全部打开，即：声音，弹窗，角标等
  entity.types = UMessageAuthorizationOptionBadge|UMessageAuthorizationOptionAlert;
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  [UMessage registerForRemoteNotificationsWithLaunchOptions:launchOptions Entity:entity completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      // 用户选择了接收Push消息
    }else{
      // 用户拒绝接收Push消息
    }
  }];
  
  [[BaiduMobStat defaultStat] startWithAppId:百度统计AppId];
  [UMConfigure initWithAppkey:友盟推送AppKey channel:@"App Store"];
  
  NSURL *jsCodeLocation;

  
    #ifdef DEBUG
        jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
    #else
        jsCodeLocation = [CodePush bundleURL];
    #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"myworld"
                                               initialProperties:config_plist
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [SplashScreen show];
  return YES;
}

//iOS10之前使用这个方法接收通知
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  // 当应用在前台时，不推送
  if([UIApplication sharedApplication].applicationState == UIApplicationStateActive){
    //关闭对话框
    [UMessage setAutoAlert:NO];
  }
  [UMessage didReceiveRemoteNotification:userInfo];
  //获取远程推送消息
  [RCTUmengPush application:application didReceiveRemoteNotification:userInfo];
}

//iOS10新增：处理前台收到通知的代理方法
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler{
  NSDictionary * userInfo = notification.request.content.userInfo;
  
  if([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    //可以自定义前台弹出框
    [[NSNotificationCenter defaultCenter] postNotificationName:@"userInfoNotification" object:self userInfo:userInfo];
    
    //应用处于前台时的远程推送接受
    //关闭友盟自带的弹出框
    [UMessage setAutoAlert:NO];
    //必须加这句代码
    [UMessage didReceiveRemoteNotification:userInfo];
  }else{
    //应用处于前台时的本地推送接受
  }
  //当应用处于前台时提示设置，需要哪个可以设置哪一个
  completionHandler(UNNotificationPresentationOptionSound|UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionAlert);
}

//iOS10新增：处理后台点击通知的代理方法
//iOS10以后接收的方法
-(void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler{
  NSDictionary * userInfo = response.notification.request.content.userInfo;
  if([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    //代理方法
    [[NSNotificationCenter defaultCenter] postNotificationName:@"userInfoNotification" object:self userInfo:userInfo];
    
    [UMessage didReceiveRemoteNotification:userInfo];
    //获取远程推送消息
    [RCTUmengPush userNotificationCenter:userInfo];
    if([response.actionIdentifier isEqualToString:@"*****你定义的action id****"])
    {
      
    }else
    {
      NSLog(@"actionIdentifier:%@",response.actionIdentifier);
    }
    //这个方法用来做action点击的统计
    [UMessage sendClickReportForRemoteNotification:userInfo];
    
  }else{
    //应用处于后台时的本地推送接受
  }
}

//获取device_Token
-(void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{
  [RCTUmengPush application:application didRegisterDeviceToken:deviceToken];
  NSLog(@"deviceToken11:%@\n",deviceToken);
  [UMessage registerDeviceToken:deviceToken];
}

@end
