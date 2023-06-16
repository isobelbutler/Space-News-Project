let placeholderImage = 'images/image-placeholder.png';
document.getElementById("user-image-container").style.background = `url(${placeholderImage}) center / cover no-repeat`;

const NASAapiKey = "3wnxOfRJD4eT7ejeRvcgQUIIKAANUyqtIBVq62Iz";
const unsplashAPIkey = "UhChBZg41aaNCvsaG2V9bstJAN_MB7U8UuVkqoOtDJQ"
const form = document.querySelector("form");

const apodDisplayElement = document.getElementById("user-image-container");
const apodDescriptionElement = document.getElementById("explanation");


form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const dateInput = document.getElementById("formDate").value;
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASAapiKey}&date=${dateInput}`;

    console.log(document.getElementById("date").value)
  
    // Show loading wheel
    apodDisplayElement.style.background = `url(https://upload.wikimedia.org/wikipedia/commons/5/53/Loading-red-spot.gif) center / cover no-repeat`;  
    fetch(apiUrl)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not OK.');
        }
      })
      .then((data) => {
        const hdUrl = data.hdurl;
        const description = data.explanation;
  
        if (hdUrl === undefined) {
          throw new Error('HD URL is undefined.');
        }
  
        apodDisplayElement.style.background = `url(${hdUrl}) center / cover no-repeat`;  
        // can background image have an alt?
        // apodDisplayElement.alt = description;
        apodDescriptionElement.textContent = description;
  
      })
      .catch((error) => {
        console.log("Error:", error);
        
        // Fetch a random space-related image
        fetch(`https://api.unsplash.com/photos/random?query=space&orientation=landscape&client_id=${unsplashAPIkey}`)
          .then((response) => response.json())
          .then((data) => {
            const randomImageUrl = data.urls.regular;
            
            // Display the random space-related image
            apodDisplayElement.style.background = `url(${randomImageUrl}) center / cover no-repeat`;

            // apodDisplayElement.alt = "Random Space Image";
            apodDescriptionElement.textContent = "Randomly generated space-related image (no NASA astrology picture of the day for this date)";
  
            console.log("Random Space Image URL:", randomImageUrl);
          })
          .catch((error) => {
            console.log("Error fetching random space image:", error);
          });
      });
  });
  
  // nb a good date to test an undefined apod hdurl response is 06/06/23 and 31/05/2023