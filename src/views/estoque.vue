<template>
  <div class="layout-container">
    <!-- Cabeçalho -->
    <header class="header-section flex-between">
      <div>
        <h1>ESTOQUE</h1>
        <p>Gerencie o saldo de EPIs e disponibilidade.</p>
      </div>
      <button class="btn btn-outline flex-center" @click="carregar" :disabled="loading">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-right: 8px;">
          <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
        </svg>
        Recarregar página
      </button>
    </header>

    <!-- Ajuste de Estoque -->
    <div class="card-form">
      <div class="card-header">
        <h2>Atualizar quantidade</h2>
      </div>
      
      <div class="main-form">
        <div class="form-row">
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.epi_id" class="custom-select">
              <option value="">Selecione o EPI...</option>
              <!-- Alterado: item agora é o próprio EPI -->
              <option v-for="item in estoque" :key="item.id" :value="item.id">
                {{ item.nome }} (Saldo disponível: {{ item.quantidade || 0 }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Nova quantidade em estoque</label>
            <input type="number" v-model.number="form.quantidade" min="0" placeholder="0" />
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="atualizar" 
            :disabled="!form.epi_id || loading"
          >
            Salvar alterações
          </button>
        </div>

        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Estoque atualizado com sucesso!</p>
      </div>
    </div>

    <!-- Tabela de Saldo -->
    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Itens em estoque</h2>
        <span class="badge badge-blue">{{ estoque.length }} itens catalogados</span>
      </div>

      <div v-if="loading" class="text-center" style="padding: 40px;">
        <div class="spinner"></div> Carregando estoque...
      </div>
      
      <div v-else class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>EPI / CA</th>
              <th>Descrição</th>
              <th>Quantidade</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in estoque" :key="item.id">
              <td>
                <!-- Ajustado: Acesso direto aos campos do item -->
                <div class="text-bold">{{ item.nome }}</div>
                <div class="cargo-text">CA: {{ item.ca }}</div>
              </td>
              <td class="cargo-text">{{ item.descricao || '—' }}</td>
              <td>
                <span class="text-bold" style="font-family: monospace; font-size: 1.1rem;">
                  {{ item.quantidade || 0 }}
                </span>
              </td>
              <td class="text-center">
                <span :class="badgeClass(item.quantidade)">
                  {{ item.quantidade <= 0 ? 'Sem estoque' : item.quantidade < 10 ? 'Estoque baixo' : 'Estoque normal' }}
                </span>
              </td>
            </tr>
            <tr v-if="estoque.length === 0">
              <td colspan="4" class="text-center cargo-text" style="padding: 40px;">
                Nenhum EPI foi encontrado.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase';

const { supabase } = useSupabase();
const estoque = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)
const form = ref({ epi_id: '', quantidade: 0 })

// Função para buscar dados diretamente da tabela 'epis'
async function carregar() {
  loading.value = true
  erro.value = ''
  
  try {
    const { data, error } = await supabase
      .from('epis')
      .select('id, nome, ca, descricao, quantidade')
      .order('nome', { ascending: true })

    if (error) throw error
    estoque.value = data || []
  } catch (e) {
    erro.value = 'Erro ao carregar: ' + e.message
  } finally {
    loading.value = false
  }
}

// Função para atualizar a quantidade diretamente na tabela 'epis'
async function atualizar() {
  if (!form.value.epi_id) return
  
  erro.value = ''
  ok.value = false
  loading.value = true
  
  try {
    const { error } = await supabase
      .from('epis')
      .update({ 
        quantidade: form.value.quantidade 
      })
      .eq('id', form.value.epi_id)

    if (error) throw error
    
    ok.value = true
    form.value = { epi_id: '', quantidade: 0 }
    await carregar() // Recarrega a lista para mostrar o novo saldo
    setTimeout(() => ok.value = false, 3000)
  } catch (e) {
    erro.value = 'Erro ao atualizar: ' + e.message
  } finally {
    loading.value = false
  }
}

function badgeClass(qtd) {
  if (!qtd || qtd <= 0) return 'badge badge-danger'
  if (qtd < 10) return 'badge badge-warn'
  return 'badge badge-ok'
}

onMounted(carregar)
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wdth,wght@0,62.5..100,100..900;1,62.5..100,100..900&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 1. Fundo totalmente branco no container principal */
.layout-container { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 10px 20px 20px 20px; /* Reduzi o padding superior de 20px para 10px */
  font-family: sans-serif; 
  background: #F2F2F2; /* Fundo totalmente branco */
  min-height: 100vh; 
  border-radius: 20px;
}

/* 2. Ajuste do cabeçalho para subir o texto */
.header-section { 
  margin-bottom: 20px; 
  margin-top: 0; /* Garante que não haja margem externa no topo */
}

.header-section h1 {
  margin-top: 0; /* Remove o espaço padrão acima do título h1 */
  padding-top: 0;
  font-size: 1.8rem;
  font-family: "Noto Sans", sans-serif;
}

.header-section p {
  margin-top: -5px; /* Puxa o subtítulo levemente para mais perto do título */
  color: #000000;
  font-family: "Noto Sans", sans-serif;
}

/* 3. Ajuste nos Cards para destacar no fundo branco */
.card { 
  background: white; 
  border: 1px solid #f1f5f9; /* Borda mais clara */
  border-radius: 12px; 
  padding: 20px; 
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Sombra leve para não "sumir" no fundo branco */
}

.card-header {
  font-family: "Noto Sans", sans-serif;
  margin-bottom: 10px;
}

.info-banner { 
  background: #f0f9ff; 
  color: #0369a1; 
  padding: 8px; 
  border-radius: 8px; 
  margin-bottom: 15px; 
  font-size: 0.8rem; 
  text-align: center; 
  border: 1px solid #e0f2fe;
}

/* Mantendo os demais estilos */
.dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px; }
.chart-box { height: 250px; position: relative; }
.filter-card { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; font-size: 0.8rem; font-weight: bold; color: #000000; font-family: "Noto Sans", sans-serif; text-align: left; }
.custom-select {color: #828282}
input, select { padding: 8px; border: 1px solid #000000; border-radius: 6px; color: #828282}
.action-bar { margin-top: 15px; display: flex; gap: 10px; }
.btn { padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; color: #FFFFFF; background-color: #00296B; margin-top: 10px; }
.btn:hover { background-color: #001941; text-shadow: 0.4px 0 0 currentColor; }
.btn-primary { background: #00296B; color: #FFFFFF; margin-top: -5px; margin-bottom: 20px;}
.btn-pdf { background: #10b981; color: white; }
.btn:disabled { background: #E2E2E2; cursor: not-allowed; }
.table-container { border: 1px solid #000000; border-radius: 12px; margin-top: 10px; }
.styled-table { width: 100%; border-collapse: collapse; background: #F2F2F2; overflow: hidden; border-radius: 12px; text-align: center; font-family: "Noto Sans", sans-serif; }
.styled-table th { background: #00296B; padding: 12px; text-align: left; font-size: 0.75rem; color: #FFFFFF; text-transform: uppercase; border-bottom: 1px solid #000000; text-align: center; }
.styled-table td { padding: 12px; border-top: 1px solid #000000; font-size: 0.9rem; }
.badge { padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: bold; }
.badge-ok { background: #dcfce7; color: #166534; }
.badge-warn { background: #fee2e2; color: #991b1b; }
.placeholder { height: 100%; display: flex; align-items: center; justify-content: center; color: #828282; }
</style>