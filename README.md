#### MZCore File Support Project

- 该项目用于大型开发级项目中，包含了基本的Tab标签页，navigation类导航页，能够快速的建立react-native项目

###使用

npm install react-native-mzcore

我会持续更新这个版本库


```
// 导入核心框架类
import {
    ProjectCore,
    registerTabRouter,
    registerStackRouter
} from "react-native-mzcore";

/**
ProjectCore         主视图文件

registerTabRouter   注册tab标签页，请在调用ProjectCore视图前，先调用该方法

registerStackRouter 注册stack导航页，请在调用ProjectCore视图前，先调用该方法

*/ 


registerStackRouter([
    {
        screen : RouteNavi1,
        routeNameKey : "routeGate1",
    }
]);

registerTabRouter([
    {
        screen: View,
        navigationOptions: {
            tabBarLabel: "测试标签1",
        },
        routeNameKey : "tab2"
    },
    {
        screen: View,
        navigationOptions: {
            tabBarLabel: "测试标签1",
        },
        routeNameKey : "tab3"
    },
    {
        screen: View,
        navigationOptions: {
            tabBarLabel: "测试标签1",
        },
        routeNameKey : "tab4"
    }
]);


render(){
    // disableYellowBox 是否限制警告框，true为不显示，false为显示 
    return <ProjectCore
                disableYellowBox={true}
            />
}

```