import { createApp } from 'vue';
import NstTimeLine from "./assets/nstTimeLine.vue";

import SVGInject from '@iconfu/svg-inject';


import { nstLib } from './nstLib';
import curInfNst from './MediaAssets/cursor_info_nst.json';


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
    this.appTL = createApp(NstTimeLine,{
      homeUrl: this.homeUrl
    });
    
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
          left:250px;top:30px;
          background-color:orange;"
          onclick="$('#dA').css('left',parseInt(100.00*Math.random()));$('#dA').css('top',parseInt(100.00*Math.random()));"
          >
          dA</div>

      <div 
        id="dB"
        style="width:20px;height:20px;position:fixed;
          left:200px;top:30px;
          background-color:brown;"
          onclick="setOpts.Dragging_start(this,e=>{
             //console.log('dragg',e);
             $('#dB').css('left',e.cXY[0]);
             $('#dB').css('top',e.cXY[1]);
          });"
          >
          dB</div>



      <div 
        id="dDivSvg"
        style="position:fixed;
          left:360px;top:30px;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          " 
          onclick="setOpts.Dragging_start(this,e=>{
             //console.log('dragg',e);
             $('#dDivSvg').css('left',e.cXY[0]);
             $('#dDivSvg').css('top',e.cXY[1]);
          });"
          > </div>

         
    <!--
      <div 
        id="dDivCurInfo"
        class="containerSvg"
        onclick="setOpts.Dragging_start(this,e=>{
              //console.log('dragg',e);
              $('#ciX').html('X: '+e.cXY[0]);
              $('#ciY').html('Y: '+e.cXY[1]);
              $('#dDivCurInfo').css('left',e.cXY[0]);
              $('#dDivCurInfo').css('top',e.cXY[1]);
          });"
        >
        </div>
        
        
        -->
        <img style="position:fixed;left:50;top:0;pointer-events:none;" 
            id="dDivCurInfo"
            src="${this.homeUrl}MediaAssets/cursor_info.svg"
          onload="console.log('svgd onload');"
        >


  

    </div>
    
    <div id="appTl"></div>

    `;

  }


  setMouseTrack = ( event ) => {
  
    let mouseX = event.clientX;
    let mouseY = event.clientY;

    $('#ciX').html('X: '+mouseX);
    $('#ciY').html('Y: '+mouseY);

    $('#dDivCurInfo').css({
      'left': mouseX-25,
      'top': mouseY-50,
    });

  }


  onKeypress = ( keyCode ) => {
    

    if( keyCode.key == '?' ){
      console.log(`Node Stop Time - help
? - help
m - cursor info status: [${this.curInfo}]
+ - insert current properties as key frame for selected
      
        `);

    }else if( keyCode.key == '+' ){
      console.log('make key frame by key press (+)');
      let ctx = this.appTL._instance.ctx;
      ctx.onAddKeyFrame();
      ctx.nstTimeSlideInput_focus();
      $.toast('Key frame inserted !');

    }else if( keyCode.key == 'm' ){

      console.log('move cursor info',keyCode.clientX);
      if( this.curInfo == undefined  ) this.curInfo = false;
      this.curInfo = !this.curInfo;

      if( this.curInfo == true ){
        document.body.addEventListener('mousemove', this.setMouseTrack);
        this.Tlci.reset();
        this.Tlci.play();
      }else{
        this.Tlci.reverse();
        setTimeout(()=>
          document.body.removeEventListener('mousemove', this.setMouseTrack),
          1500
        );
      }

    }

  }



  onSvgInjectionDone=()=>{
    // build node stop time START
    this.nstLibO = new nstLib();
    let TlRes = this.nstLibO.getTimeline_FromJsonData( curInfNst );
    this.Tlci = TlRes.timeLine;
    this.Tlci.reset();
    console.log('svgd time line ready ....');
      // build node stop time END
  }


  getHtmlAfterLoad = () =>{
    cl(`${this.getName} - getHtmlAfterLoad()`);

    /*
    $.get( `${this.homeUrl}MediaAssets/osdMapTest1.svg`, function( data, status ){
        siteByKey.s_multiSVGPage.o.mulSvgParseGet( data  , status, false, '#dDivSvg' );
      });
    */

    setTimeout(()=>{
      console.log('svgd on inject ...',curInfNst);
      SVGInject(document.getElementById( 'dDivCurInfo' ),{
        'useCache': false,
        'makeIdsUnique':false,
        'copyAttributes':true,
        'onAllFinish':()=>{
          $('#ciX').html('X - - - ');
          $('#ciX').attr('x',parseInt($('#ciX').attr('x')));
          //aajs.animate('#dDivCurInfo',{opacity:0,duration:0});
          this.onSvgInjectionDone();

        }
      });

      


      /*$('#ciX').html('X: '+e.cXY[0]);
      $('#ciY').html('Y: '+e.cXY[1]);
      $('#dDivCurInfo').css('left',e.cXY[0]);
      $('#dDivCurInfo').css('top',e.cXY[1]);
      */
          
    },20);

    /*
    $.get( `${this.homeUrl}MediaAssets/cursor_info.svg`, function( data, status ){
      //siteByKey.s_multiSVGPage.o.mulSvgParseGet( data  , status, false, '#dDivCurInfo' );
      let d = data.childNodes[1];
      $('#dDivCurInfo').html( d );//.childNodes[1] );
      
    });
      */


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
