# Aplicativo de gestão de finanças pessoais

![Badge em Desenvolvimento](https://img.shields.io/badge/Backend-Em%20desenvolvimento-green?style=flat&logo=nodedotjs)
![Badge em Desenvolvimento](https://img.shields.io/badge/Mobile-Em%20desenvolvimento-green?style=flat&logo=react)
![Problemas](https://img.shields.io/github/issues/GravetoGeek/gestao-financas-pessoais)
![Forks](https://img.shields.io/github/forks/GravetoGeek/gestao-financas-pessoais)
![Stars](https://img.shields.io/github/stars/GravetoGeek/gestao-financas-pessoais)

Este projeto é um aplicativo de gestão de finanças pessoais. Desenvolvido como trabalho de conclusão de curso, o aplicativo foi desenvolvido em React Native, utilizando o framework Expo.

## Instalação
### Método 1
<blockquote>
<br>
Abra o terminal e clone o projeto <a href='https://github.com/GravetoGeek/gestao-financas-pessoais'>gestao-financas-pessoais</a>.

```bash
git clone git@github.com:GravetoGeek/gestao-financas-pessoais.git
```

Entre no diretório do projeto Backend.
```bash
cd gestao-financas-pessoais/backend
```
Execute o comando `npm install`. O comando irá instalar todos os pacotes necessários para o desenvolvimento do aplicativo.
```bash
npm install
```

Execute em seguida o comando `nodemon`. O comando irá iniciar o servidor do aplicativo.
```bash
nodemon
```


Abra outro terminal e entre no diretório do projeto Frontend.
```bash
cd gestao-financas-pessoais/gfp
```
Execute o comando `npm install`. O comando irá instalar todos os pacotes necessários para o desenvolvimento do aplicativo.
```bash
npm install
```

Abra o Emulador do Android.
Execute em seguida o comando `expo start`. O comando irá iniciar o frontend do aplicativo.
```bash
expo start
```
<br>
</blockquote>
<br>

### Método 2

<blockquote>
<br>
Abra o terminal e clone o projeto <a href='https://github.com/GravetoGeek/gestao-financas-pessoais'>gestao-financas-pessoais</a>.

```bash
git clone git@github.com:GravetoGeek/gestao-financas-pessoais.git
```

Entre no diretório do projeto Backend.
```bash
cd gestao-financas-pessoais/backend
```
Execute o comando `npm install`. O comando irá instalar todos os pacotes necessários para o desenvolvimento do aplicativo.
```bash
npm install
```

Entre no diretório do projeto Frontend.
```bash
cd ../gfp
```
Execute o comando `npm install`. O comando irá instalar todos os pacotes necessários para o desenvolvimento do aplicativo.
```bash
npm install
```

Volte para o diretório raiz do projeto `gestao-financas-pessoais`.

```bash
cd ..
```

Instale o pacote para gerenciar múltiplos projetos em background.

```bash
npm install -g pm2
```

Abra o emulador do Android.

Para iniciar os projetos Backend e Frontend, execute o comando `pm2 start`. O comando irá iniciar os projetos em background.

```bash
pm2 start
```
</br>
</blockquote>