<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';  // Importa o useRouter para navegação

const selectedImage = ref(null);  // Armazena a imagem selecionada

// Função para selecionar a imagem
const selectImage = (image) => {
  selectedImage.value = image;
};

// Instância do roteador
const router = useRouter();

// Função para voltar à página inicial e desmarcar a imagem
const goToHome = () => {
  selectedImage.value = null;  // Desmarca a imagem selecionada
  router.push("/");  // Redireciona para a rota "/"
};
</script>

<template>
  <div class="container">
    <router-link 
      to="/loja1" 
      @click="selectImage('mongodb')"
      :state="{ msg: 'MongoDB' }"
    >
      <img 
        src="./assets/mongodb.png" 
        class="logo" 
        :class="{ selected: selectedImage === 'mongodb' }"
        alt="MongoDB logo" 
      />
    </router-link>

    <router-link 
      to="/loja2" 
      @click="selectImage('couchdb')"
      :state="{ msg: 'CouchDB' }"
    >
      <img 
        src="./assets/couchdb.png" 
        class="logo couch" 
        :class="{ selected: selectedImage === 'couchdb' }"
        alt="CouchDB logo" 
      />
    </router-link>
  </div>

  <!-- Exibe a vista do roteador -->
  <router-view />
  
  <!-- Botão para voltar à página inicial -->
  <button @click="goToHome" class="btn-home">Voltar à Página Inicial</button>
</template>

<style scoped>
/* Contêiner principal da página */
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  padding-top: 1em;
  height: auto;
  margin-bottom: 2em;
  box-sizing: border-box;
  position: relative;  /* Permite que elementos dentro deste contêiner sejam posicionados em relação a ele */
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
  cursor: pointer;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.couch:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.selected {
  border: 3px solid #42b883; 
  border-radius: 10px; 
  box-shadow: 0 0 10px #42b883; 
  transform: scale(1.1);
  transition: transform 200ms, box-shadow 200ms; 
}

/* Estilo do botão de voltar */
.btn-home {
  position: fixed;  /* Fixado na tela */
  top: 10px;  /* Distância do topo */
  right: 10px;  /* Distância da direita */
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;  /* Garantir que o botão fique acima de outros elementos */
}

.btn-home:hover {
  background-color: #0056b3;
}
</style>
