// Fetch request when any of the Pokémon buttons are clicked
const pokemonButtons = document.querySelectorAll(".pokemonButton");

pokemonButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const pokemonName = this.getAttribute("data-pokemon");

    // Change button text while waiting for the response
    const buttonText = this;
    buttonText.textContent = "Loading...";
    buttonText.disabled = true; // Disable the button during fetch

    // Perform the fetch request for the corresponding Pokémon
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        }
        throw new Error("Network response was not ok"); // Handle errors
      })
      .then((data) => {
        // Fetch species data for description
        fetch(data.species.url)
          .then((speciesResponse) => speciesResponse.json())
          .then((speciesData) => {
            const description =
              speciesData.flavor_text_entries.find(
                (entry) => entry.language.name === "en"
              )?.flavor_text || "No description available.";

            // Display the fetched data
            document.getElementById("result").innerHTML = `
              <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
              <img src="${data.sprites.front_default}" alt="${data.name}" />
              <p><strong>Description:</strong> ${description}</p>
            `;

            // Change button text when data is fetched
            buttonText.textContent = `${
              pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)
            }`;
            buttonText.disabled = false; // Re-enable the button
          })
          .catch((speciesError) => {
            console.error(
              "There was a problem with the species fetch operation:",
              speciesError
            );

            document.getElementById("result").innerHTML = `
              <p style="color: red;">Error fetching description</p>
            `;
          });
      })
      .catch((error) => {
        // Handle fetch errors
        console.error("There was a problem with the fetch operation:", error);

        // Reset the button and show an error message
        buttonText.textContent = "Fetch Again";
        buttonText.disabled = false;

        document.getElementById("result").innerHTML = `
          <p style="color: red;">Error: ${error.message}</p>
        `;
      });
  });
});
