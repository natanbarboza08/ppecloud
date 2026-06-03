<template>
  <div class="layout-container">
    
    <header class="header-section">
      <h1>FUNCIONÁRIOS</h1>
      <p>Gerenciamento dos funcionários registrados no sistema</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Editar cadastro' : 'Novo cadastro' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Nome completo</label>
              <input v-model="form.nome" type="text" id="nome" placeholder="Ex: João da Silva" required>
            </div>
            <div class="form-group">
              <label for="matricula">C.A. do funcionário</label>
              <input v-model="form.matricula" type="text" id="matricula" placeholder="Ex: 5542" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="setor">Setor</label>
              <input v-model="form.setor" type="text" id="setor" placeholder="Ex: RH" required>
            </div>
            <div class="form-group">
              <label for="cargo">Cargo</label>
              <input v-model="form.cargo" type="text" id="cargo" placeholder="Ex: Recrutador" required>
            </div>
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
              <th>Funcionário</th>
              <th>C.A.</th>
              <th>Setor / Cargo</th>
              <th class="text-center">Gerenciar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in funcionarios" :key="f.id">
              <td><span class="text-bold">{{ f.nome }}</span></td>
              <td>{{ f.matricula }}</td>
              <td>
                <span class="badge">{{ f.setor }}</span>
                <span class="cargo-text">{{ f.cargo }}</span>
              </td>
              <td class="text-center">
                <button @click="prepararEdicao(f)" class="btn-action edit">Editar</button>
                <button @click="excluir(f.id)" class="btn-action delete">Excluir</button>
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

// Variáveis que controlam os dados na tela
const funcionarios = ref([]);
const editandoId = ref(null);
const form = reactive({ 
  nome: '', 
  matricula: '', 
  setor: '', 
  cargo: '' 
});

// Busca os dados do Supabase
const carregar = async () => {
  const { data, error } = await supabase.from('funcionarios').select('*').order('nome');
  if (error) {
    console.error("Erro ao carregar:", error.message);
  } else {
    funcionarios.value = data || [];
  }
};

// Salva um novo ou atualiza um existente
const salvar = async () => {
  if (editandoId.value) {
    // Modo de Edição (Update)
    await supabase.from('funcionarios').update(form).eq('id', editandoId.value);
  } else {
    // Modo de Criação (Insert)
    await supabase.from('funcionarios').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

// Prepara o formulário para edição ao clicar no botão
const prepararEdicao = (f) => {
  editandoId.value = f.id;
  Object.assign(form, { 
    nome: f.nome, 
    matricula: f.matricula, 
    setor: f.setor, 
    cargo: f.cargo 
  });
};

// Deleta um registro
const excluir = async (id) => {
  if (confirm('Tem certeza que deseja excluir este cadastro?')) {
    await supabase.from('funcionarios').delete().eq('id', id);
    carregar();
  }
};

// Limpa o formulário e sai do modo de edição
const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', matricula: '', setor: '', cargo: '' });
};

// Inicia a busca de dados assim que a tela abre
onMounted(carregar);
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #F2F2F2;
  min-height: 100vh;
  border-radius: 20px;
}

.header-section { margin-bottom: 10px; }
.header-section h1 { color: #000000; font-size: 1.8rem; font-family: "Noto Sans", sans-serif; }
.header-section p { color: #000000; font-size: 0.95rem; font-family: "Noto Sans", sans-serif; margin-top: 4px; }

/* Cards (Containers Principais) */
.card-form, .card-table {
  background: #004381;  
  border-radius: 12px;
  border: 1px solid #000000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden;
  font-family: "Noto Sans", sans-serif;
}

.card-header {
  background-color: #00296B;
  padding: 15px 24px;
  border-bottom: 1px solid #000000;
  font-family: "Noto Sans", sans-serif;
  color: #FFFFFF;
}


/* ==========================================
   FORMULÁRIO (ALINHADO À ESQUERDA)
   ========================================== */
.main-form { padding: 24px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  align-items: flex-start; /* Força a label e o input para a esquerda */
  text-align: left;        /* Remove qualquer centralização herdada */
}

label { 
  font-size: 0.85rem; 
  font-weight: 400; 
  color: #ffffff; 
  font-family: "Noto Sans", sans-serif;
  width: 100%;             /* Garante o bloco de alinhamento à esquerda */
}

input {
  padding: 12px;
  border: 1px solid #000000;
  border-radius: 8px;
  font-size: 1rem;
  transition: box-shadow 0.3s ease-in-out;
  width: 100%;             /* Preenche a coluna da grid corretamente */
  box-sizing: border-box;  /* Evita que o padding quebre o layout do input */
}

input:focus {
  outline: none;
  border-color: #9BC9FF;
  box-shadow: 0 0 0 4px #6699ff3a;
}

/* Botões Estilizados */
.action-bar { display: flex; gap: 12px; }
.btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-primary { font-family: "Noto Sans", sans-serif; background: #FFFFFF; color: black; border: none; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-primary:hover{ background-color: #A2A2A2; text-shadow: 0.4px 0 0 currentColor; }
.btn-outline { font-family: "Noto Sans", sans-serif; padding: 9px 20px; background: white; color: #828282; border: none; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-outline:hover { background-color: #A2A2A2; color: #000000; text-shadow: 0.4px 0 0 currentColor; }

/* Tabela Profissional */
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th {
  background-color: #E9ECEE;
  padding: 16px 24px;
  text-align: center; /* ALTERADO: Centraliza o cabeçalho igual ao conteúdo */
  font-size: 0.80rem;
  color: #000000;
  text-transform: uppercase;
  font-family: "Noto Sans", sans-serif;
  vertical-align: middle; /* GARANTE: Alinhamento vertical perfeito */
}

.styled-table td {
  background-color: #FFFFFF;
  padding: 16px 24px;
  border-top: 1px solid #000000;
  font-size: 0.95rem;
  font-family: "Noto Sans", sans-serif;
  text-align: center; /* GARANTE: Todo o texto das células fica centralizado */
  vertical-align: middle; /* GARANTE: Alinha verticalmente ao centro */
}

.text-bold { font-weight: 400; color: #000000; }

.badge {
  background: #E2E2E2;
  color: #00296B;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-right: 10px;
  display: inline-block; /* ADICIONADO: Permite o alinhamento correto */
  vertical-align: middle; /* CORRIGE: Alinha o badge com o texto "sei la" */
}

.cargo-text { 
  color: #000000; 
  font-size: 0.85rem; 
  display: inline-block; /* ADICIONADO */
  vertical-align: middle; /* CORRIGE: Alinha o texto com o badge */
}

/* Ações na Tabela */
.btn-action {
  background: none;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.edit { color: #2563eb; cursor: pointer; background: none; border: none; font-weight: bold; margin-right: 10px; transition: color 0.3s ease-in-out; }
.edit:hover { color: #153479; }
.delete { color: #be123c; cursor: pointer; background: none; border: none; font-weight: bold; transition: color 0.3s ease-in-out; }
.delete:hover { color:#6d0c24; }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>