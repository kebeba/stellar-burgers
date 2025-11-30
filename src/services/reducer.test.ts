import { describe, test, expect } from '@jest/globals'

import { rootReducer } from './reducer'


describe('Тестирование корневого редьюсера', () => {
    test('Тест корректной инициализации', () => {
        const initialState = rootReducer(undefined, {type: 'TEST_ACTION'});
        expect(initialState).toEqual({
            assortment: {
                ingredients: [],
                isLoading: false,
                errorText: null,
            },
            auth: {
                userInfo: null,
                isAuthorized: false,
                isLoading: false,
                error: null,
            },
            burgerConstructor: {
                bun: null,
                ingredients: [],
            },
            orders: {
                currentOrder: null,
                overallOrders: {
                    orders: [],
                    total: 0,
                    totalToday: 0
                },
                userOrders: [],
                modalOrders: null,
                isLoading: false,
                isOrdersLoading: false,
                errorText: null,
                ordersErrorText: null,
            },
        })
    });
});
