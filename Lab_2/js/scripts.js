var modal = document.getElementById("modal");

var span = document.getElementsByClassName("close")[0];

window.onload = function() {
    modal.classList.add("show"); 

    setTimeout(function() {
        modal.classList.remove("show");
        setTimeout(function() {
            modal.style.display = "none"; 
        }, 500); 
    }, 5000); 
};


span.onclick = function() {
    modal.style.display = "none";
}
