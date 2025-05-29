# Simulador de Filas M/M/1 em React

## 📜 Visão Geral

Este projeto é um simulador interativo para o modelo de filas M/M/1, desenvolvido como parte de [Nome da Disciplina/Projeto Acadêmico] na [Sua Instituição]. A aplicação permite aos usuários inserir taxas de chegada (λ) e atendimento (μ) para calcular e visualizar diversas métricas de desempenho de um sistema de filas com um único servidor, chegadas de Poisson e tempos de serviço exponenciais.

O modelo M/M/1 é fundamental na teoria das filas, representando um sistema onde:
-   **M (Markoviano/Poisson):** O processo de chegada segue uma distribuição de Poisson (intervalos entre chegadas são exponenciais).
-   **M (Markoviano/Exponencial):** O tempo de atendimento segue uma distribuição exponencial.
-   **1:** Existe apenas um servidor no sistema.

## ✨ Funcionalidades Principais

-   **Entrada de Parâmetros:** Os usuários podem definir a taxa de chegada (λ) e a taxa de atendimento (μ).
-   **Cálculo Dinâmico de Métricas:** Calcula automaticamente as seguintes métricas de desempenho:
    -   Taxa de Utilização do Servidor (ρ)
    -   Probabilidade do Sistema Estar Vazio ($P_0$)
    -   Probabilidade de 'n' Clientes no Sistema ($P_n$), onde $n = \lfloor\lambda\rfloor$
    -   Probabilidade de até 'k' Clientes no Sistema ($P(N \le k)$), onde $k = \lfloor\lambda\rfloor$
    -   Número Médio de Clientes no Sistema (L)
    -   Número Médio de Clientes na Fila ($L_q$)
    -   Tempo Médio de Permanência de um Cliente no Sistema (W)
    -   Tempo Médio de Permanência de um Cliente na Fila ($W_q$)
-   **Exibição de Fórmulas:** Apresenta as fórmulas utilizadas para cada métrica calculada, auxiliando no entendimento.
-   **Interface Reativa:** A interface do usuário é construída com React, proporcionando uma experiência fluida e interativa.
-   **Validação de Entradas:** Garante que $\lambda < \mu$ para a estabilidade do sistema e que as taxas sejam positivas.

## 🛠️ Tecnologias Utilizadas

-   **Frontend:**
    -   React (v18+)
    -   JavaScript (ES6+)
    -   HTML5
    -   CSS3
-   **Versionamento:**
    -   Git
    -   GitHub

## ⚙️ Parâmetros e Métricas do Modelo M/M/1

### Parâmetros de Entrada:
-   **Taxa de Chegada (λ):** Número médio de clientes que chegam ao sistema por unidade de tempo.
-   **Taxa de Atendimento (μ):** Número médio de clientes que o servidor consegue atender por unidade de tempo.

### Métricas Calculadas e Suas Fórmulas:

1.  **Taxa de Utilização (ρ):**
    $$ \rho = \frac{\lambda}{\mu} $$
2.  **Probabilidade de Sistema Vazio ($P_0$):**
    $$ P_0 = 1 - \rho $$
3.  **Probabilidade de n Clientes no Sistema ($P_n$):** (onde $n = \lfloor\lambda\rfloor$ é derivado da entrada λ)
    $$ P_n = P_0 \cdot \rho^n $$
4.  **Probabilidade de até k Clientes no Sistema ($P(N \le k)$):** (onde $k = \lfloor\lambda\rfloor$ é derivado da entrada λ)
    $$ P(N \le k) = 1 - \rho^{k+1} $$
5.  **Número Médio de Clientes no Sistema (L):**
    $$ L = \frac{\lambda}{\mu - \lambda} $$
6.  **Número Médio de Clientes na Fila ($L_q$):**
    $$ L_q = L - \rho $$
    Alternativamente: $L_q = \frac{\lambda^2}{\mu(\mu - \lambda)}$
7.  **Tempo Médio de Permanência no Sistema (W):** (Lei de Little)
    $$ W = \frac{L}{\lambda} $$
    Alternativamente: $W = \frac{1}{\mu - \lambda}$
8.  **Tempo Médio de Permanência na Fila ($W_q$):** (Lei de Little)
    $$ W_q = \frac{L_q}{\lambda} $$
    Alternativamente: $W_q = \frac{\lambda}{\mu(\mu - \lambda)}$

