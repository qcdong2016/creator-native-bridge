package com.cocos2dx.javascript;

import android.util.Log;
import android.widget.Toast;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public class Js{

    public static void call(String fname, Object ...args) {
        if (fname == null || fname.isEmpty()) {
            return;
        }

        String[] s = new String[args.length];

        String str = "native.callback('" + fname + "', ";

        for (Object o : args) {
            if (o instanceof String) {
                str += "'" + o.toString() + "', ";
            } else {
                str += o.toString() + ", ";
            }
        }

        eval(str + "undefined)");
    }

    static private Cocos2dxActivity getCtx() {
        return (Cocos2dxActivity) Cocos2dxActivity.getContext();
    }

    public static void callGlobal(String fname, Object ...args) {
        if (fname == null || fname.isEmpty()) {
            return;
        }

        String[] s = new String[args.length];

        String str = fname + "(";

        for (Object o : args) {
            if (o instanceof String) {
                str += "'" + o.toString() + "', ";
            } else {
                str += o.toString() + ", ";
            }
        }

        eval(str + "undefined)");
    }


    public static void eval(final String str) {
        getCtx().runOnGLThread(new Runnable() {
            @Override
            public void run() {
                print(str);
                Cocos2dxJavascriptJavaBridge.evalString(str);
            }
        });
    }

    public static void print(String s) {
        Log.e("@.@", s);
    }

    public static void tip(final String s) {
        getCtx().runOnUiThread(new Runnable() {
            @Override
            public void run() {
            Toast.makeText(getCtx(), s, Toast.LENGTH_LONG).show();
            }
        });
    }
}
