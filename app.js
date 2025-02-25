// Armazenar todos os Pokémons para buscar
let allPokemons = [];

// Quantidade de Pokémons por página
const POKEMON_LIMIT = 1025; // Podemos aumentar para 150 ou qualquer número

// Seleciona o contêiner da lista de Pokémons
const pokemonList = document.getElementById("pokemon-list");

// Mapeamento das cores para os tipos de Pokémon
const typeColors = {
  fire: "#ffbeae",   // Fogo: Laranja Claro //
  water: "#bbd5f9",  // Água: Azul Claro //
  electric: "#fffec4", // Elétrico: Amarelo Claro //
  grass: "#98FB98",   // Planta: Verde Claro //
  ground: "#efdcc9",  // Terra: Marrom Claro //
  rock: "#c6c8c8",    // Rocha: Cinza Claro //
  fairy: "#f8d2e8",   // Fada: Rosa Claro //
  poison: "#c5abf6",  // Venenoso: Roxo Claro //
  bug: "#d7ff61",     // Inseto: Verde Claro //
  normal: "#ececec",  // Normal: Branco Claro //
  psychic: "#fd8ae4", // Psíquico: Rosa Claro //
  fighting: "#e3697f",// Luta: Vermelho Claro //
  ice: "#ccfaed",     // Gelo: Azul Claro //
  dragon: "#ff7c70",  // Dragão: Laranja Claro //
  ghost: "#a9a9a9",   // Fantasma: Cinza Claro //
  steel: "#8c8c8c",   // Metal: Cinza Escuro //
  dark: "#545454",    // Sombrio: Preto //
  flying: "#ecf6fc"   // Voador: Azul Claro //
};

// Função para buscar os Pokémons da API
async function fetchPokemons() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`);
  const data = await response.json();
  const pokemons = data.results;
  
  const promises = pokemons.map(pokemon => fetch(pokemon.url).then(response => response.json()));
  allPokemons = await Promise.all(promises);  // Armazenar todos os Pokémons
  allPokemons.sort((a, b) => a.id - b.id);
  
  displayPokemons(allPokemons);  // Exibe todos os Pokémons inicialmente
}

// Filtrar Pokémons pela pesquisa
function filterPokemons() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  const filteredPokemons = allPokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchValue)  // Pesquisa por nome
  );
  
  displayPokemons(filteredPokemons);  // Exibe apenas os Pokémons filtrados
}

// Exibir apenas Pokémons filtrados
function displayPokemons(pokemons) {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonList.innerHTML = '';  // Limpa a lista antes de exibir os resultados
  
  pokemons.forEach(pokemon => {
    createPokemonCard(pokemon);
  });
}

// Função para criar o card do Pokémon
function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  
  const pokemonId = pokemon.id;
  const types = pokemon.types.map(type => type.type.name);
  const cardColor = getTypeColor(types);
  pokemonCard.style.backgroundColor = cardColor;
  
  pokemonCard.innerHTML = `
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
  `;
  
  pokemonCard.addEventListener("mouseover", (e) => {
    showDetailsOnHover(pokemon, e);
  });
  pokemonCard.addEventListener("mouseleave", () => {
    removeTooltip();
  });
  
  pokemonList.appendChild(pokemonCard);
}

// Função para obter a cor de fundo baseada nos tipos de Pokémon
function getTypeColor(types) {
  let colors = types.map(type => typeColors[type]).join(", ");
  return colors.length ? colors.split(", ")[0] : "#ffffff";
}

// Função para exibir detalhes flutuantes ao passar o mouse
async function showDetailsOnHover(pokemon, event) {
    removeTooltip();
    
    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = `
      <h4>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h4>
      <p><strong>Tipo(s):</strong> ${pokemon.types.map(type => type.type.name).join(", ")}</p>
      <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(", ")}</p>
      <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
      <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
    `;
    
    document.body.appendChild(tooltip);
    positionTooltip(event, tooltip);
    document.addEventListener("mousemove", (e) => positionTooltip(e, tooltip));
}

// Ajusta a posição do tooltip
function positionTooltip(event, tooltip) {
    tooltip.style.position = "absolute";
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;
    tooltip.style.background = "rgba(255, 255, 255, 0.9)";
    tooltip.style.padding = "10px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    tooltip.style.zIndex = "1000";
}

// Remove o tooltip quando o mouse sai do card
function removeTooltip() {
    const tooltip = document.querySelector(".tooltip");
    if (tooltip) {
        tooltip.remove();
    }
}

function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const pokemonId = pokemon.id;
  const types = pokemon.types.map(type => type.type.name);
  const cardColor = getTypeColor(types);
  pokemonCard.style.backgroundColor = cardColor;

  // Cria o conteúdo do card
  pokemonCard.innerHTML = `
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
    <div class="types-container"></div>
  `;

  // Cria e adiciona os tipos como caixas abaixo do card
  const typesContainer = pokemonCard.querySelector('.types-container');
  types.forEach(type => {
    const typeBox = document.createElement("span");
    typeBox.classList.add("pokemon-type", type);  // Adiciona a classe do tipo (cor)
    typeBox.textContent = type.charAt(0).toUpperCase() + type.slice(1);  // Capitaliza a primeira letra
    typesContainer.appendChild(typeBox);
  });

  pokemonCard.addEventListener("mouseover", (e) => {
    showDetailsOnHover(pokemon, e);
  });
  pokemonCard.addEventListener("mouseleave", () => {
    removeTooltip();
  });

  pokemonList.appendChild(pokemonCard);
}

// Chama a função para buscar os Pokémons
fetchPokemons();