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
    height:100%;
}

/* Nav Bar*/
.tmplit-navBar-container{
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    order: 0;
    max-width: 100px;
    background-color: var(--navBar-background-color, rgb(230, 230, 230));
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

    noChange = false;
    constructor() {
        super() 
        //Find the template tags and move them to the shadow dom
        let nodes = this.querySelectorAll('template')
        let labels = []

        for (let i in nodes) {
            let el = nodes[i]
            switch (el.tagName) {
                case undefined:
                    break;
                case 'TEMPLATE':
                    labels.push(el.getAttribute("title"))
                    break;
                default:
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
                <slot name="footer">
                    DEFAULT FOOTER
                </slot>
            </div>
        </div>`
        // Append styleTemplate to shadowRoot to activate css styling
        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
        this.shadowRoot.innerHTML += this.innerHTML;
        let navbar = this.shadowRoot.querySelector(".tmplit-navBar-container");
        for(let i in labels){
            let button = document.createElement(`div`);
            button.classList.add('tmplit-navBar-button')
            button.innerHTML = labels[i] ? labels[i] : +i + 1;
            button.addEventListener('click', ()=>{this.setAttribute('value',i)})
            navbar.appendChild( button )
        }
        if(!this.hasAttribute('value')){           
            this.setAttribute('value', 0)
            this.selectPage(this.getAttribute('value'))
        }
    }
    
    //Tell the DOM to observe 'value' attribute for changes
    static get observedAttributes() {
        return ['value']
    }

    //If 'value' attribute changes, execute these
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

    selectPage(templatesIndex){
        let templates = this.shadowRoot.querySelectorAll('template')
        let mainContent = this.shadowRoot.querySelector('.tmplit-main-content')
        if(+templatesIndex < templates.length){
            console.log(mainContent)
            mainContent.innerHTML = templates[templatesIndex].innerHTML
        }
        else{
            mainContent.innerHTML = "Not Found"            
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

//Register Custom Element as 'lui-basic-layout' from basicLayout class 
customElements.define('lui-basic-layout', basicLayout)
