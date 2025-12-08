
import {animate as ajsanimate } from 'animejs';
import { createTimeline as ajscreateTimeline } from 'animejs/timeline';


let nstMediaExtensions = [ '.jpg', '.png', '.gif', '.svg', '.html' ];


class nstLib{
    constructor( ){
        this.metadata = {

        };

    }

    getTimeline_FromJsonData ( jData ) {
        
        let layers = jData.layers;
        let metadata = jData.metadata;

        let tr = [];
        let tl = ajscreateTimeline({
            autoplay:false,
            ease: 'linear',
            //duration: metadata.framesTotalMs,
            //onUpdate:self=>{
            //    console.log('R/tik @ ',self._currentTime+' ms.');
           //}
        });
        //tl.fps = metadata.fps;
        //tl.duration = metadata.framesTotalMs;

        
        //layers.forEach( layer =>{
        for( let layer of layers ){
            let divName = layer.divName;
            let propName = '';
            let propVal = '';
            let animOpts = '';
            let frameLast = 0;
            let optLast = -1;
            let vLast = -1
            
            layer.kFrames.forEach( kf => {
                propName = kf.name;
                frameLast = 0;
                vLast = -1;

                kf.keys.forEach((v,i)=>{
                    propVal = v;
                    animOpts = kf.lHelpers[ i ];
                    let tStart = i * metadata.frameMs;
                    
                    let opt = {};

                    if( animOpts==null){

                    }else if( animOpts.type == 'set' ){

                        opt[ propName ] = propVal;
                        delete opt['duration'];
                        delete opt['composition'];

                        // 
                        if( animOpts.onBegin != '' ) opt['onBegin'] = eval( ` self => { ${ animOpts.onBegin } } ` );
                        if( animOpts.onComplete != '' ) opt['onComplete'] = eval( ` self => { ${ animOpts.onComplete } } ` );


                        //debugger
                        tl.set( divName, opt, tStart );

                    }else if( animOpts.type == 'animate' ){
                        
                        tStart = (frameLast) * metadata.frameMs+1;
                        opt = JSON.parse( JSON.stringify( animOpts ) );
                        delete opt['type'];
                        opt['duration'] = (i-frameLast) * metadata.frameMs-1;

                        let vfrom = '';
                        let vto = propVal;
                        if( vLast == -1 ) {
                            vfrom = vto;
                        }else{
                            vfrom = vLast;
                        }

                        opt[ propName ] = {
                            'from': vfrom,
                            'to': vto
                        };

                        if( opt.onBegin == '' || opt.onBegin == undefined ) delete opt['onBegin'];
                        else opt.onBegin = eval( ` self => {${opt.onBegin}}` );
                        if( opt.onComplete == '' || opt.onComplete == undefined ) delete opt['onComplete'];
                        else opt.onComplete = eval( ` self => {${opt.onComplete}}` );

                        
                        tl.add( divName, opt, tStart );
                    }

                    if( animOpts != null ){
    
                        tr.push( { tStart: tStart,
                            opt: opt,
                            animOpts: animOpts
                        } );

                        frameLast = i;
                        vLast = propVal;

                    }

                });



            });


        }

        return { trDebug:tr, timeLine: tl };
    }

    layers_toStr( layers, metadata ) {
        let tr = JSONcopy( layers );
        let cMeta= {};

        tr.forEach( l => {
            l['obj'] = ''; 
            l['nodeObservator'] = null;
        });    
        Object.keys( metadata ).forEach( k => 
            cMeta[ k ] = ( k == 'timeLine' ) ? -1 :  metadata[ k ]
        );

        return {
            metadata: cMeta,
            layers: tr
        };

    }

    layres_from_json ( jLayers ){

    }




}




