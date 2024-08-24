import { createRouter, createWebHistory } from 'vue-router';
import BookList from '../components/BookList.vue';
import BookDetails from '../components/BookDetails.vue';

const routes = [
  {
    path: '/',
    name: 'BookList',
    component: BookList,
  },
  {
    path: '/book-details/:id',
    name: 'BookDetails',
    component: BookDetails,
  },
];

const router = createRouter({
   history:createWebHistory(),
  routes,
})


export default router;

