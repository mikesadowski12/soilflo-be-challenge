import { expect } from 'chai';

import { materials } from '../../../kernel';

describe('Kernel Unit Tests - Consts', () => {
  describe('list of materials', () => {
    it('should be a Set() type', () => {
      expect(materials instanceof Set).to.equal(true);
    });

    it('should contain required materials', () => {
      const required = ['Soil'];
      required.forEach(requiredMaterial => expect(materials.has(requiredMaterial)).to.equal(true));
    });
  });
});
