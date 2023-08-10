import "../../jquery/dist/jquery.js"
//Check if jquery has already been loaded
//If it hasn't then load it
if( !window.$ ){
    window.$ = jQuery
    console.error('Loading JQuery in tmplits.js. To avoid this ensure that JQuery is loaded before tmplits.js')
}
let loglevel =1
let log = function( t ){ if(loglevel == 0){ console.log(t) }};
let warn = function( t ){ if(loglevel <= 1){ console.warn(t) }};
let error = function( t ){ if(loglevel <= 2){ console.error(t) }};

export class Tmplits {
    constructor(node_module_directory, loadedCallback ) {
        
        //Get any base element from the page
        this.base = node_module_directory

        this.cache = {}
        this.compiled = {}
        this.raw = '{}'
        this.combinedScript = ''
        this.retryScripts = []
        Tmplits.modules["tmplitsystem"] = true;
        if(loadedCallback){
            Tmplits.loadedCallback.push(()=>{loadedCallback(this.native)})
        }        
        this.loadPackageLockJson(this.base + '../package-lock.json')
        .then(()=>{return this.loadPackageJson(this.base + '../package.json')})
        .then(()=>{return this.loadJson(this.base + '../tmplits.json')})
        .then(()=>{return this.getLibraries(this.libraries)})
        .then(()=>{return this.getPages(this.pages)})
        .then(()=>{return this.retries()})
        .then(()=>{return Tmplits.moduleLoaded('tmplitsystem')})        
    }
    static modules = {}
    static loadedCallback = []
    //This function refreshes all dynamic elements
    refreshDynamicDom() {
        $('[dynamic-template]').each((i, el) => {
            this.refreshDynamicEl(el)
        })
    }

    //This function refreshes a dynamic element
    //by getting the template and context and adding it to the element
    //el is the element to refresh
    refreshDynamicEl(el) {
        var template = this.get(el.getAttribute('dynamic-template'));
        let context = eval(el.getAttribute('context'))
        context = context ? context : window[this.raw.context]
        $(el).attr('dom-added', true)
        let generated = $(el).html(template(context))
        var post = el.getAttribute('dynamic-post');
        if (post) {
            post = eval(post)
            post(context, generated)
        }
    }

    //This function loads a script into the window
    importScript(script){
        const encodedJs = encodeURIComponent(script);
        const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
        try{
            import(dataUri).then(ns => {
                log(`imported ${id} successfully`);
                Object.assign(window, ns);
            }).catch(()=>{
                warn(`import failed ${id}, will retry..`)
            })
        }
        catch(e){
            warn(`import failed ${el.id}, will retry..`)
        }                  
    }

    //This function reads the libraries and adds each item with the type='text/x-handlebars-template'
    //to the cache
    //it also adds the scripts to the combinedScript
    readLibraries(raw) {
        log('processing libraries' )
        let scope = this
        let html = $.parseHTML(raw)
        if (html) {
            $.each(html, function (i, el) {
                if (el.type == "text/x-handlebars-template") {
                    Handlebars.registerPartial(
                        el.id,
                        el.text
                    )
                    scope.cache[el.id] = el.text;
                }
                if (el.type == "text/x-handlebars-onload") {          
                    scope.combinedScript += el.innerHTML + '\n'
                    log(`loading script ${el.id}`);
                    const encodedJs = encodeURIComponent(el.innerHTML);
                    const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
                    try{
                        import(dataUri).then(ns => {
                            log(`imported ${el.id} successfully`);
                            Object.assign(window, ns);
                        }).catch(()=>{
                            warn(`import failed ${el.id}, will retry..`)
                            scope.retryScripts.push(el)                        
                        })
                    }
                    catch(e){
                        scope.retryScripts.push(el)                        
                        warn(`import failed ${el.id}, will retry..`)
                    }                                      
                }
            });
        }
    }

