const btnMenus = document.querySelector(".btn-menus")
const titleEl = document.querySelector('#title');

btnMenus.addEventListener("click", () => {
    btnMenus.style.fontWeight = "bold";
});


titleEl.addEventListener("click", () => {
    window.location.href = "/"; 

})
