
# cocos-creator Native Caller
从javascript调用本地代码的辅助工具。
- 无需关心什么类型签名、包名。调用android和oc的代码相同
- 支持把js函数直接传入本地代码，处理完功能直接调用js回调

javascript
```javascript
native.callClass("SomeClass", "FuncName", "your string", 2017, true, (str, number, bool) => {
    cc.log(str, number, bool)
})
```
objective-c
```objective-c
@interface SomeClass : NSObject 
+(void) FuncName : (NSString*) str
        arg1 : (NSNumber) number 
        arg2 : (BOOL) b
        arg3 : (NSString*) cbName {
            JS::call(cbName, @[@"your string", @2017, Yes]);
        }
@end
```
java
```java
class SomeClass {
    static public void FuncName(String s, double d, boolean b, String cbName) {
        Js.call(cbName, "your string", 2017, true);
    }
}
```

### 使用方法
- 拷贝Native.js 到你的creator项目中
- 拷贝Js.mm & Js.h 到你的ios目录，并添加到xcode中
- 拷贝Js.java 到安卓 org/cocos2dx/javascript 下
- ios这边因为Api经常变，需要设置一下js调用方式：
    如果有报错请自行修改。
```objective-c
    Js::setEvalFunc([](std::string content) {
        if (!se::ScriptEngine::getInstance()->evalString(content.c_str())) {
            NSLog(@"evalString fail.");
        }
    });
```

### 注意
- 在ios端调用js时候，bool值必须使用 Yes 和 No
- 在ios端 函数多个参数 必须写成arg1 arg2 ... arg10这样。
- js回调函数在本地代码中用string类型接收
- js回调调用一次之后就会被移除。
- 代码比较少，有bug请自行修改，当然也可以给个Pr。
