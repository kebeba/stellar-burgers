import { describe, test, expect } from '@jest/globals';

import { TIngredient } from '@utils-types'

import {
    constructorReducer,
    addIngredient,
    deleteIngredient,
    reorderIngredient,
    clearIngredients,
} from './constructor-slice'


const bunFixture: TIngredient = {
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
};
const anotherBunFixture: TIngredient = {
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
};
const sauceFixture: TIngredient = {
    "_id": "3",
    "name": "Тестовый соус",
    "type": "sauce",
    "proteins": 101,
    "fat": 99,
    "carbohydrates": 100,
    "calories": 100,
    "price": 88,
    "image": "https://code.s3.yandex.net/react/code/sauce-01.png",
    "image_mobile": "https://code.s3.yandex.net/react/code/sauce-01-mobile.png",
    "image_large": "https://code.s3.yandex.net/react/code/sauce-01-large.png",
};
const fillingFixture: TIngredient = {
    "_id": "4",
    "name": "Тестовая начинка",
    "type": "main",
    "proteins": 420,
    "fat": 142,
    "carbohydrates": 242,
    "calories": 4242,
    "price": 424,
    "image": "https://code.s3.yandex.net/react/code/meat-01.png",
    "image_mobile": "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
    "image_large": "https://code.s3.yandex.net/react/code/meat-01-large.png",
};

describe('Тестирование редьюсера конструктора бургера', () => {
    test('Тест корректной инициализации', () => {
        const initialState = constructorReducer(undefined, {type: 'TEST_ACTION'});
        expect(initialState).toEqual({
            bun: null,
            ingredients: [],
        });
    });

    test('Тест добавления ингредиентов', () => {
        const state = {
            bun: null,
            ingredients: [],
        };
        let action = addIngredient(bunFixture);
        let reducerState = constructorReducer(state, action);
        expect(reducerState.ingredients).toHaveLength(0);
        expect(reducerState.bun).toEqual({...bunFixture, id: 'fake_ingredient_uuid'});

        action = addIngredient(sauceFixture);
        reducerState = constructorReducer(reducerState, action);
        expect(reducerState.ingredients).toHaveLength(1);
        expect(reducerState.bun).toEqual({...bunFixture, id: 'fake_ingredient_uuid'});

        action = addIngredient(fillingFixture);
        reducerState = constructorReducer(reducerState, action);
        expect(reducerState.ingredients).toHaveLength(2);
        expect(reducerState.bun).toEqual({...bunFixture, id: 'fake_ingredient_uuid'});

        action = addIngredient(anotherBunFixture);
        reducerState = constructorReducer(reducerState, action);
        expect(reducerState.ingredients).toHaveLength(2);
        expect(reducerState.bun).toEqual({...anotherBunFixture, id: 'fake_ingredient_uuid'});
    });

    test('Тест удаления ингредиента', () => {
        const state = {
            bun: null,
            ingredients: [{...fillingFixture, id: 'filling_uuid'}],
        }; 
        const action = deleteIngredient(0);
        const reducerState = constructorReducer(state, action);
        expect(reducerState.ingredients).toHaveLength(0);
    });

    test('Тест перемещения ингредиента', () => {
        const state = {
            bun: null,
            ingredients: [
                {...fillingFixture, id: 'filling_uuid'},
                {...sauceFixture, id: 'sauce_uuid'},
            ],
        };
        
        let action = reorderIngredient({fromIdx: 0, toIdx: 1});
        let reducerState = constructorReducer(state, action);
        expect(reducerState.ingredients[0].name).toEqual('Тестовый соус');
        expect(reducerState.ingredients[1].name).toEqual('Тестовая начинка');

        action = reorderIngredient({fromIdx: 1, toIdx: 0});
        reducerState = constructorReducer(reducerState, action);
        expect(reducerState.ingredients[0].name).toEqual('Тестовая начинка');
        expect(reducerState.ingredients[1].name).toEqual('Тестовый соус');
    });

    test('Тест очистки конструктора', () => {
        const state = {
            bun: {...bunFixture, id: 'bun_uuid'},
            ingredients: [
                {...fillingFixture, id: 'filling_uuid'},
                {...sauceFixture, id: 'sauce_uuid'},
            ],
        };
        const action = clearIngredients();
        const reducerState = constructorReducer(state, action);
        
        expect(reducerState.bun).toBeNull();
        expect(reducerState.ingredients).toHaveLength(0);
    });
});
