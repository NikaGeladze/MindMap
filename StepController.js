const rcontainer = document.querySelector(".rcontainer");

const input = document.querySelector(".textinput");

const loadingIMG = document.querySelector(".loadimg");
const createText = document.querySelector(".creationText");

document.addEventListener("keydown", function (event) {
  if (event.key.toLowerCase() === "`") {
    location.reload();
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Get the input value

    //console.log(inputValue);
    const inp = input.value;
    const depth = 15;
    input.value = "";
    createText.style.display = "none";
    loadingIMG.style.display = "flex";
    fetch(
      `https://gdghackathon-786162513991.europe-central2.run.app/api/roadmap?input=${inp}&depth=${depth}`
    )
      .then((response) => response.json())
      .then((data) => {
        createSteps(data);
        createText.style.display = "flex";
        loadingIMG.style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
        loadingIMG.style.display = "none";
      });
  }
});

function createOneStep(topic, resource, isLast, rm) {
  let ritem = document.createElement("div");
  ritem.className = "ritem";

  let rtext = document.createElement("div");
  rtext.className = "rtext";
  rtext.textContent = topic;
  rtext.addEventListener("click", function () {
    window.open(resource, "_blank");
  });

  ritem.appendChild(rtext);

  if (!isLast) {
    let arrow = document.createElement("img");
    arrow.src = "Images/Arrow.png";
    arrow.alt = "arr";
    arrow.className = "arrow";
    ritem.appendChild(arrow);
  }

  rm.appendChild(ritem);
}

function createSteps(steps) {
  let cont = document.createElement("div");
  cont.className = "roadmap";
  rcontainer.style.display = "none";
  rcontainer.innerHTML = "";
  rcontainer.appendChild(cont);
  let length = steps.length;
  let realI = 0;
  for (let i = 0; i < length; i++) {
    if (i % 5 == 0 && i != 0) {
      cont = document.createElement("div");
      cont.className = "roadmap";
      rcontainer.appendChild(cont);
      length -= i;
      i = 0;
    }
    createOneStep(
      steps[realI].topic,
      steps[realI].resource,
      0 === i % 4 && i != 0,
      cont
    );
    realI++;
  }
  rcontainer.style.display = "flex";
}

//createSteps(steps);
