import { createRouter, createWebHistory } from 'vue-router';
import Loja1 from '../components/Loja1.vue';
import Loja2 from '../components/Loja2.vue';

const routes = [
  {
    path: '/loja1',
    component: Loja1,
    props: route => ({ msg: route.state?.msg || 'MongoDB' }) // Passa "MongoDB" como padrão
  },
  {
    path: '/loja2',
    component: Loja2,
    props: route => ({ msg: route.state?.msg || 'CouchDB' }) // Passa "CouchDB" como padrão
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
