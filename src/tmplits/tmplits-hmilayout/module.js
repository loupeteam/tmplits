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

/* Nav Bar*/
.tmplit-navBar-container{
    background-color:grey;
    width:100px;
}

.tmplit-navBar-button{
    width: 100%;
    background-color: yellow;
    text-wrap: nowrap;  
    text-align: var(--navBar-buttons-text-align, left);
}

/* Main Content */
.tmplit-main-content{
    flex-grow: 1;
    overflow:auto;
}

/* Footer belong to tmplit-layout-grid*/
.tmplit-footer-wrapper{
    background-color: var(--footer-background-color, rgb(150, 150, 150));
    height: var(--footer-height, 50px);
}



</style>
`;

//Web Component Functionality
class basicLayout extends HTMLElement {
    buttonList = []
    noChange = false;
    constructor() {
        super() 
        //Find the template tags and move them to the shadow dom
        let nodes = this.querySelectorAll('template')
        let buttonLabels = []
        for (let i in nodes) {
            let el = nodes[i]
            switch (el.tagName) {
                case undefined:
                    break;
                case 'TEMPLATE':
                    buttonLabels.push(el.getAttribute("title"))
                    break;
                default:
                    buttonLabels.push(el.getAttribute("title"))
                    break;
            }
        }
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
        <div class="tmplit-layout-grid">
            <div class="tmplit-main-container">
                <div class="tmplit-navBar-container">
                </div>

                <div class="tmplit-main-content">
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
        //Apply light DOM to shadow DOM
        this.shadowRoot.innerHTML += this.innerHTML;
        let navbar = this.shadowRoot.querySelector(".tmplit-navBar-container");

        for(let i in buttonLabels){
            let button = document.createElement(`div`);
            button.classList.add('tmplit-navBar-button')
            button.innerHTML = buttonLabels[i] ? buttonLabels[i] : +i + 1;
            button.addEventListener('click', ()=>{this.setAttribute('value',i)})
            this.buttonList.push(button);
            navbar.appendChild( button )
        }

        if(!this.hasAttribute('value')){
            this.setAttribute('value', 0)
        }
    }
    
    static get observedAttributes() {
        return ['value']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'value':
                this.selectPage(newValue)
                //Raise an event
                if(!this.noChange){
                    this.dispatchEvent(new Event("change", {
                        "bubbles": true,
                        "cancelable": true
                    }));    
                }
                break;
            default:
                break;
        }
    }

    connectedCallback() {

    }
    disconnectedCallback() {


    }

    selectPage(buttonLabelsIndex){
        let buttonLabels = this.shadowRoot.querySelectorAll('template')
        if(+buttonLabelsIndex < buttonLabels.length){
            this.innerHTML = buttonLabels[buttonLabelsIndex].innerHTML
        }
        else{
            this.innerHTML = "Not Found"            
        }
    }
    get value(){
        return this.getAttribute('value');
    }
    set value(val){
        this.noChange = true;
        this.setAttribute('value', val)
        this.noChange = false;
    }
}

//Register Element (Web Component)
customElements.define('lui-basic-layout', basicLayout)
