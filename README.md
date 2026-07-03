# Elementos do Sentimento — como publicar

Este pacote já vem pronto para publicar. A diferença em relação ao arquivo
`.jsx` que você baixou antes: aqui o modo "Escrever em texto" chama uma
função de servidor (`api/analyze.js`) em vez de chamar a IA direto do
navegador. Isso é obrigatório — dentro do Claude a chamada para a IA é
liberada automaticamise, mas em um site publicado, se o navegador da pessoa
chamasse a Anthropic diretamente, sua chave de API ficaria visível no código
e qualquer um poderia roubar e usar (e gastar seu crédito). Por isso existe
esse "meio de campo" no servidor, que guarda a chave em segredo.

## Passo 1 — Criar a chave de API

1. Acesse **console.anthropic.com** (redireciona para a Claude Platform) e
   crie uma conta — é separada da sua conta do claude.ai.
2. Cadastre um cartão em **Billing** (é pré-pago: você recorrega créditos;
   dá pra colocar um limite de gasto mensal para não ter susto).
3. Vá em **API Keys → Create Key**, dê um nome (ex: `identificador-emocoes`)
   e copie a chave — ela começa com `sk-ant-` e só aparece uma vez.

Esse app usa o modelo `claude-haiku-4-5-20251001`, que é rápido e barato —
ótimo para uma tarefa simples como identificar emoções em um texto curto.
O custo por análise é bem baixo (frações de centavo).

## Passo 2 — Colocar o código no GitHub

1. Crie uma conta em **github.com** se ainda não tiver.
2. Crie um repositório novo (pode ser privado) chamado, por exemplo,
   `identificador-emocoes`.
3. Suba todos os arquivos desta pasta para esse repositório (pelo site do
   GitHub mesmo dá pra arrastar os arquivos em "Add file → Upload files").

## Passo 3 — Publicar na Vercel

A Vercel é a forma mais simples: ela reconhece automaticamente a pasta
`api/` e transforma `analyze.js` em uma função de servidor, sem você
precisar configurar nada.

1. Acesse **vercel.com** e crie uma conta (dá pra entrar direto com o
   GitHub).
2. Clique em **Add New → Project** e selecione o repositório que você
   acabou de criar.
3. Antes de clicar em "Deploy", abra **Environment Variables** e adicione:
   - Nome: `ANTHROPIC_API_KEY`
   - Valor: a chave `sk-ant-...` que você copiou no Passo 1
4. Clique em **Deploy**. Em cerca de 1 minuto você recebe um link do tipo
   `identificador-emocoes.vercel.app` — esse já é o site publicado,
   funcionando para qualquer pessoa.

Depois disso, qualquer atualização que você subir para o GitHub é
publicada automaticamente de novo.

## Domínio próprio (opcional)

Se quiser usar algo como `emocoes.papelandia.com.br` ou outro domínio seu,
dentro do projeto na Vercel vá em **Settings → Domains** e siga as
instruções para apontar o DNS. A Vercel emite o certificado de segurança
(https) automaticamente.

## Testar no seu computador antes de publicar (opcional)

Isso exige ter o Node.js instalado. Com o terminal aberto dentro da pasta
do projeto:

```
npm install -g vercel
npm install
vercel dev
```

O comando `vercel dev` sobe o site E a função `api/analyze.js` juntos
localmente (o comando `npm run dev` sozinho não serve — ele só sobe a
parte visual, sem a função de IA). Ele vai pedir a `ANTHROPIC_API_KEY`;
você pode criar um arquivo `.env` (copiando o `.env.example`) com sua
chave para não precisar digitar toda vez.

## Se preferir Netlify em vez de Vercel

Funciona também, só muda o formato da função de servidor. Se quiser, eu
adapto o `api/analyze.js` para o formato do Netlify Functions — é só
pedir.
