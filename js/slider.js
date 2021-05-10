function Slider(element){
    this.element=element;
    this.width=800;
    this.height=600;
    this.buttonSize=30;
    this.dotSize=10;
    this.children= Array.from(element.children);
    this.currentIndex=0;
    this.status="holding";

    this.holdTime=this.element.getAttribute("data-hold-time");
    this.holdTime=this.holdTime?parseInt(this.holdTime):1500;
    this.transitionTime=this.element.getAttribute("data-transition-time");
    this.transitionTime=this.transitionTime?parseInt(this.transitionTime):400;

    
    this.timeStep=10;
    this.currentLeft=0;
    this.leftDelta=this.width/(this.transitionTime/this.timeStep);
    this.holdTimeoutHandle=null;
    this.intervalHandle=null;

    //creating the next and previous buttons
    this.nextButton=document.createElement("button");
    this.nextButton.classList="carousel__button carousel__button--next";
    this.prevButton=document.createElement("button");
    this.prevButton.classList="carousel__button carousel__button--previous";
    this.nextButton.textContent=">";
    this.prevButton.textContent="<";
    setElementStyle([this.nextButton,this.prevButton],{
        position:"absolute",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:this.buttonSize+"px",
        height:this.buttonSize+"px",
        borderRadius:"50%",
        fontSize:"1.2em"
    })

    setElementStyle(this.nextButton,{
        top:"50%",
        right:"0px", 
        transform:"translate(-50%,-50%)",

    })
    
    setElementStyle(this.prevButton,{
        top:"50%",
        left:"0px",
        transform:"translate(50%,-50%)"
    })
    this.element.appendChild(this.nextButton);
    this.element.appendChild(this.prevButton);


    //making the position of the parent element relative
    setElementStyle(this.element,{
        position:"relative",
        overflow:"hidden",
    })
    
    //treating all the child elements for look, feel and functionality
    setElementStyle(this.children,{
        width:"100%",
        height:"100%",
        position:"absolute",
        top:"0px",
        left:"0px"
    })
    this.children.forEach((child,index)=>{
        if(index!==this.currentIndex){
            setElementStyle(child,{
                display:"none"
            })
        }
    })

    //makingDots for representation
    this.dotBar=document.createElement("div");
    this.dots=this.children.map((child,index)=>{
            let dotDiv=document.createElement("div");
            setElementStyle(dotDiv,{
                width:this.dotSize+"px",
                height:this.dotSize+"px",
                backgroundColor:"rgba(214, 200, 190,0.5)",
                display:"inline-block",
                borderRadius:"50%",
                marginLeft:"5px",
                cursor:"pointer"
            });
            if(index===this.currentIndex){
                setElementStyle(dotDiv,{
                    backgroundColor:"rgb(199, 0, 57)"
                });
            }
            this.dotBar.appendChild(dotDiv);
            return dotDiv;            
    })
    setElementStyle(this.dotBar,{
        position:"absolute",
        width:"max-content",
        margin:"0 auto",
        left:"0px",
        right:"0px",
        bottom:"5px",
        
    })
    this.element.appendChild(this.dotBar);

    //creating and placing the resize handler to handle the responsiveness;
    this.refreshDimensions=function(){
        this.width=this.element.clientWidth;
        this.height=this.element.clientHeight;
    }

    this.sliding=function(nextIndex,reverse=false){
        let transitionCompltete;        
        this.currentLeft+=reverse?this.leftDelta:-this.leftDelta;
        let currentChild=this.children[this.currentIndex];
        let nextChild=this.children[nextIndex];
        setElementStyle(currentChild,{
            left:this.currentLeft+"px"
            })
        
        if(reverse){
            setElementStyle(nextChild,{
                left:this.currentLeft-this.width+"px"
            })
            transitionCompltete=this.currentLeft-this.width>=0;
        }
        else{
            setElementStyle(nextChild,{
                left:this.currentLeft+this.width+"px"
            })
            transitionCompltete=this.currentLeft+this.width<=0;
        }

        if(transitionCompltete){
            setElementStyle(this.dots[this.currentIndex],{
                backgroundColor:"rgba(214, 200, 190,0.5)",
            })
            setElementStyle(this.dots[nextIndex],{
                backgroundColor:"rgb(199, 0, 57)"
            })
            this.currentIndex=nextIndex;
            setElementStyle(currentChild,{
                display:"none"
            })
            setElementStyle(nextChild,{
                left:"0px",
                top:"0px"
            })
            this.currentLeft=0;
            window.clearInterval(this.intervalHandle);
            this.holdTimeoutHandle=window.setTimeout(this.next.bind(this),this.holdTime);
            this.intervalHandle=null;
            this.status="holding";
        }
    }

    this.slideTo=function(nextIndex,reverse){
        window.clearTimeout(this.holdTimeoutHandle);
        this.refreshDimensions();
        nextIndex=(nextIndex+this.children.length)%this.children.length;
        this.children.forEach((child,index)=>{
            if(index!=this.currentIndex && index!=nextIndex)
            {
                setElementStyle(child,{
                    left: -this.width+"px",
                    display:"none"
                })
            }
            else{
                setElementStyle(child,{
                    display:"block"
                })
            }
            })
        this.status="sliding"
        this.intervalHandle =window.setInterval(this.sliding.bind(this,nextIndex,reverse),this.timeStep);        
    }

    this.dotClick=async function(index){
        let reversed=false;
        let storedDelta=this.leftDelta;
        let dist=Math.abs(this.currentIndex-index);
        if(index<this.currentIndex)reversed=true;
        let delta=reversed?-1:1;
        let curIndex=this.currentIndex;
        this.leftDelta=Math.min(this.leftDelta*dist,50);
        while(curIndex!==index){
            if(this.status==="holding")
            this.slideTo(this.currentIndex+delta,reversed);
            await sleep(this.timeStep*(this.width/this.leftDelta)+10);
            curIndex+=delta;
        }
        this.leftDelta=storedDelta;
    }

    this.next=function(){
        if(this.status==="holding")
        this.slideTo(this.currentIndex+1);
    }


    this.previous=function(){
        if(this.status==="holding")
        {
            this.slideTo(this.currentIndex-1,true);
        }
    }

    
    this.dots.forEach((dot,index)=>{
        dot.addEventListener("click",this.dotClick.bind(this,index));
    })
    this.nextButton.addEventListener("click",this.next.bind(this))
    this.prevButton.addEventListener("click",this.previous.bind(this))

    this.holdTimeoutHandle=window.setTimeout(this.next.bind(this),this.holdTime);


}