const markerContainer = document.getElementById("markerContainer");
const cardStack = document.getElementById("cardStack");
const vehicleButtons = document.querySelectorAll(".tr-vehicle-selector button");

const carouselImages = document.querySelector(".tr-carousel-images");
const carouselSlides = document.querySelectorAll(".tr-carousel-images img");
const leftArrow = document.querySelector(".tr-carousel-arrow.left");
const rightArrow = document.querySelector(".tr-carousel-arrow.right");

const vehicleImages = {
  jeep: "images/jeep.png",
  truck: "images/truck.png",
  car: "images/car.png",
  motorcycle: "images/motorcycle.png",
  cybertruck: "images/cybertruck.png",
};

const productData = JSON.parse(
  document.getElementById("vehicle-products").textContent
);

const vehicleData = {
  jeep: [
    { pos: ["30%", "13%"] },
    { pos: ["82%", "26%"] },
    { pos: ["35%", "55%"] },
    { pos: ["60%", "63%"] },
    { pos: ["37%", "76%"] },
    { pos: ["25%", "90%"] },
    { pos: ["51%", "89%"] },
  ],
  truck: [
    { pos: ["60%", "18%"] },
    { pos: ["25%", "23%"] },
    { pos: ["12%", "42%"] },
    { pos: ["67%", "63%"] },
    { pos: ["29%", "73%"] },
    { pos: ["40%", "84%"] },
  ],
  car: [
    { pos: ["67%", "13%"] },
    { pos: ["43%", "30%"] },
    { pos: ["14%", "48%"] },
    { pos: ["28%", "62%"] },
    { pos: ["48%", "80%"] },
  ],
  motorcycle: [
    { pos: ["28%", "21%"] },
    { pos: ["45%", "30%"] },
    { pos: ["59%", "49%"] },
    { pos: ["56%", "78%"] },
    { pos: ["69%", "88%"] },
  ],
  cybertruck: [
    { pos: ["80%", "10%"] },
    { pos: ["45%", "16%"] },
    { pos: ["12%", "34%"] },
    { pos: ["70%", "63%"] },
    { pos: ["23%", "84%"] },
  ],
};

// Merge product data into vehicleData [Necessary]
for (const type in vehicleData) {
  const products = productData[type] || [];

  vehicleData[type] = vehicleData[type].map((marker, index) => {
    const product = products[index];
    return {
      ...marker,
      title: product?.title ?? "",
      price: product?.price ?? "",
      img: product?.img ?? "",
      url: product?.url ?? "",
    };
  });
}

const vehicleKeys = Object.keys(vehicleImages);
let currentSlide = 0;

// Update main image view by fade
function updateCarouselPosition(vehicle) {
  // Start fade-out
  carouselImages.classList.add("fade");

  // Wait for fade-out
  setTimeout(() => {
    // Move the image
    carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;

    // 👇 Render markers/cards before fade-in starts
    renderVehicle(vehicle);

    // Start fade-in
    carouselImages.classList.remove("fade");
  }, 200); // ~fade-out duration
}

// Change selected vehicle programmatically
function switchVehicle(vehicle) {
  vehicleButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.vehicle === vehicle);
  });

  // Let updateCarouselPosition handle rendering
  updateCarouselPosition(vehicle);
}

// Render parts and markers
function renderVehicle(vehicle) {
  markerContainer.innerHTML = "";
  cardStack.innerHTML = "";

  const parts = vehicleData[vehicle];
  parts.forEach((part, index) => {
    console.log(part.url);
    const marker = document.createElement("div");
    marker.className = "tr-marker";
    marker.textContent = index + 1;
    marker.style.top = part.pos[0];
    marker.style.left = part.pos[1];

    const card = document.createElement("div");
    card.className = "tr-card";
    card.innerHTML = `
    <a href="${part.url || ""}" class="tr-text-decoration-none">
    <div class="tr-card-badge">${index + 1}</div>
    <img src="${part.img}" alt="${part.title}" />
    <div class="tr-card-body">
      <div class="tr-card-info">
        <h4>${part.title}</h4>
        <p>${part.price}</p>
      </div>
       <a href="${
         part.url || ""
       }" class="tr-view-btn">VIEW PRODUCT <span>❯</span></a>
    </div></a>
  `;

    markerContainer.appendChild(marker);
    cardStack.appendChild(card);

    marker.addEventListener("click", () => {
      document
        .querySelectorAll(".tr-marker, .tr-card")
        .forEach((el) => el.classList.remove("active"));
      marker.classList.add("active");
      card.classList.add("active");
    });

    card.addEventListener("mouseenter", () => {
      document
        .querySelectorAll(".tr-marker, .tr-card")
        .forEach((el) => el.classList.remove("active"));
      marker.classList.add("active");
      card.classList.add("active");
    });
  });
}

// Button click handlers
vehicleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const vehicle = button.dataset.vehicle;
    currentSlide = vehicleKeys.indexOf(vehicle);
    switchVehicle(vehicle);
  });
});

// Arrow navigation
leftArrow.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + vehicleKeys.length) % vehicleKeys.length;
  switchVehicle(vehicleKeys[currentSlide]);
});

rightArrow.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % vehicleKeys.length;
  switchVehicle(vehicleKeys[currentSlide]);
});

// Init
switchVehicle("jeep");

// Drag-to-scroll on card carousel
let isDown = false,
  startX,
  scrollLeft;

cardStack.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - cardStack.offsetLeft;
  scrollLeft = cardStack.scrollLeft;
  cardStack.classList.add("active");
});
cardStack.addEventListener("mouseleave", () => (isDown = false));
cardStack.addEventListener("mouseup", () => (isDown = false));
cardStack.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - cardStack.offsetLeft;
  const walk = (x - startX) * 2;
  cardStack.scrollLeft = scrollLeft - walk;
});

// Deselect on outside click
document.addEventListener("click", (e) => {
  const isMarker = e.target.closest(".tr-marker");
  const isCard = e.target.closest(".tr-card");
  if (!isMarker && !isCard) {
    document
      .querySelectorAll(".tr-marker, .tr-card")
      .forEach((el) => el.classList.remove("active"));
  }
});
