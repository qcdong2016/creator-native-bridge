


#import <Foundation/Foundation.h>
#include <string>

extern NSString * const Yes;
extern NSString * const No;

/*
    Js::call(cbName, @[Yes, @"hello", @100])
    Js::call(cbName, @[])
*/

namespace Js {
    void call(NSString* cb, NSArray* args);
    void eval(std::string content);
    void eval(NSString* content);
}
