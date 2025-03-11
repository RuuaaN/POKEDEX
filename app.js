// Armazenar todos os Pokémons para buscar
let allPokemons = [];

// Quantidade de Pokémons
const POKEMON_LIMIT = 1025;

// Seleciona o contêiner da lista de Pokémons
const pokemonList = document.getElementById("pokemon-list");

// Mapeamento das cores para os tipos de Pokémon
const typeColors = {
  fire: "#ffbeae",
  water: "#bbd5f9",
  electric: "#fffec4",
  grass: "#98FB98",
  ground: "#efdcc9",
  rock: "#c6c8c8",
  fairy: "#f8d2e8",
  poison: "#c5abf6",
  bug: "#d7ff61",
  normal: "#ececec",
  psychic: "#fd8ae4",
  fighting: "#e3697f",
  ice: "#ccfaed",
  dragon: "#ff7c70",
  ghost: "#a9a9a9",
  steel: "#8c8c8c",
  dark: "#373737",
  flying: "#ecf6fc"
};

// Função para buscar os Pokémons da POKEAPI
async function fetchPokemons() {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`);
  const data = await response.json();
  const pokemons = data.results;
  
  const promises = pokemons.map(pokemon => fetch(pokemon.url).then(response => response.json()));
  allPokemons = await Promise.all(promises);
  allPokemons.sort((a, b) => a.id - b.id);
  
  displayPokemons(allPokemons);
}

// Filtrar Pokémons pela pesquisa
function filterPokemons() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  const filteredPokemons = allPokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchValue)
  );
  
  displayPokemons(filteredPokemons);
}

// Exibir apenas Pokémons filtrados
function displayPokemons(pokemons) {
  const pokemonList = document.getElementById("pokemon-list");
  pokemonList.innerHTML = '';
  
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

  // Se for do tipo Dark, adiciona a classe .dark ao card
  if (types.includes("dark")) {
    pokemonCard.classList.add("dark");
  }

  // Criando o ID do Pokémon
  const pokemonIdElement = document.createElement("h3");
  pokemonIdElement.textContent = `#${pokemonId.toString().padStart(4, '0')}`;
  pokemonIdElement.classList.add("pokemon-id");

  // Criando o nome do Pokémon
  const pokemonNameElement = document.createElement("h3");
  pokemonNameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  // Adiciona os elementos ao card
  pokemonCard.appendChild(pokemonIdElement);
  pokemonCard.appendChild(pokemonNameElement);

  pokemonList.appendChild(pokemonCard);

  // Definir os valores de HP, Attack, Defense e Speed
  const hp = pokemon.stats.find(stat => stat.stat.name === "hp").base_stat;
  const attack = pokemon.stats.find(stat => stat.stat.name === "attack").base_stat;
  const defense = pokemon.stats.find(stat => stat.stat.name === "defense").base_stat;
  const speed = pokemon.stats.find(stat => stat.stat.name === "speed").base_stat;

  // Calculando as porcentagens para cada barra
  const maxStat = 255;
  const hpPercentage = (hp / maxStat) * 100;
  const attackPercentage = (attack / maxStat) * 100;
  const defensePercentage = (defense / maxStat) * 100;
  const speedPercentage = (speed / maxStat) * 100;

  // Criação do conteúdo do card
  pokemonCard.innerHTML = `
  <h3 class="pokemon-id">#${pokemonId.toString().padStart(4, '0')}</h3>
  <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
  <img src="images/gifs/${pokemonId.toString().padStart(4, '0')}.gif" alt="${pokemon.name}">
  <div class="types-container"></div>
  <div class="stats-container">

      <div class="stat-row">

        <p>HP: ${hp}</p>

        <div class="stat-bar">
        
            <span class="stat" style="width: ${hpPercentage}%;"></span>

        </div>

        <p>Speed: ${speed}</p>

        <div class="stat-bar">

           <span class="stat" style="width: ${speedPercentage}%;"></span>

        </div>

      </div>

      <div class="stat-row">

        <p>Attack: ${attack}</p>

        <div class="stat-bar">

            <span class="stat" style="width: ${attackPercentage}%;"></span>

        </div>

        <p>Defense: ${defense}</p>

        <div class="stat-bar">

          <span class="stat" style="width: ${defensePercentage}%;"></span>

        </div>
      </div>
    </div>
  `;

  // Criação e inserção das caixas de tipos
  const typesContainer = pokemonCard.querySelector('.types-container');
  types.forEach(type => {
    const typeBox = document.createElement("span");
    typeBox.classList.add("pokemon-type", type);
    typeBox.textContent = type.charAt(0).toUpperCase() + type.slice(1);
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

// Função para obter a cor de fundo baseada nos tipos de Pokémon
function getTypeColor(types) {
  let colors = types.map(type => typeColors[type]).join(", ");
  return colors.length ? colors.split(", ")[0] : "#ffffff";
}

// Chama a função para buscar os Pokémons
fetchPokemons();

// Função para criar os filtros de tipo
function createTypeFilters() {
  const typeFiltersContainer = document.getElementById("type-filters");

  if (!typeFiltersContainer) {
      console.error("Erro: Elemento #type-filters não encontrado!");
      return;
  }

  Object.keys(typeColors).forEach(type => {
      const button = document.createElement("button");
      button.classList.add("type-filter", type); // Adiciona a classe do tipo
      button.textContent = type.charAt(0).toUpperCase() + type.slice(1);

      button.addEventListener("click", () => filterByType(type));

      typeFiltersContainer.appendChild(button);
  });
}

// Função para filtrar Pokémons por tipo
function filterByType(type) {
  const filteredPokemons = allPokemons.filter(pokemon =>
      pokemon.types.some(t => t.type.name === type)
  );
  displayPokemons(filteredPokemons);
}

// Criar os botões de filtro ao carregar a página
createTypeFilters();

