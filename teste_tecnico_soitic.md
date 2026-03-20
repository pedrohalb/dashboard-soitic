# Teste Técnico: Desenvolvedor Web Sênior - Grupo SOITIC

## Introdução

Bem-vindo ao teste técnico para a vaga de Desenvolvedor Web Sênior no Grupo SOITIC. Há mais de 40 anos, o Grupo SOITIC atua na união entre educação, tecnologia e comunicação, desenvolvendo soluções de gestão e inovação para o mercado [1]. Buscamos profissionais que não apenas dominem a lógica de programação, mas que também possuam um olhar crítico para a Experiência do Usuário (UX) e Interface do Usuário (UI), garantindo que nossas soluções sejam eficientes, escaláveis e intuitivas.

Este teste foi desenhado para avaliar sua capacidade de resolver problemas complexos de forma elegante, arquitetar soluções robustas e criar interfaces que agreguem valor real ao usuário final.

---

## O Desafio: Dashboard de Gestão de Consultórios (Padrão GESTIC)

O Grupo SOITIC tem um forte histórico no desenvolvimento de softwares de gestão de consultórios [2]. Seu desafio é projetar e implementar um protótipo funcional de um **Dashboard de Agendamentos e Gestão de Pacientes**, inspirado no padrão GESTIC de qualidade.

O objetivo não é entregar um sistema completo com backend real, mas sim demonstrar sua arquitetura de frontend, lógica de manipulação de dados e decisões de design de interface.

### Parte 1: Lógica e Manipulação de Dados (Peso: 50%)

Você receberá um payload JSON simulado contendo uma lista de agendamentos de uma clínica médica para a semana atual. Os dados incluem informações como: ID do paciente, nome, data/hora da consulta, status (confirmado, pendente, cancelado) e tipo de atendimento (primeira consulta, retorno, exame).

**Requisitos Técnicos:**

1.  **Processamento de Dados:** Crie uma função que receba este JSON e retorne dados agregados para alimentar os indicadores do dashboard:
    *   Total de consultas no dia atual.
    *   Percentual de consultas canceladas na semana.
    *   Distribuição de consultas por tipo de atendimento.
2.  **Lidar com Conflitos:** Implemente um algoritmo que identifique e sinalize conflitos de agendamento (duas consultas marcadas para o mesmo médico no mesmo horário).
3.  **Filtros e Buscas:** A interface deve permitir filtrar os agendamentos por data, status e buscar pelo nome do paciente. A lógica de filtragem deve ser otimizada para lidar com um volume razoável de dados no client-side.

### Parte 2: UX/UI e Implementação de Interface (Peso: 50%)

Com base nos dados processados na Parte 1, construa a interface do Dashboard.

**Requisitos de Design e Implementação:**

1.  **Layout Responsivo:** O dashboard deve ser perfeitamente utilizável em desktops e dispositivos móveis (tablets e smartphones).
2.  **Visualização de Dados:** Utilize gráficos ou componentes visuais adequados para apresentar os indicadores calculados (ex: um gráfico de rosca para a distribuição de tipos de atendimento).
3.  **Tabela de Agendamentos:** Exiba a lista de agendamentos de forma clara. Aplique conceitos de UI para diferenciar visualmente os status das consultas (ex: cores semânticas para confirmado, pendente, cancelado).
4.  **Acessibilidade (a11y):** Garanta que a interface siga princípios básicos de acessibilidade (contraste adequado, uso correto de tags semânticas, navegação por teclado).
5.  **Microinterações:** Adicione feedbacks visuais sutis para ações do usuário (ex: hover em botões, loading states durante a filtragem).

---

## Critérios de Avaliação

Como se trata de uma vaga de nível Sênior, avaliaremos não apenas se o código funciona, mas *como* ele foi construído.

| Critério | Descrição |
| :--- | :--- |
| **Arquitetura e Clean Code** | Organização de pastas, componentização, separação de responsabilidades (lógica vs. apresentação) e legibilidade do código. |
| **Lógica de Programação** | Eficiência dos algoritmos de processamento de dados e tratamento de conflitos. |
| **Decisões de UX/UI** | Clareza da interface, hierarquia da informação, escolhas tipográficas e de cores, e facilidade de uso. |
| **Boas Práticas Frontend** | Gerenciamento de estado, performance de renderização e uso adequado do framework escolhido. |
| **Testes (Bônus)** | A inclusão de testes unitários para as funções lógicas (Parte 1) será considerada um diferencial significativo. |

---

## Instruções de Entrega

1.  **Stack Tecnológico:** Você é livre para escolher o framework/biblioteca frontend de sua preferência (React, Vue, Angular, Svelte, etc.), bem como ferramentas de estilização (Tailwind, Styled Components, CSS puro, etc.).
2.  **Repositório:** O código deve ser hospedado em um repositório público no GitHub ou GitLab.
3.  **Documentação (README):** O repositório deve conter um arquivo `README.md` detalhado, explicando:
    *   Como rodar o projeto localmente.
    *   As principais decisões de arquitetura e bibliotecas escolhidas.
    *   Uma breve justificativa para as decisões de UX/UI tomadas.

### Tempo Estimado de Conclusão

Para um desenvolvedor de nível Sênior, estimamos que este teste exija entre **6 a 8 horas** de dedicação para ser concluído com a qualidade esperada, considerando o equilíbrio entre a lógica de dados e o refinamento da interface.

Boa sorte! Estamos ansiosos para ver sua solução e como você pode contribuir para a inovação no Grupo SOITIC.

---

## Referências

[1] [Há mais de 40 anos, o Grupo SOITIC tem sido pioneiro na união entre educação, tecnologia e comunicação](https://www.instagram.com/p/C-Xp6QKtaOp/h%C3%A1-mais-de-40-anos-o-grupo-soitic-tem-sido-pioneiro-na-uni%C3%A3o-entre-educa%C3%A7%C3%A3o-tecn/?hl=am-et)
[2] [Há 39 anos, surgia o primeiro software de gestão de consultório do Brasil](https://www.facebook.com/soitic/posts/hoje-%C3%A9-um-dia-muito-importante-para-o-grupo-soitic-h%C3%A1-39-anos-surgia-o-primeiro-/2009250315925624/)
