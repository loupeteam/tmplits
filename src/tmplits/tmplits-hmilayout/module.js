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
/* Nested grid */
.tmplit-layout-grid[nested='nested']{
    height: 100%; 
    width: 100%;
}   

/* Main Container */
.tmplit-main-container{
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    display: flex;
    overflow: var(--main-container-overflow, auto);
    height:100%;
}

/* Nav Bar*/
.tmplit-navbar-container{
    flex-shrink: 1;
    display: flex;
    background-color: var(--navbar-background-color, rgb(230, 230, 230));
    overflow: var(--navbar-container-overflow, auto);
    align-items: center;    
}

/* Nav Bar Buttons */
.tmplit-navbar-button{
    text-wrap: nowrap;  
    padding: var(--navbar-buttons-padding, 0 0 0 0);
    margin: var(--navbar-buttons-margin, 0 0 0 0);
    color: var(--navbar-buttons-color, var(--md-sys-color-primary, none));
    font-size: var(--navbar-buttons-text-size, Large);

    border-width: var(--navbar-buttons-border-width, 0);
    background-color: var(--navbar-buttons-background-color, inherit);
}

.tmplit-navbar-button.selected{
    background-color: var(--navbar-button-indicator-background-color, rgb(182, 182, 182));
    border-radius: 20px;
}

/* Additional styling for different nav bar locations */
/* Main Container Layout Per Nav Bar Location */
.tmplit-main-container[navbar='left'],
.tmplit-main-container[navbar='right']{
    flex-direction: row;
}

.tmplit-main-container[navbar='left'] .tmplit-navbar-container,
.tmplit-main-container[navbar='right'] .tmplit-navbar-container{
    flex-direction: column;
}

.tmplit-main-container[navbar='left'] .tmplit-navbar-button,
.tmplit-main-container[navbar='right'] .tmplit-navbar-button{
    height: auto;
    width: 60%;
}

.tmplit-main-container[navbar='top'],
.tmplit-main-container[navbar='bottom']{
    flex-direction: column;
}

.tmplit-main-container[navbar='top'] .tmplit-navbar-container,
.tmplit-main-container[navbar='bottom'] .tmplit-navbar-container{
    flex-direction: row;
    justify-content: center;
    min-height: var(--navbar-minheight, 10%);
    max-height: var(--navbar-maxheight, 15%);
}

.tmplit-main-container[navbar='top'] .tmplit-navbar-button,
.tmplit-main-container[navbar='bottom'] .tmplit-navbar-button{
    width: 25%;
    height: 70%;
}

/* Nav Bar Location */
.tmplit-main-container[navbar='left'] .tmplit-navbar-container,
.tmplit-main-container[navbar='top'] .tmplit-navbar-container{
    order: 0; 
}

.tmplit-main-container[navbar='right'] .tmplit-navbar-container,
.tmplit-main-container[navbar='bottom'] .tmplit-navbar-container{
    order: 1;
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
    .tmplit-main-container[navbar='left'] .tmplit-navbar-container,
    .tmplit-main-container[navbar='right'] .tmplit-navbar-container{
        min-width: var(--navbar-minwidth, 10%);
        max-width: var(--navbar-maxwidth, 15%);
    }
}

/* Medium Screen Size */
@media (min-width: 992px) and (max-width: 1200px){
    .tmplit-main-container[navbar='left'] .tmplit-navbar-container,
    .tmplit-main-container[navbar='right'] .tmplit-navbar-container{
        min-width: var(--navbar-minwidth, 15%);
        max-width: var(--navbar-maxwidth, 20%);
    }
}

/* Large Screen Size */
@media (min-width: 1200px){
    .tmplit-main-container[navbar='left'] .tmplit-navbar-container,
    .tmplit-main-container[navbar='right'] .tmplit-navbar-container{
        min-width: var(--navbar-minwidth, 20%);
        max-width: var(--navbar-maxwidth, 25%);
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
        let nestedLayout = (this.parentElement.localName == 'lui-basic-layout' ? 'nested' : '')
        let navBarLoc = this.getAttribute('navbar')
        let footer = this.getAttribute('footer')
        this.attachShadow({mode: 'open'})
        
        //Create Shadow Root structure
        //::part(footer) is assigned to footer
        this.shadowRoot.innerHTML = `
        <div class="tmplit-layout-grid" nested=${nestedLayout}>
            <div class="tmplit-main-container" navbar=${navBarLoc}>
                <div class="tmplit-navbar-container">
                </div>

                <div class="tmplit-main-content" part="main-content">
                    <slot>
                        DEFAULT SLOT
                    </slot>
                </div>             
            </div>

            ${footer !== 'disable' ? 
            `<div class="tmplit-footer-wrapper" part="footer">
                <slot name="footer">
                    DEFAULT FOOTER
                </slot>
            </div>`: ''}`
        // Append styleTemplate to shadowRoot to activate css styling
        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
        this.shadowRoot.innerHTML += this.innerHTML;
                                
        let navbar = this.shadowRoot.querySelector(".tmplit-navbar-container")

        //Assign ::part() to navbar container
        navbar.setAttribute('part','navbar-container')
        
        //Create nav bar button divs 
        for(let i in labels){
            let iconSource=''
            let button = document.createElement(`button`);
            button.classList.add('tmplit-navbar-button')

            //Assign ::part() to button
            button.setAttribute('part','nav-button')

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
        let buttons = this.shadowRoot.querySelectorAll('.tmplit-navbar-button')
        for (let i = 0; i < buttons.length; i++){
            buttons[i].classList.remove('selected')
            let oldPart = buttons[i]['part']
            oldPart.remove('selected')

            buttons[templatesIndex].classList.add('selected')
            let newPart = buttons[templatesIndex]['part']
            newPart.add('selected')
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
