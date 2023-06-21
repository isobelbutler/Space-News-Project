// Variables
const placeholderImage = "images/image-placeholder.png";
const NASAapiKey = "3wnxOfRJD4eT7ejeRvcgQUIIKAANUyqtIBVq62Iz";
const unsplashAPIkey = "UhChBZg41aaNCvsaG2V9bstJAN_MB7U8UuVkqoOtDJQ";
const apiUrl = "https://api.nasa.gov/planetary/apod";
const guardianAPIkey = "bb4717f4-9ef8-4141-a00c-6cf38e5d80e4";
const form = document.querySelector("form");
const dateTitle = document.getElementById("date");
const apodDisplayElement = document.getElementById("user-image-container");
const apodDescriptionElement = document.getElementById("explanation");
const apiHeadlineElement = document.getElementById("apiHeadline");
const articleSectionInput = document.getElementById("articleSection");
const clearButton = document.getElementById("clearButton");

// Set the placeholder image
apodDisplayElement.style.background = `url(${placeholderImage}) center / cover no-repeat`;

// Set the max date for the input field
formDate.max = new Date().toISOString().split("T")[0];

// Event listener for the form submission
form.addEventListener("submit", handleFormSubmit);

// Event listener for the clear button
clearButton.addEventListener("click", clearArticleSection);

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault();
  document.querySelector(".headline-text").style.display = "none";
  const dateInput = document.getElementById("formDate").value;
  const headingDate = getFormattedDate(dateInput);
  const requestUrl = `${apiUrl}?api_key=${NASAapiKey}&date=${dateInput}`;
  apodDisplayElement.style.background = `url(https://upload.wikimedia.org/wikipedia/commons/5/53/Loading-red-spot.gif) center / cover no-repeat`;
  fetchAPOD(requestUrl, headingDate);
}

// Function to fetch Astronomy Picture of the Day (APOD) from NASA API
function fetchAPOD(url, headingDate) {
  fetch(url)
    .then(handleResponse)
    .then((data) => {
      const hdUrl = data.hdurl;
      const description = data.explanation;
      if (hdUrl === undefined) {
        throw new Error("HD URL is undefined.");
      }
      apodDisplayElement.style.background = `url(${hdUrl}) center / cover no-repeat`;
      apodDescriptionElement.textContent = description;
      dateTitle.innerHTML = headingDate;
      shortExplanation(description);
      grabHeadline();
    })
    .catch((error) => {
      console.log("Error:", error);
      fetchRandomSpaceImage(headingDate);
    });
}

// Function to handle API response
function handleResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Network response was not OK.");
  }
}

// Function to fetch a random space-related image
function fetchRandomSpaceImage(headingDate) {
  fetch(
    `https://api.unsplash.com/photos/random?query=space&orientation=landscape&client_id=${unsplashAPIkey}`
  )
    .then(handleResponse)
    .then((data) => {
      dateTitle.innerHTML = headingDate;
      const randomImageUrl = data.urls.regular;
      apodDisplayElement.style.background = `url(${randomImageUrl}) center / cover no-repeat`;
      apodDescriptionElement.textContent =
        "Houston, we've had a problem... randomly generated space-related image (no NASA astronomy picture of the day for this date)";
      console.log("Random Space Image URL:", randomImageUrl);
      grabHeadline();
    })
    .catch((error) => {
      console.log("Error fetching random space image:", error);
      grabHeadline();
    });
}

// Function to format the date
function getFormattedDate(date) {
  const fullDate = new Date(date);
  const day = fullDate.getDate();
  const month = fullDate.getMonth() + 1;
  const year = fullDate.getFullYear();
  return `${day} / ${month} / ${year}`;
}

// Function to extract the short explanation from the description
function shortExplanation(description) {
  const sentences = description.split(".");
  const shortDesc = sentences.slice(0, 2).join(".") + ".";
  apodDescriptionElement.textContent = shortDesc;
}

// Function to grab the headline from the Guardian API
function grabHeadline() {
  const articleFilter = articleSectionInput.value.toLowerCase();
  const articleFilterURLAppendage =
    articleFilter === "general"
      ? ""
      : `&order-by=relevance&section=${articleFilter}`;
  const specificDate = document.getElementById("formDate").value;
  const url = `https://content.guardianapis.com/search?from-date=${specificDate}&to-date=${specificDate}&api-key=${guardianAPIkey}${articleFilterURLAppendage}`;
  fetchArticlesByDateAndSection(url, specificDate, articleFilter);
}

// Function to fetch articles by date and section from the Guardian API
function fetchArticlesByDateAndSection(url, specificDate, articleFilter) {
  fetch(url)
    .then(handleResponse)
    .then((data) => {
      const results = data.response.results;
      if (results.length > 0) {
        const headline = results[0].webTitle;
        const headlineUrl = results[0].webUrl;
        document.querySelector(".headline-text").style.display = "initial";
        apiHeadlineElement.innerHTML = `<a href="${headlineUrl}" target="_blank">${headline}</a>`;
      } else {
        document.querySelector(".headline-text").style.display = "initial";
        apiHeadlineElement.innerHTML = `<p>Error: No headline found for this date and news category.</p>`;
      }
    })
    .catch((error) => {
      document.querySelector(".headline-text").style.display = "initial";
      apiHeadlineElement.innerHTML = `<p>Error: No headline found for this date and news category.</p>`;
      console.log("Error:", error);
    });
}

// Function to clear the article section input
function clearArticleSection() {
  articleSectionInput.value = "";
}
