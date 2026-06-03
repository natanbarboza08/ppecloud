<template>
  <div class="layout-container">
    <header class="header-section">
      <h1>ENTREGAS</h1>
      <p>Registro de entregas de equipamentos aos funcionários</p>
    </header>

    <div class="card-form">
      <div class="card-header">
        <h2>Registrar Entrega</h2>
      </div>

      <div class="main-form">
        <div class="form-row">
          <div class="form-group">
            <label>Funcionário</label>
            <select v-model="form.funcionario_id" class="custom-select">
              <option value="">Selecione o funcionário...</option>
              <option v-for="f in funcionarios" :key="f.id" :value="f.id">
                {{ f.nome }} — {{ f.setor }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>EPI</label>
            <select v-model="form.epi_id" class="custom-select">
              <option value="">Selecione o EPI...</option>
              <option v-for="e in epis" :key="e.id" :value="e.id">
                {{ e.nome }} (Saldo disponível: {{ e.quantidade ?? 0 }})
              </option>
            </select>
          </div>
        </div>

        <div class="form-row cols-3">
          <div class="form-group">
            <label>Quantidade</label>
            <input type="number" v-model.number="form.quantidade" min="1" />
          </div>
          <div class="form-group">
            <label>Data de entrega</label>
            <input type="date" v-model="form.data_entrega" />
          </div>
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.assinatura_digital" />
              Confirmar entrega (assinatura digital)
            </label>
          </div>
        </div>

        <div class="action-bar">
          <button 
            class="btn btn-primary" 
            @click="registrar" 
            :disabled="!form.funcionario_id || !form.epi_id || loading"
          >
            Registrar
          </button>
        </div>

        <p class="error-msg" v-if="erro">⚠ {{ erro }}</p>
        <p class="success-msg" v-if="ok">✓ Entrega registrada com sucesso!</p>
      </div>
    </div>

    <!-- Tabela Histórico -->
    <div class="card-table">
      <div class="card-header flex-between">
        <h2>Histórico de Entregas</h2>
        <span class="badge badge-blue">{{ entregas.length }} entregas</span>
      </div>

      <div v-if="loading" class="text-center-loading" style="padding: 20px; text-align: center;">Carregando dados...</div>
      
      <div v-else class="table-container">
        <table class="styled-table">
          <thead>
            <tr>
              <th>Funcionário</th>
              <th>EPI</th>
              <th>Qtd.</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in entregas" :key="e.id">
              <td>
                <div class="text-bold">{{ e.funcionarios?.nome }}</div>
                <div class="cargo-text">{{ e.funcionarios?.setor }}</div>
              </td>
              <td>
                <div class="text-bold">{{ e.epis?.nome }}</div>
                <div class="cargo-text">CA: {{ e.epis?.ca }}</div>
              </td>
              <td class="text-bold">{{ e.quantidade }}</td>
              <td class="cargo-text">{{ formatarData(e.data_entrega) }}</td>
              <td>
                <span :class="e.assinatura_digital ? 'badge badge-ok' : 'badge badge-warn'">
                  {{ e.assinatura_digital ? 'Confirmada' : 'Pendente' }}
                </span>
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
import { useSupabase } from '../composables/useSupabase'

const { supabase } = useSupabase()

const funcionarios = ref([])
const epis = ref([])
const entregas = ref([])
const loading = ref(true)
const erro = ref('')
const ok = ref(false)

const hoje = new Date().toISOString().slice(0, 10)

const form = ref({ 
  funcionario_id: '', 
  epi_id: '', 
  quantidade: 1, 
  data_entrega: hoje, 
  assinatura_digital: false 
})

async function carregar() {
  loading.value = true
  erro.value = ''
  try {
    // 1. Carrega Funcionários
    const { data: funcs } = await supabase.from('funcionarios').select('*').order('nome')
    funcionarios.value = funcs || []

    // 2. Carrega EPIs diretamente (onde o saldo real está)
    const { data: episData } = await supabase.from('epis').select('*').order('nome')
    epis.value = episData || []

    // 3. Carrega Histórico de Entregas
    const { data: entData } = await supabase
      .from('entregas')
      .select('*, funcionarios(nome, setor), epis(nome, ca)')
      .order('created_at', { ascending: false })
    entregas.value = entData || []
  } catch (e) {
    erro.value = e.message
  } finally {
    loading.value = false
  }
}

async function registrar() {
  erro.value = ''; ok.value = false
  
  // Localiza o EPI selecionado para verificar o saldo
  const epiSelecionado = epis.value.find(e => e.id === form.value.epi_id)
  const qtdEstoque = epiSelecionado?.quantidade ?? 0
  
  if (form.value.quantidade > qtdEstoque) {
    erro.value = `Estoque insuficiente (${qtdEstoque} disponíveis)`; return
  }

  // Insere o registro da entrega
  const { error: insertError } = await supabase.from('entregas').insert(form.value)
  if (insertError) { erro.value = insertError.message; return }

  // 4. ATUALIZAÇÃO: Baixa o estoque diretamente na tabela 'epis'
  const { error: updateError } = await supabase.from('epis')
    .update({ quantidade: qtdEstoque - form.value.quantidade })
    .eq('id', form.value.epi_id)

  if (updateError) {
    erro.value = "Entrega registrada, mas ocorreu um erro ao atualizar o estoque: " + updateError.message
    return
  }

  ok.value = true
  // Reseta o formulário mantendo a data de hoje
  form.value = { funcionario_id: '', epi_id: '', quantidade: 1, data_entrega: hoje, assinatura_digital: false }
  await carregar()
}

function formatarData(d) {
  if (!d) return '—'
  const [y, m, dia] = d.split('-')
  return `${dia}/${m}/${y}`
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

.layout-container { width: 100%; padding: 20px 30px; background-color: #F2F2F2; min-height: 100vh; box-sizing: border-box; border-radius: 20px; }

.header-section { margin-bottom: 25px; font-family: "Noto Sans", sans-serif;}

.header-section h1 { color: #000000; font-size: 1.5rem; font-weight: 700; margin: 0; }

.card-form, .card-table { background: #004381; border: 1px solid #000000; border-radius: 8px; margin-bottom: 24px; width: 100%; overflow: hidden; font-family: "Noto Sans", sans-serif; color: #FFFFFF;}

.card-header { background-color: #00296B; padding: 12px 20px; border-bottom: 1px solid #000000; font-family: "Noto Sans", sans-serif; font-weight: 400; }

.flex-between { display: flex; justify-content: space-between; align-items: center; }

.main-form { padding: 20px; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

.cols-3 { grid-template-columns: 1fr 1fr 1.2fr; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

label { font-size: 0.8rem; font-weight: 400; color: #FFFFFF; font-family: "Noto Sans", sans-serif; text-align: left; }

input, .custom-select { padding: 9px 12px; border: 1px solid #000000; border-radius: 6px; font-size: 0.875rem; color: #828282;}

.btn-primary { font-family: "Noto Sans", sans-serif; background: #FFFFFF; color: black; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: 600; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-primary:hover{ background-color: #A2A2A2; text-shadow: 0.3px 0 0 currentColor; }

.table-container { width: 100%; overflow-x: auto; }

.styled-table { width: 100%; border-collapse: collapse; }

.styled-table th { background: #E9ECEE; padding: 14px 20px; text-align: center; font-size: 0.75rem; color: #000000; border-bottom: 1px solid #000000; font-family: "Noto Sans", sans-serif; }

.styled-table td { background: #FFFFFF; padding: 14px 20px; border-top: 1px solid #000000; font-size: 0.875rem; font-family: "Noto Sans", sans-serif; color: #000000; }

.badge { padding: 3px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }

.badge-blue { background: #e0f2fe; color: #0369a1; }

.badge-ok { background: #dcfce7; color: #166534; }

.badge-warn { background: #fef9c3; color: #854d0e; }

.text-bold { font-weight: 600; }

.cargo-text { color: #828282; font-size: 0.8rem; }

.text-center-loading { padding: 40px; text-align: center; }
</style>