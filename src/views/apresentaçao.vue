<script setup>

</script>

<template>
    <header class="header">
        <div class="empresa-info">
            <div class="empresa-logo">
                <img src="../assets/header/logo.png" alt="Logo da Empresa" class="logo-header">
            </div>
            <div class="empresa-nome">Sistema de EPI</div>
        </div>

        <div class="menu-login-container">
            <div to="/login" class="login-area">
                <router-link to="/login" href="#">Login</router-link>
                <div class="login-icon">
                    <img src="../assets/header/login.png" alt="Ícone de Login" class="login-icon">
                </div>
            </div>
        </div>
    </header>

    <main>
        <section class="epi">
            <h1>Bem-vindo ao Sistema de EPI</h1>
            <p>Gerencie eficientemente seus equipamentos de proteção individual.</p>

        </section>

        <img src="../assets/Principal/senai.png" alt="Imagem de Fundo" class="senai-image">
        <div class="img2" alt="Imagem 2">
            <img src="../assets/Principal/imagem1.png" alt="img1" class="imagem1">
            <img src="../assets/Principal/imagem2.png" alt="img2" class="imagem2">
            <img src="../assets/Principal/imagem3.png" alt="img3" class="imagem3">
        </div>
    </main>


    <footer>
        <div class="telefone">
            <img src="../assets/Footer/telefone.png" alt="Telefone" class="telefone-icon">
            <span>0800-048-1212</span>
        </div>
        <div class="whatsapp">
            <img src="../assets/Footer/whats.png" alt="WhatsApp" class="whatsapp-icon">
            <span>(48) 3231-4000 </span>
        </div>
        <div class="email">
            <img src="../assets/Footer/email.png" alt="Email" class="email-icon">
            <span>faleconosco@fiesc.com.br</span>
        </div>
        <div class="local">
            <img src="../assets/Footer/local.png" alt="Localização" class="local-icon">
            <span>Rod. Ademar Gonzaga, 2765 - Centro, Florianópolis - SC, Brasil</span>
        </div>
    </footer>
</template>

<style>

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Configuração do contêiner principal do cabeçalho */
.header {
    width: 100%;
    box-sizing: border-box; /* Garante que o padding não aumente a largura total */
    background-color: #00296B;
    color: white;
    padding: 0.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Área do Logo da Empresa + Nome */
.empresa-info {
    display: flex;
    align-items: center;
    gap: 15px;   /* Espaço entre o logo e o nome */
}

.logo-header {
    width: 60px; /* Largura do logo da empresa */
    height: 60px; /* Altura do logo da empresa */
    background-color: #fff; /* Fundo branco para visualização */
    border-radius: 50%; /* Torna o logo circular (opcional) */
    object-fit: contain;  /* Garante que a imagem caiba no espaço */
    /* Se for usar uma imagem real: <img src="logo.png" class="empresa-logo" alt="Logo da Empresa"> */
}

.empresa-nome {
    font-size: 1.5rem;
    font-weight: bold;
}

/* Área do Menu + Logo de Login */
.menu-login-container {
    display: flex;
    align-items: center;
    gap: 30px;  /* Espaço entre o menu e a área de login */
}

/* Estilização da lista de navegação */
nav ul {
    list-style: none; /* Remove as bolinhas da lista */
    margin: 0;
    padding: 0;
    display: flex;  /* Coloca os itens um ao lado do outro */
    gap: 25px;  /* Espaçamento entre os links */
}

nav a {
    color: #ecf0f1;
    text-decoration: none;  /* Remove o sublinhado dos links */
    font-weight: 500;
    font-size: 1.3rem;
    transition: color 0.3s, transform 0.2s;
    display: inline-block;  /* Necessário para o transform funcionar */
}

nav a:hover {
    color: #3498db;  /* Cor ao passar o mouse */
    transform: translateY(-2px); /* Pequena animação ao passar o mouse */
}

/* Área específica do Login */
.login-area {
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 10px; /* Espaço entre o texto Login e seu logo */
    cursor: pointer;
    text-decoration: none;
}

.login-area a {
    color: #ecf0f1;
    text-decoration: none;
    transition: color 0.3s, transform 0.2s;
    display: inline-block;  /* Necessário para o transform funcionar */

}

.login-area a:hover {
    color: #3498db;
    transform: translateY(-2px); /* Pequena animação ao passar o mouse */
}

.login-icon {
    width: 40px;  /* Largura do logo de login */
    height: 40px; /* Altura do logo de login */
    background-color: #00509D;  /* Fundo mais escuro para destaque */
    border-radius: 50%; /* Circular */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 9rem;  /* Para usar uma inicial se não tiver imagem */
    /* Se for usar imagem: <img src="login.png" class="login-icon" alt="Login"> */
}

use {
    font-family: 'Iceland', sans-serif;
}   
main {
    padding: 100px;
    text-align: center;
}
.senai-image {
    width: 100%;
    max-width: 500px;
    height: auto;
    margin-top: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.epi h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
}
.epi p {
    font-size: 0.75rem;
    color: #34495e;
    margin-bottom: 0.5rem;
}
.img2 {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 2rem;
}
.imagem1, .imagem2, .imagem3 {
    width: 100%;
    max-width: 200px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
footer {
    width: 100%;
    box-sizing: border-box;
    background-color: #f9fafb;
    color: rgb(97, 95, 95);
    padding: 1rem 2rem; /* Corrigido o erro de sintaxe da vírgula */
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap; /* Importante para que não quebre em telas menores */
    gap: 20px;
    bottom: 0;
    position: absolute;
}

.telefone, .whatsapp, .email, .local {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px; /* Espaço entre os itens */
}   
.redes-sociais {
    display: flex;
    gap: 10px;
}

</style>
<script>
export default { name: 'Home', }
</script>
