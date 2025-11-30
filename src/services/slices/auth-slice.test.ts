import { describe, test, expect } from '@jest/globals';

import { TUser } from '@utils-types';

import { 
    authReducer,
    checkUserAuth,
    registerUser,
    logIn,
    logOut,
    updateUserData 
} from './auth-slice'


const userFixture: TUser = {
    "email": "fakeuser@yandex.ru",
    "name": "Тестовый Пользователь",
}

describe('Тестирование редьюсера данных пользователя', () => {
    test('Тест корректной инициализации', () => {
        const initialState = authReducer(undefined, {type: 'TEST_ACTION'});
        expect(initialState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: null,
        });
    });

    test('Тест состояния при проверке статуса авторизованного пользователя', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        }
        const action = {
            type: checkUserAuth.fulfilled.type,
            payload: userFixture,
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: false,
            error: null,
        });
    });

    test('Тест состояния при проверке статуса неавторизованного пользователя', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        }
        const action = {type: checkUserAuth.rejected.type}
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: null,
        });
    });
    
    test('Тест состояния при обработке запроса на регистрацию пользователя', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: null,
        }
        const action = {type: registerUser.pending.type}
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        });
    });

    test('Тест состояния при успешном выполнении запроса на регистрацию пользователя', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        }
        const action = {
            type: registerUser.fulfilled.type,
            payload: userFixture,
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: false,
            error: null,
        });
    });
    
    test('Тест состояния при ошбке выполнения запроса на регистрацию пользователя', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        }
        const action = {
            type: registerUser.rejected.type,
            error: 'Ошибка регистрации пользователя',
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: 'Ошибка регистрации пользователя',
        });
    });

    test('Тест состояния при обработке запроса на логин', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: null,
        }
        const action = {type: logIn.pending.type}
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        });
    });

    test('Тест состояния при успешном выполнении запроса на логин', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        }
        const action = {
            type: logIn.fulfilled.type,
            payload: userFixture,
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: false,
            error: null,
        });
    });
    
    test('Тест состояния при ошбке выполнения запроса на логин', () => {
        const state = {
            userInfo: null,
            isAuthorized: false,
            isLoading: true,
            error: null,
        }
        const action = {
            type: logIn.rejected.type,
            error: 'Ошибка входа',
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: 'Ошибка входа',
        });
    });

    test('Тест состояния при успешном выполнении запроса на логаут', () => {
        const state = {
            userInfo: userFixture,
            isAuthorized: false,
            isLoading: false,
            error: null,
        }
        const action = {
            type: logOut.fulfilled.type,
            payload: userFixture,
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: null,
            isAuthorized: false,
            isLoading: false,
            error: null,
        });
    });

    test('Тест состояния при обработке запроса на обновление данных пользователя', () => {
        const state = {
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: false,
            error: null,
        }
        const action = {type: updateUserData.pending.type}
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: true,
            error: null,
        });
    });

    test('Тест состояния при успешном выполнении запроса на обновление данных пользователя', () => {
        const state = {
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: true,
            error: null,
        }
        const action = {
            type: updateUserData.fulfilled.type,
            payload: userFixture,
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: false,
            error: null,
        });
    });
    
    test('Тест состояния при ошбке выполнения запроса на обновление данных пользователя', () => {
        const state = {
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: true,
            error: null,
        }
        const action = {
            type: updateUserData.rejected.type,
            error: 'Ошибка обновления профиля',
        }
        const reducerState = authReducer(state, action);

        expect(reducerState).toEqual({
            userInfo: userFixture,
            isAuthorized: true,
            isLoading: false,
            error: 'Ошибка обновления профиля',
        });
    });
});
