import { createApp } from '../../src/index';

describe('Servidor Principal - Integração', () => {
  it('deve criar o app sem lançar erro', () => {
    const app = createApp();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });
});
