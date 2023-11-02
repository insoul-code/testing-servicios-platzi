import { Calculator } from './calculator';

describe('Test for Calculator', ()=>{
  describe('Tests for multiply', ()=>{
    it('Should return a nine', ()=>{
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta = calculator.multiply(3,3);
      //Assert
      expect(rta).toEqual(9);
    })
    it('Should return a four', ()=>{
      //Arrange
      const calculator = new Calculator();
      //Act
      const rta = calculator.multiply(1,4);
      //Assert
      expect(rta).toEqual(4);
    })
  })

  describe('Tests for divide',()=>{
    it('Should return some numbers', ()=>{
      //Arrange
      const calculator = new Calculator();
      //Act
      expect(calculator.divide(6,3)).toEqual(2);
      expect(calculator.divide(5,2)).toEqual(2.5);
    });
    it('For zero', ()=>{
      //Arrange
      const calculator = new Calculator();
      //Act
      expect(calculator.divide(6,0)).toBeNull();
      expect(calculator.divide(5,0)).toBeNull();
      expect(calculator.divide(12456465,0)).toBeNull();
    });
    it('Tests matchers', ()=>{
      const name = 'tiago';
      let name2;

      expect(name).toBeDefined();
      expect(name2).toBeUndefined();

      expect(1 + 3 === 4).toBeTruthy();
      expect(1 + 1 === 3).toBeFalsy();

      expect(5).toBeLessThan(10);
      expect(20).toBeGreaterThan(10);

      expect('123456').toMatch(/123/);
      expect(['apples', 'oranges', 'pears']).toContain('oranges');
    });
  })
})