    //This function loads all the libraries that were found
    //it resolves the libraries then processes them by compiling them
    //and adding them to the cache
    getLibraries(libraries) {

        let scope = this
        let chain = new Promise((resolve, reject)=>{          
            log('loading libraries')
            let libraryCount = 0;
            if(libraries.length == 0){
                next()
            }
            function next() {
                libraryCount++
                if (libraries.length <= libraryCount) {
                    resolve()
                }
            }
            function processPartial(data) {
                data.text()
                    .then((partial) => {
                        scope.readLibraries(partial)
                        next()
                    })
                    .catch(error => {
                        warn( 'error loading library ' + error )
                        next()                    
                    })
            }

            libraries.forEach(element => {
                fetch(element.file)
                    .then(processPartial)
                    .catch(error => {
                        warn( 'error loading library ' + error )
                        next()
                    });
            });
        })
        return chain

    }

    //This function loads all the template pages that were found
    //it resolves the pages then processes them by compiling them
    //and adding them to the cache
    getPages( pagesObj ) {        
        let scope = this
        let chain = new Promise((resolve, reject)=>{          
            log('loading pages')
            let pageCount = 0;

            //go through pages object members and add each to an array of pages
            let pages = []
            for( let page in pagesObj ){
                pages.push( pagesObj[page] )
            }

            if(pages.length == 0){
                next()
            }

            function next() {
                pageCount++
                if (pages.length <= pageCount) {
                    resolve()
                }
            }

            function processPartial(element, partial) {
                scope.readLibraries(partial)
                scope.cache[element.name] = partial;
                Handlebars.registerPartial(
                    element.name,
                    partial
                )
                next()
            }

            pages.forEach(element => {
                if(element.script){
                    $.getScript(element.script, function() {
                        log(`loaded script ${element.script}`);
                    }).catch((e)=>{
                    });
                }
            });

            pages.forEach(element => {
                if(element.module){
                    scope.loadModule(element.module)
                }
            });  

            pages.forEach(element => {
                fetch(element.file)
                .then((data)=>{
                    if(data.status != 200){
                    }
                    else{
                        return data.text()                        
                    }
                })
                .then((partial) => {
                    processPartial(element, partial)
                })
                .catch(error => {
                    warn('failed to get page: ' + error);
                    next()
                });
            });
          
        })
        return chain
    }

    //This function retries to load scripts that failed to load
    //and loads them into the container
    retries( ){
        let scope = this
        let chain = new Promise((resolve, reject)=>{    
            let retryAgain = []

            let scriptCount = 0;
            let numberScript = this.retryScripts.length

            function next() {
                scriptCount++
                if (numberScript <= scriptCount) {
                    if( retryAgain.length > 0 && retryAgain.length < numberScript )
                    {
                        setTimeout( ()=>{
                            this.retryScripts = retryAgain
                            this.retries()
                        }, 0)
                    }
                    else{
                        retryAgain.forEach((el)=>{
                            const encodedJs = encodeURIComponent(el.innerHTML);
                            const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
                            log(`failing: ${el.id}`);
                            import(dataUri).then(ns => {
                                Object.assign(window, ns);
                            })
                        })            
                        resolve()
                    }
                }
            }

            if( this.retryScripts.length > 0 ){
                log('retrying to load scripts' )
                this.retryScripts.forEach((el)=>{
                    try{
                        const encodedJs = encodeURIComponent(el.innerHTML);
                        const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
                        log(`retrying: ${el.id}`);
                        import(dataUri).then(ns => {
                            Object.assign(window, ns);
                        })
                        .then(()=>{
                            next()                    
                        })
                        .catch((error)=>{
                            warn('failed to parse script, will retry: ' + error);
                            retryAgain.push(el)                        
                            next()                    
                        })
                    }
                    catch(e){
                        retryAgain.push(el)                        
                        next()                    
                    }                  
                })     
            }
            else{
                next()
            }
        })
        return chain;
    }

    //This function loads a page defined by the user
    //and loads them into the container
    //containerId is the id of the container to load the page into
    //pageName is the name of the page to load
    //context is the context to load the page with
    loadPage(containerId, pageName, context) {
        var template = this.get(pageName);
        context = context ? context : window                    
        log(`Loading page: ${pageName}`)
        let dom = containerId
        try{
            if( typeof containerId == 'string'){
                dom = '#' + containerId;    
            }
            $(dom).html(template(context))
        }
        catch(e){
            $(dom).html(`<div class="error">Error loading the page '${pageName}' ${e} </div>` )
        }
        if( typeof WEBHMI !== 'undefined'){
            try {
                WEBHMI.queryDom()
                WEBHMI.updateHMI()                        
            } catch (error) {
                
            }
        }
    }

