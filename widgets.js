class Widgets {
    constructor(fileName, loadedCallback ) {
        this.cache = {}
        this.compiled = {}
        this.raw = '{}'
        this.compinedScript = ''
        this.loadedCallback = loadedCallback
        this.retryScripts = []        
        if (fileName) {
            this.load(fileName)
        }
    }
    refreshDynamicDom() {
        $('[dynamic-template]').each((i, el) => {
            this.refreshDynamicEl(el)
        })
    }

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

    readLibraries(raw) {
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

    getLibraries(libraries, callback) {
        let libraryCount = 0;
        let scope = this
        if(libraries.length == 0){
            next()
        }
        function next() {
            libraryCount++
            if (libraries.length <= libraryCount) {
                if (callback) {
                    callback()
                }
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

    }
    getPages(pages, callback) {
        let scope = this
        let pageCount = 0;

        if(pages.length == 0){
            next()
        }

        function next() {
            pageCount++
            if (pages.length <= pageCount) {
                if (callback) {
                    callback()
                }
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

    }
    retries( callback ){
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
                        this.retries(callback)
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
                    if(callback){
                        callback()
                    }            
                }
            }
        }

        if( this.retryScripts.length > 0 ){
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
   
    }
    loadPage(containerId, pageName, context) {
        var template = this.get(pageName);
        context = context ? context : window            
        console.log(`Loading page: ${pageName}`)
        try{
            $('#' + containerId).html(template(context))
        }
        catch(e){
            $('#' + containerId).html(`<div class="error">Error loading the page '${pageName}' ${e} </div>` )
        }
        WEBHMI.queryDom()
        WEBHMI.updateHMI()
    }

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

    get(partial) {
        if (this.compiled[partial]) {
            return this.compiled[partial];
        }
        // ,{compat:true}
        this.compiled[partial] = Handlebars.compile(this.cache[partial]);

        return this.compiled[partial]
    }

    load(fileName) {
        let scope = this
        $.get(fileName, function (raw) {
            scope.raw = raw
            $(document).on('DOMNodeInserted', function (e) {
                $('[dynamic-template]').not("[dom-added=true]").each((i, el) => {
                    scope.refreshDynamicEl(el)
                })
            });

            scope.getLibraries(raw.libraries, function () {
                scope.getPages(raw.pages, function () {
                    scope.retries(()=>{
                        if(scope.loadedCallback){
                            scope.loadedCallback( raw )
                        }
                    })                    
                })
            })
        });
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

Handlebars.registerHelper('widget', createWidget)
Handlebars.registerHelper('W', createWidget)
Handlebars.registerHelper('obj', createObject)


