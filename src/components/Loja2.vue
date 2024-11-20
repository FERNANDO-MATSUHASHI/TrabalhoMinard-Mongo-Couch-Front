<script setup>
import { ref, onMounted } from 'vue';

// Propriedade recebida
defineProps({
  msg: String,
});

// Estado para armazenar os produtos, loading e erro
const produtos = ref([]);
const loading = ref(true);
const error = ref(null);

// Estado para controle do modal
const modalVisible = ref(false);
const produtoSelecionado = ref(null);
const quantidadeVenda = ref(0);

// Função para buscar os produtos
const fetchProdutos = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/products?db=couchdb');
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }
    produtos.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Função para abrir o modal
const openModal = (produto) => {
  produtoSelecionado.value = produto;
  quantidadeVenda.value = 0; // Resetar a quantidade da venda ao abrir o modal
  modalVisible.value = true;
};

// Função para fechar o modal
const closeModal = () => {
  modalVisible.value = false;
};

// Função para realizar a venda (atualizar a quantidade no banco de dados)
const realizarVenda = async () => {
  if (quantidadeVenda.value > produtoSelecionado.value.quantidade) {
    alert('A quantidade de venda não pode ser maior que a quantidade disponível.');
    return;
  }

  const produtoAtualizado = {
    ...produtoSelecionado.value,
    quantidade: produtoSelecionado.value.quantidade - quantidadeVenda.value, // Atualiza a quantidade
  };

  try {
    const response = await fetch(`http://127.0.0.1:5000/product/${produtoSelecionado.value.id_produto}?db=couchdb`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produtoAtualizado),
    });

    if (response.ok) {
      alert('Venda realizada com sucesso!');
      closeModal(); // Fecha o modal após a venda
      await fetchProdutos(); // Recarrega os produtos após a venda
    } else {
      throw new Error('Erro ao realizar a venda');
    }
  } catch (err) {
    alert(err.message);
  }
};

// Chama a função quando o componente é montado
onMounted(() => {
  fetchProdutos();
});
</script>

<template>
  <div>
    <h1 class="msg">{{ msg }}</h1>

    <!-- Exibe mensagem de carregamento -->
    <p class="loading" v-if="loading">Carregando produtos...</p>

    <!-- Exibe mensagem de erro, se houver -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Lista os produtos -->
    <div v-if="!loading && !error" class="product-list">
      <div 
        v-for="produto in produtos" 
        :key="produto._id" 
        class="card" 
        @click="openModal(produto)"
      >
        <h2>{{ produto.id_produto }}</h2>
        <p><strong>Categoria:</strong> {{ produto.categoria }}</p>
        <p><strong>Loja:</strong> {{ produto.loja }}</p>
        <p><strong>Quantidade:</strong> {{ produto.quantidade }}</p>
        <p><strong>Última Atualização:</strong> {{ produto.ultima_atualizacao }}</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <!-- Botão "X" para fechar -->
        <span class="close-icon" @click="closeModal">&times;</span>
        
        <!-- Conteúdo do modal -->
        <h2>{{ produtoSelecionado?.id_produto }}</h2>
        <p><strong>Categoria:</strong> {{ produtoSelecionado?.categoria }}</p>
        <p><strong>Loja:</strong> {{ produtoSelecionado?.loja }}</p>
        <p><strong>Quantidade disponível:</strong> {{ produtoSelecionado?.quantidade }}</p>

        <!-- Input e botão centralizados -->
        <div class="input-container">
          <label for="quantidade">Quantidade:</label>
          <input
            type="number"
            v-model="quantidadeVenda"
            :max="produtoSelecionado?.quantidade"
            min="1"
            class="input-venda"
          />
        </div>

        <button @click="realizarVenda" class="botao-venda">Realizar Venda</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msg, .loading {
  text-align: center;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
  padding: 1em;
}

.card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1em;
  width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2em;
  border-radius: 8px;
  width: 300px;
  position: relative;
  text-align: center;
}

/* Botão "X" no canto superior direito */
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-icon:hover {
  color: #f44336;
}

/* Centraliza e estiliza o input */
.input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1em 0;
}

.input-venda {
  width: 80px; /* Reduz tamanho */
  padding: 0.3em;
  margin-top: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  text-align: center;
}

.input-venda:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
  outline: none;
}

/* Estilo do botão */
.botao-venda {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.7em 1.5em;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.botao-venda:hover {
  background-color: #45a049;
  transform: translateY(-2px);
}

.botao-venda:active {
  background-color: #3e8e41;
  transform: translateY(0);
}
</style>
