<template>
    <section class="w-full bg-[#013A60] min-h-screen">
   <main class="book-list max-w-6xl mx-auto p-4 md:p-6">
    <h1 class="text-2xl font-bold mb-4 text-white">Book - List</h1>
    <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search By Title" 
        class="block w-full p-2 mb-4 border rounded bg-white"
     />

       <select v-model="selectedCategory" class="block w-full p-2 mb-4 border rounded bg-white">
        <option value="">All Categories</option>
           <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
         </option>
      </select>
       
         <div v-if="isLoading" class="text-center text-white">Loading...</div>
       
        <div v-if="error" class="text-center text-red-500 mb-4">Error: {{ error }}</div>
      
        <div v-if="!isLoading && !error && paginatedBooks.length" class="books grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        <div v-for="book in paginatedBooks" :key="book.id" class="book-item p-4 border rounded shadow bg-white flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
          <div class="book-details flex-1">
               <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ book.volumeInfo.title }}</h3>
            <p class="text-sm text-gray-600 mb-1">{{ book.volumeInfo.authors?.join(', ') }}</p>
                <p class="text-sm text-gray-700 mt-2 mb-4">{{ book.volumeInfo.description }}</p>
             <router-link 
              :to="`/book-details/${book.id}`" 
              class="block bg-[#004E95] text-white hover:bg-[#003C7A] font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
         <p v-else-if="!isLoading && !error" class="text-center text-red-500">No books found.</p>

      
         <section v-if="!isLoading && !error && paginatedBooks.length" class="pagination flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 border rounded">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1" 
          class="px-4 py-2 bg-[#004E95] text-white rounded hover:bg-[#003C7A] disabled:opacity-50 transition duration-200 ease-in-out"
        >
          Previous
        </button>
        <span class="text-lg font-semibold text-gray-800 mb-4 sm:mb-0">Page {{ currentPage }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages" 
          class="px-4 py-2 bg-[#004E95] text-white rounded hover:bg-[#003C7A] disabled:opacity-50 transition duration-200 ease-in-out"
        >
          Next
        </button>
        </section>
          </main>
  </section>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'BookList',
  setup() {
    const books = ref([]);
    const selectedCategory = ref('');
    const searchQuery = ref('');
    const currentPage = ref(1);
    const booksPerPage = 10;
    const totalItems = ref(0); 
    const isLoading = ref(false); 
    const error = ref(null);

    const fetchBooks = async () => {
      isLoading.value = true;
      error.value = null;
      try {
        const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
          params: {
            q: 'vue.js',
            maxResults: 40, 
          },
        });
        books.value = response.data.items || [];
        totalItems.value = response.data.totalItems || 0;
        if (!response.data.items || response.data.items.length === 0) {
          error.value = 'No books found.';
        }
      } catch (err) {
        error.value = `Failed to load books. Error: ${err.message}`;
      } finally {
        isLoading.value = false;
      }
    };

    const filteredBooks = computed(() => {
      let filtered = books.value;

      if (selectedCategory.value) {
        filtered = filtered.filter(book => book.volumeInfo.categories?.includes(selectedCategory.value));
      }

      if (searchQuery.value) {
        filtered = filtered.filter(book =>
          book.volumeInfo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      return filtered;
    });

    const paginatedBooks = computed(() => {
      const startIndex = (currentPage.value - 1) * booksPerPage;
      return filteredBooks.value.slice(startIndex, startIndex + booksPerPage);
    });

      const totalPages = computed(() => Math.ceil(filteredBooks.value.length / booksPerPage));

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
      }
    };

       const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value -= 1;
      }
    };

    const categories = computed(() => {
      const allCategories = books.value.flatMap(book => book.volumeInfo.categories || []);
      return [...new Set(allCategories)];
    });

  
      onMounted(fetchBooks);

    return {
      books,
      selectedCategory,
      searchQuery,
      currentPage,
      paginatedBooks,
      categories,
      totalPages,
      nextPage,
      prevPage,
      isLoading,
      error,
    };
  },
};
</script>
