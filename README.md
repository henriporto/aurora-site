# Site da Aurora

[Site](https://auroravoto.com.br) estático para o projeto [Aurora](https://github.com/henriporto/aurora) com HTML, CSS e JS puros, sem build.

| Arquivo | O que é |
| :--- | :--- |
| `index.html` | Página inicial |
| `privacidade.html` | Política de privacidade (exigida pelo Google para publicar o login OAuth) |
| `styles.css` | Estilos, com tema claro e escuro automáticos |
| `script.js` | Abas de instalação e botões de copiar. **A URL do MCP fica no topo (`URL_MCP`)** |
| `favicon.svg` | Ícone |
| `CNAME` | Domínio próprio para o GitHub Pages |

## Ver localmente

```bash
cd aurora-site
python3 -m http.server 8080
# abra http://localhost:8080
```

## Publicar no GitHub Pages

O site fica na pasta `aurora-site/`, e o GitHub Pages só publica sozinho a raiz ou a pasta `/docs`.
Por isso a publicação é feita pelo workflow `.github/workflows/pages.yml`, que envia só esta pasta.

### 1. Criar o repositório e enviar o código

Crie um repositório vazio no GitHub (ex.: `henriporto/aurora-site`). Não use `henriporto/aurora`,
que já é o do servidor. Depois, na raiz deste projeto (`/home/hempp/aurora`):

```bash
git branch -M main
git add .
git commit -m "feat: esboço do site"
git remote add origin git@github.com:henriporto/aurora-site.git
git push -u origin main
```

### 2. Ativar o GitHub Pages

No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

O workflow roda a cada push na `main`. Acompanhe na aba **Actions**. Ao terminar, o site
já abre em `https://henriporto.github.io/aurora-site/`.

### 3. Verificar o domínio na sua conta do GitHub (recomendado)

Isso impede que outra conta publique um site no seu domínio.

1. **Configurações da sua conta** (não do repositório) → **Pages** → **Add a domain** → `auroravoto.com.br`.
2. O GitHub mostra um registro **TXT** (`_github-pages-challenge-henriporto`). Crie esse registro no DNS (passo 4) e clique em **Verify**.

### 4. Configurar o DNS no registro.br

Em [registro.br](https://registro.br) → seu domínio → **DNS** → **Editar zona** (se pedir, escolha
"Utilizar os servidores DNS do Registro.br"). Crie:

| Tipo | Nome | Valor |
| :--- | :--- | :--- |
| A | *(vazio, domínio raiz)* | `185.199.108.153` |
| A | *(vazio)* | `185.199.109.153` |
| A | *(vazio)* | `185.199.110.153` |
| A | *(vazio)* | `185.199.111.153` |
| AAAA | *(vazio)* | `2606:50c0:8000::153` |
| AAAA | *(vazio)* | `2606:50c0:8001::153` |
| AAAA | *(vazio)* | `2606:50c0:8002::153` |
| AAAA | *(vazio)* | `2606:50c0:8003::153` |
| CNAME | `www` | `henriporto.github.io.` |
| TXT | `_github-pages-challenge-henriporto` | *(valor dado pelo GitHub no passo 3)* |
| A | `mcp` | *IP fixo da VM do GCP* (servidor MCP) |

Confira os IPs atuais do GitHub Pages na
[documentação oficial](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
A propagação costuma levar de minutos a algumas horas. Para testar:

```bash
dig +short auroravoto.com.br
dig +short mcp.auroravoto.com.br
```

### 5. Ligar o domínio ao site

No repositório: **Settings → Pages → Custom domain** → `auroravoto.com.br` → **Save**.
Quando o GitHub terminar de checar o DNS, marque **Enforce HTTPS**. O certificado pode levar
até cerca de 1 hora para ficar pronto.

Pronto: `https://auroravoto.com.br` serve o site, e `www` redireciona para ele.

## Depois de publicar

- **Servidor MCP:** no `.env` do deploy, `LEIS_DOMINIO=mcp.auroravoto.com.br` e
  `LEIS_URL_PUBLICA=https://mcp.auroravoto.com.br`. O Caddy emite o HTTPS sozinho quando o DNS apontar para a VM.
- **Google Cloud Console → OAuth:**
  - adicione `auroravoto.com.br` aos domínios autorizados e verifique-o no Search Console;
  - página inicial `https://auroravoto.com.br`;
  - política de privacidade `https://auroravoto.com.br/privacidade.html`;
  - atualize o URI de redirecionamento para o novo domínio do MCP.
- **Privacidade:** preencha os campos entre colchetes em `privacidade.html`.
