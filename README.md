# OceanPact CBO

> **Projeto não oficial.** Feito por colegas para uma apresentação. Não é um site da OceanPact nem da CBO; marcas, nomes e imagens pertencem às respectivas empresas.

Site com a página inicial e a aba do Linkedin.

**Acesse:** https://carlos-pssc.github.io/oceanpact-cbo/

## Páginas

- `index.html`: página inicial (hero, carrossel, unidades de negócio, frota e rodapé)
- `linkedin.html`: aba do Linkedin (guia do Programa Horizonte e funcionalidades)

## Estrutura

```
index.html                 página inicial
linkedin.html              aba do Linkedin
css/
  comum.css                estilos usados nas duas páginas (cabeçalho, layout, aviso)
  home.css                 estilos da página inicial
  linkedin.css             estilos da aba do Linkedin
js/
  home.js                  carrossel, unidades e frota da página inicial
  linkedin.js              layout e botões de tamanho de texto da aba do Linkedin
  dados-unidades.js        unidades de negócio (nome, link, imagem e resumo)
  dados-frota.js           frota (tipos de embarcação e dados de cada embarcação)
assets/
  home/                    imagens da página inicial
  linkedin/                imagens da aba do Linkedin
  unidades/                imagens das unidades de negócio
  frota/                   fotos das embarcações
  icones/                  ícones e elementos em SVG
.github/workflows/         publicação automática no GitHub Pages
```

## Como editar

- **Textos e links das unidades:** `js/dados-unidades.js`
- **Embarcações:** `js/dados-frota.js` (a foto fica em `assets/frota/<nome>.webp`)
- **Cores, tamanhos e posições:** arquivos em `css/`

## Como abrir no computador

Abra o `index.html` no navegador. Não precisa instalar nada.
