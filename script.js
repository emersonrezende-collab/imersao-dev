document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('botao-busca');
    const searchInput = document.querySelector('.search-box input');
    const cardContainer = document.querySelector('.card.container');
    const dataUrl = 'data.json';

    let allItems = [];

    // Função para criar o card de um filme ou série
    function createCard(item) {
        const cardArticle = document.createElement('article');
        cardArticle.classList.add('card'); // Adiciona a classe card para estilização

        // Trata tanto "Diretor" quanto "Criador(es)"
        const creatorOrDirector = item.Diretor ? `<p>Direção: ${item.Diretor}</p>` : `<p>Criador(es): ${item["Criador(es)"]}</p>`;

        cardArticle.innerHTML = `
            <h2>${item.Título}</h2>
            ${creatorOrDirector}
            <p>Formato: ${item.Formato}</p>
            <p>Lançamento: ${item.Ano}</p>
            <p>Gênero: ${item.Gênero}</p>
            <p>Elenco: ${item.Elenco}</p>
            <p>Sinopse:</p>
            <p>${item.Sinopse}</p>
            <a href="${item.Link}" target="_blank">Mais informações</a>
        `;
        return cardArticle;
    }

    // Função para exibir os dados na tela
    function displayData(items) {
        cardContainer.innerHTML = ''; // Limpa o container
        if (items.length === 0) {
            cardContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            return;
        }
        items.forEach(item => {
            const card = createCard(item);
            cardContainer.appendChild(card);
        });
    }

    // Função para buscar os dados
    async function fetchData() {
        try {
            const response = await fetch(dataUrl);
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo de dados.');
            }
            allItems = await response.json();
            // displayData(allItems); // Não exibe mais os itens inicialmente
        } catch (error) {
            console.error('Houve um problema com a operação de fetch:', error);
            cardContainer.innerHTML = '<p>Erro ao carregar os dados. Verifique o console para mais detalhes.</p>';
        }
    }

    // Função para lidar com a busca
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            const filteredItems = allItems.filter(item =>
                item.Título.toLowerCase().includes(searchTerm)
            );
            displayData(filteredItems);
        } else {
            displayData(allItems); // Se a busca estiver vazia, mostra todos os itens
        }
    }

    // Adiciona os event listeners
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    });

    // Carrega os dados iniciais
    fetchData();
});