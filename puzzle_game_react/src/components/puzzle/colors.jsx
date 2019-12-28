import React,{Component} from "react";

class Color extends Component{
    constructor() {
        super();
        this.state = { 
            color :["red","blue","black","white","green"]
         }
         this.changecolor = this.changecolor.bind(this)
    }
     
    changecolor(e,color){
        console.log("okoko")
        console.log(color)
        var x=   document.querySelectorAll(".tile2, .tile1, .tile3, .tile4, .tile5, .tile6, .tile7, .tile8");
        
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = color;
            } 
    }

   
    render() { 
      const  colordisplay = this.state.color.map(color=>
            <div className={"circle "+color} onClick={(e)=> this.changecolor(e,color)} ></div>
            )
        return (
        <> 
            <div class="color_pallete">
               {
                   colordisplay
               }
            </div>
                
        </> );
    }
}
 
export default Color;