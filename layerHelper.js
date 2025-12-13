import { toRaw,ref } from 'vue';
import { decycle } from 'cycle';

import {animate as ajsanimate } from 'animejs';
import { createTimeline as ajscreateTimeline } from 'animejs/timeline';
//window['aajjs'] = animate;



class layerHelper{

    constructor( nst, layer, propEntry, atFrame ){
        this.nst = nst;
        this.l = layer
        this.divName = `${this.l.divName}`;
        if( this.divName == '' ){
            console.error('EE div name error :',this.l.divName);
        }

        this.timeLine = toRaw( nst.timeLine );
        //this.timeLine = nst.timeLine;
        this.propEntry = propEntry;
        this.propKeys = toRaw(propEntry.keys), 
        this.propName = propEntry.name;
        this.atFrame = atFrame;
        this.atFrameMs = parseInt(atFrame*nst.frameMs);
        this.frameNoRange = [-1, atFrame];
        this.frameMsRange = [0,0];
        this.duration = 0;

        this.aJs = -1;
        this.aJs_atTimeLine = -1;


        this.tl_label = 's'+this.divName.substring(1)+'XX'+this.propName+'XX'+this.atFrame;
        this.orgAdd = -1;

       
    }

    chkLeft=()=>{
        this.frameNoRange_update();
    }


    frameNoRange_update=()=>{

        let toLeftKId = this.atFrame-1;
        let rpk = this.propKeys ;

        for(; toLeftKId>=0; toLeftKId--){
            if( rpk[ toLeftKId ] != null ){
                toLeftKId++;
                break;
            }
        }
        if( toLeftKId == -1 ) toLeftKId = 0;



        let oldRange = this.frameNoRange[0];
        let calculaterToLeftId = toLeftKId;
        


        // first one
        if( this.frameNoRange[0] == -1  ){
            this.frameNoRange[0] = toLeftKId;
            
            // same no action
        }else if( this.frameNoRange[0] == toLeftKId ){
            
            // new one need to rebuild
        }else if( this.frameNoRange[0] != toLeftKId ){

            if( this.aJs != -1 )
                this.timeLine.remove( this.tl_label );
            this.frameNoRange[0] = toLeftKId;
            this.add( this.orgAdd.animeOpts, this.orgAdd.valueOpts, false );
            
        }
        

        this.frameMsRange = [
            this.frameNoRange[0] * this.nst.frameMs,
            this.frameNoRange[1] * this.nst.frameMs,
        ];
        this.duration = this.frameMsRange[1]-this.frameMsRange[0]+this.nst.frameMs-1;

    }

    update=(  animeOpts, valueOpts, doFrameNoRange_update = false )=>{
        if( this.aJs != -1 ){
            this.timeLine.remove( this.tl_label );
        }
        console.log('update ..'+this.atFrame+'... do frame No range update ',doFrameNoRange_update);
        this.add( animeOpts, valueOpts, doFrameNoRange_update );
    }

    add=(  animeOpts, valueOpts, doFrameNoRange_update = true )=>{

        this.orgAdd = { animeOpts, valueOpts };
                
        if( doFrameNoRange_update ) this.frameNoRange_update();
        let deb = '';

                 
        let opts = {};
        opts['from'] = {};
        opts['from'][ this.propName ] = valueOpts;
        
        
        if( animeOpts.type == 'set' ){
            let tStart = parseInt( this.atFrameMs);
            //opts['duration'] = 1;
            delete opts['composition'];

            //opts['target'] = this.divName;
            
            
            deb = 'R/obj/ ['+this.tl_label+'] (set) CALL @ '+tStart+'ms '+
            '\n in range frames '+this.frameNoRange.join('...')+
            '\n in duration: '+this.duration+
            '\n ------ valueOpts: '+valueOpts+
            '\n opts:'+JSON.stringify(opts,null,4)+'\n'+
            '\n divName: '+this.divName+
            '\n'+new Date();
            
            
            //this.timeLine.label( this.tl_label,tStart )            
            //this.timeLine.call(()=>{ console.log( deb ); }, this.tl_label );
            
            console.log('added (set) at ',tStart,'ms label ['+this.tl_label+']',
                '\n opts:',opts,'\n',
                '\n deb: ',deb);
            this.aJs = opts;
            this.aJs_atTimeLine = tStart;
            this.timeLine.label( this.tl_label, tStart ).set( this.divName, this.aJs , this.tl_label);


        }else if( animeOpts.type == 'animate' ){       
            let tStart = this.frameMsRange[0];
                        
            opts['alternate'] = animeOpts.alternate;
            opts['autoplay'] = animeOpts.autoplay;
            opts['loop'] = animeOpts.loop;
            opts['duration'] = this.duration;
            //opts['target'] = this.divName;
            if( 'onBegin' in animeOpts ) opts['onBegin'] = animeOpts.onBegin;
            
            //this.orgAdd.animeOpts = opts;


            deb = 'R/obj/ ['+this.tl_label+'] (set) CALL @ '+tStart+'ms '+
                    '\n in range frames '+this.frameNoRange.join('...')+
                    '\n in duration: '+this.duration+
                    '\n ------ valueOpts: '+valueOpts+
                    '\n opts:'+JSON.stringify(opts,null,4)+'\n'+
                    '\n divName: '+this.divName+
                    '\n'+new Date();
            console.log('added (animejs) at ',tStart,'ms label ['+this.tl_label+']',
                '\n opts:',opts,'\n',
                '\n deb: ',deb);

            this.aJs = opts;
            this.aJs_atTimeLine = tStart;
            //this.timeLine.label( this.tl_label, tStat )
            //this.timeLine.call(()=>{ console.log( deb ); }, this.tl_label );
            this.timeLine.label( this.tl_label, tStart ).add( this.divName, this.aJs, this.tl_label );
            
        }
        

        this.emitToRight();

    }

