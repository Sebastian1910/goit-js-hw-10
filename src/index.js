import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  'live_O4xfILCHzT4X9PjqFH2dZ7yqIKNViGOHlD3NpNkCKGyKetaj5k8BgbCNDsU8II8x';

// Pobieranie elementów interfejsu użytkownika
const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const errorMsg = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

// Ukrywanie loader i error na początku
loader.style.display = 'none';
errorMsg.style.display = 'none';

// Tworzenie niestandardowego loadera
const createLoader = () => {
  const loaderDiv = document.createElement('div');
  loaderDiv.className = 'loader';

  // Dodawanie stylów dla loadera
  loaderDiv.style.width = '48px';
  loaderDiv.style.height = '48px';
  loaderDiv.style.border = '3px dotted #FFF';
  loaderDiv.style.borderStyle = 'solid solid dotted dotted';
  loaderDiv.style.borderRadius = '50%';
  loaderDiv.style.display = 'inline-block';
  loaderDiv.style.position = 'relative';
  loaderDiv.style.boxSizing = 'border-box';
  loaderDiv.style.animation = 'rotation 2s linear infinite';

  const loaderAfter = document.createElement('div');
  loaderAfter.style.content = '';
  loaderAfter.style.boxSizing = 'border-box';
  loaderAfter.style.position = 'absolute';
  loaderAfter.style.left = '0';
  loaderAfter.style.right = '0';
  loaderAfter.style.top = '0';
  loaderAfter.style.bottom = '0';
  loaderAfter.style.margin = 'auto';
  loaderAfter.style.border = '3px dotted #FF3D00';
  loaderAfter.style.borderStyle = 'solid solid dotted';
  loaderAfter.style.width = '24px';
  loaderAfter.style.height = '24px';
  loaderAfter.style.borderRadius = '50%';
  loaderAfter.style.animation = 'rotationBack 1s linear infinite';
  loaderAfter.style.transformOrigin = 'center center';

  // Dodawanie elementu loadera
  loaderDiv.appendChild(loaderAfter);

  // Dodawanie animacji CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes rotationBack {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
    `;
  document.head.appendChild(style);

  return loaderDiv;
};

// Tworzenie i dodawanie loadera do DOM
const customLoader = createLoader();
loader.replaceWith(customLoader);

// Funkcja do pobierania listy ras kotów
const fetchBreeds = async () => {
  try {
    const response = await axios.get('https://api.thecatapi.com/v1/breeds');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funkcja do pobierania informacji o kocie na podstawie rasy
const fetchCatByBreed = async breedId => {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Funkcja inicjalizująca - ładuje listę ras kotów
const init = async () => {
  try {
    // Pokazuje loader i ukrywa select
    customLoader.style.display = 'block';
    breedSelect.style.display = 'none';

    // Pobieranie listy ras kotów
    const breeds = await fetchBreeds();

    // Wypełnianie select.breed-select opcjami
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Ukrywa loader i pokazuje select
    customLoader.style.display = 'none';
    breedSelect.style.display = 'block';
  } catch (error) {
    // Obsługa błędów
    customLoader.style.display = 'none';
    errorMsg.style.display = 'block';
  }
};

// Funkcja do pobierania informacji o kocie na podstawie wybranej rasy
const handleBreedChange = async () => {
  try {
    // Pobranie wybranej rasy z select
    const breedId = breedSelect.value;

    // Pokazuje loader i ukrywa cat-info
    customLoader.style.display = 'block';
    catInfo.style.display = 'none';

    // Pobieranie informacji o kocie
    const catData = await fetchCatByBreed(breedId);

    // Aktualizowanie interfejsu użytkownika informacjami o kocie
    if (catData.length > 0) {
      const cat = catData[0].breeds[0];
      const catImage = document.createElement('img');
      catImage.src = catData[0].url;
      catImage.alt = cat.name;
      catImage.style.maxWidth = '400px';

      // Dodawanie informacji o kocie
      catInfo.innerHTML = `
                <h2>${cat.name}</h2>
                <p>${cat.description}</p>
                <p><strong>Temperament:</strong> ${cat.temperament}</p>
            `;

      // Dodawanie obrazu do interfejsu
      catInfo.insertAdjacentElement('afterbegin', catImage);
      catInfo.style.display = 'block';
    } else {
      catInfo.innerHTML =
        '<p>No cat information found for the selected breed.</p>';
      catInfo.style.display = 'block';
    }

    // Ukrywa loader
    customLoader.style.display = 'none';
  } catch (error) {
    // Obsługa błędów
    customLoader.style.display = 'none';
    errorMsg.style.display = 'block';
  }
};

breedSelect.addEventListener('change', handleBreedChange);
init();
