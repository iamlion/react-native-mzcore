/**
 * Created by zhudezhen on 17/6/3.
 */

import {createStore, applyMiddleware,combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

export default function configureStore(AppNavigator) {
    return function (initialState) {
        const store = createStoreWithMiddleware(rootReducer(AppNavigator), initialState);

        return store;
    }
}