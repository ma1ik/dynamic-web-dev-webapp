// Get buttons and panels
let tabButtons=document.querySelectorAll(".tabContainer .buttonContainer button");
let tabPanels=document.querySelectorAll(".tabContainer  .tabPanel");

//tabs selector
function showPanel(panelIndex,colorCode) {
    tabButtons.forEach(function(node){
        node.style.backgroundColor="";
        node.style.color="";
    });
    tabButtons[panelIndex].style.backgroundColor=colorCode;
    tabButtons[panelIndex].style.color="white";
    tabPanels.forEach(function(node){
        node.style.display="none";
    });
    tabPanels[panelIndex].style.display="block";
    tabPanels[panelIndex].style.backgroundColor=colorCode;
}
// Show default
showPanel(0,'#086788');

// On movie entry click.
$(function () {
    $("[data-type][data-id]").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        let target = $(event.target);

        if (!target.data("type") || !target.data("id")) {
            target = target.parents("[data-id][data-type]");
        }

        if (target.data("id") !== undefined && target.data("type") !== undefined) {

            window.location.href = "info?" + target.data("type") + "=" + target.data("id");
        }
    });
});