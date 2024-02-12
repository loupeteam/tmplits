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
.tmplit-nested-layout-grid{
    display: grid;
    grid-template-rows: 1fr;
    height: 100%; 
    width: 100%;

}

/* Main Wrapper */
.tmplit-main-container{
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    display: flex;
    overflow: var(--main-container-overflow, auto);
    height:100%;
}

.tmplit-main-container-left-right{
    flex-direction: row;
}

.tmplit-main-container-top-bottom{
    flex-direction: column;
}

/* Nav Bar*/
.tmplit-navBar-container{
    flex-shrink: 1;
    display: flex;
    background-color: var(--navBar-background-color,  rgb(230, 230, 230));
    overflow: var(--navBar-container-overflow, auto);
}

.tmplit-nested-navBar-container{
    flex-shrink: 1;
    display: flex;
    background-color: var(--navBar-background-color,  rgb(0, 230, 230));
    overflow: var(--navBar-container-overflow, auto);
}


.tmplit-navBar-container-left{
    flex-direction: column;
    order: 0;
}

.tmplit-navBar-container-right{
    flex-direction: column;
    order: 1;
}

.tmplit-navBar-container-top{
    flex-direction: row;
    order: 0;
}

.tmplit-navBar-container-bottom{
    flex-direction: row;
    order: 1;
}

.tmplit-navBar-button{
    width: 100%;
    text-wrap: nowrap;  
    text-align: var(--navBar-buttons-text-align, left);
    padding: var(--navBar-buttons-padding, 0 0 0 0);
    margin: var(--navBar-buttons-margin, 0 0 0 0);
    color: var(--navBar-buttons-color, none);
    font-size: var(--navBar-buttons-text-size, Large);
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

@media (max-width: 992px){
    .tmplit-navBar-container-width-size{
        min-width: var(--navBar-minwidth, 10%);
        max-width: var(--navBar-maxwidth, 15%);
    }
}

/* Medium Screen Size */
@media (min-width: 992px) and (max-width: 1200px){
    .tmplit-navBar-container-width-size{
        min-width: var(--navBar-minwidth, 15%);
        max-width: var(--navBar-maxwidth, 20%);
    }
}

/* Large Screen Size */
@media (min-width: 1200px){
    .tmplit-navBar-container-width-size{
        min-width: var(--navBar-minwidth, 20%);
        max-width: var(--navBar-maxwidth, 25%);
    }
}

.tmplit-navBar-container-height-size{
    min-height: var(--navBar-minheight, 5%);
    max-height: var(--navBar-maxheight, 10%);
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
        let nested = this.getAttribute('nested')
        let navBarLoc = this.getAttribute('navBar')
        let footer = this.getAttribute('footer')
        this.attachShadow({mode: 'open'})
        this.shadowRoot.innerHTML = `
        <div class=" ${nested === 'NESTED' ? 'tmplit-nested-layout-grid' : 'tmplit-layout-grid'}">
            <div class="tmplit-main-container
                        ${navBarLoc ==='left' || navBarLoc ==='right' ? 'tmplit-main-container-left-right' : 
                        navBarLoc ==='top' || navBarLoc ==='bottom' ? 'tmplit-main-container-top-bottom' :'mplit-main-container-left-right'}">
                <div class=" ${nested === 'NESTED' ? 'tmplit-nested-navBar-container' : 'tmplit-navBar-container'}
                            ${navBarLoc ==='left' ? 'tmplit-navBar-container-left tmplit-navBar-container-width-size' :
                            navBarLoc ==='right' ? 'tmplit-navBar-container-right tmplit-navBar-container-width-size' :
                            navBarLoc ==='top' ? 'tmplit-navBar-container-top tmplit-navBar-container-height-size' :
                            navBarLoc ==='bottom' ? 'tmplit-navBar-container-bottom tmplit-navBar-container-height-size' : 
                            'tmplit-navBar-container-left tmplit-navBar-container-width-size'}">
                </div>

                <div class="tmplit-main-content">
                    <slot>
                        DEFAULT SLOT
                    </slot>
                </div>             
            </div>

            ${footer !== 'disable' ? 
            `<div class="tmplit-footer-wrapper">
                <slot name="footer">
                    DEFAULT FOOTER
                </slot>
            </div>`: ''}`
        // Append styleTemplate to shadowRoot to activate css styling
        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
        this.shadowRoot.innerHTML += this.innerHTML;

        let navbar = (nested === 'NESTED' ? this.shadowRoot.querySelector(".tmplit-nested-navBar-container") :
                                             this.shadowRoot.querySelector(".tmplit-navBar-container"))
        
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
        // let mainSlot = this.shadowRoot.querySelector('slot[name="mainSlot"]')
        let mainSlot = this.shadowRoot.querySelector('slot:not([name])')
        let mainContent = mainSlot.assignedNodes()[0]
        // console.log(mainContent.innerHTML)
        // let footer = this.getAttribute('footer')
        let footer = this.querySelector('[slot="footer"]')        

        if(+templatesIndex < templates.length){            
            this.innerHTML = templates[templatesIndex].innerHTML
            if (footer !== null){
                this.append(footer)
            }            
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

//Register Custom Element as 'lui-basic-layout' from basicLayout class 
customElements.define('lui-basic-layout', basicLayout)
