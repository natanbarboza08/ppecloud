<template>
  <div class="layout-container">
    
    <header class="header-section">
      <h1>CADASTRO DE EPIs</h1>
      <p>Registre e gerencie seu EPI aqui.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header" >
          <h3>{{ editandoId ? 'Editar Equipamento' : 'Novo Equipamento' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nome</label>
              <input v-model="form.nome" type="text" placeholder="Ex.: Capacete de Segurança" required>
            </div>
            <div class="form-group">
              <label>Número de C.A.</label>
              <input v-model="form.ca" type="text" placeholder="Ex.: 12345" required>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label>Descrição</label>
            <input v-model="form.descricao" type="text" placeholder="Ex.: Classe B com tira de queixo">
          </div>

            <div class="form-group">
              <label>Quantidade Inicial</label>
              <input v-model="form.quantidade" type="number" placeholder="Ex.: 10" required>
            </div>
          
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Salvar alterações' : 'Cadastrar' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <section class="card-table">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Equipamento</th>
              <th>C.A.</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in epis" :key="e.id">
              <td><span class="text-bold">{{ e.nome }}</span></td>
              <td><span class="badge-ca">{{ e.ca }}</span></td>
              <td>{{ e.descricao }}</td>
              <td>{{ e.quantidade }}</td>
              <td class="text-center">
                <button @click="prepararEdicao(e)" class="btn-action edit">Editar</button>
                <button @click="excluir(e.id)" class="btn-action delete">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '../composables/useSupabase';

const epis = ref([]);
const editandoId = ref(null);
const form = reactive({ nome: '', ca: '', descricao: '', quantidade: '' });

// Busca os EPIs no banco
const carregar = async () => {
  const { data } = await supabase.from('epis').select('*').order('nome');
  epis.value = data || [];
};

// Salva ou Atualiza
const salvar = async () => {
  if (editandoId.value) {
    await supabase.from('epis').update(form).eq('id', editandoId.value);
  } else {
    await supabase.from('epis').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  Object.assign(form, { nome: e.nome, ca: e.ca, descricao: e.descricao, quantidade: e.quantidade });
};

const excluir = async (id) => {
  if (confirm('Você tem certeza que deseja excluir este equipamento?')) {
    await supabase.from('epis').delete().eq('id', id);
    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', ca: '', descricao: '', quantidade: '' });
};

onMounted(carregar);
</script>

<style scoped>



@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap');

/* Aproveitando o estilo anterior para manter o padrão */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Container Principal em Azul Escuro Profundo */
.layout-container { 
  max-width: 1100px; 
  margin: 40px auto; 
  padding: 40px; 
  background-color: #f2f2f2; 
  min-height: 85vh; 
  font-family: "Noto Sans", sans-serif; 
  color: #16166d; 
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Cabeçalho elegante com divisória suave */
.header-section { 
  margin-bottom: 35px; 
  border-bottom: 2px solid rgba(24, 23, 23, 0.1);
  padding-bottom: 20px;
}
.header-section h1 {
  font-family: "Noto Sans", sans-serif;
  color: #121111;
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}
.header-section p {
  color: #121111; 
  font-size: 1rem;
}

/* Cards utilizando o seu azul oficial #00296B */
.card-form, .card-table { 
  background: #00296B; 
  border-radius: 12px; 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  margin-bottom: 30px; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden; 
  font-family: "Noto Sans", sans-serif;
}

/* Cabeçalho do Card levemente mais escuro para dar profundidade */
.card-header { 
  background: #001f52; 
  padding: 16px 24px; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
}
.card-header h3 {
  font-family: "Noto Sans", sans-serif;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Formulário e Inputs adaptados para o tema escuro */
.main-form { 
  padding: 24px; 
}
.form-row { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 20px; 
  margin-bottom: 20px; 
}
.form-group { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}
label { 
  font-size: 0.85rem; 
  font-weight: 600; 
  color: #dcdee1; 
  text-align: left;
}
input { 
  padding: 11px 16px; 
  border: 1px solid rgba(236, 231, 231, 0.993); 
  border-radius: 8px; 
  font-family: "Noto Sans", sans-serif;
  font-size: 0.95rem;
  color: #121111;
  background-color: #eceff2; 
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
input:focus {
  outline: none;
  border-color: #38bdf8; 
  box-shadow: 0 0 0 3px rgba(244, 244, 245, 0.962);
}
input::placeholder {
  color: #53585f;
}

/* Alinhamento dos botões */
.action-bar {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

/* Botões */
.btn { 
  padding: 11px 24px; 
  border-radius: 8px; 
  cursor: pointer; 
  border: none; 
  font-weight: 600; 
  font-size: 0.95rem;
  font-family: "Noto Sans", sans-serif;
  transition: all 0.2s ease-in-out; 
}
.btn-primary { 
  background: #ffffff; 
  color: #012c6d; 
}
.btn-primary:hover { 
  background-color: #e2e8f0; 
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.15);
}
.btn-outline { 
  background: transparent; 
  color: #ffffff; 
  border: 1px solid rgba(255, 255, 255, 0.4);
}
.btn-outline:hover { 
  background-color: rgba(255, 255, 255, 0.1); 
  border-color: #ffffff;
}

/* ==========================================
   TABELA AJUSTADA E ALINHADA EM MODO ESCURO 
   ========================================== */
.styled-table { 
  width: 100%; 
  border-collapse: collapse; 
}

/* th e td agora compartilham do mesmo alinhamento à esquerda, espaçamento e comportamento de bloco */
.styled-table th,
.styled-table td {
  padding: 16px 24px; 
  text-align: left; 
  vertical-align: middle;
}

.styled-table th { 
  background: #001f52; /* Fundo escuro combinando com o card-header */
  font-size: 0.8rem; 
  color: #94a3b8; /* Texto cinza claro para contraste */
  text-transform: uppercase; 
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1); 
}

.styled-table td { 
  background-color: #eaedf3; /* Remove o fundo cinza claro que quebrava o design */
  border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
  font-family: "Noto Sans", sans-serif; 
  font-size: 0.95rem; 
  color: #211f1f; /* Texto branco para leitura no card azul escuro */
}

.styled-table tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.05); /* Leve destaque moderno ao passar o mouse */
}

/* Classes utilitárias de alinhamento */
.text-center { 
  text-align: center !important; 
}
.text-bold {
  font-weight: 600;
}

/* Badge do C.A. em azul claro elétrico */
.badge-ca { 
  background: rgba(56, 189, 248, 0.15); 
  color: #38bdf8; 
  padding: 4px 10px; 
  border-radius: 6px; 
  font-weight: 600; 
  font-size: 0.85rem;
  display: inline-block;
}

/* Botões de Ação na Tabela */
.btn-action {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer; 
  background: none; 
  border: none; 
  font-weight: 600; 
  transition: all 0.2s ease;
}
.edit { 
  color: #38bdf8; 
  margin-right: 8px; 
}
.edit:hover { 
  background-color: rgba(59, 209, 246, 0.15);
}
.delete { 
  color: #f87171; 
}
.delete:hover { 
  background-color: rgba(248, 113, 113, 0.15);
}
</style>