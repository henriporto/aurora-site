# Configurar o domínio `auroravoto.com.br` no Registro.br

Guia para apontar `auroravoto.com.br` (e `www.auroravoto.com.br`) para o site no GitHub Pages.

| Item | Valor |
| :--- | :--- |
| Domínio | `auroravoto.com.br` |
| Repositório | `henriporto/aurora-site` |
| Domínio padrão do Pages | `henriporto.github.io` |
| Publicação | GitHub Actions (`.github/workflows/static.yml`) |

> **Importante:** como o site é publicado por um workflow do GitHub Actions, o arquivo `CNAME` do repositório é **ignorado**. O domínio precisa ser cadastrado em **Settings → Pages** (passo 2). O arquivo pode ficar, mas não é ele que configura nada.

A ordem abaixo segue a recomendação do GitHub: verificar o domínio e cadastrá-lo no repositório **antes** de mexer no DNS, para ninguém conseguir "sequestrar" o domínio no meio do caminho.

---

## 1. Verificar o domínio na sua conta do GitHub (recomendado)

1. No GitHub, clique na sua foto → **Settings** → **Pages** (na seção "Code, planning, and automation").
2. Clique em **Add a domain**, digite `auroravoto.com.br` e clique em **Add domain**.
3. O GitHub mostra um registro **TXT** parecido com:
   - Nome: `_github-pages-challenge-henriporto.auroravoto.com.br`
   - Valor: um código aleatório (ex.: `a1b2c3d4e5...`)
4. Deixe essa tela aberta. Você vai criar esse TXT no Registro.br no passo 3 e voltar aqui para clicar em **Verify**.

## 2. Cadastrar o domínio no repositório

1. Abra `https://github.com/henriporto/aurora-site` → **Settings** → **Pages**.
2. Em **Custom domain**, digite `auroravoto.com.br` e clique em **Save**.
3. Vai aparecer um aviso de que o DNS ainda não está correto. É normal, siga para o próximo passo.

## 3. Criar os registros no Registro.br

1. Entre em <https://registro.br> e faça login.
2. No painel, clique no domínio `auroravoto.com.br`.
3. Na seção **DNS**, confira se o domínio usa os **servidores DNS do Registro.br** (`a.auto.dns.br` / `b.auto.dns.br`). Se estiver usando outros servidores, clique em **Alterar servidores DNS** → **Utilizar os DNS do Registro.br** e salve.
4. Clique em **Configurar zona DNS** (ou **Editar zona**). Se aparecer a opção **Modo avançado**, ative-a.
5. Se já existir algum registro padrão apontando o domínio para outro lugar (ex.: um `A` ou `CNAME` de página de estacionamento), **apague**.
6. Clique em **Nova entrada** e adicione cada registro abaixo.

> No Registro.br, o campo **Nome** já completa com `.auroravoto.com.br`. Para o domínio raiz (apex), **deixe o Nome em branco**. Para o `www`, escreva só `www`.

### Registros A (domínio raiz, IPv4)

| Tipo | Nome | Dados |
| :--- | :--- | :--- |
| A | *(em branco)* | `185.199.108.153` |
| A | *(em branco)* | `185.199.109.153` |
| A | *(em branco)* | `185.199.110.153` |
| A | *(em branco)* | `185.199.111.153` |

### Registros AAAA (domínio raiz, IPv6)

| Tipo | Nome | Dados |
| :--- | :--- | :--- |
| AAAA | *(em branco)* | `2606:50c0:8000::153` |
| AAAA | *(em branco)* | `2606:50c0:8001::153` |
| AAAA | *(em branco)* | `2606:50c0:8002::153` |
| AAAA | *(em branco)* | `2606:50c0:8003::153` |

### Registro CNAME (www)

| Tipo | Nome | Dados |
| :--- | :--- | :--- |
| CNAME | `www` | `henriporto.github.io` |

- Aponte para `henriporto.github.io`, **sem** o nome do repositório e **não** para `auroravoto.com.br`.
- Com o raiz e o `www` configurados, o GitHub redireciona `www.auroravoto.com.br` → `auroravoto.com.br` sozinho.

### Registro TXT (verificação do passo 1)

| Tipo | Nome | Dados |
| :--- | :--- | :--- |
| TXT | `_github-pages-challenge-henriporto` | *o código que o GitHub mostrou* |

7. Clique em **Salvar alterações**. O Registro.br costuma publicar em alguns minutos, mas a propagação pode levar até 24 horas.

> **Não crie registro curinga** (`*`, ou seja, `*.auroravoto.com.br`). Ele permite que outra pessoa hospede um site em subdomínios seus, mesmo com o domínio verificado.

## 4. Conferir o DNS

No Linux/WSL (se faltar o `dig`: `sudo apt install dnsutils`):

```bash
# Raiz: deve listar os 4 IPs 185.199.10x.153
dig auroravoto.com.br +noall +answer -t A

# IPv6: deve listar os 4 endereços 2606:50c0:800x::153
dig auroravoto.com.br +noall +answer -t AAAA

# www: deve mostrar CNAME para henriporto.github.io.
dig www.auroravoto.com.br +nostats +nocomments +nocmd

# Verificação: deve mostrar o código do GitHub
dig _github-pages-challenge-henriporto.auroravoto.com.br +noall +answer -t TXT
```

No Windows (PowerShell):

```powershell
Resolve-DnsName auroravoto.com.br -Type A
Resolve-DnsName www.auroravoto.com.br -Type CNAME
```

Para ver se já propagou pelo mundo: <https://dnschecker.org>.

## 5. Finalizar no GitHub

1. Volte à tela do passo 1 e clique em **Verify**. Depois de verificado, pode apagar o TXT, mas é melhor mantê-lo.
2. Em **Settings → Pages** do repositório, espere o aviso ficar verde ("DNS check successful"). Se estiver demorando, clique em **Remove** e salve o domínio de novo para forçar uma nova checagem.
3. Marque **Enforce HTTPS**. O certificado pode levar até 24 horas para ficar disponível; enquanto isso a caixa fica desativada.
4. Rode o workflow de novo (aba **Actions** → *Deploy static content to Pages* → **Run workflow**) ou faça um push na `main`.
5. Teste: <https://auroravoto.com.br> e <https://www.auroravoto.com.br>.

---

## Problemas comuns

| Sintoma | Causa provável |
| :--- | :--- |
| "Domain's DNS record could not be retrieved" | DNS ainda propagando. Espere e confira com `dig`. |
| "Custom domain is already taken" | O domínio está cadastrado em outro repositório. Remova lá (Settings → Pages → **Remove**). |
| **Enforce HTTPS** desativado | Certificado ainda sendo emitido. Aguarde até 24 h. Se não resolver, remova e salve o domínio de novo. |
| Site 404 do GitHub | O domínio não está salvo em Settings → Pages, ou o workflow ainda não rodou. |
| `www` não funciona | CNAME apontando para o lugar errado. Deve ser `henriporto.github.io`. |
| Nada muda no `dig` | O domínio não está usando os DNS do Registro.br (veja o passo 3.3). |

## Segurança

Se um dia desativar o GitHub Pages deste repositório, **apague também os registros A, AAAA e CNAME no Registro.br**. DNS apontando para o GitHub sem site ativo permite que outra pessoa assuma o domínio.

Referência: [Gerenciar um domínio personalizado (GitHub Docs)](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
