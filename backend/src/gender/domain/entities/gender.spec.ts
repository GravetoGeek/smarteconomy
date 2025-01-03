import {Gender} from './gender';

describe('Gender',() => {
    it('Deve ser definido',() => {
        expect(new Gender()).toBeDefined();
    });
});
