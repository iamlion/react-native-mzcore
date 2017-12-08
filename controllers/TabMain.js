import React from 'react';
import {
    View,
    Text,
    Alert
} from 'react-native';
import {
    TabNavigator
} from 'react-navigation';

let tabConfig , kit = require("../hooks/kit") ;
const initialTabRouteName = "initialTabRouteName";

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}

    }

    render(){
        let props = this.props;
        let tabCg = props.tabBarConfig || {};
        let tabBarCfg = {
            animationEnabled: false, // 切换页面时不显示动画
            tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
            swipeEnabled: false, // 禁止左右滑动
            backBehavior: 'none', // 按 back 键是否跳转到第一个 Tab， none 为不跳转
            lazy: true,
            tabBarOptions: {
                upperCaseLabel: false,
                activeTintColor: tabCg.activeTintColor ?  tabCg.activeTintColor : '#0372d9', // 文字和图片选中颜色
                inactiveTintColor: tabCg.inactiveTintColor ? tabCg.inactiveTintColor : '#878787', // 文字和图片默认颜色
                showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
                indicatorStyle: {height: 0}, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了， 不知道还有没有其它方法隐藏？？？
                style: tabCg.tabStyle ? tabCg.tabStyle : {
                    backgroundColor: '#fff', // TabBar 背景色
                    height: 50,
                },
                labelStyle: tabCg.labelStyle ? tabCg.labelStyle :{
                    fontSize: 10, // 文字大小
                    marginTop: 0
                },
            },
        };
        let tabMenus = props.tabMenus || [];
        if (!tabConfig) {
            tabConfig = {};
            for(let item of tabMenus) {
                if (item.isDefault){
                    tabBarCfg["initialRouteName"] = item.routeNameKey;
                }
                tabConfig[item.routeNameKey] = {
                    screen : (props)=>{
                        let Screen = item.screen;
                        return <Screen
                            {...this.props}
                            tabNavigation={props.navigation}
                        />
                    },
                    navigationOptions : item.navigationOptions
                }
            }
        }


        let Comp = TabNavigator(tabConfig, tabBarCfg) ;

        return <Comp />
    }

}