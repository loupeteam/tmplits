import * as util from "../tmplits-utilities/module.js"

//Define the style template


const styleTemplate = document.createElement('template');
styleTemplate.innerHTML = 
`
<style>
.tmplit-tab-control{
    background-color: var(--tmplit-tab-color, var( --md-sys-color-surface-container, ));
    padding: var(--tmplit-tab-padding, 10px);
    margin: var(--tmplit-tab-margin, 10px);
}
.tmplit-frame{
    border: var(--tmplit-tab-frame-border, 1px solid black);
    border-radius: var(--tmplit-tab-frame-radius, 10px);
    padding: var(--tmplit-tab-frame-padding, 10px);
    color : var(--tmplit-tab-frame-text-color, var( --md-sys-color-on-secondary-container,  #385E72));
    background-color: var(--tmplit-tab-frame-color, var( --md-sys-color-secondary-container, #D9E4EC));
}
.tmplit-nav-tabs{
    position: relative;
    width: fit-content;
    margin: 10px auto;
	display: flex;
	align-items: center;
	justify-content: center;    
	background-color: var(--tmplit-tab-color, var( --md-sys-color-primary-container, #D9E4EC));
    color: var(--tmplit-tab-color, var( --md-sys-color-on-primary-container,  #385E72));
    border-radius: var(--tmplit-tab-radius, 30px);
    padding: var(--tmplit-tab-padding, 5px 0px);
}
.tmplit-nav-tabs * {
	z-index: 2;
}
.tmplit-nav-tab{
    cursor: pointer;
    padding: var(--tmplit-tab-padding, 5px 50px);
}
.tmplit-nav-tab.active{
    color: var(--tmplit-tab-active-color, var( --md-sys-color-on-primary,  #385E72));
}
.tmplit-nav-glider {
	position: absolute;
	height: 100%;
	z-index: 1;
	border-radius: inherit;
	background-color: var(--tmplit-tab-glider-color, var( --md-sys-color-primary, #B7CFDC));
	transition: var(--tmplit-tab-glider-transition, all 0.1s ease-in-out);
}
</style>
`;


class tabControl extends HTMLElement {
    tabs = []
    glider = null
    noChange=false;
	constructor() {
		super()
        //Find the template tags and move them to the shadow dom
        let nodes = this.querySelectorAll('template')
        let pages = []
        for( let i in nodes){
            let el = nodes[i]
            switch (el.tagName) {
                case undefined:
                    break
                case 'TEMPLATE':
                    pages.push( el.getAttribute("title") )
                    break;
                default:
                    pages.push( el.getAttribute("title") )
                    break;  
            }
        }
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `<div class="tmplit-tab-control">
                <div class="tmplit-nav-tabs"> 
                </div>
                <div class="tmplit-frame">
                    <slot></slot>
                </div>
            <div>
        `   
        this.shadowRoot.appendChild(styleTemplate.content.cloneNode(true));
        this.shadowRoot.innerHTML += this.innerHTML;
        let navbar = this.shadowRoot.querySelector(".tmplit-nav-tabs")

        for(let i in pages){
            let tab = document.createElement(`div`);
            tab.classList.add('tmplit-nav-tab')
            tab.innerHTML = pages[i] ? pages[i] : +i + 1
            tab.addEventListener('click', ()=>{this.setAttribute('value',i)})
            this.tabs.push(tab);
            navbar.appendChild( tab )
        }
        let tab = document.createElement(`div`);
        this.glider = tab

        tab.classList.add('tmplit-nav-glider')
        navbar.appendChild( tab )

        //On resize, update the glider
        window.addEventListener('resize', this.updateGlider.bind(this))
        
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
                this.updateGlider()
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
        this.updateGlider()
    }
	disconnectedCallback() {
        window.removeEventListener('resize', this.updateGlider.bind(this))

	}
    updateGlider(){
        this.tabs.forEach((tab, i)=>{
            tab.classList.remove('active')
        })
        let tab = this.tabs[this.getAttribute('value')]
        tab.classList.add('active')
        this.glider.style.left = tab.offsetLeft + 'px'
        this.glider.style.width = tab.scrollWidth + 'px'
    }
    selectPage(pageIndex){
        let pages = this.shadowRoot.querySelectorAll('template')
        if(+pageIndex < pages.length){
            this.innerHTML = pages[pageIndex].innerHTML
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
//Register the webcomponent
customElements.define('lui-tab-control', tabControl)


export function TmplitTabs(context, args) {
    //Pull out any attributes we need
    let {
        ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = util.cleanArgs(_args)
    return `
    <lui-tab-control ${attr} class='${classList.join(' ')}'>${args.children}</lui-tab-control>
    `
}