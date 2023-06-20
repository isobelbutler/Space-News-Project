let placeholderImage = "images/image-placeholder.png";
document.getElementById(
  "user-image-container"
).style.background = `url(${placeholderImage}) center / cover no-repeat`;

const NASAapiKey = "3wnxOfRJD4eT7ejeRvcgQUIIKAANUyqtIBVq62Iz";
const unsplashAPIkey = "UhChBZg41aaNCvsaG2V9bstJAN_MB7U8UuVkqoOtDJQ";
const form = document.querySelector("form");
const dateTitle = document.getElementById("date");

const apodDisplayElement = document.getElementById("user-image-container");
const apodDescriptionElement = document.getElementById("explanation");
const apiHeadlineElement = document.getElementById("apiHeadline");

//  Prevents future dates from being displayed in input field.
formDate.max = new Date().toISOString().split("T")[0]; 

// Form listener event. Grabs APOD from NASA API then calls grabHeadline function at the end.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector(".headline-text").style.display = "none";

  const dateInput = document.getElementById("formDate").value;
  let fullDate = new Date(dateInput);
  let day = fullDate.getDate();
  let month = fullDate.getMonth() + 1; // you need + 1 as month is seen as 0-11.
  let year = fullDate.getFullYear();
  let headingDate = `${day} / ${month} / ${year}`; // string interpolation

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASAapiKey}&date=${dateInput}`;

  // Show loading wheel
  apodDisplayElement.style.background = `url(https://upload.wikimedia.org/wikipedia/commons/5/53/Loading-red-spot.gif) center / cover no-repeat`;
  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not OK.");
      }
    })
    .then((data) => {
      const hdUrl = data.hdurl;
      const description = data.explanation;

      if (hdUrl === undefined) {
        throw new Error("HD URL is undefined.");
      }
      apodDisplayElement.style.background = `url(${hdUrl}) center / cover no-repeat`;
      apodDescriptionElement.textContent = description;
      dateTitle.innerHTML = headingDate;

    //   shortExplanation takes the description provided by the API, and reduces it to the first two sentences.
    //     the shortened description is then rendered on the DOM within the function.
      shortExplanation(description);
      grabHeadline();
    })
    .catch((error) => {
      console.log("Error:", error);

      // Fetch a random space-related image
      fetch(
        `https://api.unsplash.com/photos/random?query=space&orientation=landscape&client_id=${unsplashAPIkey}`
      )
        .then((response) => response.json())
        .then((data) => {
          dateTitle.innerHTML = headingDate;
          const randomImageUrl = data.urls.regular;
          // Display the random space-related image
          apodDisplayElement.style.background = `url(${randomImageUrl}) center / cover no-repeat`;

          // apodDisplayElement.alt = "Random Space Image";
          apodDescriptionElement.textContent =
            "Houston, we've had a problem... randomly generated space-related image (no NASA astrology picture of the day for this date)";

          console.log("Random Space Image URL:", randomImageUrl);

          grabHeadline();
        })
        .catch((error) => {
          console.log("Error fetching random space image:", error);

          grabHeadline();
        });
    });
});
// nb a good date to test an undefined apod hdurl response is 06/06/23 and 31/05/2023

// Function for grabbing the headline frm the Guardian API
const grabHeadline = () => {
  const articleFilter = document
    .getElementById("articleSection")
    .value.toLowerCase();
  const articleFilterURLAppendage =
    articleFilter === "general"
      ? ""
      : `&order-by=relevance&section=${articleFilter}`;

  const specificDate = document.getElementById("formDate").value;

  const fetchArticlesByDateAndSection = async (date, section) => {
    const guardianAPIkey = "bb4717f4-9ef8-4141-a00c-6cf38e5d80e4";
    const url = `https://content.guardianapis.com/search?from-date=${specificDate}&to-date=${specificDate}&api-key=${guardianAPIkey}${articleFilterURLAppendage}`;

    console.log(specificDate);
    console.log(articleFilter);
    console.log(url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      const headline = data.response.results[0].webTitle;
      const headlineUrl = data.response.results[0].webUrl;

      document.querySelector(".headline-text").style.display = "initial";
      apiHeadlineElement.innerHTML = `<a href="${headlineUrl}" target="_blank">${headline}</a>`;
    } catch (error) {
      document.querySelector(".headline-text").style.display = "initial";
      apiHeadlineElement.innerHTML = `<p>Error: No headline found for this date and news category.<p/>`;
      console.log("test");
      console.log("Error:", error);
    }
  };

  fetchArticlesByDateAndSection(specificDate, articleFilter);
};
