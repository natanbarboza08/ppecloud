// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '../composables/useSupabase.js';
// views
import Home from '../views/apresentaçao.vue';
import Login from '../views/login.vue';
import Dashboard from '../views/dashboard.vue';
import CadastroFuncionario from '../views/cadastroFuncionario.vue';
import Entregas from '../views/entregas.vue';
import CadastroEPI from '../views/cadastroEPI.vue';
import Estoque from '../views/estoque.vue';
// routes
const routes = [
{ path: '/', component: Home },
{ path: '/login', component: Login },
{
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
        { path: 'cadastroFuncionario', component: CadastroFuncionario },
        { path: 'entregas', component: Entregas },
        { path: 'cadastroEPI', component: CadastroEPI },
        { path: 'estoque', component: Estoque }
    ]
}
];
const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach(async (to, from, next) => {
const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
const { data: { session } } = await supabase.auth.getSession();
if (requiresAuth && !session) { next('/login'); }
else { next(); }
});
export default router;
