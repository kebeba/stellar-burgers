import { describe, test, expect } from '@jest/globals';

import { TIngredient } from '@utils-types';

import { assortmentReducer, requestIngredients } from './assortment-slice';


const assortmentFixture: TIngredient[] = [
    {
        "_id": "1",
        "name": "Тестовая булка 1",
        "type": "bun",
        "proteins": 44,
        "fat": 26,
        "carbohydrates": 85,
        "calories": 643,
        "price": 988,
        "image": "https://code.s3.yandex.net/react/code/bun-01.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/bun-01-large.png",
    },
    {
        "_id": "2",
        "name": "Тестовая булка 2",
        "type": "bun",
        "proteins": 80,
        "fat": 24,
        "carbohydrates": 53,
        "calories": 420,
        "price": 1255,
        "image": "https://code.s3.yandex.net/react/code/bun-02.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
    },
    {
        "_id": "3",
        "name": "Тестовый соус 1",
        "type": "sauce",
        "proteins": 101,
        "fat": 99,
        "carbohydrates": 100,
        "calories": 100,
        "price": 88,
        "image": "https://code.s3.yandex.net/react/code/sauce-01.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/sauce-01-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/sauce-01-large.png",
    },
    {
        "_id": "4",
        "name": "Тестовый соус 2",
        "type": "sauce",
        "proteins": 30,
        "fat": 20,
        "carbohydrates": 40,
        "calories": 30,
        "price": 90,
        "image": "https://code.s3.yandex.net/react/code/sauce-02.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/sauce-02-large.png",
    },
    {
        "_id": "5",
        "name": "Тестовая начинка 1",
        "type": "main",
        "proteins": 420,
        "fat": 142,
        "carbohydrates": 242,
        "calories": 4242,
        "price": 424,
        "image": "https://code.s3.yandex.net/react/code/meat-01.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/meat-01-large.png",
    },
    {
        "_id": "6",
        "name": "Тестовая начинка 2",
        "type": "main",
        "proteins": 433,
        "fat": 244,
        "carbohydrates": 33,
        "calories": 420,
        "price": 1337,
        "image": "https://code.s3.yandex.net/react/code/meat-02.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/meat-02-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/meat-02-large.png",
    }
]

describe('Тестирование редьюсера ассортимента ингредиентов', () => {
    test('Тест корректной инициализации', () => {
        const initialState = assortmentReducer(undefined, {type: 'TEST_ACTION'});
        expect(initialState).toEqual({
            ingredients: [],
            isLoading: false,
            errorText: null,
        });
    });

    test('Тест состояния при успешном получении ассортимента ингредиентов', () => {
        const state = {
            ingredients: [],
            isLoading: true,
            errorText: null,
        };
        const action = {
            type: requestIngredients.fulfilled.type,
            payload: assortmentFixture,
        };
        const reducerState = assortmentReducer(state, action);
        
        expect(reducerState).toEqual({
            ingredients: assortmentFixture,
            isLoading: false,
            errorText: null,
        });
    });

    test('Тест состояния при ошибке загрузки ассортимента ингредиентов', () => {
        const state = {
            ingredients: [],
            isLoading: true,
            errorText: null,
        };
        const action = {
            type: requestIngredients.rejected.type,
            error: {message: 'Произошла непредвиденная ошибка'},
        };
        const reducerState = assortmentReducer(state, action);
        
        expect(reducerState).toEqual({
            ingredients: [],
            isLoading: false,
            errorText: 'Произошла непредвиденная ошибка',
        });
    });
    
    test('Тест состояния при обработке запроса на получение ассортимента ингредиентов', () => {
        const state = {
            ingredients: [],
            isLoading: false,
            errorText: null,
        };
        const action = {type: requestIngredients.pending.type};
        const reducerState = assortmentReducer(state, action);
        
        expect(reducerState).toEqual({
            ingredients: [],
            isLoading: true,
            errorText: null,
        });
    });

});
