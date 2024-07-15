#import "AppDelegate.h"
#import "Orientation.h"
#import <React/RCTBundleURLProvider.h>
#import "RCTPushy.h"  // <-- import头文件，注意要放到if条件外面

// Add the header at the top of the file:
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"smart_helper";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  // Force DatePicker locale to current language (for: 24h or 12h format, full day names etc...)
  NSString *currentLanguage = [[NSLocale preferredLanguages] firstObject];
  [[UIDatePicker appearance] setLocale:[[NSLocale alloc]initWithLocaleIdentifier:currentLanguage]];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  // 原先DEBUG这里的写法不作修改(所以DEBUG模式下不可热更新)
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [RCTPushy bundleURL]; 
#endif
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

// Add this inside `@implementation AppDelegate` above `@end`:
- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end