    //This function pushes a template to a container
    //and updates the HMI
    pushTemplate(container, template, context) {
        log(`Pushing template: ${template}`)
        var template = this.get(template);
        context = context ? context : window
        try{
            $(container).html(template(context))
        }
        catch(e){
            $(container).html(`<div class="error">Error loading the template '${template}' ${e} </div>`)
        }
        if( typeof WEBHMI !== 'undefined'){
            try {
                WEBHMI.queryDom()
                WEBHMI.updateHMI()                        
            }catch{}
        }
    }

    //This function gets a partial from the cache
    //and compiles it if it has not been compiled yet
    get(partial) {
        if (this.compiled[partial]) {
            return this.compiled[partial];
        }
        // ,{compat:true}
        this.compiled[partial] = Handlebars.compile(this.cache[partial]);

        return this.compiled[partial]
    }

    //This function loads a json file defined by the user
    //and loads them into pages and libraries
    loadJson( fileName ) {
        let scope = this
        let chain = new Promise((resolve, reject)=>{    
            log('loading ' + fileName)
            $.get(fileName, function (raw) {
                scope.native = raw
                $(document).on('DOMNodeInserted', function (e) {
                    $('[dynamic-template]').not("[dom-added=true]").each((i, el) => {
                        scope.refreshDynamicEl(el)
                    })
                });

                //Append the package pages to the pages
                scope.pages = scope.pages ? scope.pages : [];
                raw.pages.forEach((e)=>{
                    e.file = scope.base + e.file
                    e.source = fileName
                    scope.pages[e.name] = e
                })

                scope.libraries = scope.libraries ? scope.libraries : [];
                raw.libraries.forEach((e)=>{
                    let lib = {};
                    lib.file = scope.base + e
                    lib.source = fileName

                    scope.libraries.push(lib)
                })
                resolve();
            }).fail(()=>{
                warn(fileName + ' not found, may not load all tmplits')
                resolve();
            });
        })
        return chain

    }

    //This function loads a package json and finds the packages installed in 
    //@loupeteam/tmplits/ and loads them into pages
    //Then it searches for loader.js and runs it for each package
    loadPackageJson( name ){
        let scope = this
        let chain = new Promise((resolve, reject)=>{
            $.get( name, function (raw) {
                log('loading ' + name)
                scope.package = raw
                //Search through the package.json for @loupeteam/tmplits/*
                //by going through iterating through each member of the dependency object
                //and adding the package to the libraries and pages
                scope.pages = scope.pages ? scope.pages : [];
                scope.loaderScripts = scope.loaderScripts ? scope.loaderScripts : [];
                for( let dep in raw.dependencies ){
                    if( dep.startsWith('@loupeteam/tmplits-') ){
                        //Add the package to the pages where the name is the package name without the @loupeteam/tmplits/
                        //and the file is the library.handlebars
                        let name = dep.replace('@loupeteam/tmplits-', '');
                        scope.pages[name] = {
                            name: dep.replace('@loupeteam/tmplits-', ''), 
                            file:  scope.base + dep + '/library.handlebars',
                            script: scope.base + dep + '/loader.js',
                            module: scope.base + dep + '/module.js',
                            source: name
                        } 
                    }
                    
                }    
                resolve();
            }).fail(()=>{
                warn('package.json not found, may not load all tmplits')
                resolve();
            });      
        })
        return chain
    }
    
