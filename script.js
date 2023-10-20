$(document).ready(function () {
    var paginacion = 20;
    var paginaActual = 1;
    $("button").click(function () {
        var btnClass = $(this).attr('class');
        if (btnClass == "btn-todos") {
            paginacion = 20;
            paginaActual = 1;
            showLoader();
            funcTodos(paginacion, paginaActual);
            // BOTONES PAGINACION
            document.getElementById('next').addEventListener('click', () => {
                paginacion += 20;
                paginaActual += 20;
                funcTodos(paginacion, paginaActual);
            });
            document.getElementById('previous').addEventListener('click', () => {
                paginacion -= 20;
                paginaActual -= 20;
                funcTodos(paginacion, paginaActual);
            });

        } else {
            showLoader();
            obtenerPokemonsPorTipo(btnClass);
        }
    }); 

    //Buscador
    buscador.addEventListener('input', async () => {
        searchBar(); 
        showLoader();

    }); 
});

async function obtenerPokemonsPorTipo(tipo) {
    const container = document.querySelector(".container");
    container.innerHTML = '';

    const tipoURL = `https://pokeapi.co/api/v2/type/${tipo}`;
    const tipoData = await fetch(tipoURL).then(response => response.json());

        if (tipoData.pokemon.length > 0) {
            for (const pokemonInfo of tipoData.pokemon) {
                const pokemonURL = pokemonInfo.pokemon.url;
                const pokemonData = await fetch(pokemonURL).then(response => response.json());
                let tipos = pokemonData.types.map((type) => `<p class="${type.type.name}">${type.type.name}</p>`);
                tipos = tipos.join('');
                const peso = pokemonData.weight / 10;
                const altura = pokemonData.height / 10;
                const createDiv = document.createElement('div');
                createDiv.className = "items_item";
                createDiv.innerHTML = `
                    <h1 class="itemTitle">${pokemonData.name}</h1>
                    <img src="${pokemonData.sprites.other['official-artwork'].front_default}" style="width:50%;">
                    <div class="stat">
                        <p> PESO: ${peso}Kg </p>
                        <p> ALTURA: ${altura}m </p>
                    </div>
                    <div class="tipos">
                        <p> ${tipos} </p> 
                    </div>
                    <p class="itemP">#${pokemonData.id}</p>
                    <button onclick="stats(${pokemonData.id})"> Ver mas </button>
                `;

                container.appendChild(createDiv);
            }
        } else {
            alert(`No se encontraron Pokémon de tipo ${tipo}`);
        }
}

async function funcTodos(paginacion, paginaActual) {
    const container = document.querySelector(".container");
    container.innerHTML = '';
    if (!paginacion <= 0) {
        for (let i = paginaActual; i <= paginacion; i++) {
            await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
                .then(response => response.json())
                .then(data => {
                    const createDiv = document.createElement("div");
                    const peso = data.weight / 10;
                    const altura = data.height / 10;
                    let tipos = data.types.map((type) => `<p class="${type.type.name}">${type.type.name}</p>`);
                    tipos = tipos.join('');
                    createDiv.className = "items_item";
                    createDiv.innerHTML = `
                    <h1 class="itemTitle">${data.name}</h1>
                    <img src="${data.sprites.other['official-artwork'].front_default}" style="width:50%;">
                    <div class="stat">
                        <p> PESO: ${peso}Kg </p>
                        <p> ALTURA: ${altura}m </p>
                    </div>
                    <div class="tipos">
                    <p> ${tipos} </p> 
                    </div>
                    <p class="itemP">#${data.id} </p>
                    <button onclick="stats(${data.id})"> Ver mas </button>
                `;

                    container.appendChild(createDiv);
                });
        }
    } else {
        const createDiv = document.createElement("div");
        createDiv.innerHTML = `
                <h1 class="itemTitle">QUE BUSHQUES</h1>
            `;
        container.appendChild(createDiv);
    }

}

function showLoader() {
    var loaderDiv = document.querySelector(".screen");
    var contenido = document.querySelector(".container");
    var paginacion = document.querySelector(".paginacion");

    loaderDiv.style.visibility = 'visible';
    contenido.style.display = 'none';
    paginacion.style.display = 'none';

    var duration = 2000;

    setTimeout(function () {
        loaderDiv.style.display = 'none';
        contenido.style.display = 'grid';
        contenido.style.visibility = 'visible';
        paginacion.style.display = 'flex';
        paginacion.style.visibility = 'visible';
    }, duration);

    loaderDiv.style.display = 'block';
}

async function stats(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();

        const stats = data.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`);
        Swal.fire({
            title: data.name,
            imageUrl: data.sprites.other['official-artwork'].front_default,
            imageWidth: 100 ,
            html: stats.join('<br>'),
            backdrop: `rgba(0,0,0,0.8)`,
            background: 'rgb(255,165,0)',
            customClass:{
                container: 'alertContainer',
                title: 'alertTITLE',
                htmlContainer: 'alertHTML',
            }
        });
    } catch (error) {
        console.error('Error al obtener los stats del Pokémon:', error);
    }
}

async function searchBar() {
    const buscador = document.getElementById('buscador'); // La barra de búsqueda
    const contenedor = document.querySelector(".container"); // Donde se mostrarán los Pokémon
    const paginacion = document.querySelector(".paginacion");

    const input = buscador.value.toLowerCase(); // El nombre introducido se convierte a minúsculas

        // Si no hay nada en el buscador, limpia el contenedor donde se muestran los Pokémon
        if (input === "") {
            contenedor.innerHTML = '';
            paginacion.style.visibility = "hidden"
            contenedor.style.visibility = "hidden"
            return;
        }

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon`);
            const data = await response.json();

            const resultado = data.results.filter(pokemon => pokemon.name.includes(input));
            if (resultado.length > 0) {
                contenedor.style.visibility = "visible";

                contenedor.innerHTML = '';
                for (const pokemon of resultado) {
                    const pokemonResponse = await fetch(pokemon.url);
                    const pokemonData = await pokemonResponse.json();
                    
                    const createDiv = document.createElement("div");
                    let tipos = pokemonData.types.map(type => `<p class="${type.type.name}">${type.type.name}</p>`).join('');
                    createDiv.className = "items_item";
                    createDiv.innerHTML = `
                        <h1 class="itemTitle">${pokemonData.name}</h1>
                        <img src="${pokemonData.sprites.other['official-artwork'].front_default}" style="width:50%;">
                        <div class="stat">
                            <p> PESO: ${pokemonData.weight / 10}Kg </p>
                            <p> ALTURA: ${pokemonData.height / 10}m </p>
                        </div>
                        <div class="tipos">
                            ${tipos}
                        </div>
                        <p class="itemP">#${pokemonData.id} </p>
                        <button onclick="stats(${pokemonData.id})"> Ver más </button>
                    `;
                    contenedor.appendChild(createDiv);
                }
            } else {
                contenedor.innerHTML = `<h1 class="itemTitle">No se encontraron Pokémon que empiecen con esa letra.</h1>`;
            }
        } catch (error) {
            contenedor.innerHTML = `<h1 class="itemTitle">Error al buscar Pokemon: ${error.message}</h1>`;
            
        }
}



