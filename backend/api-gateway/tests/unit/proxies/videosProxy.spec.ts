describe('VideosProxy', () => {
  it('deve instanciar corretamente', async () => {
    const { VideosProxy } = await import('../../../src/proxies/videos.proxy');
    const proxy = new VideosProxy();
    expect(proxy).toBeDefined();
  });
});
