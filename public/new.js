var nextOption = 3;

document.querySelector("#add-option").addEventListener("click", function() {
  if(nextOption > 10) return;
  
  var options = document.querySelector("#options");

  var div = document.createElement("div");
  div.setAttribute("id", "option_" + nextOption);

  var label = document.createElement("label");
  label.setAttribute("for", "option_" + nextOption + "_input");
  label.innerText = "Option " + nextOption + ": ";

  var input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", "option_" + nextOption);
  input.setAttribute("id", "option_" + nextOption + "_input");
  input.setAttribute("required", "");

  div.appendChild(label);
  div.appendChild(input);

  options.appendChild(div);
  nextOption++;
});

document.querySelector("#remove-option").addEventListener("click", function() {
  var options = document.querySelector("#options");

  if(options.children.length > 2) {
    options.lastElementChild.remove();
    nextOption--;
  }
});