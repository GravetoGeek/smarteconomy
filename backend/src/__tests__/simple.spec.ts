describe('Test Environment', () => {
    it('should work', () => {
        expect(true).toBe(true)
    })

    it('should have access to jest functions', () => {
        expect(jest).toBeDefined()
        expect(describe).toBeDefined()
        expect(it).toBeDefined()
        expect(expect).toBeDefined()
    })
})
