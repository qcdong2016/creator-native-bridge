
#import "Js.h"
#include <functional>


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
        
        NSString* s = [NSString stringWithFormat:@"native.callback(%@, %@)", cb, [ma componentsJoinedByString:@", "]];
        
        eval(s);
    }
   
    void eval(NSString* content) {
        eval(std::string([content UTF8String]));
    }
   
    
    static EvalFunc efunc;
    void setEvalFunc(const EvalFunc& func) {
        efunc = func;
    }
    
    void eval(std::string content) {
        NSLog(@"evalString: %s", content.c_str());
        efunc(content);
    }
    
}
