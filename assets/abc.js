document.addEventListener("DOMContentLoaded", function () {
  const vehicleData = JSON.parse(
    document.getElementById("vehicleData").textContent
  );
  const markerContainer = document.getElementById("markerContainer");
  const cardStack = document.getElementById("cardStack");
  const vehicleButtons = document.querySelectorAll(
    ".tr-vehicle-selector button"
  );
  const carouselImages = document.querySelector(".tr-carousel-images");
  const carouselSlides = document.querySelectorAll(".tr-carousel-images img");
  const leftArrow = document.querySelector(".tr-carousel-arrow.left");
  const rightArrow = document.querySelector(".tr-carousel-arrow.right");
  const vehicleKeys = Object.keys(vehicleData);
  let currentSlide = 0;

  function updateCarouselPosition(vehicle) {
    carouselImages.classList.add("fade");
    setTimeout(() => {
      carouselImages.style.transform = `translateX(-${currentSlide * 100}%)`;
      renderVehicle(vehicle);
      carouselImages.classList.remove("fade");
    }, 200);
  }

  function switchVehicle(vehicle) {
    vehicleButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.vehicle === vehicle)
    );
    updateCarouselPosition(vehicle);
  }

  function renderVehicle(vehicle) {
    markerContainer.innerHTML = "";
    cardStack.innerHTML = "";
    const parts = vehicleData[vehicle] || [];

    parts.forEach((part, index) => {
      const marker = document.createElement("div");
      marker.className = "tr-marker";
      marker.textContent = index + 1;
      if (part.pos) {
        marker.style.top = part.pos[0];
        marker.style.left = part.pos[1];
      }
      marker.dataset.index = index;
      markerContainer.appendChild(marker);

      const card = document.createElement("div");
      card.className = "tr-card";
      card.dataset.index = index;
      card.innerHTML = `
          <img src="${part.img}" alt="${part.title}" />
          <div class="tr-card-body">
            <h4>${part.title}</h4>
            <p>${part.price}</p>
          </div>
        `;
      cardStack.appendChild(card);

      marker.addEventListener("click", () => {
        document
          .querySelectorAll(".tr-marker, .tr-card")
          .forEach((el) => el.classList.remove("active"));
        marker.classList.add("active");
        card.classList.add("active");
        card.scrollIntoView({ behavior: "smooth", inline: "center" });
      });

      card.addEventListener("mouseenter", () => {
        document
          .querySelectorAll(".tr-marker, .tr-card")
          .forEach((el) => el.classList.remove("active"));
        marker.classList.add("active");
        card.classList.add("active");
      });

      card.addEventListener("click", () => {
        window.location.href = "#"; // TODO: Update with product URL
      });
    });
  }

  vehicleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const vehicle = button.dataset.vehicle;
      currentSlide = vehicleKeys.indexOf(vehicle);
      switchVehicle(vehicle);
    });
  });

  leftArrow.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + vehicleKeys.length) % vehicleKeys.length;
    switchVehicle(vehicleKeys[currentSlide]);
  });

  rightArrow.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % vehicleKeys.length;
    switchVehicle(vehicleKeys[currentSlide]);
  });

  switchVehicle(vehicleKeys[0]);
});