function nstAsset_onload( atype, idd, objThis, positionByDrag = true ){
    let idde = document.getElementById( idd );
    
    if( 0 )console.log('nstAsset_onload ok idd  type:['+atype+'] idd: ['+idd+'] node:[',idde,']');

    if( idde == 'null' || idde == null  ){
        console.log('EE soft -- nstAsset_onload \n',
            'asset is not load in dome but its call onload :/ try later ....'
        );

        setTimeout(()=>{
            nstAsset_onload( atype, idd, objThis, positionByDrag);
        },500);

        return -1;
    }



    if( atype == '.svg' )
        SVGInject( objThis, { 'useCache': false, 'makeIdsUnique':false, 'copyAttributes':true,
            'onAllFinish':()=>{
                $('#'+idd).css(
                    'left',  
                    parseInt($('#'+idd).css('left').replaceAll('px',''))+1
                );
                aajs.animate('#'+idd,{opacity:1,duration:100});

        }});
    else if( nstMediaExtensions.indexOf( atype ) != -1 ){
        aajs.animate('#'+idd,{opacity:1,duration:100});

    }


    if( positionByDrag == true )
        setTimeout(()=>{
            setOpts.Dragging_start( $('#'+idd), e=>{
                $('#'+idd).css('left',e.cXY[0]);
                $('#'+idd).css('top',e.cXY[1]);
            },e2=>{
                nstSvgAsset_onDragEnd(idd, e2);
            });
        },100);
}

function nstSvgAsset_onDragEnd( idd, e2 ){
    console.log('drag done ',idd,'\ne',e2);

    let obj = $('#'+idd);
    let assets = pager._page.appTL._instance.ctx.$data.metadata.assets;
    
    let idAs = assets.findIndex( a => a.id === idd );
    if( idAs == -1 )
        return -1;

    assets[ idAs ]['props']= {
        'top': obj.css('top'),
        'left': obj.css('left'),
        'opacity': obj.css('opacity'),
        'position': obj.css('position')
    }; 

}


async function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // FileReader.result will contain the data URL (e.g., data:image/png;base64,...)
      // We extract the Base64 part after the comma.
      resolve(reader.result.split(',')[1]); 
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(blob); // This initiates the asynchronous read operation
  });
}


async function nstImportAsset( pay ){
    console.log('onAI pay:\n', pay);
    
    let src = '';
    let getExtLost = '';
    if( pay.src.startsWith('data:image/') )
        src = pay.src;
    else if( pay.src.startsWith('http') )
        src = pay.src;
    else
        src = pay.homeUrl+pay.src;
    let idd = pay.id;
    let drapToPlace = false;
    //let doSvgInject = true;
    
    // first load of asset Not resum / load
    if( !pay.src.startsWith('data:image/') && pay.assetSrc == 'http' && pay.addToAssets == 'bakeIn' && pay.props.left == null ){
        let assData = await fetch( `${src}` ); 
        if( !assData.ok ){
            console.error('EE when fetch assets \n',assData.status);
            return -1;  
        } else{
            let rBlob = await assData.blob();
            let asb64 = await blobToBase64( rBlob );
            //console.log('got asset\n',rStr);
            getExtLost = src.substring( src.lastIndexOf('.') );
            src = `data:${rBlob.type};base64,`+asb64;
            pay['orgSrc'] = pay.src;
            pay['ext'] = getExtLost;
            pay.src = src;

            
        }
    }
    // first load of asset Not resum / load END

    // first load of asset Not resum / load local START
    if( pay.src == '' && pay.assetSrc == 'localFile' && pay.props.left == null ){
        src = pay.fileData.b64;
        pay.src = pay.fileData.b64;
        delete pay.fileData.b64;
        //doSvgInject = false;
        
    }
    // first load of asset Not resum / load local END


    if( pay.props.left == null ){
        pay.props.left = 0;
        drapToPlace = true;
    }
    let propsStyle = '';
    for(let p of Object.keys( pay.props ) )
        propsStyle+= p+':'+pay.props[p]+';';

    let srcExt = '';
    if( pay.assetSrc == 'http' && pay.addToAssets == 'linked' ){
        srcExt = pay.src.substring( pay.src.lastIndexOf('.') );        
    }else  if( pay.assetSrc == 'http' && pay.addToAssets == 'bakeIn' ){
        srcExt = pay['ext'];       
    }
   
    
    if( 
        ( pay.assetSrc == 'http' && nstMediaExtensions.indexOf( srcExt ) != -1 )
        //|| 
        //doSvgInject == true
        
    ){
        // pointer-events:none;
        let tr = `<img style="${propsStyle}" 
        id="${idd}"
        src="${src}"
        onload="nstAsset_onload('${srcExt}','${idd}', this, ${drapToPlace});">`;
        $('body').append( tr );

    }

    else if( 
        ( pay.assetSrc == 'localFile' && pay.fileData.ext == '.html' )        
    ){
        // pointer-events:none;
        let tr = `<div style="${propsStyle}padding:5px;" 
            id="${idd}" >`+
            atob(src.split('ta:text/html;base64,')[1]).replaceAll('##this.homeUrl##', pay.homeUrl)+
            `</div>`;
        $('body').append( tr );
        setTimeout(()=> {
            nstAsset_onload(pay.fileData.ext, idd, undefined, drapToPlace);
            },100 );

    }


    else if( 
        ( [ 'localFile', 'http' ].indexOf( pay.assetSrc ) != -1 && nstMediaExtensions.indexOf( pay.fileData.ext ) != -1 )        
    ){
        // pointer-events:none;
        let tr = nstConvert.dataToNodeStr( propsStyle, idd, src, pay.fileData.ext, drapToPlace );/*`<img style="${propsStyle}" 
        id="${idd}"
        src="${src}"
        alt="pay.fileData.name not loaded :("
        onload="nstAsset_onload('${pay.fileData.ext}','${idd}', this, ${drapToPlace});">`;*/
        $('body').append( tr );

    }
    
   return [0,pay];
}

