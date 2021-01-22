/*

函数定义：
    andrid -> org.cocos2dx.javascript.Native.SayHello(String helloString, String cbName);
    ios    -> Native.SayHello : (NSString*) helloString
                         arg1 : (NSString*) cbName;
js调用写法
native.call("SayHello", "hello world", (ok) => { })
native.callClass("Native", "SayHello", "hello world", (ok) => { })

注意：
	Android 这边 接受数字的函数都要用float。
		double 在 cocos c++ 代码中未实现
*/

export enum AndrodSign {
	Void = "V",
	String = "Ljava/lang/String;",
	Boolean = "Z",
	Float = "F",
	Double = "D",
	Int = "I",
}

export class Native {

	static cbIdx : number = 0
	static cbs = {}

	static defaultClass = "Native"
	static defaultPackage = "com/cocos2dx/javascript/"

	private static callback(cbID: string, ...args: any[]) {
		let func = this.cbs[cbID]
		if (func) {
			delete this.cbs[cbID]
			func(...args)
		} else {
			cc.log("no func ", cbID)
		}
	}

	private static _newCB(f) {
		this.cbIdx++
		let cbID = "" + this.cbIdx
		this.cbs[cbID] = f
		return cbID
	}

	static getStr(clazz: string, method: string, ...args: any[]) {
		return this.callWithPackage(this.defaultPackage, clazz, method, AndrodSign.String, ...args)
	}

	static call(method: string, ...args: any[]) {
		this.callWithPackage(this.defaultPackage, this.defaultClass, method, AndrodSign.Void, ...args)
	}

	static callClass(clazz: string, method: string, ...args: any[]) {
		this.callWithPackage(this.defaultPackage, clazz, method, AndrodSign.Void, ...args)
	}

	static callWithReturnType(clazz: string, method: string, returnTypeAndroid: AndrodSign, ...args: any[]) {
		return this.callWithPackage(this.defaultPackage, clazz, method, returnTypeAndroid, ...args)
	}

	static callWithPackage(pkg: string, clazz: string, method: string, returnTypeAndroid: AndrodSign, ...args: any[]) {
		let real_args = []

		cc.log("clazz:", clazz)
		cc.log("method:", method)

		if (cc.sys.os == cc.sys.OS_ANDROID) {
			var sig : string = ""
			for (let i = 0; i< args.length; i++) {
				let v = args[i]
				switch (typeof v) {
					case 'boolean':
						sig += AndrodSign.Boolean;
						real_args.push(v + "");
						break;
					case 'string':
						sig += AndrodSign.String;
						real_args.push(v);
						break;
					case 'number':
						sig += AndrodSign.Float;
						real_args.push(v + "");
						break;
					case 'function':
						sig += AndrodSign.String;
						real_args.push(this._newCB(v));
						break;
				}
			}
			return jsb.reflection.callStaticMethod(pkg + clazz, method, "("+sig+")" + returnTypeAndroid, ...real_args)
		} 
		
		
		if (cc.sys.os == cc.sys.OS_IOS) {
			for (let i = 0; i < args.length; i++) {
				let v = args[i]
				if (typeof v == "function") {
					real_args.push(this._newCB(v))
				} else {
					real_args.push(v)
				}
				if (i == 0) {
					method += ":"
				} else {
					method += "arg" + i + ":"
				}
			}
			//@ts-ignore
			return jsb.reflection.callStaticMethod(clazz, method, ...real_args)
		}
	}
}

//@ts-ignore
window.native = Native
