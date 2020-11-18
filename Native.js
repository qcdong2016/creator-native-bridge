
'use strict'
/*

Native Caller
bool/string/number/string/function

调用 
    andrid -> org.cocos2dx.javascript.Native.SayHello(String helloString, String cbName);
    ios    -> Native.SayHello : (NSString*) helloString
                         arg1 : (NSString*) cbName;
写法
native.call("SayHello", "hello world", (ok) => { })
native.callClz("Native", "SayHello", "hello world", (ok) => { })
let str = native.getStr("Native", "someArg")
*/

class Native {

	constructor() {
		this.cbIdx = 0
		this.cbs = {}

		var self = this
		window.js_native_cb = function (cbID) {
			let func = self.cbs[cbID]
			if (func) {
				delete self.cbs[cbID]
				let args = Array.prototype.slice.call(arguments)
				args.splice(0, 1)
				func.apply(null, args)
			} else {
				cc.log("no func ", cbID)
			}
		}
	}

	_newCB(f) {
		this.cbIdx++
		let cbID = "" + this.cbIdx
		this.cbs[cbID] = f
		return cbID
	}

	call() {
		let args = Array.prototype.slice.call(arguments)
		if (cc.sys.os == cc.sys.OS_ANDROID) {
			args.splice(0, 0, "Native")
		} else if (cc.sys.os == cc.sys.OS_IOS) {
			args.splice(0, 0, "Native")
		} else {
			return
		}

		this.callClz.apply(this, args)
	}

	getStr(clz, funcName) {
		let args = Array.prototype.slice.call(arguments)
		args.splice(2, 0, "Ljava/lang/String;");
		return this._callClz.apply(this, args)
	}

	callClz(clz, funcName) {
		let args = Array.prototype.slice.call(arguments)
		args.splice(2, 0, "V");
		return this._callClz.apply(this, args)
	}

	_callClz(clz, funcName, returnType) {
		let args = Array.prototype.slice.call(arguments)
		args.unshift('com/cocos2dx/javascript/')
		return this.callClzWithPackage.apply(this, args)
	}

	callClzWithPackage(pkg, clz, funcName, returnType) {
		let args = Array.prototype.slice.call(arguments)
		args.splice(0, 4)
		let real_args = [clz, funcName]

		console.log("clz:", clz)
		console.log("funcName:", funcName)

		if (cc.sys.os == cc.sys.OS_ANDROID) {
			real_args[0] = pkg + clz
			real_args[2] = "()" + returnType
			if (args.length > 0) {
				let sig = ""
				args.forEach((v) => {
					switch (typeof v) {
						case 'boolean': sig += "Z"; real_args.push(v); break;
						case 'string': sig += "Ljava/lang/String;"; real_args.push(v); break;
						case 'number': sig += "D"; real_args.push(v); break;
						case 'function': sig += "Ljava/lang/String;"; real_args.push(this._newCB(v)); break;
					}
				})
				real_args[2] = "(" + sig + ")" + returnType
			}
		} else if (cc.sys.os == cc.sys.OS_IOS) {
			if (args.length > 0) {
				for (let i = 0; i < args.length; i++) {
					let v = args[i]
					if (typeof v == "function") {
						real_args.push(this._newCB(v))
					} else {
						real_args.push(v)
					}
					if (i == 0) {
						funcName += ":"
					} else {
						funcName += "arg" + i + ":"
					}
				}

				real_args[1] = funcName
			}
		} else {
			return
		}

		return jsb.reflection.callStaticMethod.apply(jsb.reflection, real_args)
	}
}

window.native = new Native