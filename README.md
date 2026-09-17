# Site da Aurora

[Site](https://auroravoto.com.br) estático para o projeto [Aurora](https://github.com/henriporto/aurora) com HTML, CSS e JS puros, sem build.

| Arquivo | O que é |
| :--- | :--- |
| `index.html` | Página inicial |
| `privacidade.html` | Política de privacidade (exigida pelo Google para publicar o login OAuth) |
| `styles.css` | Estilos, com tema claro e escuro automáticos |
| `script.js` | Abas de instalação e botões de copiar. **A URL do MCP fica no topo (`URL_MCP`)** |
| `lobo.png` | Ícone (lobo-guará, fundo transparente) |
| `CNAME` | Domínio próprio para o GitHub Pages |

## Ver localmente

```bash
cd aurora-site
python3 -m http.server 8080
# abra http://localhost:8080
```
