O que os testes cobrem (texto pronto pra ler)

ApiFactory
“Nos testes eu levanto uma API de teste com ambiente ‘Development’ e ajusto configurações só para a suíte: libero CORS para http://localhost:3000 e deixo o rate limit propositalmente baixo (1 requisição por janela) pra conseguir validar as respostas 429 quando necessário.”

RateLimitingTests
“Este teste garante que o endpoint interno /_rl-test realmente existe e que a política de rate limiting chamada fixed está aplicada nele. Eu varro as rotas mapeadas, encontro /_rl-test e confirmo via metadados que a policy é exatamente ‘fixed’. Isso evita falso-positivo de configuração.”

SecurityHeadersTests
“Aqui eu chamo GET /health e confirmo que os cabeçalhos de segurança estão presentes na resposta: X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy e Permissions-Policy. É um ‘checklist’ automático que evita regressão de headers.”

CorsTests
“Eu simulo um preflight CORS: mando um OPTIONS /products com Origin: http://localhost:3000 e Access-Control-Request-Method: GET. O esperado é 204 No Content e o cabeçalho Access-Control-Allow-Origin devolvendo exatamente http://localhost:3000. Isso prova que o front na porta 3000 está autorizado.”

Inventory_SmokeTests
“Este é um smoke test: ele não valida regra de negócio — ele garante que a suíte está operacional e o pipeline de testes está funcionando antes dos testes específicos de estoque.”

InventoryServiceTests
“São os testes unitários principais do serviço de estoque. Eles validam entradas corretas e erros:
– in: aumenta o estoque e rejeita quantidades zero/negativas;
– out: reduz estoque quando há saldo e lança exceção se a saída deixaria o estoque negativo;
– adjustment: permite ajustes positivos/negativos, mas nunca deixa ir abaixo de zero;
– casos gerais: parâmetros nulos, tipo inválido e mensagens de erro coerentes.”

InventoryServiceMoreTests
“Complementam o serviço de estoque com cenários de sequência e consistência: aplico o retorno de cada operação no produto e confiro o valor final; cubro bordas como ‘sair até zero’, ajuste exato até zero, trabalhar abaixo do estoque mínimo (permitido), grandes quantidades e um teste paramétrico que confere se o retorno sempre bate com o estado do produto após aplicar.”

UnitTest1
“É apenas um placeholder vazio gerado pelo template; fica no projeto pra manter a estrutura, mas não exerce validação de regra.”