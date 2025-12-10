import { createApp } from 'vue';
import NstTimeLine from "./assets/nstTimeLine.vue";

import SVGInject from '@iconfu/svg-inject';


import { nstConvert, nstLib } from './nstLib';
import curInfNst from './MediaAssets/cursor_info_nst.json';


/**  */
function mkTrashHold( keyIdent, func, msTrash ){
  let t = Date.now();
  console.log(`mkTH spon \n\tkeyIdent[${keyIdent}], func, msTrash[${msTrash}]`);

  if( !('trashH' in window) ){
    window['trashH'] = {
      entryDate: t,
      items: {}
    };
  }

  if( keyIdent in window['trashH']['items'] ){
    let item = window['trashH']['items'][ keyIdent ];
    clearTimeout( item.iter );
    item.tEvents.push( t );
    item.iter = setTimeout(()=> {
      console.log(`mkTrashHold ok for keyIdent: [${item.keyIdent}] events:(${item.tEvents.length})`);
      func(); 
      delete window['trashH']['items'][ keyIdent ];
    }, msTrash );
    return 2;

  }



  window['trashH']['items'][ keyIdent ] = {
    'keyIdent': keyIdent,
    'func': func,
    'tStart': t,
    'tEvents': [],
    'msTrash': msTrash,
    'iter': setTimeout(()=>func() , msTrash )
  };

  return 1;
}




class site{

  constructor(){
    console.log('* * 8 8 initated ! c_site ...................... running MODE['+import.meta.env.MODE+']');



    console.log(`-------------------------
      inject mkTrashHold ---------------`);
    window['mkTrashHold'] = mkTrashHold;




   
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
          left:82px;top:17px;
          background-color:orange;"
          onclick="$('#dA').css('left',parseInt(100.00*Math.random()));$('#dA').css('top',parseInt(100.00*Math.random()));"
          >
          dA</div>

      <div 
        id="dB"
        style="width:20px;height:20px;position:fixed;
          left:109px;top:17px;
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
          onload="console.log('svgd onload - cursor_info');"
        >
        <img style="position:fixed;left:50;top:0;pointer-events:none;opacity:0;" 
            id="dDivAngInfo"
            src="${this.homeUrl}MediaAssets/angle_info.svg"
          onload="console.log('svgd onload - angle_info');"
        >


  

    </div>
    
    <div id="appTl"></div>

    `;

  }



  onWindowResize=( w, h)=>{
    setTimeout(()=> this.appTL._instance.ctx.onWindowResize( w, h ), 1);
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
    window['nstLastKey'] = keyCode;
    let focusOn = document.activeElement;
    console.log('focuse on ['+focusOn.tagName+']');
    if( ['INPUT','TEXTAREA' ].indexOf( focusOn.tagName ) != -1 ) return 1;


    if( keyCode.key == '?' || keyCode.key == 'h' ){
      console.log(`Node Stop Time - help
? | h - help
m - cursor info status: [${this.curInfo}]
l - like cursor inspector
+ - insert current properties as key frame for selected

## Manipulators:
Select node by Id then:

g - to grab / move it with mouse
r - to rotate in spot by mouse
s - TODO

q - to Cancel

      
        `);

    }else if( keyCode.key == 'l' ){
      console.log('make cursor like inspector .... (o)');
      this.appTL._instance.ctx.onSelectNodeFromDome();

    }else if( keyCode.key == '+' ){
      console.log('make key frame by key press (+)');
      let ctx = this.appTL._instance.ctx;
      ctx.onAddKeyFrame();
      ctx.nstTimeSlideInput_focus();
      $.toast('Key frame inserted !');
    
    }else if( keyCode.key == 'q' ){
      
    }else if( keyCode.key == 'r' ){
      let oTargetId = this.appTL._instance.ctx.$data.divFindName;
      let propSel = this.appTL._instance.ctx.$data.propertiesSelected;
      console.log('propSel now ',propSel);
      if( propSel.indexOf( 'transform') == -1 ) propSel.push('transform');
      
      if( oTargetId == '' ) return 1;
      let oTarget = $('#'+oTargetId);
      let orgPos = nstConvert.matrixTo( oTarget.css('transform') );
      //{
       // 'rotate': oTarget.attr('tran')!='none'?oTarget.attr('rotate'):0
      //};
      oTarget.attr('orgPos', orgPos );
      
      let pStart = null;      
      let onMove = ( e ) =>{
        if( pStart == null ){
          pStart = [ e.pageX, e.pageY ];
          aajs.animate( '#dDivAngInfo', { 'opacity':1, 'left': e.pageX-50, 'top': e.pageY-50, duration: 500 } );
        }
        
        let angle = nstConvert.calculateAngle( pStart[0], pStart[1], e.pageX, e.pageY );
        
        //console.log('rotate it to: ',angle, ' org ', orgPos.rotate);
        
        //aajs.animate('#angInfoP', {'rotate': angle, duration:2});
        rotateSvgSetRC( "anglePointMouse", "angInfoCenter",  angle );
        rotateSvgSetRC( "angInfoB", "angInfoCenter", orgPos.angle + angle );
        $('#angInfStr').html(`< ${orgPos.angle + angle}\``);
        $('#angInfStrShadow').html(`< ${orgPos.angle + angle}\``);
        $('#angInfStr2').html(`${angle}\``);
          
        aajs.animate('#'+oTargetId, {'rotate': orgPos.angle + angle, duration:1} );
      };

      document.body.addEventListener('mousemove', onMove );
      document.body.addEventListener('mouseup',e=>{
        console.log('ok rotate done!');
        document.body.removeEventListener('mousemove', onMove );
        aajs.animate( '#dDivAngInfo', { 'opacity': 0, duration: 500 });
        if( nstLastKey.key == 'q' ){
          aajs.animate('#'+oTargetId, {'rotate': orgPos.angle,duration:500} );
          
        }
      });
      

    }else if( keyCode.key == 'g' ){
      let oTargetId = this.appTL._instance.ctx.$data.divFindName;
      if( oTargetId == '' ) return 1;
      let oTarget = $('#'+oTargetId);
      let orgPos = {
        'left':oTarget.css('left'),
        'top':oTarget.css('top')
      };
      oTarget.attr('orgPos', orgPos );
      
      let propSel = this.appTL._instance.ctx.$data.propertiesSelected;
      console.log('propSel now ',propSel);
      if( propSel.indexOf( 'left') == -1 ) propSel.push('left');
      if( propSel.indexOf( 'top') == -1 ) propSel.push('top');
      

      let pStart = null;
      setOpts.Dragging_start(oTarget,e=>{
          //console.log('dragg',e);
          if( pStart == null ){
            pStart = [ 
              parseInt( oTarget.css('left').replaceAll('px','')) -e.cXY[0] , 
              parseInt( oTarget.css('top').replaceAll('px','')) -e.cXY[1] ];
          }
          oTarget.css('left',pStart[0]+e.cXY[0]);
          oTarget.css('top', pStart[1]+e.cXY[1]);
      }, onDone => {
        if( nstLastKey.key == 'q' ){
          aajs.animate('#'+oTargetId, {'left':orgPos.left, 'top':orgPos.top, duration: 500 } );
        }
      });

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

      SVGInject(document.getElementById( 'dDivAngInfo' ),{
        'useCache': false,
        'makeIdsUnique':false,
        'copyAttributes':true,
        'onAllFinish':()=>{
          //$('#ciX').html('X - - - ');
          //$('#ciX').attr('x',parseInt($('#ciX').attr('x')));
          //aajs.animate('#dDivAngInfo',{opacity:1,duration:0});
          //this.onSvgInjectionDone();

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
