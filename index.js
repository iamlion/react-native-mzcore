/**
 * 创建了项目级核心类文件
 * */
import React from 'react';
import {
    View,
    Text,
    Alert
} from 'react-native';
import {
    Provider,
} from 'react-redux';
import ConfigureStore from './stores/ConfigureStore';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import {
    connect
} from 'react-redux';
import {
    StackNavigator,
    addNavigationHelpers,
} from 'react-navigation';
import TabMain from './controllers/TabMain';

let AppNavigator, AppWithNavigationState;
const kit = require("./hooks/kit");
// 导航控制路由器前缀，默认导航器
const VIEW_SUFFIX = "MZ", DEFAULT_INITIALROUTENAME = `${VIEW_SUFFIX}_mainscreen`;
const StackNavigatorConfig = {};
let StackNavigatorMenus = [], TabNavigatorMenus = [];


const applyRouteNavigation = (props) => {
    if (props.navigation) {
        let navigate, naviName;
        naviName = "navigation";
        navigate = props.navigation.navigate;
        props[naviName].navigate = (...args) => {
            let appNaviKey =  props.navigation.state.routeName;
            let isCardAnimated = kit.getValueSystem(appNaviKey);
            if (!isCardAnimated) {
                navigate(...args);
                kit.setValueSystem(appNaviKey, true);
            }
        }
    }
}

const createAppNavigator = (mainProps) => {

    // 注册主界面控制器
    StackNavigatorConfig[DEFAULT_INITIALROUTENAME] = {
        screen: (props)=>{
            applyRouteNavigation(props);
            return <TabMain
                {...props}
                tabMenus={TabNavigatorMenus}
                {...mainProps}
            />
        },
    };

    for (let item of StackNavigatorMenus) {
        let Screen = item.screen;
        if (item.isDefault){
            kit.setValueSystem("initialRouteName",item.routeNameKey,true);
        }
        StackNavigatorConfig[item.routeNameKey] = {
            screen : (props)=>{
                applyRouteNavigation(props);
                return <Screen
                    {...props}
                />
            },
            navigationOptions : item.navigationOptions
        }
    }

    return StackNavigator(StackNavigatorConfig, {
        headerMode: "none",
        initialRouteName: kit.getValueSystem("initialRouteName", true) || DEFAULT_INITIALROUTENAME,
        transitionConfig: () => ({
            screenInterpolator: CardStackStyleInterpolator.forHorizontal,
        }),
        onTransitionStart: (item, pre) => {

            let idx = item.navigation.state.index;
            let route = item.navigation.state.routes[idx];
            kit.setValueSystem(route.routeName, null);
        },
        onTransitionEnd: (item, pre) => {

            let idx = item.navigation.state.index;
            let route = item.navigation.state.routes[idx];

        }
    });
};

class AppNavigatorScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{
                flex: 1
            }}>
                <AppNavigator
                    navigation={addNavigationHelpers({
                        dispatch: this.props.dispatch,
                        state: this.props.nav,
                    })}
                />
            </View>
        );
    }
}

class ProjectCore extends React.Component {

    constructor(props) {
        super(props);

        // 去除警告
        console.disableYellowBox = props.disableYellowBox || false;
        // 生成导航器
        AppNavigator = createAppNavigator(props);
        AppWithNavigationState = connect(state => {
            return (
                {
                    nav: state.nav
                }
            )
        })(AppNavigatorScreen);


        this.store = ConfigureStore(AppNavigator)();
    }

    render() {
        return (
            <Provider
                store={this.store}
            >
                <AppWithNavigationState/>
            </Provider>
        )
    }

}

const registerStackRouter = (item) => {
    if (item instanceof Array) {
        StackNavigatorMenus = StackNavigatorMenus.concat(item);
        return
    }
    /**
     * routeNameKey 控制器的key
     * screen  控制器的视图
     * navigationOptions 控制器的配置信息
     * */
    StackNavigatorMenus.push(item);
}

const registerTabRouter = (item) => {
    if (item instanceof Array) {
        TabNavigatorMenus = TabNavigatorMenus.concat(item);
        return
    }
    /**
     * routeNameKey 控制器的key
     * screen  控制器的视图
     * navigationOptions 控制器的配置信息
     * */
    TabNavigatorMenus.push(item);
}
// 项目核心文件
exports.ProjectCore = ProjectCore;

// 注册项目路由器
exports.registerStackRouter = registerStackRouter;

// 注册标签页路由器
exports.registerTabRouter = registerTabRouter;
