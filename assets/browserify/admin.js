'use strict';

let tabs = document.querySelectorAll('.hf-tab');
let tabNavs = document.querySelectorAll('#hf-tabs-nav a');
for(let i=0; i<tabNavs.length; i++) {
    tabNavs[i].addEventListener('click', openTab);
}

function openTab(e) {
    let tabTarget = this.getAttribute('data-tab-target');
    for(let i=0; i<tabs.length; i++) {
        let tab = tabs[i];
        tab.classList.toggle('hf-tab-active', tab.getAttribute('data-tab') === tabTarget);
    }

    e.preventDefault();
}