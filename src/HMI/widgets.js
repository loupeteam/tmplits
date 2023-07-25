
class Widgets {
    constructor(node_module_directory, loadedCallback ) {
        
        //Get any base element from the page
        this.base = node_module_directory

        this.cache = {}
        this.compiled = {}
        this.raw = '{}'
        this.compinedScript = ''
        this.retryScripts = []
        this.loadPackageLockJson(this.base + '../package-lock.json')
        .then(()=>{return this.loadPackageJson(this.base + '../package.json')})
        .then(()=>{return this.loadJson(this.base + '../widgets.json')})
        .then(()=>{return this.getLibraries(this.libraries)})
        .then(()=>{return this.getPages(this.pages)})
        .then(()=>{return this.retries()})
        .then(()=>{return loadedCallback(this.native)}) 
    }

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
                console.log(`imported ${id} successfully`);
                Object.assign(window, ns);
            }).catch(()=>{
                console.log(`import failed ${id}, will retry..`)
            })
        }
        catch(e){
            console.log(`import failed ${el.id}, will retry..`)
        }                  
    }

    //This function reads the libraries and adds each item with the type='text/x-handlebars-template'
    //to the cache
    //it also adds the scripts to the compinedScript
    readLibraries(raw) {
        console.log('processing libraries' )
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
                    scope.compinedScript += el.innerHTML + '\n'
                    console.log(`loading script ${el.id}`);
                    const encodedJs = encodeURIComponent(el.innerHTML);
                    const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
                    try{
                        import(dataUri).then(ns => {
                            console.log(`imported ${el.id} successfully`);
                            Object.assign(window, ns);
                        }).catch(()=>{
                            console.log(`import failed ${el.id}, will retry..`)
                            scope.retryScripts.push(el)                        
                        })
                    }
                    catch(e){
                        scope.retryScripts.push(el)                        
                        console.log(`import failed ${el.id}, will retry..`)
                    }                                      
                }
            });
        }
    }

    //This function loads all the libraries that were found
    //it resolves the libraries then processess them by compiling them
    //and adding them to the cache
    getLibraries(libraries) {

        let scope = this
        let chain = new Promise((resolve, reject)=>{          
            console.log('loading libraries')
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
                        console.log( 'error loading library ' + error )
                        next()                    
                    })
            }

            libraries.forEach(element => {
                fetch(element)
                    .then(processPartial)
                    .catch(error => {
                        console.log( 'error loading library ' + error )
                        next()
                    });
            });
        })
        return chain

    }

    //This function loads all the template pages that were found
    //it resolves the pages then processess them by compiling them
    //and adding them to the cache
    getPages( pagesObj ) {        
        let scope = this
        let chain = new Promise((resolve, reject)=>{          
            console.log('loading pages')
            let pageCount = 0;

            //go throught pages object members and add each to an array of pages
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
                fetch(element.file)
                    .then((data)=>{
                        data.text()
                        .then((partial) => {
                            processPartial(element, partial)
                        })
                    })
                    .catch(error => {
                        console.log('failed to get page: ' + error);
                        next()
                    });
            });

            pages.forEach(element => {
                if(element.script){
                    $.getScript(element.script, function() {
                        console.log(`loaded script ${element.script}`);
                    });
                }
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
                            console.log(`failing: ${el.id}`);
                            import(dataUri).then(ns => {
                                Object.assign(window, ns);
                            })
                        })            
                        resolve()
                    }
                }
            }

            if( this.retryScripts.length > 0 ){
                console.log('retrying to load scripts' )
                this.retryScripts.forEach((el)=>{
                    try{
                        const encodedJs = encodeURIComponent(el.innerHTML);
                        const dataUri = 'data:text/javascript;charset=utf-8,' + encodedJs;
                        console.log(`retrying: ${el.id}`);
                        import(dataUri).then(ns => {
                            Object.assign(window, ns);
                        })
                        .then(()=>{
                            next()                    
                        })
                        .catch((error)=>{
                            console.log('failed to parse script, will retry: ' + error);
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
        console.log(`Loading page: ${pageName}`)
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
        WEBHMI.queryDom()
        WEBHMI.updateHMI()
    }

    //This function pushes a template to a container
    //and updates the HMI
    pushTemplate(container, template, context) {
        console.log(`Pushing template: ${template}`)
        var template = this.get(template);
        context = context ? context : window
        try{
            $(container).html(template(context))
        }
        catch(e){
            $(container).html(`<div class="error">Error loading the template '${template}' ${e} </div>`)
        }
        WEBHMI.queryDom()
        WEBHMI.updateHMI()
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
            console.log('loading ' + fileName)
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
                    e.file = scope.base + e.file
                    e.source = fileName
                    scope.libraries.push(e)
                })
                resolve();
            }).fail(()=>{
                console.log(fileName + ' not found, may not load all widgets')
                resolve();
            });
        })
        return chain

    }

    //This function loads a package json and finds the packages installed in 
    //@loupeteam/widgets/ and loads them into pages
    //Then it searches for loader.js and runs it for each package
    loadPackageJson( name ){
        let scope = this
        let chain = new Promise((resolve, reject)=>{
            $.get( name, function (raw) {
                console.log('loading ' + name)
                scope.package = raw
                //Search through the package.json for @loupeteam/widgets/*
                //by going through iterating through each member of the dependcy object
                //and adding the package to the libraries and pages
                scope.pages = scope.pages ? scope.pages : [];
                scope.loaderScripts = scope.loaderScripts ? scope.loaderScripts : [];
                for( let dep in raw.dependencies ){
                    if( dep.startsWith('@loupeteam/widgets-') ){
                        //Add the package to the pages where the name is the package name withouth the @loupeteam/widgets/
                        //and the file is the library.handlebars
                        let name = dep.replace('@loupeteam/widgets-', '');
                        scope.pages[name] = {
                            name: dep.replace('@loupeteam/widgets-', ''), 
                            file:  this.base + dep + '/library.handlebars',
                            script: this.base + dep + '/loader.js',
                            source: name
                        } 
                    }
                    
                }    
                resolve();
            }).fail(()=>{
                console.log('package.json not found, may not load all widgets')
                resolve();
            });      
        })
        return chain
    }
    
    //This function loads a package-lock json and finds the packages installed in 
    //@loupeteam/widgets/ and loads them into pages
    //Then it searches for loader.js and runs it for each package
    loadPackageLockJson(name){
        let scope = this
        let chain = new Promise((resolve, reject)=>{
            console.log('loading ' + name)
            $.get(name, function (raw) {
                scope.packageLock = raw
                //Search through the package.json for @loupeteam/widgets/*
                //by going through iterating through each member of the dependcy object
                //and adding the package to the libraries and pages
                scope.pages = scope.pages ? scope.pages : [];
                scope.loaderScripts = scope.loaderScripts ? scope.loaderScripts : [];
                for( let dep in raw.packages ){
                    if( dep.startsWith('node_modules/@loupeteam/widgets-') ){
                        //Add the package to the pages where the name is the package name withouth the @loupeteam/widgets/
                        //and the file is the library.handlebars
                        if( dep.replace('node_modules/@loupeteam/widgets-', '').indexOf('/') == -1 ){                        
                            let name = dep.replace('node_modules/@loupeteam/widgets-', '');
                            scope.pages[name] = {
                                name: name,
                                file: dep.replace('node_modules/','') + this.base + '/library.handlebars',
                                script: dep.replace('node_modules/','') + '/loader.js',
                                source: name
                            } 
                        }
                    }
                }    
                resolve();
            }).fail(()=>{
                console.log('package-lock.json not found, may not load all dependent widgets')
                resolve()
            });                 
        })
        return chain
    }
}