    //This function loads a package-lock json and finds the packages installed in 
    //@loupeteam/tmplits/ and loads them into pages
    //Then it searches for loader.js and runs it for each package
    loadPackageLockJson(name){
        let scope = this
        let chain = new Promise((resolve, reject)=>{
            log('loading ' + name)
            $.get(name, function (raw) {
                scope.packageLock = raw
                //Search through the package.json for @loupeteam/tmplits/*
                //by going through iterating through each member of the dependency object
                //and adding the package to the libraries and pages
                scope.pages = scope.pages ? scope.pages : [];
                scope.loaderScripts = scope.loaderScripts ? scope.loaderScripts : [];
                for( let dep in raw.packages ){
                    if( dep.startsWith('node_modules/@loupeteam/tmplits-') ){
                        //Add the package to the pages where the name is the package name without the @loupeteam/tmplits/
                        //and the file is the library.handlebars
                        if( dep.replace('node_modules/@loupeteam/tmplits-', '').indexOf('/') == -1 ){                        
                            let name = dep.replace('node_modules/@loupeteam/tmplits-', '');
                            let path = dep.replace('node_modules/', '');
                            scope.pages[name] = {
                                name: dep.replace('node_modules/@loupeteam/tmplits-', ''), 
                                file:  scope.base + path + '/library.handlebars',
                                script: scope.base + path + '/loader.js',
                                module: scope.base + path + '/module.js',
                                source: name
                            } 
                        }
                    }
                }    
                resolve();
            }).fail(()=>{
                warn('package-lock.json not found, may not load all dependent tmplits')
                resolve()
            });                 
        })
        return chain
    }

    //This function will create a module script to load a module then export all the exports to the window
    loadModule( name ){
        let scope = this

        Tmplits.modules[name] = true

        //Just fetch the head to check because the script will need to reload the module anyway
        fetch(name,{ method: "HEAD" })
        .then((res) => {
            if (res.ok) {
                let script = "" 
//                    script += `console.log("Loading Module ${name}") ;`
                script += `import * as module from '${name}';`
                script += `Object.assign(window, module);`
                script += `Object.assign(window, module);`
                script += `Tmplits.moduleLoaded('${name}')`
                scope.moduleEval(script)        
            }
            else{
                Tmplits.moduleLoaded(name)
            } 
        })
    }

    //Mark module as loaded and if all the modules are loaded, load the pages
    static moduleLoaded( name ){
        this.modules[name] = false
        let allLoaded = true
        for( let module in this.modules ){
            if( this.modules[module] ){
                allLoaded = false
            }
        }
        if( allLoaded ){
            Tmplits.loadedCallback.forEach(callback => {
                callback()
            });
        }        
    }
    //This function loads a module script into the window
	moduleEval( code ) {
        var doc = document
		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
        script.setAttribute( 'type', "module" );

		doc.head.appendChild( script ).parentNode.removeChild( script );
	}    
}

export class viewDelegate {
    constructor() {}
    //     static observer = new MutationObserver(function (mutations) {
    // 		// Was a new webhmi element added to the DOM?
    // 		// Use Array.some() instead of Array.forEach() for easy loop break when we find a webhmi element added or remove from DOM
    //         let nodes = new Array()
    // 		mutations.forEach(function (mutation) {
    // 			// check added nodes for webhmi changes
    // 			mutation.addedNodes.forEach(function (node) {
    // 				if (node.nodeType == node.ELEMENT_NODE) {
    // 					// check elem, check descendants
    //                     let el = node.querySelectorAll("[delegate]");
    //                     nodes = nodes.concat( Array.from(el) )
    //                     if( node.matches("[delegate]") )
    //                         nodes.append( node )

    // 				}
    // 			});
    // 		})

    //         // let el = document.querySelectorAll('[delegate]')
    //         nodes.forEach((el) => {
    //             let delegate = el.getAttribute('delegate')
    //             if (viewDelegate.delegateHolder[delegate]) {
    // //                el.delegate = viewDelegate.delegateHolder[delegate]
    //                 delete viewDelegate.delegateHolder[delegate]
    //             }
    //         })
    //         if(Object.keys(viewDelegate.delegateHolder).length === 0){
    //             viewDelegate.observer.disconnect()
    //         }
    //     });
    //     static observe(){
    //         viewDelegate.observer.observe(document.body, {
    //             childList: true,
    //             subtree: true
    //         });
    //     }
    static delegateHolder = {}
    static uniqueId = 1213
    static getUniqueID() {
        return "did_" + ++viewDelegate.uniqueId
    }

