// Base URL do API Gateway, injetada pelo Vite em dev/build via import.meta.env.
//
// Este módulo é carregado apenas pelo Vite. Nos testes Jest (CommonJS,
// onde import.meta não existe) ele é substituído por ./api-config.jest.ts
// através do moduleNameMapper no jest.config.mjs.
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? '';
