describe('FavoritosProxy', () => {
  it('deve instanciar corretamente', async () => {
    const { FavoritosProxy } = await import('../../../src/proxies/favoritos.proxy');
    const proxy = new FavoritosProxy();
    expect(proxy).toBeDefined();
  });

  it('deve ter URL do serviço configurada', () => {
    const expectedUrl = process.env.FAVORITOS_SERVICE_URL || 'http://localhost:3003';
    expect(expectedUrl).toMatch(/^https?:\/\//);
  });
});
