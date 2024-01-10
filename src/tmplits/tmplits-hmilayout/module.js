//Style Template
const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = 
`
<style>

</style>
`;

//Web Component Functionality
class basicLayout extends HTMLElement {

    constructor() {

    
        this.shadowRoot.innerHTML = `
        <div class="tmplit-layout-grid">
            <div class="tmplit-main-container">
                <div class="tmplit-navBar-container"> 
                    <div class="tmplit-navBar-logo-wrapper">

                    </div>

                    <div class="tmplit-navBar-buttons-container">

                    </div>
                </div>

                <div id="tmplit-screen-content" class="tmplit-screen-container"> 

                </div>
            </div>

            <div class="tmplit-footer-wrapper">

            </div>
        <div>`
    }   
}

// //Register Element (Web Component)
// customElements.define('lui-basicLayout', basicLayout)


// export function TmplitBasicLayout1(context, args) {

// }

// export function TmplitBasicLayout2(context, args) {

// }