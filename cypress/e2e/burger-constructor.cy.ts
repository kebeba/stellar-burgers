import { TIngredient } from '@utils-types'

describe('Тестирование окна создания бургера', () => {
    
    let assortmentData: TIngredient[];
    
    beforeEach(() => {
        cy.intercept('GET', 'api/ingredients', {fixture: 'assortment.json'}).as('fetchAssortment');
        cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
        cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('makeOrder');
        
        window.localStorage.setItem('refreshToken', JSON.stringify('fake-refreshToken'));
        cy.setCookie('accessToken', 'fake-accessToken');
        
        cy.visit('');
        cy.wait('@fetchAssortment').then((interception) => {
            assortmentData = interception.response?.body.data;
        })
    });

    afterEach(function () {
        cy.clearAllLocalStorage();
        cy.clearCookies();
    });

    it('Тест добавления ингредиентов в конструктор', () => {
        const bun = assortmentData[0];
        const sauce = assortmentData[2];
        const filling = assortmentData[4];
        let orderPrice: number = 0;
        
        cy.get('[data-cy=assortment-buns]').contains('Добавить').click();
        cy.get('[data-cy=constructor-bun-top]').contains(bun.name).should('exist');
        cy.get('[data-cy=constructor-bun-bottom]').contains(bun.name).should('exist');
        orderPrice = bun.price * 2;
        cy.get('[data-cy=order-price] p').should('have.text', orderPrice.toString());
        
        cy.get('[data-cy=assortment-sauces]').contains('Добавить').click();
        cy.get('[data-cy=constructor-ingredients]').contains(sauce.name).should('exist');
        orderPrice += sauce.price;
        cy.get('[data-cy=order-price] p').should('have.text', orderPrice.toString());
        
        cy.get('[data-cy=assortment-fillings]').contains('Добавить').click();
        cy.get('[data-cy=constructor-ingredients]').contains(filling.name).should('exist');
        orderPrice += filling.price;
        cy.get('[data-cy=order-price] p').should('have.text', orderPrice.toString());
    });

    it('Тест открытия модального окна с деталями ингредиента', () => {
        const selectedIngredient = assortmentData[1];
        cy.get('[data-cy=modal-title]').should('not.exist');
        cy.contains(selectedIngredient.name).click();
        cy.get('[data-cy=modal-title]').should('exist').and('have.text', 'Детали ингредиента');
        cy.contains(selectedIngredient.calories).should('exist');
        cy.contains(selectedIngredient.proteins).should('exist');
        cy.contains(selectedIngredient.fat).should('exist');
        cy.contains(selectedIngredient.carbohydrates).should('exist');
        cy.get('#modals').should('exist');
    });

    it('Тест закрытия модального окна по нажатию на иконку', () => {
        const selectedIngredient = assortmentData[3];
        cy.contains(selectedIngredient.name).click();
        cy.get('[data-cy=modal-title]').should('exist').and('have.text', 'Детали ингредиента');
        cy.get('[data-cy=modal-close-btn]').click();
        cy.get('[data-cy=modal-title]').should('not.exist');
    });

    it('Тест закрытия модального окна по нажатию на оверлей', () => {
        const selectedIngredient = assortmentData[5];
        cy.contains(selectedIngredient.name).click();
        cy.get('[data-cy=modal-title]').should('exist').and('have.text', 'Детали ингредиента');
        cy.get('[data-cy=modal-overlay]').click('left', {force: true});
        cy.get('[data-cy=modal-title]').should('not.exist');
    });

    it('Тест закрытия модального окна по нажатию на Esc', () => {
        const selectedIngredient = assortmentData[4];
        cy.contains(selectedIngredient.name).click();
        cy.get('[data-cy=modal-title]').should('exist').and('have.text', 'Детали ингредиента');
        cy.get('body').type('{esc}');
        cy.get('[data-cy=modal-title]').should('not.exist');
    });

    it('Тест создания заказа', () => {
        cy.get('[data-cy=assortment-buns]').contains('Добавить').click();
        cy.get('[data-cy=assortment-sauces]').contains('Добавить').click();
        cy.get('[data-cy=assortment-fillings]').contains('Добавить').click();

        cy.get('[data-cy=make-order-btn]').click();
        cy.wait('@makeOrder').then((interception) => {
            const orderData = interception.response?.body.order;
            cy.get(`[data-cy=order-number]`).contains(orderData.number).should('exist');
        });

        cy.get('[data-cy=modal-close-btn]').click();
        cy.get(`[data-cy=order-number]`).should('not.exist');

        cy.get('[data-cy=constructor-empty-bun-top]').should('exist').and('have.text', 'Выберите булки');
        cy.get('[data-cy=constructor-empty-ingredients]').should('exist').and('have.text', 'Выберите начинку');
        cy.get('[data-cy=constructor-empty-bun-bottom]').should('exist').and('have.text', 'Выберите булки');
    });
})
