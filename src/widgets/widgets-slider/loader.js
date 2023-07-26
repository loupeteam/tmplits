function WidgetSlider(context, args) {
    let {
        style = '',
            ['data-var-name']: dataVarName,
            inputStyle = '',
            screenScale = 1,
            min = -1,
            max = 1,
            direction = 0,
            ..._args
    } = args.hash

    //Get cleaned values
    let {
        classList,
        attr
    } = cleanArgs(_args)
    classList = classList.concat(['lui-slider-scope', 'slider'])
    inputStyle = `position:relative;width:150%;top:0%;border-style:none;background:transparent;display:none` + inputStyle
    let innerClassList = ['lui-slider-value']
    if (dataVarName) {
        innerClassList.push('webhmi-num-value')
    }
    let inner = '';
    if (args.children) {
        inner += 
        inner += `<invisible-input class='${innerClassList.join(' ')}' value="${context}" style='display:none' ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`
    } else {
        inner = `<invisible-input type='number' min='${min}' max='${max}' class='${innerClassList.join(' ')}' value="${context}" style='${inputStyle}' ${dataVarName?'data-var-name="' + dataVarName +'"':''} ></invisible-input>`
    }

    let bar = document.createElement("div");
    bar.classList.add('slider-bar');
    bar.style.position = "relative";
    bar.style.margin = "0px";
    bar.style.borderRadius = '3px'
    bar.style.zIndex = 100;
    bar.style.opacity = '75%';
    bar.style.float = 'left'
    if(direction){
        bar.style.width = "10%";
        bar.style.height = "100%";
        bar.style.marginLeft = `-10%`;
        bar.style.left = "60%";
        style = 'width:150px;height:40px;position:relative;' + style;
    }
    else{
        bar.style.width = "100%";
        bar.style.top = "40%";
        // bar.style.marginTop = `-10%`;
        bar.style.height = "10%";
        style = 'height:150px;width:40px;position:relative;' + style;
    }

    return `
    <div class="${classList.join(' ')}" direction=${direction} style='${style}' lui-slider-min=${min} lui-slider-max=${max} lui-slider-scale=${screenScale} ${attr}>
        ${bar.outerHTML}
        ${inner}
        <div style='position:absolute;'>
            ${args.children}
        </div>
    </div>
`
}