var nstConvert = {
    'dataToNodeStr': ( propsStyle, id, src, ext, drapToPlace ) => {
        return `<img style="${propsStyle}" id="${id}" src="${src}"
            alt="Error loading media :(  id:[${id}]  ext:[${ext}] src:[${src.substring(0,50)}...] not loaded :("
            onload="nstAsset_onload('${ext}','${id}', this, ${drapToPlace});">`;
    },
    'matrixTo': ( matrixI )=>{
        let tr = {
            'scale': 1.0, 'angle': 0
        };
        console.log('nst. matrix To got ['+matrixI+']');
        if( matrixI == undefined || matrixI == 'none' ) return tr;

        matrixI = matrixI.split('(')[1];
        matrixI = matrixI.split(')')[0];
        matrixI = matrixI.split(',');
        let a = matrixI[0];
        let b = matrixI[1];
        let c = matrixI[2];
        let d = matrixI[3];
        let e = matrixI[4];
        let f = matrixI[5];
        
        tr[ 'scale' ] =  Math.sqrt( a*a + b*b );
        tr[ 'angle' ] = Math.round( Math.atan2( b, a ) * ( 180/ Math.PI ) );
        
        return tr;
    },

    'calculateAngle':(x1, y1, x2, y2) => {
        let dy = y2 - y1;
        let dx = x2 - x1;
        let angleRadians = Math.atan2(dy, dx);
        let angleDegrees = angleRadians * (180 / Math.PI);
        return parseInt( angleDegrees ) ;
    },

    'strToSafeIdName': ( strTo ) => {
        let tr = strTo.replace(/[!\"#$%&'\(\)\*\+,\.\/:;<=>\?\@\[\\\]\^`\{\|\}~-]/g, '');
        if( tr.length > 20 ) tr = tr.substring(0,20)+(Date.now()%10000);
        return tr;
    },
    'getElementFromDomeByIndexPath': ( dom, iPath, level = 0 ) => {
        //debugger
        //console.log('index path:',iPath, ' level now :',level,' in dom ',dom);
        if( dom == undefined  ){
            //console.log('index path: exit 1');
            return -1;
        }
        if( level > 20 || level >= (iPath.length) ){
            //console.log('index path: exit 2');
            return dom;
        } 

        return nstConvert.getElementFromDomeByIndexPath( 
            dom.children[ iPath[ level ] ], 
            iPath,
            level +1  
        );
    },

    'getIndexOfChildReq': ( oLookFor, tr=[] )=>{
        //console.log('get index ',tr,' tagName now :',oLookFor);
        if( oLookFor.tagName == 'BODY' ){
            return tr;
        }
        let lookIn = oLookFor.parentNode.children;
        let ind = -1;
        
        for( let i=0,ic=lookIn.length; i<ic; i++){
            if( lookIn[i] == oLookFor ){
                ind = i;
                break;
            }
        }
        if( ind != -1 ){
            tr.unshift( ind );
            return nstConvert.getIndexOfChildReq( oLookFor.parentNode, tr );
        }




    },

};

if( window ){
    window['nstAsset_onload'] = nstAsset_onload;
}


export { nstLib, nstImportAsset, nstConvert, nstMediaExtensions }