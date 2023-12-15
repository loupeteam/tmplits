import 'openbridge-web-components';


function updateParameter(object, key, value) {
    
    if (typeof value === 'string') {
        object[key] = machine.value(value) | 0;
        return
    }

    if (typeof value === 'object' && value['data-var-name']) {
        let {
            ['data-var-name']:dataVarName,
            machine = 'machine'
        } = value;
        let localMachine = window[machine];

        if( typeof localMachine.value(dataVarName) === 'undefined' ){
            localMachine.initCyclicRead(dataVarName);
        }
        else{
            object[key] = localMachine.value(dataVarName) | 0;
        }
    }
}

LUX.on({
    'update-hmi': () => {
        document.querySelectorAll('[data-map]').forEach((el) => {
            let mapping = el.dataMapObject;
            if (!mapping) {
                mapping = el.getAttribute('data-map');
                mapping = mapping.replace(/'/g, '"');
                mapping = JSON.parse(mapping);
                el.dataMapObject = mapping;
            }
            for (let key in mapping) {
                updateParameter(el, key, mapping[key]);
            }
        });
    }
})
