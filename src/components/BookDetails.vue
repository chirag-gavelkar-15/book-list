<template>
  <section class="w-full bg-[#013A60] min-h-screen flex items-center justify-center text-white">
   
        <div v-if="isLoading" class="text-center text-white">Loading...</div>
    
    <div v-if="error" class="text-center text-red-500">Error: {{ error }}</div>


         <div v-if="book" class="max-w-6xl mx-auto p-4 md:p-6">
      <div class="flex flex-col md:flex-row items-start">
       
        <img 
          :src="book.volumeInfo.imageLinks?.thumbnail" 
          alt="Book Cover"
          class="w-full md:w-1/3 lg:w-1/4 h-auto mb-4 md:mb-0 rounded-md shadow-md"
        />
        <div class="md:ml-6 flex-1">
          <h1 class="text-3xl md:text-4xl font-extrabold mb-4 text-white">{{ book.volumeInfo?.title }}</h1>
          <p class="text-lg md:text-xl mb-2 text-gray-300">
            <strong>Authors:</strong> {{ book.volumeInfo.authors?.join(', ') }}
          </p>
          <p class="text-lg md:text-xl mb-4 text-gray-300">
            <strong>Categories:</strong> {{ book.volumeInfo.categories?.join(', ') }}
          </p>
          <p class="text-base mb-6 text-gray-200" v-html="book.volumeInfo?.description"></p>
          <a 
            :href="book.volumeInfo.infoLink" 
            target="_blank" 
            class="block bg-[#004E95] text-white hover:bg-[#003C7A] font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            More Information
          </a>
              <router-link 
            to="/" 
            class="block bg-[#004E95] text-white hover:bg-[#003C7A] font-semibold mt-4 py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            Back to List
          </router-link>
     </div>
           </div>
                 </div>
    </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  name: 'BookDetails',
  setup() {
    const book = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const route = useRoute();

      const fetchBook = async () => {
      isLoading.value = true;
      error.value = null;
        isLoading.value = true;
      try {
          isLoading.value = true;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${route.params.id}`);
        book.value = response.data;
      } catch (err) {
        error.value = 'Failed to load book details. Please try again later.';
        console.error('Error fetching book:', err);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(fetchBook);

    return { book, isLoading, error };
  },
};
</script>


