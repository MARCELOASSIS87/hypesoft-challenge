# ADR 0016 — Estratégia de Testes para Rate Limiting

## Contexto
O desafio exige implementação de **rate limiting** no backend (.NET 9).  
O middleware foi configurado com política `"fixed"`, aplicada ao endpoint `/_rl-test` (usado apenas em ambiente de desenvolvimento).  
Durante os testes manuais no **console do navegador**, conseguimos reproduzir o esperado **HTTP 429 Too Many Requests** ao disparar múltiplas requisições.

No entanto, ao tentar validar o mesmo cenário com **xUnit + TestServer**, não foi possível obter o 429.  
Isso ocorre porque o `TestServer` processa as requisições **in-proc** e tende a serializar chamadas concorrentes, impedindo a simulação realista de estouro de limite.

## Decisão
- Mantivemos um **teste determinístico** que valida via **metadados do endpoint** se:
  - o endpoint `/_rl-test` existe;
  - ele possui a política `"fixed"` aplicada.
- Para evidência prática, registramos que no console do navegador os 429 foram observados, comprovando o comportamento real em ambiente de execução.
- Assim, a cobertura automatizada garante que a configuração não seja removida acidentalmente, enquanto a validação manual mostra o efeito prático.

## Consequências
- **Positivo**: teste estável, não flakiness, documentação clara.  
- **Negativo**: não há assert automático de 429 dentro do TestServer; aceitamos a limitação técnica.  
- **Mitigação**: documentação + evidência manual + teste de configuração automatizado.

---
