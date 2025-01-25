const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// adding task

function addTask() {
    if(inputBox.value === ''){
        alert("Enter a task first!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
}

// tick untick and remove task 

listContainer.addEventListener("click", function(e) {
    if(e.target.tagName === 'LI'){
        e.target.classList.toggle("checked");
        saveData();
    } else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// saving tasks locally

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();