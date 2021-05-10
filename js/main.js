let sliderElements=document.querySelectorAll(".auto-carousel");
let sliders=sliderElements.forEach((element)=>{
    return new Slider(element);
})