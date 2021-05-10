/*
    this function takes in an object of react like css styling and applies them to
    the specified element 
    arguments:
            elements: A single dom element or an array of dom elements to which style is to 
            be applied
            style: a javascript object with react like syntax  specifying the style to be applied

*/
function setElementStyle(elements,style){

    //if a single element is provided convert that to an array with single element
    if(!Array.isArray(elements))
    elements=[elements];


    elements.forEach(element => {
        var keys=Object.keys(style);
        keys.forEach(key=>{
            element.style[key]=style[key];
        })
    });

}

function sleep(millis) {  
    return new Promise(resolve => setTimeout(resolve, millis));  
 }