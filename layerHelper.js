import { toRaw,ref } from 'vue';
import { decycle } from 'cycle';

class layerHelper{

    constructor( nst, layer, propEntry, atFrame ){
        this.nst = nst;
        this.l = layer

        this.timeLine = nst.timeLine;
        this.propEntry = propEntry;
        this.propKeys = propEntry.keys,
        this.propName = propEntry.name;
        this.atFrame = atFrame;
        this.atFrameMs = parseInt(atFrame*nst.frameMs);
        this.frameNoRange = [-1, atFrame];

        this.tl_label = 'setXX'+this.l.divName.substring(1)+'XX'+this.propName+'XX'+this.atFrame;
        this.orgAdd = -1;

       
    }

    chkLeft=()=>{
        this.frameNoRange_update();
    }


    frameNoRange_update=()=>{

        let toLeftKId = this.atFrame-1;
        let rpk = toRaw( this.propKeys );
        for(; toLeftKId>0; toLeftKId--){
            if( rpk[ toLeftKId ] != null ){
                toLeftKId++;
                break;
            }
        }
        if( toLeftKId == -1 ) toLeftKId = 0;

        
        // first one
        if( this.frameNoRange[0] == -1  ){
            this.frameNoRange[0] = toLeftKId;

        // same no action
        }else if( this.frameNoRange[0] == toLeftKId ){

        // new one need to rebuild
        }else if( this.frameNoRange[0] != toLeftKId ){
            this.timeLine.remove( this.tl_label );
            this.frameNoRange[0] = toLeftKId;
            this.add( this.orgAdd.animeOpts, this.orgAdd.valueOpts, false );
            
        }

        this.frameMsRange = [
            this.frameNoRange[0] * this.nst.frameMs,
            this.frameNoRange[1] * this.nst.frameMs,
        ];

    }

    update=(  animeOpts, valueOpts, doFrameNoRange_update = false )=>{
        this.timeLine.remove( this.tl_label );
        this.add( animeOpts, valueOpts, doFrameNoRange_update );
    }

    add=(  animeOpts, valueOpts, doFrameNoRange_update = true )=>{
        this.orgAdd = { animeOpts, valueOpts };
                
        if( doFrameNoRange_update ) this.frameNoRange_update();
        let deb = ['R/obj/ ['+this.tl_label+']  '+this.l.divName+' CALL @ '+this.atFrameMs+'ms',
                    '\n in range frames ',this.frameNoRange.join('...'),
                    '\n ------ valueOpts: ',valueOpts
                 ];

        if( animeOpts == 'set' ){

            let opts = {};
            opts[ this.propName ] = valueOpts;

            this.timeLine.label( this.tl_label,
                this.atFrameMs )
            this.timeLine.call(()=>{
                    console.log( deb );
                },
                this.tl_label )
            this.timeLine.set( this.l.divName, opts, this.tl_label);

            console.log('added at ',this.atFrameMs,'ms label ['+this.tl_label+'] ',
                '\n opts:',opts,'\n',
                deb);



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


let layers_to_saveJson=( nst, layers, opts = { 
            localStorageH: true,
            //asName: '' 
        }   ) => {

    let tr = [];
    layers.forEach( l =>{
        
        let tLayer = decycle(toRaw(l));
                
        
        tLayer['obj'] = '';

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
            let lHelOrg = JSON.parse( JSON.stringify( para ) );

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


export{ 
    layerHelper,
    layers_to_saveJson, layers_from_json
 }