    updates = []
    willLoad() {

    }
    willUpdate() {

    }
    addUpdate(id, run) {
        this.cleanDom()
        this.updates.push({
            id: id,
            fn: run
        })
        return id;
    }
    cleanDom() {
        let keep = []
        this.updates.forEach((e, i) => {
            let el = $("[delegate-index='" + e.id + "']")
            if (el.length > 0) {
                keep.push(e)
            }
        })
        this.updates = keep
    }

    updateDom() {
        let keep = []

        if (this.willUpdate) {
            this.willUpdate()
        }
        this.updates.forEach((e, i) => {
            let el = document.querySelectorAll('[delegate="' + this.delegate + '"][delegate-index="' + e.id + '"]')
            if (el.length > 0) {
                el.forEach((el) => {
                    let fn = e.fn()
                    el.innerHTML = fn
                    if( typeof WEBHMI !== 'undefined'){
                        try{
                            WEBHMI.queryDom()
                            WEBHMI.updateHMI()    
                        }
                        catch{}
                    }
                })
                keep.push(e)
            }
        })
        this.updates = keep
    }
}

function delegatePartial(context, options, delegate, id, script) {
    let _utils = Handlebars.Utils;

    let fn = options.fn;

    if (!_utils.isEmpty(context)) {
        let data = options.data;

        if (options.data && options.ids) {
            data = _utils.createFrame(options.data);
            data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
        }

        data.delegate = delegate
        data.delegateObject = context
        let block = {
            context: context,
            params: {
                data: Object.assign({}, data),
                blockParams: _utils.blockParams([context, delegate], [data && data.contextPath, 'delegate'])
            }
        }

        function run() {
            return fn(block.context, block.params);
        }

        if (context.willLoad) {
            context.willLoad()
        }

        let ret = run()

        context.delegate = delegate
        if (context.addUpdate) {
            context.addUpdate(id, run)
            return '<div id=' + id + ' delegate="' + delegate + '" delegate-index="' + id + '">' +
                script +
                ret + '</div>'
        } else {
            return '<div id=' + id + '>' + ret + '</div>'
        }

    } else {
        return options.inverse(this);
    }
}

function createTmplit(tmplit, ...args) {

    let options = Object.assign( {}, args[args.length-1])
    options.name = tmplit
    let context = args.slice(0,-1)
    
    try{
        var fn = eval('Tmplit'+tmplit)
    }
    catch(e){
        try{
            fn = eval(tmplit)
            //If function is not undefined, then it is a tmplit
            if( typeof fn !== 'undefined' ){
                console.warn('Tmplits names should prepend "Tmplit" to their name for clarity');
            }
        }
        catch{
            var error = `<div class='error'>could not find tmplit ${tmplit}</div>`
        }
    }

    if( typeof fn != 'function'){
        var error = `<div class='error'>could not find tmplit ${tmplit}</div>`
        fn = ()=>{ return error}
    }
    if( options.fn )
    {
        options.children = options.fn(options.hash)
        if(error){
            return `<div class='error'>${error}${options.children}</div>`
        }
        else{
            return fn( context, options )
        }
    }
    else{
        if(error){
            return {
                toHTML(){
                    return error
                }
            }    
        }        
        else{
            return {
                toHTML(){
                    options.children = ''
                    return fn( context, options)
                }
            }    
        }
    }
}

function createObject(json, options) {

    let obj; 

    try{
        obj = JSON.parse(json);
    }
    catch(e){
        try{
            obj =  eval(`( ${json} )`)
        }
        catch(e){
            obj = e
        }
    }
    if(options.fn){
        return options.fn(obj)
    }    
    else{
        return obj
    }
}

