# 📱 TimeoutGuard App — Gestão de Timeout e Erros HTTP

## 👥 1. Identificação
* **Tema do Grupo:** Eixo 2 — Qualidade, Resiliência e Estados de Loading (Grupo 5)
* **Curso:** Técnico em Desenvolvimento de Sistemas
* **Componente Curricular:** Programação para Dispositivos Móveis (PPDM)
* **Unidade Ocorrência:** SENAI-SP
* **Turma:** [2DEV-OCZ]
* **Integrantes:**
  * [Laura Nobre]
  * [Letícia Bertonzini]
  * [Luiza Stecca]

---

## 📚 2. Pesquisa Teórica: Conceitos de Resiliência Mobile

No desenvolvimento de aplicações móveis (mobile), a instabilidade de rede é um fator inevitável. Dispositivos transitam constantemente entre conexões 3G, 4G, 5G e Wi-Fi, gerando atraso alta, perda de pacotes e quedas repentinas. Por isso, implementar mecanismos de resiliência e tratamento de erros é um requisito crítico de qualidade de software.

### Gestão de Timeout (Tempo Limite)
O *Timeout* é um mecanismo de segurança que define o tempo máximo que o aplicativo aceita esperar por uma resposta do servidor. Sem uma configuração explícita de tempo limite, o aplicativo cliente pode manter a requisição em aberto por tempo indeterminado (congelando recursos da rede e do processador). A definição de um timeout estrito (ex: 5 segundos) garante previsibilidade: se o servidor demorar demais, a aplicação assume o controle do fluxo, encerra a tentativa e notifica o usuário, evitando o travamento da interface.

### Manipulação de Códigos de Erro HTTP
O protocolo HTTP utiliza códigos de status para indicar o resultado de uma requisição. Para construir uma aplicação resiliente, o aplicativo móvel deve saber interpretar esses códigos e dar feedbacks visuais adequados para cada cenário, protegendo a experiência do usuário (UX):
* **401 (Unauthorized / Não Autorizado):** Indica que a requisição precisa de autenticação. No contexto mobile, sinaliza geralmente que a sessão do usuário ou o token de acesso expiraram.
* **404 (Not Found / Não Encontrado):** Indica que o recurso solicitado (uma rota de API, um produto, um perfil) não existe no servidor.
* **500 (Internal Server Error / Erro Interno):** Indica um colapso ou falha crítica no código do próprio servidor backend. O aplicativo cliente deve tratar essa exceção para evitar que o app sofra um *crash* (feche sozinho) na mão do usuário.

---

## 💻 3. Documentação do Projeto: Solução Prática

O aplicativo foi desenvolvido utilizando **React Native** com o ecossistema **Expo** e a biblioteca **Axios** como cliente HTTP HTTP para consumir o serviço de testes **Httpbin.org**. 

### Como o problema de Qualidade e Resiliência foi resolvido:

1. **Configuração Restrita do Axios:** A instância do Axios foi configurada globalmente com a propriedade `timeout: 5000`. Isso garante que nenhuma requisição extrapole o tempo limite de segurança de 5 segundos.
2. **Isolamento de Processamento Assíncrono (Web/Mobile Compatibility):** Para simular o comportamento de estouro de tempo em múltiplos ambientes de desenvolvimento (incluindo o navegador), o botão "Simular Timeout" cria uma rotina assíncrona isolada via `setTimeout`. Quando o relógio local atinge exatamente 5 segundos de atraso da rota `/delay/7`, a aplicação aborta o estado de carregamento e aciona o card laranja com a mensagem padrão obrigatória: `"Tempo limite excedido. Tente novamente."`.
3. **Mecanismo de Interceptação com `Try/Catch`:** Toda a estrutura de requisições foi envelopada em blocos de captura de exceções. Caso o servidor retorne um erro HTTP (401, 404, 500), a aplicação intercepta a propriedade `error.response.status`, analisa o código e atualiza de forma amigável e segura o componente visual na tela, sem comprometer o ciclo de vida global do app.
4. **Prevenção de Cliques Duplos (UX Mobile):** Durante qualquer processamento assíncrono de rede, o estado `loading` é ativado como verdadeiro (`true`). Esse estado é vinculado à propriedade `disabled={loading}` dos componentes de botão. Isso impede fisicamente que o usuário clique repetidas vezes no painel por ansiedade, eliminando o risco de sobrecarga de requisições duplicadas.
5. **Estilização Dinâmica Limpa:** A troca visual e de cores dos cards de feedback é resolvida através de *Bracket Notation* direto no mapeamento do `StyleSheet`, mantendo a lógica do JSX livre de condicionais extensas de renderização.

---

## 📸 4. Screenshots

Abaixo estão registradas as capturas de tela da aplicação demonstrando as interfaces e feedbacks visuais amigáveis gerados para cada cenário de erro simulado:

## 📸 4. Screenshots

Abaixo estão registradas as capturas de tela da aplicação demonstrando as interfaces e feedbacks visuais amigáveis gerados para cada cenário de erro simulado:

| Cenário de Teste | Visualização do Aplicativo |
| :--- | :--- |
| **⏱️ Tempo Limite Excedido (Timeout)** | ![](/docs/funcionamentoTimeout.jpg) |
| **🔒 Não Autorizado (Erro 401)** | ![](/docs/erro401funcionou.jpg) |
| **🔍 Não Encontrado (Erro 404)** | ![](/docs/erro404funcionou.jpg) |
| **💥 Erro Interno (Erro 500)** | ![](/docs/erro500funcionou.jpg) |
| **✅ Requisição com Sucesso (200)** | ![](/docs/requisicaoSucesso.jpg) |

---

## 🚀 5. Manual de Execução

Siga os passos abaixo para clonar o repositório, instalar as dependências necessárias e rodar o projeto localmente no seu ambiente de desenvolvimento.

### Pré-requisitos
* Ter o **Node.js** instalado (versão LTS recomendada).
* Ter o aplicativo **Expo Go** instalado no seu smartphone (caso vá testar em dispositivo físico).

### Passo a Passo para Execução

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/lauranobre/TimeoutGuard-App
   ```

2. **Acessar a Pasta do Projeto:**
   ```bash
   cd TimeoutGuard-App
   ```

3. **Instalar as Dependências:**
   ```bash
   npm install
   ```

4. **Iniciar o Servidor do Expo:**
   * **Para testar no Computador (Modo Web):**
     ```bash
     npx expo start
     ```
     *Após abrir o menu no terminal, pressione a tecla **`w`** para abrir o app diretamente no seu navegador de internet.*