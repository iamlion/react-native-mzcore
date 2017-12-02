/**
 * Created by zhudezhen on 17/6/6.
 */
import {
    Platform,
    BackHandler
} from 'react-native';
let hookContainer = {};
let hookGolabelContainer = {};

export function getValueSystem(name, isGolable) {
    if (isGolable)
        return hookGolabelContainer[name];
    return hookContainer[name]
};

export function setValueSystem(name, value, isGolable) {
    if (isGolable) {
        hookGolabelContainer[name] = value;
    } else {
        hookContainer[name] = value;
    }
};

export function resetKitObj() {
    hookContainer = {};
    //设置默认语言中文
    setValueSystem('lang', 'zh');
}

// export function registerConstructorAndroidBack(navigator,isNotRegisterAndroid) {
//     if ((Platform.OS == "android") && !isNotRegisterAndroid) {
//         let appNavigator = getValueSystem("appNavigator");
//         if (appNavigator) {
//             let _lastAppNavigator = getValueSystem("_lastAppNavigator") || [];
//             let hasFlag = false;
//             for (let item of _lastAppNavigator) {
//                 if (appNavigator.state.key == item.state.key) {
//                     hasFlag = true;
//                     break;
//                 }
//             }
//             if (!hasFlag) {
//                 _lastAppNavigator.push(appNavigator);
//                 setValueSystem("_lastAppNavigator", _lastAppNavigator);
//             }
//         }
//     }
//
//     if (navigator) {
//         setValueSystem("appNavigator", navigator);
//     }
// }
//
// export function registerWillUnmountAndroidBack(self) {
//     if ((Platform.OS == "android") && !(self.props.isNotRegisterAndroid)) {
//         let _lastAppNavigator = getValueSystem("_lastAppNavigator");
//         // Alert.alert(`${_lastAppNavigator.length} 222`);
//         if (_lastAppNavigator.length <= 0) {
//             setValueSystem("appNavigator", getValueSystem("appNavigator"));
//         } else {
//             let naviName;
//             if (self.props.appNavigator) {
//                 naviName = "appNavigator"
//             } else {
//                 naviName = "navigation"
//             }
//             let appNavigator = getValueSystem("appNavigator");
//             if (appNavigator && self.props[naviName]) {
//                 if (appNavigator.state.key == self.props[naviName].state.key) {
//                     _lastAppNavigator && setValueSystem("appNavigator", _lastAppNavigator[_lastAppNavigator.length - 1]);
//                     _lastAppNavigator.splice(_lastAppNavigator.length - 1, 1);
//                     setValueSystem("_lastAppNavigator", _lastAppNavigator);
//                 }
//             }
//
//         }
//     }
// }
//
// let androidBackKey = "hardwareBackPress";
// export function registerAndroidBackDidMount(call) {
//     if(Platform.OS == 'android'){
//         BackHandler.addEventListener(androidBackKey,call)
//     }
// }
//
// export function registerAndroidBackUnMount(call) {
//     if(Platform.OS == 'android'){
//         BackHandler.removeEventListener(androidBackKey,call)
//     }
// }

resetKitObj();