Handlebars.registerHelper('controllerType', function (context, options) {

    let _utils = Handlebars.Utils;
    let uid = viewDelegate.getUniqueID()
    let delegate = uid + '.delegate';

    let script = `<script id=${uid}_script>
    ${uid}.delegate = viewDelegate.delegateHolder['${uid}']; 
    delete viewDelegate.delegateHolder['${uid}']
    $("#${uid}_script").remove();
    </script>`

    if (_utils.isFunction(context)) {
        context = context.call(this);
    }

    if (typeof context == 'string') {
        try {
            context = eval('new ' + context);
        } catch (e) {
            try {
                context = eval('machine["' + context + '"]');
            } catch (e) {
                warn(e)
            }
        }
    }
    viewDelegate.delegateHolder[uid] = context

    return delegatePartial(context, options, delegate, uid, script)
});

Handlebars.registerHelper('controller', function (context, options) {

    let _utils = Handlebars.Utils;
    let uid = viewDelegate.getUniqueID()
    let delegate = context;

    if (_utils.isFunction(context)) {
        context = context.call(this);
    }

    if (typeof context == 'string') {
        try {
            context = eval(context);
        } catch (e) {
            try {
                context = eval('machine["' + context + '"]');
            } catch (e) {
                warn(e)
            }
        }
    }

    return delegatePartial(context, options, delegate, uid, '')
});

Handlebars.registerHelper('controllerIndex', function (context, options) {

    let _utils = Handlebars.Utils;
    let uid = viewDelegate.getUniqueID()
    let delegate = context;

    if (_utils.isFunction(context)) {
        context = context.call(this);
    }

    if (typeof context == 'string') {
        let contextHead = context.substring(0, context.lastIndexOf('['));
        let contextIndex = context.substring(context.lastIndexOf('['));
        try {
            context = eval(context);
        } catch (e) {
            try {
                context = eval('machine["' + contextHead + '"]' + contextIndex);
            } catch (e) {
                warn(e)
            }
        }
    }

    return delegatePartial(context, options, delegate, uid, '')
});

Handlebars.registerHelper('repeat', function (context, options) {
    if (!options) {
        throw new _exception2['default']('Must pass iterator to #each');
    }

    var fn = options.fn,
        inverse = options.inverse,
        i = 0,
        ret = '',
        data = undefined,
        contextPath = undefined;

    let _utils = Handlebars.Utils;

    if (options.data && options.ids) {
        contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
    }

    if (_utils.isFunction(context)) {
        context = context.call(this);
    }

    if (options.data) {
        data = _utils.createFrame(options.data);
    }

    function execIteration(field, index, last) {
        if (data) {
            data.key = field;
            data.index = index;
            data.first = index === 0;
            data.last = !!last;

            if (contextPath) {
                data.contextPath = contextPath + field;
            }
        }

        ret = ret + fn(context[field], {
            data: data,
            blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
        });
    }

    if (context && typeof context === 'object') {
        if (_utils.isArray(context)) {
            for (var j = context.length; i < j; i++) {
                if (i in context) {
                    execIteration(i, i, i === context.length - 1);
                }
            }
        } else {
            var priorKey = undefined;

            for (var key in context) {
                if (context.hasOwnProperty(key)) {
                    // We're running the iterations one step out of sync so we can detect
                    // the last iteration without have to scan the object twice and create
                    // an intermediate keys array.
                    if (priorKey !== undefined) {
                        execIteration(priorKey, i - 1);
                    }
                    priorKey = key;
                    i++;
                }
            }
            if (priorKey !== undefined) {
                execIteration(priorKey, i - 1, true);
            }
        }
    } else if (context && typeof context === 'number') {
        for (var j = context; i < j; i++) {
            execIteration(i, i, i === context - 1);
        }
    }

    if (i === 0) {
        ret = inverse(this);
    }

    return ret;
});

Handlebars.registerHelper('concat', function (...args){

    // let options = Object.assign( {}, args[args.length-1])
    let context = args.slice(0,-1)
    let ret = ''
    context.forEach(e=>{
        ret += e;
    })
    return ret
})
Handlebars.registerHelper('widget', createTmplit)
Handlebars.registerHelper('W', createTmplit)
Handlebars.registerHelper('tmplit', createTmplit)
Handlebars.registerHelper('T', createTmplit)
Handlebars.registerHelper('obj', createObject)
Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    } [operator];
});
window.Tmplits = Tmplits
export default Tmplits