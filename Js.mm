
#include "jsapi.h"
#include "jsfriendapi.h"

#include "base/CCScheduler.h"
#include "base/CCDirector.h"
#include "ScriptingCore.h"
#include "platform/CCFileUtils.h"
#import "Js.h"

NSString * const Yes = @"yes";
NSString * const No  = @"no";

namespace Js{
    void call(NSString* cb, NSArray* args)  {
        if (cb && [cb isEqualToString:@""]) {
            return;
        }
        
        
        NSMutableArray* ma = [[NSMutableArray alloc]init];
        
        for(int i=0; i<args.count; i++){
            NSObject* obj = [args objectAtIndex:i];
            
            if (obj == Yes) {
                [ma addObject:@"true"];
            } else if (obj == No) {
                [ma addObject:@"false"];
            } else if ([obj isKindOfClass:[NSNumber class]]) {
                [ma addObject:[NSString stringWithFormat:@"%@", obj]];
            } else if ([obj isKindOfClass:[NSString class]]){
                [ma addObject:[NSString stringWithFormat:@"'%@'", obj]];
            } else if ([obj isKindOfClass:[NSError class]]) {
                [ma addObject:[NSString stringWithFormat:@"'%@'", [(NSError*)obj localizedDescription]]];
            } else {
                [ma addObject:@"null"];
            }
        }
        
        NSString* s = [NSString stringWithFormat:@"js_native_cb(%@, %@)", cb, [ma componentsJoinedByString:@", "]];
        
        eval(s);
    }
   
    void eval(NSString* content) {
        eval(std::string([content UTF8String]));
    }
    
    void eval(std::string content) {
        NSLog(@"evalString: %s", content.c_str());
        cocos2d::Scheduler* sc = cocos2d::Director::getInstance()->getScheduler();
        sc->performFunctionInCocosThread([=](){
            ScriptingCore* core = ScriptingCore::getInstance();
            if (!core->evalString(content.c_str())) {
                NSLog(@"evalString fail.");
            }
        });
    }
}
