const markerContainer = document.getElementById("markerContainer");
const cardStack = document.getElementById("cardStack");
const vehicleButtons = document.querySelectorAll(".tr-vehicle-selector button");
const carouselImages = document.querySelector(".tr-carousel-images");
const carouselSlides = document.querySelectorAll(".tr-carousel-images img");
const leftArrow = document.querySelector(".tr-carousel-arrow.left");
const rightArrow = document.querySelector(".tr-carousel-arrow.right");

// Parse vehicle product data and handles
const productData = JSON.parse(
  document.getElementById("vehicle-products").textContent
);
const vehicleHandles = JSON.parse(
  document.getElementById("vehicleHandles").textContent
);

// Indexed coordinate mapping
const coordinateMap = [
  [
    { pos: ["30%", "13%"] },
    { pos: ["82%", "26%"] },
    { pos: ["35%", "55%"] },
    { pos: ["60%", "63%"] },
    { pos: ["37%", "76%"] },
    { pos: ["25%", "90%"] },
    { pos: ["51%", "89%"] },
  ],
  [
    { pos: ["60%", "18%"] },
    { pos: ["25%", "23%"] },
    { pos: ["12%", "42%"] },
    { pos: ["67%", "63%"] },
    { pos: ["29%", "73%"] },
    { pos: ["40%", "84%"] },
  ],
  [
    { pos: ["67%", "13%"] },
    { pos: ["43%", "30%"] },
    { pos: ["14%", "48%"] },
    { pos: ["28%", "62%"] },
    { pos: ["48%", "80%"] },
  ],
  [
    { pos: ["28%", "21%"] },
    { pos: ["45%", "30%"] },
    { pos: ["59%", "49%"] },
    { pos: ["56%", "78%"] },
    { pos: ["69%", "88%"] },
  ],
  [
    { pos: ["80%", "10%"] },
    { pos: ["45%", "16%"] },
    { pos: ["12%", "34%"] },
    { pos: ["70%", "63%"] },
    { pos: ["23%", "84%"] },
  ],
];

// Construct dynamic vehicle data
const vehicleData = {};
vehicleHandles.forEach((handle, idx) => {
  const coordinates = coordinateMap[idx] || [];
  const products = productData[handle.toLowerCase()] || [];

  // For rendering only those markers which have product (Fallback Case)
  const length = Math.min(coordinates.length, products.length);
  vehicleData[handle] = coordinates.slice(0, length).map((coord, i) => ({
    ...coord,
    title: products[i].title,
    price: products[i].price,
    compare_at_price: products[i].compare_at_price,
    img: products[i].img,
    url: products[i].url,
  }));
});

let currentSlide = 0;

function updateCarouselPosition(vehicleKey) {
  const markerContainer = document.getElementById("markerContainer");
  const loader = document.getElementById("imageLoader");
  const currentImage = carouselSlides[currentSlide];

  // Check if image is already loaded
  const isImageLoaded =
    currentImage.complete && currentImage.naturalHeight !== 0;

  if (!isImageLoaded) {
    loader.style.display = "block";
    markerContainer.style.display = "none";

    currentImage.onload = () => {
      finalizeRender();
    };
  } else {
    finalizeRender();
  }

  function finalizeRender() {
    carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;
    renderVehicle(vehicleKey);
    loader.style.display = "none";
    markerContainer.style.display = "block";
  }
}

function switchVehicle(vehicleKey) {
  vehicleButtons.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.vehicle === vehicleKey)
  );
  updateCarouselPosition(vehicleKey);
}

function renderVehicle(vehicleKey) {
  markerContainer.innerHTML = "";
  cardStack.innerHTML = "";

  const parts = vehicleData[vehicleKey] || [];
  parts.forEach((part, index) => {
    const marker = document.createElement("div");
    marker.className = "tr-marker";
    marker.textContent = index + 1;
    marker.style.top = part.pos[0];
    marker.style.left = part.pos[1];

    const card = document.createElement("div");
    card.className = "tr-card";
    card.innerHTML = `
      <a href="${part.url}" class="tr-text-decoration-none">
        <div class="tr-card-badge">${index + 1}</div>
        <img src="${part.img}" alt="${part.title}" />
        <div class="tr-card-body">
          <div class="tr-card-info">
            <h4>${part.title}</h4>
            <p class="tr-price">${part.price}</p>
            <p class="tr-compare-at-price">${part.compare_at_price}</p>
          </div>
          <a href="${
            part.url
          }" class="tr-view-btn">VIEW PRODUCT <span>❯</span></a>
        </div>
      </a>
    `;

    markerContainer.appendChild(marker);
    cardStack.appendChild(card);

    marker.addEventListener("click", () => {
      document
        .querySelectorAll(".tr-marker, .tr-card")
        .forEach((el) => el.classList.remove("active"));
      marker.classList.add("active");
      card.classList.add("active");

      const containerRect = cardStack.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const scrollLeft =
        cardStack.scrollLeft +
        (cardRect.left - containerRect.left) -
        (containerRect.width / 2 - cardRect.width / 2);

      cardStack.scrollTo({ left: scrollLeft, behavior: "smooth" });
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

vehicleButtons.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const vehicleKey = vehicleHandles[idx];
    currentSlide = idx;
    switchVehicle(vehicleKey);
    cardStack.scrollLeft = 0;
  });
});

leftArrow.addEventListener("click", () => {
  currentSlide =
    (currentSlide - 1 + vehicleHandles.length) % vehicleHandles.length;
  switchVehicle(vehicleHandles[currentSlide]);
});

rightArrow.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % vehicleHandles.length;
  switchVehicle(vehicleHandles[currentSlide]);
});

// Initialize
if (vehicleHandles.length > 0) {
  switchVehicle(vehicleHandles[0]);
}

// Drag-to-scroll
let isDown = false,
  startX,
  scrollStart;
cardStack.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - cardStack.offsetLeft;
  scrollStart = cardStack.scrollLeft;
  cardStack.classList.add("active");
});
["mouseleave", "mouseup"].forEach((evt) =>
  cardStack.addEventListener(evt, () => (isDown = false))
);
cardStack.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - cardStack.offsetLeft;
  const walk = (x - startX) * 2;
  cardStack.scrollLeft = scrollStart - walk;
});

// Deselect on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".tr-marker") && !e.target.closest(".tr-card")) {
    document
      .querySelectorAll(".tr-marker, .tr-card")
      .forEach((el) => el.classList.remove("active"));
  }
});
