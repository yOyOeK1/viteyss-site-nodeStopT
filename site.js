import { createApp } from 'vue';
import NstTimeLine from "./assets/nstTimeLine.vue";

class site{

  constructor(){
    console.log('* * 8 8 initated ! c_site ...................... running MODE['+import.meta.env.MODE+']');

  }
  
  get getName(){
    return `Node Stop Time`;
  }
    
  
  get getDefaultBackgroundColor(){
    return "#ffffff";
  }
  
  getHtml = () => {
    this.appTL = createApp(NstTimeLine,{});
    
    return `
    <!--
    <b>${this.getName}</b><br>
    <img src="${this.homeUrl}assets/ico_viteyss_32.png"><br>
    This is a npm package<br>
    viteyss-site-nodeStopT<br>
    <pre>
    In Menu: ${this.getName}
    Home url: ${this.homeUrl}
    Ver: ${this.instanceOf.ver}

    More ditails in \`./site.json\`
    </pre>-->
    <div 
      id="nstCanvas">
      <div 
        id="dA"
        style="width:20px;height:20px;position:fixed;
          left:250px;top:20px;
          background-color:orange;"
          onclick="$('#dA').css('left',parseInt(100.00*Math.random()));$('#dA').css('top',parseInt(100.00*Math.random()));"
          >
          dA</div>

      <div 
        id="dB"
        style="width:20px;height:20px;position:fixed;
          left:200px;top:20px;
          background-color:brown;"
          onclick="setOpts.Dragging_start(this,e=>{
             //console.log('dragg',e);
             $('#dB').css('left',e.cXY[0]);
             $('#dB').css('top',e.cXY[1]);
          });"
          >
          dB</div>

    </div>
    
    <div id="appTl"></div>

    `;

  }

  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);

    this.appTL.mount('#appTl');
  }

  get svgDyno(){
    return '';
  }

  svgDynoAfterLoad(){

  }

  onMessageCallBack = ( r ) => {
    cl( `${this.getName} [cb] - got msg `);

  }

}

export { site as s_vysnodeStopTPage };
