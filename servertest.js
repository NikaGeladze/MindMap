const input = "How to make calculator";

fetch(`http://localhost:3000/api?input=${input}`)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
