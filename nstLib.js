
import {animate as ajsanimate } from 'animejs';
import { createTimeline as ajscreateTimeline } from 'animejs/timeline';


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
            onUpdate:self=>{
                console.log('R/tik @ ',self._currentTime+' ms.');
            }
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

                        if( opt.onBegin == '' ) delete opt['onBegin'];
                        else opt.onBegin = eval( ` self => {${opt.onBegin}}` );
                        if( opt.onComplete == '' ) delete opt['onComplete'];
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


export { nstLib }