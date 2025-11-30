import { describe, test, expect } from '@jest/globals';

import { TOrder } from '@utils-types'

import {
    ordersReducer,
    makeOrder,
    fetchOrders,
    getSpecifiedOrder,
    getUserOrders,
    clearOrderData,
    clearModalOrderData,
} from './orders-slice'


const initialStateFixture = {
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
    ordersErrorText: null
}
const ordersFixture: TOrder[] = [
    {
        _id: 'fake-order-1-uuid',
        status: 'done',
        name: 'Тестовый бургер 1',
        createdAt: '2025-11-30T12:30:00.000Z',
        updatedAt: '2025-11-30T12:45:00.000Z',
        number: 1,
        ingredients: [
            'ingredient-uuid-1',
            'ingredient-uuid-2',
            'ingredient-uuid-3',
        ],
    },
    {
        _id: 'fake-order-2-uuid',
        status: 'done',
        name: 'Тестовый бургер 2',
        createdAt: '2025-11-30T12:10:00.000Z',
        updatedAt: '2025-11-30T12:25:00.000Z',
        number: 2,
        ingredients: [
            'ingredient-uuid-4',
            'ingredient-uuid-5',
        ],
    },
]

describe('Тестирование редьюсера заказов', () => {
    test('Тест корректной инициализации', () => {
        const initialState = ordersReducer(undefined, {type: 'TEST_ACTION'});
        expect(initialState).toEqual(initialStateFixture);
    });

    test('Тест состояния при обработке запроса на создание заказа', () => {
        const action = {type: makeOrder.pending.type};
        const reducerState = ordersReducer(initialStateFixture, action);
        expect(reducerState.isLoading).toBe(true);
        expect(reducerState.errorText).toBeNull();
    });

    test('Тест состояния при обработке запроса на создание заказа', () => {
        const action = {type: makeOrder.pending.type};
        const reducerState = ordersReducer(initialStateFixture, action);
        expect(reducerState.isLoading).toBe(true);
        expect(reducerState.errorText).toBeNull();
    });

    test('Тест состояния при успешном выполнении запроса на создание заказа', () => {
        const action = {
            type: makeOrder.fulfilled.type,
            payload: ordersFixture[0],
        };
        const state = {...initialStateFixture, isLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isLoading).toBe(false);
        expect(reducerState.errorText).toBeNull();
        expect(reducerState.currentOrder).toEqual(ordersFixture[0]);
    });

    test('Тест состояния при ошибке выполнения запроса на создание заказа', () => {
        const action = {
            type: makeOrder.rejected.type,
            error: 'Неизвестная ошибка',
        };
        const state = {...initialStateFixture, isLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isLoading).toBe(false);
        expect(reducerState.errorText).toEqual('Неизвестная ошибка');
        expect(reducerState.currentOrder).toBeNull();
    });

    test('Тест состояния при обработке запроса на получение ленты заказов', () => {
        const action = {type: fetchOrders.pending.type};
        const reducerState = ordersReducer(initialStateFixture, action);
        expect(reducerState.isOrdersLoading).toBe(true);
        expect(reducerState.ordersErrorText).toBeNull();
    });

    test('Тест состояния при успешном выполнении запроса на получение ленты заказов', () => {
        const action = {
            type: fetchOrders.fulfilled.type,
            payload: {
                orders: ordersFixture,
                total: 2,
                totalToday: 2,
            },
        };
        const state = {...initialStateFixture, isOrdersLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isOrdersLoading).toBe(false);
        expect(reducerState.ordersErrorText).toBeNull();
        expect(reducerState.overallOrders.orders).toEqual(ordersFixture);
        expect(reducerState.overallOrders.total).toEqual(2);
        expect(reducerState.overallOrders.totalToday).toEqual(2);
    });

    test('Тест состояния при ошибке выполнения запроса на получение ленты заказов', () => {
        const action = {
            type: fetchOrders.rejected.type,
            error: 'Неизвестная ошибка',
        };
        const state = {...initialStateFixture, isOrdersLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isOrdersLoading).toBe(false);
        expect(reducerState.ordersErrorText).toEqual('Неизвестная ошибка');
        expect(reducerState.overallOrders).toEqual(initialStateFixture.overallOrders);
    });

    test('Тест состояния при обработке запроса на получение указанного заказа', () => {
        const action = {type: getSpecifiedOrder.pending.type};
        const reducerState = ordersReducer(initialStateFixture, action);
        expect(reducerState.isLoading).toBe(true);
        expect(reducerState.errorText).toBeNull();
    });

    test('Тест состояния при успешном выполнении запроса на получение указанного заказа', () => {
        const action = {
            type: getSpecifiedOrder.fulfilled.type,
            payload: ordersFixture[1],
        };
        const state = {...initialStateFixture, isLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isLoading).toBe(false);
        expect(reducerState.errorText).toBeNull();
        expect(reducerState.modalOrders).toEqual(ordersFixture[1]);
    });

    test('Тест состояния при ошибке выполнения запроса на получение указанного заказа', () => {
        const action = {
            type: getSpecifiedOrder.rejected.type,
            error: 'Неизвестная ошибка',
        };
        const state = {...initialStateFixture, isOrdersLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isLoading).toBe(false);
        expect(reducerState.errorText).toEqual('Неизвестная ошибка');
        expect(reducerState.modalOrders).toBeNull();
    });

    test('Тест состояния при обработке запроса на получение заказов пользователя', () => {
        const action = {type: getUserOrders.pending.type};
        const reducerState = ordersReducer(initialStateFixture, action);
        expect(reducerState.isLoading).toBe(true);
        expect(reducerState.errorText).toBeNull();
        expect(reducerState.userOrders).toHaveLength(0);
    });

    test('Тест состояния при успешном выполнении запроса на получение заказов пользователя', () => {
        const action = {
            type: getUserOrders.fulfilled.type,
            payload: ordersFixture,
        };
        const state = {...initialStateFixture, isLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isLoading).toBe(false);
        expect(reducerState.errorText).toBeNull();
        expect(reducerState.userOrders).toEqual(ordersFixture);
    });

    test('Тест состояния при ошибке выполнения запроса на получение заказов пользователя', () => {
        const action = {
            type: getUserOrders.rejected.type,
            error: 'Неизвестная ошибка',
        };
        const state = {...initialStateFixture, isLoading: true};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.isLoading).toBe(false);
        expect(reducerState.errorText).toEqual('Неизвестная ошибка');
        expect(reducerState.userOrders).toHaveLength(0);
    });

    test('Тест состояния при очистке данных заказа', () => {
        const action = clearOrderData();
        const state = {...initialStateFixture, currentOrder: ordersFixture[1]};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.errorText).toBeNull();
        expect(reducerState.currentOrder).toBeNull();
    });

    test('Тест состояния при очистке данных заказа в модальном окне', () => {
        const action = clearModalOrderData();
        const state = {...initialStateFixture, modalOrders: ordersFixture[1]};
        const reducerState = ordersReducer(state, action);
        
        expect(reducerState.errorText).toBeNull();
        expect(reducerState.modalOrders).toBeNull();
    });
});
