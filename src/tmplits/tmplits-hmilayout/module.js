import * as util from "../tmplits-utilities/module.js"

//Style Template
const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = 
`
<style>
/* Parent grid */
.tmplit-layout-grid{
    display: grid;
    grid-template-rows: 1fr;
    height: 100vh; 
    width: 100vw;
}

/* Main Wrapper */
.tmplit-main-container{
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    display: flex;
    overflow: var(--main-container-overflow, auto);
    height:100%
}

/* Footer belong to tmplit-layout-grid*/
.tmplit-footer-wrapper{
    background-color: var(--footer-background-color, rgb(150, 150, 150));
    height: var(--footer-height, 50px);
}
.nav{
    background-color:grey;
    width:100px;
    
}
.main-content{
    flex-grow: 1;
    overflow:auto;



}
.red{
    background-color: red;
}
.green{
    background-color: green;
}
</style>
`;

//Web Component Functionality
class basicLayout extends HTMLElement {

    constructor() {
        super() 
        //Find the template tags and move them to the shadow dom
        let nodes = this.querySelectorAll('template')
        let pages = []
        for (let i in nodes) {
            let el = nodes[i]
            switch (el.tagName) {
                case undefined:
                    break;
                case 'TEMPLATE':
                    pages.push(el.getAttribute("title"))
                    break;
                default:
                    pages.push(el.getAttribute("title"))
                    break;
            }
        }
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
        <div class="tmplit-layout-grid
        ${this.getAttribute('red') ? 'red' : 'green'}">
        
            
            <div class="tmplit-main-container">
                <div class='nav'>
                    Nav
                </div>

                <div class="main-content">
                    <slot>
                    </slot>
                </div>
            </div>

            <div class="tmplit-footer-wrapper">
                FOOTER
            </div>
        </div>`
        // Append styleTemplate to shadowRoot to activate css styling
        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
    }   
    connectedCallback() {

    }
    disconnectedCallback() {


    }
}

//Register Element (Web Component)
customElements.define('lui-basic-layout', basicLayout)
