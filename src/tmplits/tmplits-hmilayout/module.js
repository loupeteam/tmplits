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
.tmplit-layout-grid[nested='nested']{
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

.tmplit-layout-grid[navBar='left'] .tmplit-main-container,
.tmplit-layout-grid[navBar='right'] .tmplit-main-container{
    flex-direction: row;
}

.tmplit-layout-grid[navBar='top'] .tmplit-main-container,
.tmplit-layout-grid[navBar='bottom'] .tmplit-main-container{
    flex-direction: column;
}

/* Nav Bar*/
.tmplit-navBar-container{
    flex-shrink: 1;
    display: flex;
    background-color: var(--navBar-background-color, rgb(230, 230, 230));
    overflow: var(--navBar-container-overflow, auto);
    align-items: center;    
}

.tmplit-layout-grid[navBar='left'] .tmplit-navBar-container{
    flex-direction: column;
    order: 0; 
}

.tmplit-layout-grid[navBar='right'] .tmplit-navBar-container{
    flex-direction: column;
    order: 1;
}

.tmplit-layout-grid[navBar='top'] .tmplit-navBar-container{
    flex-direction: row;
    order: 0;
    justify-content: center;

}

.tmplit-layout-grid[navBar='bottom'] .tmplit-navBar-container{
    flex-direction: row;
    order: 1;
    justify-content: center;
}

.tmplit-navBar-button{
    text-wrap: nowrap;  
    padding: var(--navBar-buttons-padding, 0 0 0 0);
    margin: var(--navBar-buttons-margin, 0 0 0 0);
    color: var(--navBar-buttons-color, var(--md-sys-color-primary, none));
    font-size: var(--navBar-buttons-text-size, Large);

    border-width: var(--navBar-buttons-border-width, 0);
    background-color: var(--navBar-buttons-background-color, inherit);
}

.tmplit-layout-grid[navBar='left'] .tmplit-navBar-button,
.tmplit-layout-grid[navBar='right'] .tmplit-navBar-button{
    height: auto;
    width: 60%;
}

.tmplit-layout-grid[navBar='top'] .tmplit-navBar-button,
.tmplit-layout-grid[navBar='bottom'] .tmplit-navBar-button{
    width: 25%;
    height: 70%;
}

.tmplit-navBar-button.selected{
    background-color: var(--navBar-button-indicator-background-color, rgb(182, 182, 182));
    border-radius: 20px;
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
    .tmplit-layout-grid[navBar='left'] .tmplit-navBar-container,
    .tmplit-layout-grid[navBar='right'] .tmplit-navBar-container{
        min-width: var(--navBar-minwidth, 10%);
        max-width: var(--navBar-maxwidth, 15%);
    }

    .tmplit-layout-grid[navBar='top'] .tmplit-navBar-container,
    .tmplit-layout-grid[navBar='bottom'] .tmplit-navBar-container{
        min-height: var(--navBar-minheight, 10%);
        max-height: var(--navBar-maxheight, 15%);
    }
}

/* Medium Screen Size */
@media (min-width: 992px) and (max-width: 1200px){
    .tmplit-layout-grid[navBar='left'] .tmplit-navBar-container,
    .tmplit-layout-grid[navBar='right'] .tmplit-navBar-container{
        min-width: var(--navBar-minwidth, 15%);
        max-width: var(--navBar-maxwidth, 20%);
    }
    .tmplit-layout-grid[navBar='top'] .tmplit-navBar-container,
    .tmplit-layout-grid[navBar='bottom'] .tmplit-navBar-container{
        min-height: var(--navBar-minheight, 10%);
        max-height: var(--navBar-maxheight, 15%);
    }
}

/* Large Screen Size */
@media (min-width: 1200px){
    .tmplit-layout-grid[navBar='left'] .tmplit-navBar-container,
    .tmplit-layout-grid[navBar='right'] .tmplit-navBar-container{
        min-width: var(--navBar-minwidth, 20%);
        max-width: var(--navBar-maxwidth, 25%);
    }
    .tmplit-layout-grid[navBar='top'] .tmplit-navBar-container,
    .tmplit-layout-grid[navBar='bottom'] .tmplit-navBar-container{
        min-height: var(--navBar-minheight, 10%);
        max-height: var(--navBar-maxheight, 15%);
    }
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
        let icons = []
        
        for (let i in nodes) {
            let el = nodes[i]
            
            switch (el.tagName) {
                case undefined:
                    break;
                case 'TEMPLATE':
                    if (el.getAttribute("title")){
                        labels.push(el.getAttribute("title"))
                    }
                    else if (el.getAttribute("img")){
                        labels.push(el.getAttribute("img"))
                    }
                    break;
                default:
                    break;
            }
        }

        //Check for nested lui-basic-layout tmplit.  If there parent tag is lui-basic-layout, then it is nested
        let nested = (this.parentElement.localName == 'lui-basic-layout' ? 'nested' : '')
        let navBarLoc = this.getAttribute('navBar')
        let footer = this.getAttribute('footer')
        this.attachShadow({mode: 'open'})
        
        //Create Shadow Root structure
        this.shadowRoot.innerHTML = `
        <div class="tmplit-layout-grid" navBar=${navBarLoc} nested=${nested}>
            <div class="tmplit-main-container">
                <div class="tmplit-navBar-container">
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
                                
        let navbar = this.shadowRoot.querySelector(".tmplit-navBar-container")

        //Assign ::part() to navBar container
        navbar.setAttribute('part','navBarContainer')
        
        //Create nav bar button divs 
        for(let i in labels){
            let iconSource=''
            let button = document.createElement(`button`);
            button.classList.add('tmplit-navBar-button')

            //Assign ::part() to button
            button.setAttribute('part','button')

            //Icon as button if first 4 characters == src=
            if (labels[i].substring(0,4) == 'src='){
                button.innerHTML = labels[i] ? (iconSource.concat('<img ',labels[i],'/>')) : +i + 1;
            }
            //Text as button
            else{
                button.innerHTML = labels[i] ? labels[i] : +i + 1;
            }
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
        let mainSlot = this.shadowRoot.querySelector('slot:not([name])')
        let mainContent = mainSlot.assignedNodes()[0]
        let footer = this.querySelector('[slot="footer"]')   
        
        //Add - Remove Navigation Button Indicator
        let buttons = this.shadowRoot.querySelectorAll('.tmplit-navBar-button')
        for (let i = 0; i < buttons.length; i++){
            buttons[i].classList.remove('selected')
            buttons[templatesIndex].classList.add('selected')
        }

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