    emitToRight=()=>{

        for(let i=this.atFrame+1,ic=this.nst.framesTotal;i<ic;i++){
            if( this.propKeys[i] != null ){
                let toQForUpdate = this.propEntry.lHelpers[i];
                toQForUpdate.chkLeft()
                
                break;
            }

        }
    }


}


let layers_to_saveJson_noMore=( nst, layers, opts = { 
            localStorageH: true,
            //asName: '' 
        }   ) => {

    let tr = [];
    layers.forEach( l =>{
        
        let tLayer = decycle(toRaw(l));
                
        
        tLayer['obj'] = '';
        tLayer['propertiesNow'] = {};

        tLayer.kFrames.forEach( prop =>{
            if( prop!=undefined ){     
                let newlHelp = new Array( prop.lHelpers.length );           
                prop.lHelpers.forEach( (lh,i) =>{
                    if( lh ){  
                        newlHelp[ i ] = lh.orgAdd;
                    }
                } );
                prop.lHelpers = newlHelp;
                
            }
        } );
        tr.push( tLayer);
        
    });


    tr = {
        fps: nst.fps,
        framesTotal: nst.framesTotal,
        layers: tr
    };



    let saveAdr = 'asName' in opts ? opts.asName : 'nst/Save/'+timestampToNiceTime_DomSafe();

    console.log('to save as ['+saveAdr+']-----------\n',tr);
    if( tr.length == 0 ){
        console.error('EE nst layer save to ... is empty ');
    }
    
    if( 'localStorageH' in opts && opts.localStorageH ){
        try{
            let j = JSON.stringify(tr);
            console.log('save str  --------------------\n',
                JSON.stringify(j,null,4),'\n-------------'
            );
            localStorageH.setK( saveAdr , j );
            console.log("[i] - save in local storage as ",saveAdr);
        }catch(e){

            console.error('EE when parsing tr to save jsone\n',e);
        }
    }

    return {
        status: 'ok',
        data: tr,
        saveAdr: saveAdr
    }
};

let layers_from_json=( nst, json, opts )=>{
    let tr = [];
    
    nst.fps = json.fps;
    nst.framesTotal = json.framesTotal;
    nst.frameMs = parseInt( 1000.00 / json.fps );
    nst.framesTotalMs = nst.frameMs* ( json.framesTotal-1);
    
    json.layers.forEach( l =>{
        l.kFrames.forEach( (para, pIn) =>{
            let lHelpers = new Array( para.keys.length );
            let lHelOrg = JSON.clone( para );

            para.lHelpers.forEach( (lH, fNo) => {
                if( lH != null ){
                    lHelpers[ fNo ] = new layerHelper( nst, l, para, fNo );
                    //lHelpers[ fNo ].add( lH.animeOpts, lH.valueOpts );
                }
            });

            para.lHelpers = lHelpers; 
            lHelpers.forEach( (lH, fNo) => {
                if( lH != null ){
                    //lHelpers[ fNo ] = new layerHelper( nst, l, para, fNo );
                    let args = lHelOrg.lHelpers[ fNo ];
                    lHelpers[ fNo ].add( args.animeOpts, args.valueOpts );
                }
            });

        });

        tr.push( l );

    });


    return tr;
};



function layers_to_timeLine( layers, metadata ){
    
}







export{ 
    layerHelper,
    //layers_to_saveJson, // move to nstLib.js
    layers_from_json,
    //layers_to_timeLine
 }
