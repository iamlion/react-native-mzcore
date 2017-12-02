/**
 * Created by zhudezhen on 17/6/3.
 */
import {combineReducers} from 'redux';
import {NavigationActions} from 'react-navigation';

export default function (AppNavigator) {
    return combineReducers({
        nav: (state, action) => {

            if (action.type === NavigationActions.BACK) {
                let backRouteIndex = null;
                if (action.key) {

                    const backRoute = state.routes.find(
                        /* $FlowFixMe */
                        /* 修改源码 */
                        route => route.routeName === action.key
                        /* (route: *) => route.key === action.key */
                    );
                    /* $FlowFixMe */
                    backRouteIndex = state.routes.indexOf(backRoute);
                }
                if (backRouteIndex >= 0) {
                    return {
                        ...state,
                        routes: state.routes.slice(0, backRouteIndex+1),
                        index: backRouteIndex - 1 + 1,
                    };
                }
            }

            const newState = AppNavigator.router.getStateForAction(action, state);
            return newState || state;
        }
    });
}


