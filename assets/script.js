let itemsPerPage = 9; // Number of items to show per page
let currentPage = 1; // Current page number

// Fetch data from Google Sheets CSV and populate data list
window.originalData = [];
window.filteredData = [];

// Fetch data from Google Sheets CSV and populate data list
async function fetchData() {
  try {
    const response = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSy-40VQ58WsSvpb_kc6d-qmukgnmR54DzL8W62juVP3xOp_uPtjNKMseHAPJj70TKmLVcAF1HG9r-Y/pub?gid=0&single=true&output=csv"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const data = parseCSV(csvText);
    window.originalData = data;
    window.filteredData = sortData(data, "desc"); // Default sort by date in descending order
    populateTagFilter(data);
    displayPage(window.filteredData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Parse CSV data using PapaParse
function parseCSV(csvText) {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
}

// Populate data list
function populateDataList(data) {
  const dataList = document.getElementById("data-list");
  dataList.innerHTML = ""; // Clear existing content

  data.forEach((item) => {
    const dataItem = document.createElement("div");
    dataItem.className = "col-md-4 mb-4"; // Adjust to show three data cards per row
    dataItem.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <div>
            <h5 class="card-title"><a href="${
              item.original_link
            }" target="_blank">${item.name}</a></h5>
            <p class="card-text">${item.description}</p>
            <p><strong>Source:</strong> ${item.source}</p>
            <p><strong>Publication Date:</strong> ${item.publication_date}</p>
            <p><strong>Tags:</strong> ${item.tags.split(",").join(", ")}</p>
            <p><strong>Geographic Extent:</strong> ${item.geographic_extent}</p>
            <p><strong>Temporal Extent:</strong> ${item.temporal_extent}</p>
            <p><strong>File Size:</strong> ${item.file_size}</p>
            <p><strong>Rating:</strong> <span class="star-rating">${renderStars(
              item.rating
            )}</span></p>
          </div>
          <div class="card-buttons">
            <button class="btn btn-primary text-white" onclick="showDownloadInstructions('${
              item.name
            }', '${item.download_instruction}')">Download</button>
            <button class="btn btn-cite" onclick="showCiteInstructions('${
              item.name
            }', '${item.cite}')">Cite</button>
          </div>
        </div>
      </div>
    `;
    dataList.appendChild(dataItem);
  });
}

// Render stars for rating
function renderStars(rating) {
  const fullStars = Math.floor(rating); // Calculate the number of full stars
  const halfStar = rating % 1 !== 0; // Determine if there is a half star
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // Calculate the number of empty stars
  let stars = "";

  // Render full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  // Render half star
  if (halfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  // Render empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Show download instructions in a Bootstrap modal
function showDownloadInstructions(name, downloadLink) {
  const modalTitle = document.getElementById("downloadModalLabel");
  const modalBody = document.getElementById("downloadModalBody");

  modalTitle.textContent = `Download Instruction`;
  modalBody.innerHTML = `<p class="text-muted">${downloadLink}</p>`;

  const downloadModal = new bootstrap.Modal(
    document.getElementById("downloadModal")
  );
  downloadModal.show();
}

// Show cite instructions in a Bootstrap modal
function showCiteInstructions(name, cite) {
  const modalTitle = document.getElementById("downloadModalLabel");
  const modalBody = document.getElementById("downloadModalBody");

  modalTitle.textContent = `Cite`;
  modalBody.innerHTML = `<p class="text-muted" id="citeText">${cite}</p>`;

  const downloadModal = new bootstrap.Modal(
    document.getElementById("downloadModal")
  );
  downloadModal.show();

  // Add event listener to copy button
  const copyButton = document.getElementById("copyButton");
  copyButton.onclick = () => {
    navigator.clipboard.writeText(cite).then(() => {
      alert("Cite text copied to clipboard!");
    });
  };
}

// Show README content in the page
async function showReadme() {
  const response = await fetch("README.md");
  const readmeText = await response.text();
  const readmeHtml = marked.parse(readmeText);

  const readmeContent = document.getElementById("readme-content");
  readmeContent.innerHTML = readmeHtml;
  readmeContent.style.display = "block";

  // Manually call highlight.js to handle code blocks
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
}

// Populate tag filter options
function populateTagFilter(data) {
  const tagFilter = document.getElementById("tag-filter");
  if (!tagFilter) {
    console.error("Tag filter element not found");
    return;
  }

  const tagSet = new Set();
  data.forEach((item) =>
    item.tags.split(",").forEach((tag) => tagSet.add(tag.trim()))
  );

  tagSet.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

// Display data for the current page and render pagination
function displayPage(data) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  populateDataList(paginatedData); // Display data for the current page
  renderPagination(data.length); // Render pagination based on data length
}

// Render pagination buttons
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginationContainer = document.getElementById("pagination");

  paginationContainer.innerHTML = ""; // Clear pagination navigation

  // Previous page button
  if (currentPage > 1) {
    const prevButton = document.createElement("button");
    prevButton.className = "btn btn-secondary me-1";
    prevButton.innerText = "Previous";
    prevButton.onclick = () => {
      currentPage--;
      displayPage(window.filteredData);
    };
    paginationContainer.appendChild(prevButton);
  }

  // Page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = `btn ${
      i === currentPage ? "btn-primary" : "btn-light"
    } me-1`;
    pageButton.innerText = i;
    pageButton.onclick = () => {
      currentPage = i;
      displayPage(window.filteredData);
    };
    paginationContainer.appendChild(pageButton);
  }

  // Next page button
  if (currentPage < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.className = "btn btn-secondary";
    nextButton.innerText = "Next";
    nextButton.onclick = () => {
      currentPage++;
      displayPage(window.filteredData);
    };
    paginationContainer.appendChild(nextButton);
  }
}

// Filter data by selected tag
async function filterData() {
  const selectedTag = document.getElementById("tag-filter").value;
  window.filteredData = selectedTag
    ? window.originalData.filter((item) =>
        item.tags
          .split(",")
          .map((tag) => tag.trim())
          .includes(selectedTag)
      )
    : window.originalData;

  currentPage = 1; // Reset to the first page
  const sortOrder = document.getElementById("sort-order").value;
  window.filteredData = sortData(window.filteredData, sortOrder);
  displayPage(window.filteredData);
}

// Sort data by date based on selected sort order
function sortDataByDate() {
  const sortOrder = document.getElementById("sort-order").value;
  window.filteredData = sortData(window.filteredData, sortOrder);
  displayPage(window.filteredData);
}

// Sort data by rating based on selected sort order
function sortDataByRating() {
  const sortOrder = document.getElementById("rating-sort-order").value;
  window.filteredData = sortDataByRatingOrder(window.filteredData, sortOrder);
  displayPage(window.filteredData);
}

// Utility function to sort data based on date
function sortData(data, order) {
  return data.slice().sort((a, b) => {
    const dateA = new Date(a.publication_date);
    const dateB = new Date(b.publication_date);
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
}

// Utility function to sort data based on rating
function sortDataByRatingOrder(data, order) {
  return data.slice().sort((a, b) => {
    const ratingA = parseFloat(a.rating);
    const ratingB = parseFloat(b.rating);
    return order === "desc" ? ratingB - ratingA : ratingA - ratingB;
  });
}

// Search data by name or description
async function searchData() {
  const query = document.getElementById("search-box").value.toLowerCase();
  window.filteredData = window.originalData.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
  );

  currentPage = 1; // Reset to the first page
  const sortOrder = document.getElementById("sort-order").value;
  window.filteredData = sortData(window.filteredData, sortOrder);
  displayPage(window.filteredData);
}

// Handle Enter key press in search box
function handleSearchKey(event) {
  if (event.key === "Enter") {
    searchData();
  }
}

// Reset data to show all items
function resetData() {
  document.getElementById("search-box").value = ""; // Clear search box
  document.getElementById("tag-filter").value = ""; // Reset tag filter
  document.getElementById("sort-order").value = "desc"; // Reset sort order
  document.getElementById("rating-sort-order").value = "desc"; // Reset rating sort order
  window.filteredData = window.originalData; // Reset data to original data
  currentPage = 1; // Reset to the first page
  displayPage(window.filteredData); // Display all data
}

// Dynamically load navbar.html
async function loadNavbar() {
  const response = await fetch("navbar.html");
  const navbarHtml = await response.text();
  document.getElementById("navbar-placeholder").innerHTML = navbarHtml;

  // Add click event handlers to navbar links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll(".nav-link")
        .forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Set active link based on current page
  setActiveNavLink();
}

// Set active link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Default to setting Home as active link
  if (!currentPath || currentPath === "index.html") {
    document
      .querySelector('.nav-link[data-target="home"]')
      .classList.add("active");
  }
}

// Listen for browser forward and back events
window.addEventListener("popstate", setActiveNavLink);

loadNavbar();

// Load data on page load
fetchData();
