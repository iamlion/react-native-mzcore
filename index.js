/**
 * 创建了项目级核心类文件
 * */
import React from 'react';
import {
    View,
    Text,
    Alert,
    Animated,
    Easing
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
let mainDidEvent = [];

const applyRouteNavigation = (props) => {
    if (props.navigation) {
        let navigate, naviName;
        naviName = "navigation";
        navigate = props.navigation.navigate;
        props[naviName].navigate = (routeName, params, animateConfig) => {
            let appNaviKey = props.navigation.state.routeName;
            let isCardAnimated = kit.getValueSystem(appNaviKey);
            if (!isCardAnimated) {
                if (animateConfig) {
                    kit.setValueSystem("initalScreenInterpolator", animateConfig);
                }
                navigate(routeName, params);
                kit.setValueSystem(appNaviKey, true);
            }
        }
        props.registerDidLoadEvent = (d)=>{
            mainDidEvent.push(d);
        }
        props.unregisterDidLoadEvent = (d)=>{
            let newpush = [];
            for(let i of mainDidEvent){
                if (i == d){
                    continue;
                }
                newpush.push(i);
            }
            mainDidEvent = newpush;
        }
    }
}

const createAppNavigator = (mainProps) => {

    // 注册主界面控制器
    StackNavigatorConfig[DEFAULT_INITIALROUTENAME] = {
        screen: (props) => {
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
        if (item.isDefault) {
            kit.setValueSystem("initialRouteName", item.routeNameKey, true);
        }
        StackNavigatorConfig[item.routeNameKey] = {
            screen: (props) => {
                applyRouteNavigation(props);
                return <Screen
                    {...props}
                />
            },
            navigationOptions: item.navigationOptions
        }
    }

    return StackNavigator(StackNavigatorConfig, {
        headerMode: "none",
        initialRouteName: kit.getValueSystem("initialRouteName", true) || DEFAULT_INITIALROUTENAME,
        transitionConfig: () => {
            // 改变个性化动画
            // 默认水平横进来
            let initalScreenInterpolator = kit.getValueSystem("initalScreenInterpolator");
            let screenInterConfig = initalScreenInterpolator || {
                animateStyle: "horizontal",
                // animateStyle:"horizontal",
                isAnimated: true
            };
            let cardStyle = CardStackStyleInterpolator.forHorizontal;
            if (screenInterConfig.animateStyle == "vertical") {
                cardStyle = CardStackStyleInterpolator.forVertical;
            } else {
                cardStyle = CardStackStyleInterpolator.forHorizontal;
            }

            if (!screenInterConfig.isAnimated) {
                return {
                    screenInterpolator: cardStyle,
                    transitionSpec: {
                        duration: 0,
                        easing: Easing.linear,
                        timing: Animated.timing,
                    }
                }
            } else {
                return {
                    screenInterpolator: cardStyle,
                }
            }
        },
        onTransitionStart: (item, pre) => {
            // kit.getValueSystem("initalScreenInterpolator",CardStackStyleInterpolator.forVertical);
            let idx = item.navigation.state.index;
            let route = item.navigation.state.routes[idx];
            kit.setValueSystem(route.routeName, null);
        },
        onTransitionEnd: (item, pre) => {
            let initalScreenInterpolator = kit.getValueSystem("initalScreenInterpolator");
            if (initalScreenInterpolator) {
                kit.setValueSystem("initalScreenInterpolator", null);
            }
            let idx = item.navigation.state.index;
            let route = item.navigation.state.routes[idx];

            if (route.routeName == DEFAULT_INITIALROUTENAME) {
                // 执行事件
                for (let d of mainDidEvent) {
                    d && d();
                }
            }

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
