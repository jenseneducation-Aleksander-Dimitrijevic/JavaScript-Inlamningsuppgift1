// Global variable declaration
const form = document.querySelector("form");
let inputValue = form.querySelector("input");
let lightBox = document.querySelector("#light-box");
let closeBtn = document.querySelector("#close-btn");
let imageOutput = document.querySelector("#image-content");

// Close light box when user click on close button
closeBtn.addEventListener("click", () => {
  lightBox.classList.remove("show");
});

// Form submit and prevent page to reload
// When user click enter key or click the search icon then fetchAPI will run
form.addEventListener("submit", e => {
  e.preventDefault();
  // Run function to fetch data from FLickr API
  fetchAPI();
  // Run function to remove all images after each search
  handleImageRemoval();
});

// Retrieve images from API
function fetchAPI() {
  // Declare variables
  // Store API key
  const API_key = "0ed0daef3c5308e1cfff3ae40e52d60e";
  // Get the values from all options inside the select element
  let per_page = document.querySelector("#per-page").value;
  // Get the search word from whatever user types inside input
  let keyword = inputValue.value;

  // Run loader before fetch
  document.querySelector("#loader").style.display = "flex";

  // Use javascript fetch method to fetch Flickr API
  fetch(
    `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_key}&text=${keyword}&per_page=${per_page}&format=json&nojsoncallback=1`
  )
    // Returns a response that is a json string.
    .then(res => res.json())
    // use javascript object with parameter name "data" to get all properties from Flickr API
    .then(data => {
      // loop through array "photo" that contains all objects
      data.photos.photo.forEach(item => {
        // build up url string to be able to show all images properly.
        // Each IMG url need necessary property from object e.g farm, server, id and secret.
        const url = `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`;
        // Display all images inside container image output using backticks and an IMG-tag where url is replaced
        // with variable "url". For each image we also get the image title
        imageOutput.innerHTML += `<img src="${url}" title="${item.title}">`;

        // Stop loader after fetching is done
        document.querySelector("#loader").style.display = "none";

        // store all images that are displayed in a variable "imgArr"
        const imgArr = document.querySelectorAll("#image-content img");
        // loop through "imgArr" using a foreach loop
        imgArr.forEach(item =>
          // for each image add an eventlistener that listens for a click event
          item.addEventListener("click", e => {
            // get the IMG-tag inside light box container
            const lightBoxImage = document.querySelector("#light-box img");
            // get the src attribute from each image that is being clicked on
            const newSrc = e.target.getAttribute("src");
            // get the title from each image that is being clicked on
            const title = e.target.getAttribute("title");
            // set the src attribute to lightbox image
            lightBoxImage.setAttribute("src", newSrc);
            // show IMG-title in P-tag inside lightbox container
            document.querySelector("#title").innerHTML = title;
            // add class "show" to lightbox container, which show the lightbox
            document.querySelector("#light-box").classList.add("show");
          })
        );
      });
    })
    // if there is any errors, the catch - method catches the error and then display it in the console
    .catch(error => console.log(error));
}

// create function to remove all images after each search
function handleImageRemoval() {
  imageOutput.innerHTML = "";
}