class viewDelegate {
    constructor() {}
    //     static observer = new MutationObserver(function (mutations) {
    // 		// Was a new webhmi element added to the DOM?
    // 		// Use Arrray.some() instead of Array.forEach() for easy loop break when we find a webhmi element added or remove from DOM
    //         let nodes = new Array()
    // 		mutations.forEach(function (mutation) {
    // 			// check added nodes for webhmi changes
    // 			mutation.addedNodes.forEach(function (node) {
    // 				if (node.nodeType == node.ELEMENT_NODE) {
    // 					// check elem, check descendents
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
                    WEBHMI.queryDom()
                    WEBHMI.updateHMI()
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

function createWidget(widget, ...args) {

    let options = Object.assign( {}, args[args.length-1])
    options.name = widget
    let context = args.slice(0,-1)
    
    try{
        var fn = eval('Widget'+widget)
    }
    catch(e){
        try{
            fn = eval(widget)
            console.warn('Widgets names should prepend "Widget" to their name for clarity');
        }
        catch{
            var error = `<div class='error'>could not find widget ${widget}</div>`
        }
    }

    if( typeof fn != 'function'){
        var error = `<div class='error'>could not find widget ${widget}</div>`
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
                console.log(e)
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
                console.log(e)
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
                console.log(e)
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
                    // an itermediate keys array.
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
Handlebars.registerHelper('widget', createWidget)
Handlebars.registerHelper('W', createWidget)
Handlebars.registerHelper('obj', createObject)


export default Widgets