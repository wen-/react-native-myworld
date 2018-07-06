#import "SplashScreen.h"
#import <React/RCTBridge.h>

static bool waiting = true;
static bool addedJsLoadErrorObserver = false;

@implementation SplashScreen
- (dispatch_queue_t)methodQueue{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

+ (void)show {
    if (!addedJsLoadErrorObserver) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(jsLoadError:) name:RCTJavaScriptDidFailToLoadNotification object:nil];
        addedJsLoadErrorObserver = true;
    }

    while (waiting) {
        NSDate* later = [NSDate dateWithTimeIntervalSinceNow:0.1];
        [[NSRunLoop mainRunLoop] runUntilDate:later];
    }
}

+ (void)hide {
    dispatch_async(dispatch_get_main_queue(),
                   ^{
                       waiting = false;
                   });
}

+ (void) jsLoadError:(NSNotification*)notification
{
    [SplashScreen hide];
}

RCT_EXPORT_METHOD(hide) {
    [SplashScreen hide];
}

RCT_EXPORT_METHOD(config:(RCTResponseSenderBlock)callback) {
  //读取plist配置信息
  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
  callback(@[infoDictionary]);
}

@end
