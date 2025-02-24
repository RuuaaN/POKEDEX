// Quantidade de Pokémons por página
const POKEMON_LIMIT = 1025; // Podemos aumentar para 150 ou qualquer número

// Seleciona o contêiner da lista de Pokémons
const pokemonList = document.getElementById("pokemon-list");

// Mapeamento das cores para os tipos de Pokémon
const typeColors = {
  fire: "#f7a7a6",   // Fogo: Laranja
  water: "#2a8bb8",  // Água: Azul
  electric: "#ffeb3b", // Elétrico: Amarelo
  grass: "#66bb6a",   // Planta: Verde
  ground: "#a56e3b",  // Terra: Marrom
  rock: "#6b6b6b",    // Rocha: Cinza
  fairy: "#f8bbd0",   // Fada: Rosa
  poison: "#9c4f96",  // Venenoso: Roxo
  bug: "#99cc33",     // Inseto: Verde Claro
  normal: "#ffffff",  // Normal: Branco
  psychic: "#f06292", // Psíquico: Rosa Claro
  fighting: "#d32f2f",// Luta: Vermelho
  ice: "#80deea",     // Gelo: Azul Claro
  dragon: "#ff5722",  // Dragão: Laranja escuro
  ghost: "#9e9e9e",   // Fantasma: Cinza
  steel: "#607d8b",   // Metal: Cinza Escuro
  dark: "#424242",    // Sombrio: Preto
  flying: "#03a9f4"   // Voador: Azul Claro
};

// Função para buscar os Pokémons da API
async function fetchPokemons() {
  // Requisição para a API, pedindo POKEMON_LIMIT pokémons
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_LIMIT}`);
  const data = await response.json();
  const pokemons = data.results;

  // Para cada Pokémon, cria um card, respeitando a ordem
  const promises = pokemons.map(pokemon => fetch(pokemon.url).then(response => response.json()));

  // Aguarda todas as requisições e cria os cards
  const pokemonDetailsArray = await Promise.all(promises);
  pokemonDetailsArray.sort((a, b) => a.id - b.id);  // Ordena os pokémons pelo ID
  
  // Agora vamos criar os cards após ordenar
  pokemonDetailsArray.forEach(pokemon => {
    createPokemonCard(pokemon);
  });
}

// Função para criar o card do Pokémon
function createPokemonCard(pokemon) {
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  // Extrai o id do Pokémon para pegar o sprite
  const pokemonId = pokemon.id;

  // Cria o card com nome, imagem e a cor de fundo
  const types = pokemon.types.map(type => type.type.name);
  const cardColor = getTypeColor(types);

  // Aplica a cor de fundo com base nos tipos
  pokemonCard.style.backgroundColor = cardColor;

  pokemonCard.innerHTML = `
    <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
  `;
  
  // Adiciona o evento de mouseover para mostrar detalhes flutuantes
  pokemonCard.addEventListener("mouseover", (e) => showDetailsOnHover(pokemon.name, pokemon.url, pokemonCard, e));

  // Adiciona o card à lista
  pokemonList.appendChild(pokemonCard);
}

// Função para obter a cor de fundo baseada nos tipos de Pokémon
function getTypeColor(types) {
  let colors = types.map(type => typeColors[type]).join(", ");
  return colors.length ? colors.split(", ")[0] : "#ffffff"; // Retorna a primeira cor, caso o Pokémon tenha múltiplos tipos
}

// Função para exibir detalhes flutuantes ao passar o mouse
async function showDetailsOnHover(pokemonName, pokemonUrl, cardElement, event) {
    // Verifica se já existe um tooltip visível, se sim, evita a criação de novo
    let tooltip = document.querySelector(".tooltip");
    if (tooltip) {
      tooltip.remove(); // Remove o tooltip anterior
    }
  
    // Busca mais informações sobre o Pokémon
    const response = await fetch(pokemonUrl);
    const pokemonDetails = await response.json();
  
    // Cria o tooltip flutuante
    tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
  
    // Adiciona todas as informações que queremos exibir
    tooltip.innerHTML = `
      <h4>${pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}</h4>
      <p><strong>Tipo(s):</strong> ${pokemonDetails.types.map(type => type.type.name).join(", ")}</p>
      <p><strong>Habilidades:</strong> ${pokemonDetails.abilities.map(ability => ability.ability.name).join(", ")}</p>
      <p><strong>Altura:</strong> ${pokemonDetails.height / 10} m</p>
      <p><strong>Peso:</strong> ${pokemonDetails.weight / 10} kg</p>
      <p><strong>Fraquezas:</strong> ${getWeaknesses(pokemonDetails).join(", ")}</p>
      <p><strong>Estatísticas:</strong> HP: ${pokemonDetails.stats[0].base_stat}, Ataque: ${pokemonDetails.stats[1].base_stat}, Defesa: ${pokemonDetails.stats[2].base_stat}</p>
    `;
  
    // Ajusta a posição do tooltip considerando a rolagem da página
    tooltip.style.left = `${event.clientX + 15 + window.scrollX}px`; // Adiciona scrollX
    tooltip.style.top = `${event.clientY + 15 + window.scrollY}px`; // Adiciona scrollY
  
    // Adiciona o tooltip ao body
    document.body.appendChild(tooltip);
  
    // Faz o tooltip seguir o mouse enquanto estiver sobre o Pokémon
    document.addEventListener("mousemove", (e) => {
      tooltip.style.left = `${e.clientX + 15 + window.scrollX}px`;
      tooltip.style.top = `${e.clientY + 15 + window.scrollY}px`;
    });
  
    // Remove o tooltip quando o mouse sair do card
    cardElement.addEventListener("mouseleave", () => {
      tooltip.remove();
      document.removeEventListener("mousemove", updateTooltipPosition);
    });
}

// Função para retornar as fraquezas de um Pokémon (se houver)
function getWeaknesses(pokemonDetails) {
  const weaknesses = [];
  pokemonDetails.types.forEach(type => {
    switch (type.type.name) {
      case "fire":
        weaknesses.push("Water, Rock, Ground");
        break;
      case "water":
        weaknesses.push("Electric, Grass");
        break;
      case "electric":
        weaknesses.push("Ground");
        break;
      // Adicione mais casos conforme necessário
      default:
        break;
    }
  });
  return weaknesses.length > 0 ? weaknesses : ["Nenhuma fraqueza detectada"];
}

// Chama a função para buscar os Pokémons
fetchPokemons();
