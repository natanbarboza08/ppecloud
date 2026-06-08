<template>
  <div class="relatorios-page">

    <div class="page-header">
      <h1>Relatórios de EPIs</h1>
      <button class="btn-pdf" @click="gerarPDF">
        Gerar PDF
      </button>
    </div>

    <!-- CARD GRÁFICO -->
    <div class="card">
      <h2>EPIs com Estoque Baixo</h2>

      <div class="grafico-container">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="card">
      <h2>Filtros</h2>

      <div class="filtros">

        <input
          v-model="filtroFuncionario"
          type="text"
          placeholder="Matrícula do Funcionário"
        >

        <input
          v-model="filtroEpi"
          type="text"
          placeholder="CA do EPI"
        >

        <input
          v-model="filtroData"
          type="date"
        >

        <button class="btn-filtrar" @click="buscarEntregas">
          Filtrar
        </button>

        <button class="btn-limpar" @click="limparFiltros">
          Limpar
        </button>

      </div>
    </div>

    <!-- TABELA -->
    <div class="card">

      <h2>Histórico de Entregas</h2>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>CA EPI</th>
              <th>Nome EPI</th>
              <th>Matrícula</th>
              <th>Funcionário</th>
              <th>Data Entrega</th>
              <th>Quantidade</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="item in entregas"
              :key="item.id"
            >
              <td>{{ item.epis?.ca || '-' }}</td>

              <td>
                {{ item.epis?.nome || 'EPI não encontrado' }}
              </td>

              <td>
                {{ item.funcionarios?.matricula || '-' }}
              </td>

              <td>
                {{ item.funcionarios?.nome || 'Funcionário não encontrado' }}
              </td>

              <td>
                {{ formatarData(item.data_entrega) }}
              </td>

              <td>
                {{ item.quantidade }}
              </td>
            </tr>

            <tr v-if="entregas.length === 0">
              <td colspan="6" class="sem-registros">
                Nenhum registro encontrado
              </td>
            </tr>

          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

import { supabase } from '../composables/useSupabase'

const chartCanvas = ref(null)
let grafico = null

const entregas = ref([])
const episBaixoEstoque = ref([])

const filtroFuncionario = ref('')
const filtroEpi = ref('')
const filtroData = ref('')

onMounted(async () => {
  await carregarGrafico()
  await buscarEntregas()
})

async function carregarGrafico() {
  try {
    const { data, error } = await supabase
      .from('epis')
      .select('*')
      .lt('quantidade', 10)

    if (error) throw error

    episBaixoEstoque.value = data || []

    await nextTick()

    if (grafico) {
      grafico.destroy()
    }

    grafico = new Chart(chartCanvas.value, {
      type: 'bar',

      data: {
        labels: data.map(item => item.nome),

        datasets: [
          {
            label: 'Quantidade em Estoque',

            data: data.map(item => item.quantidade),

            backgroundColor: [
              '#00296B',
              '#003F88',
              '#00509D',
              '#6C757D',
              '#ADB5BD',
              '#4361EE',
              '#5A78FF'
            ],

            borderRadius: 8,
            borderWidth: 0
          }
        ]
      },

      options: {
        responsive: true,

        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })

  } catch (err) {
    console.error('Erro ao carregar gráfico:', err)
  }
}

async function buscarEntregas() {
  try {

    let query = supabase
      .from('entregas')
      .select(`
        id,
        quantidade,
        data_entrega,
        assinatura_digital,
        created_at,
        funcionarios (
          matricula,
          nome
        ),
        epis (
          nome,
          ca
        )
      `)
      .order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error

    let resultado = data || []

    if (filtroFuncionario.value) {
      resultado = resultado.filter(item =>
        String(item.funcionarios?.matricula || '')
          .includes(filtroFuncionario.value)
      )
    }

    if (filtroEpi.value) {
      resultado = resultado.filter(item =>
        String(item.epis?.ca || '')
          .includes(filtroEpi.value)
      )
    }

    if (filtroData.value) {
      resultado = resultado.filter(item =>
        item.data_entrega === filtroData.value
      )
    }

    entregas.value = resultado

  } catch (err) {
    console.error(err)
    entregas.value = []
  }
}

async function limparFiltros() {
  filtroFuncionario.value = ''
  filtroEpi.value = ''
  filtroData.value = ''

  await buscarEntregas()
}

function formatarData(data) {
  if (!data) return '-'

  const [ano, mes, dia] = data.split('-')

  return `${dia}/${mes}/${ano}`
}

function gerarPDF() {

  const pdf = new jsPDF()

  pdf.setFontSize(18)
  pdf.text('Relatório de Entregas de EPIs', 14, 20)

  pdf.setFontSize(10)

  pdf.text(
    `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
    14,
    28
  )

autoTable(pdf, {
  startY: 35,

  head: [[
    'CA EPI',
    'Nome EPI',
    'Matrícula',
    'Funcionário',
    'Data',
    'Qtd'
  ]],

  body: entregas.value.map(item => [
    item.epis?.ca || '-',
    item.epis?.nome || 'Não encontrado',
    item.funcionarios?.matricula || '-',
    item.funcionarios?.nome || 'Não encontrado',
    formatarData(item.data_entrega),
    item.quantidade
  ])
})

  pdf.save('relatorio-epis.pdf')
}
</script>

<style scoped>

.relatorios-page {
  padding: 10px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.page-header h1 {
  color: #00296B;
  font-size: 28px;
  font-weight: 700;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0,0,0,.08);
}

.card h2 {
  color: #00296B;
  margin-bottom: 20px;
}

.grafico-container {
  height: 420px;
}

.filtros {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.filtros input {
  height: 45px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 0 12px;
}

.btn-filtrar,
.btn-limpar,
.btn-pdf {
  height: 45px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-filtrar {
  background: #003F88;
  color: white;
}

.btn-limpar {
  background: #6C757D;
  color: white;
}

.btn-pdf {
  background: #00296B;
  color: white;
  padding: 0 20px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #00296B;
  color: white;
}

th,
td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e5e5e5;
}

tbody tr:hover {
  background: #f4f8ff;
}

.sem-registros {
  text-align: center;
  padding: 30px;
  color: #888;
}

@media (max-width: 768px) {

  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .grafico-container {
    height: 300px;
  }
}
</style>
