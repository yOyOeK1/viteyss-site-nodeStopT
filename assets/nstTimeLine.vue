<template class="nst">
    <div class="nstInfoNowBar">
        frame: ({{ frameNo }}/{{ framesTotal}}) | ms: ({{frameNoAtMs}}) |
        selected: ({{ divSelectedName }}) / ({{ divSelectedProp.join(', ') }}) |
        TL: ({{ isPlaying ?'playing':'stop' }}) {{ playInLoop ? 'loop': '' }} <br></br>ms:(<span id="nstTLMS">nstTLMS</span>) |
        layers: ({{layers.length}})
    </div>


    <div
        class="nstTimeLine">Tools:<br></br>

        <div class="nstBox1">
            <div class="nstControlsBar">
                <button @click="frameNo = 0">|<</button>
                <button @click="frameNo--"><</button>
                <button v-if="isPlaying"
                    @click="onStop()">stop</button>
                <button v-else
                    @click="onPlay()">play</button>
                <input type="checkbox" v-model="playInLoop"
                    title="Play in loop"></input>
                <select v-model="replayTimeScale">
                    <option v-for="value in replayTimeScaleOpts" :value="value.value">{{ value.name }}</option>

                </select>


                <button @click="frameNo++">></button>
                <button @click="frameNo = framesTotal">>|</button>
            </div>

            <div class="nstDebugBar">
                <button @click="lookForKeyFramesToBuild()">R1</button> |
                <button @click="onSaveToLocal()">save</button> |
                <button @click="onLoadToLocal()">load</button> |
                <button @click="divFindName='dB'; onDivFindName();onAddKeyFrame()">q?</button> |
            </div>



            <div
                class="nstFindBar">#:
                <input title="Look for div node $('#....')"
                    type="text" v-model="divFindName"
                    @change="onDivFindName([])"
                    >

                <button
                    v-if="divSelected.obj != null"
                    title="Insert key frame"
                    @click="onAddKeyFrame()"
                    >+</button>

            </div>

        </div>



    </div>




    <div
        class="nstTimeLine">Time:<br></br>

        <input
            style="min-width: 100%;"
            type="range"
            min="0"
            :max="framesTotal-1"
            step="1"
            v-model="frameNo"></input>
    </div>

    <!--
    <div
        class="nstTimeLine">Slider:</div>
    -->

    <div
        class="nstTimeLine">Layers:<br></br>

        <div
            v-for="layer in layers"
            >
            
            <div class="nstLayerTopBar">

                <input type="checkbox"
                    title="show / hide object / layer" v-model="layer.isVisible"></input>
                
                <div 
                    style="display:inline; border:solid 3px rgb(190, 249, 42); padding-right:50px;"
                    @click="makeSelectedNodeByName( layer.divName, 'all' )">
                
                    <span v-if="layer.divName != divSelectedName">
                        {{ layer.divName }}
                    </span>
                    <b v-else>
                        {{ layer.divName }}
                    </b>
                </div>

                
            </div>
                
            

            <div>
                <table :id="'nstTLTable'+layer.divName.substring(1)">
                    <tr>
                        <td>

                            <div
                                v-if="layer.isVisible"
                                v-for="f in layer.kFrames"
                                class="debBorders nstFrameCssBlock"
                                >
                                
                                <!--/*(layer.divName != divSelectedName?'nstFrameCssBlockSmaller ':'')*/-->
                                <div 
                                    :class="'debBorders '"
                                    :style=" 
                                        (divSelectedProp.indexOf( f.name )!=-1 &&
                                            layer.divName == divSelectedName )?'font-weight:bold;':'opacity:0.5;'
                                    "
                                    @click="makeSelectedNodeByName( layer.divName, [f.name], $event )"
                                    >
                                    [ {{ f.name }} ]
                                </div>

                                <!--
                                    <NstPropertyRow :propertyTimeline="f"></NstPropertyRow>
                                -->

                                <! -- old -->
                                <div style=""
                                    >
                                    <div v-for="(value,index) in f.keys"
                                        :style="
                                            'width:'+getKeyCellWidth+'px;'+
                                            'left:0px;'
                                            "
                                        :title="value!=null?'property [ '+f.name+' ] = '+value:'select this cell [ '+f.name+' ] at frame: '+index"
                                        :class="'nstFrameCssBlockCell '+
                                            (value==null?'nstFrameCssBlockCellEmpty ':'')+
                                            (index==frameNo && 
                                                layer.divName == divSelectedName &&
                                                divSelectedProp.indexOf( f.name ) != -1 ?'nstFrameCssBlockCellSelected ':'')
                                            "
                                        @click="frameNo=index; makeSelectedNodeByName( layer.divName, [f.name] )"
                                        >
                                        <small >
                                            {{ value }}                                            
                                        </small>
                                    </div>
                                </div>
                                <!-- old -->
                                <!-- new start -->
                                 <!--
                                <div style=""
                                    >
                                    <div v-for="(value,index) in f.keys"
                                        :style="
                                            'width:'+getKeyCellWidth+'px;'+
                                            'left:0px;'
                                            "
                                        :title="value!=null?'property [ '+f.name+' ] = '+value:'select this cell [ '+f.name+' ] at frame: '+index"
                                        :class="'nstFrameCssBlockCell '+
                                            (value==null?'nstFrameCssBlockCellEmpty ':'')+
                                            (index==frameNo && 
                                                layer.divName == divSelectedName &&
                                                divSelectedProp.indexOf( f.name ) != -1 ?'nstFrameCssBlockCellSelected ':'')
                                            "
                                        @click="frameNo=index; makeSelectedNodeByName( layer.divName, [f.name] )"
                                        >
                                        
                                         <NstKF :fvalue="value" :propName="f.name" :kIndex="index" :frameNo="frameNo"/>
                                    </div>
                                </div>
                                -->
                                <!-- new end -->

                            </div>
                            <!--
                            <br></br><br></br>


                            <div>


                                <div
                                    v-for="f in framesTotal"
                                    style="width:25px;display: inline-block;">


                                    <b v-if="frameNo == f-1">{{f-1}}</b>
                                    <i v-else><small>{{f-1}}</small></i>



                                    <div v-if="layer.kFrames[ f-1 ] != null">
                                        x
                                    </div>
                                    <div v-else>_</div>
                                    <div>
                                        <a @click="frameNo=f-1; makeSelectedNodeByName( layer.divName )">
                                            {{ getCellType( layer, f-1) }}
                                        </a>
                                    </div>
                                </div>
                             </div>
                             -->

                        </td>
                    </tr>
                </table>
            </div>


        </div>



    </div>

</template>






















<script>


import { toRaw,reactive,ref } from 'vue';
import NstKF from './nstKF.vue';
import { layerHelper, layers_to_saveJson, layers_from_json } from '../layerHelper';
//import nstProperty from './nstProperty.vue';

let nstTLMSDiv = -1;

export default{
    components:{ 
        //"NstPropertyRow": nstProperty 
        "NstKF": NstKF
    },
    mounted(){
        console.log('nstTimeLine mounted ');
        //window['cycle'] = decycle;

        
        
        
        setTimeout(()=>{
            this.timeLine.label('start', 0 )
    
            .call(()=>{ 
                console.log('R/tl START @ 0ms');
                nstTLMSDiv.append(', R/tl START @ 0ms');
    
            }, 0);
            this.timeLine.label('end', this.framesTotalMs )
            .call(()=>{ 
                console.log('R/tl END @ '+this.framesTotalMs+'ms');
                nstTLMSDiv.append(', R/tl END @ '+this.framesTotalMs+'ms');
            }, this.framesTotalMs)

        },200);


        setTimeout(()=>{
            console.log('updated ....');
            nstTLMSDiv = $('#nstTLMS');
            },100
        );

        //this.timeLine.restart();
    },
    data(){

        let fps = 10.00;
        let framesTotal = 15;

        let frameMs = parseInt( 1000.00 / fps );
        let framesTotalMs = frameMs* (framesTotal-1);





        

        let timeLine = aajs.createTimeline({
                autoplay:false,
                ease: 'linear',
                onUpdate:self=>{
                    console.log('R/tik @ '+this.frameNoAtMs+'ms');
                    nstTLMSDiv.html('R/tik @ '+this.frameNoAtMs+'ms');
                }
            });

        let nstTLMS = -1;
        let cellWidth = (window.innerWidth - 100) / (framesTotal - 1) ;


        



        return {
            isPlaying: false,
            replayTimeScale: 1.0,
            replayTimeScaleOpts:[
                { name:'1.5x', value:1.50},
                { name:'1x', value:1.00},
                { name:'0.25x', value:0.25},
                { name:'0.1x', value:0.1},
            ],
            playInLoop: true,

            frameNo: 0,
            frameNoAtMs: 0,
            frameMs: frameMs,
            fps: fps,
            framesTotal:framesTotal,
            framesTotalMs: framesTotalMs,

            iterator: null,

            getKeyCellWidth: cellWidth,

            divFindName:'',
            divSelectedName: '',
            divSelectedProp: [],
            divSelected:{
                divName:'',
                order: 0,
                isVisible: true,

                obj: null,

                frameAddedAt: 0,
                kFrames: [
//                    { name: 'opacity', values:[ [frameNo: 0, value: 1.0 ], ] },
                ],
            },
            timeLine: timeLine,
            timeLineStack:[],
            nstTLMS: nstTLMS,
            layers:[]

        };
    },
    watch:{
        frameNo( nframe, oframe ){

            if( nframe < 0 )
                this.frameNo = 0;
            else if( nframe >= this.framesTotal )
                this.frameNo = this.framesTotal-1;
            else
                console.log('(watch2) nframe in range so ok ',this.frameNo);



            this.frameNoAtMs = this.msAtFrame( this.frameNo );
            //this.frameNo = nframe;
            if( 0 ) console.log('(watch) frameNo changed ! ',nframe,' from ',oframe,
                '\nframeNoAtMs: '+this.frameNoAtMs+" ms."
            );

            if( this.timeLine != null ){
                //this.timeLine.stretch( this.framesTotalMs );
                this.timeLine.seek( this.frameNoAtMs );
                //this.timeLine.stretch( this.framesTotalMs / this.replayTimeScale );
            }
            //this.onSeekSet();
        }
    },
    methods:{
        

        getCellKeyFrameCell( fkvalue, kitem ){
            console.log( 'frame kay value: ',fkvalue, '\n frameNo: ',kitem);

            let idLook = parseInt( kitem[0] );
            let first = true;
            let screenW = window.innerWidth-20;
            let lastFrame = 0;
            let fpx = parseInt(screenW / this.framesTotal);
            let offsetFirst = (fkvalue[0][0]*fpx);

            if( fkvalue.length == 1 ) return  screenW-offsetFirst;

            for(let vii = 0, viic = fkvalue.length; vii<viic; vii++ ){
                let ki = fkvalue[ vii ];

                if( parseInt( ki[0] ) == idLook  ){
                    if( first == true ){
                        return ( fkvalue[ vii+1 ][0]*fpx ) - offsetFirst;

                    }else if( vii == fkvalue.length-1 ){
                        console.log('is last ',(screenW - ( idLook )*fpx));
                        return ( screenW - ( idLook )*fpx ) - offsetFirst;

                    }else{
                        return (( idLook - lastFrame )*fpx) - offsetFirst;

                    }

                }else{
                    first = false;
                }
                lastFrame = parseInt( ki[0] );
            }



            return 100;
        },
        getCellType( layer, index ){
            //console.log('get cell type layer\n',layer,'\nindex',index);

            let tr = '_';
            for(let kfi=0; kfi<=index; kfi++){
                let kf = layer.kFrames[kfi];

                if( kf == null && tr == '_' ){
                    tr = '_';
                    //break;
                }else if( kf != null && tr == '_' ){
                    tr = 'k';
                    //break;
                }else if( kf != null && tr == 'k' ){
                    tr = '-';
                    //break;
                }else if( kf == null && tr == 'k' ){
                    tr = '-';
                    //break;
                }else if( kf != null && tr == '-' ){
                    tr = 'k';
                    //break;
                }
                //console.log('kfi: '+kfi+' '+kf+'  => '+tr);
            }

            let dic = {
                '_': 'o',
                'k': 'K',
                '-': '-'
            };

            return dic[tr];
        },

        msAtFrame( frameNo ){
            return this.frameMs * frameNo;
        },


        onLoadToLocal(){
            let j = JSON.parse(localStorageH.getK( 'nst/v2/1' ));
            let loadRes = layers_from_json( this, j );
            
            console.log(' on load to lacal.....',loadRes);
            this.layers = loadRes;
            //this.lookForKeyFramesToBuild();
            this.frameNo = 0;
            $.toast(`Loaded<br>
                fps: ${j.fps}<br>
                frames: ${j.framesTotal}`);
        },

        onSaveToLocal(){
            let res = layers_to_saveJson( this, toRaw(this.layers),{ 
                localStorageH: true,
                asName: 'nst/v2/1' 
            } );

            if( res.data.layers.length == 0 ){
                $.toast('No layers to save');
            }else{
                $.toast(
                    'Layers save in local storage<br>'+
                    '<small>Adress:</small> '+res.saveAdr
                );
            }

            /*
            console.log(' on save to lacal ....');
            let tr = [];
            this.layers.forEach( l =>{
                let t = decycle(toRaw(l));
                //let t = JSON.stringify( decycledObj );
                console.log('   * layer: '+l.name,' kfram',l.kFrames,
                    '\n\nt -----------\n',t
                );
                t['obj'] = '';
                t.kFrames.forEach( f =>{
                    if( f!=undefined ){
                        delete f['animation'];
                    }
                } );
                tr.push( t );

            });
            console.log('to save -----------\n',tr);
            try{
                let j = JSON.stringify(tr);
                console.log('save str --------------------\n',
                    JSON.stringify(j,null,4),'\n-------------'
                );
                localStorageH.setK( 'nst/1' , j );
                console.log("[i] - save in local storage as nst/1");
            }catch(e){

                console.error('EE when parsing tr to save jsone\n',e);
            }
                */
        },

        onPlay(){
            this.isPlaying = true;



            // if last one play from start
            if( this.frameNo == this.framesTotal-1 )
            this.frameNo = 0;

            this.timeLine.resume();

            this.onPlayIter();
            //this.timeLine.play();
        },
        onPlayIter(){
            if( this.isPlaying == true ){
                this.iterator = setTimeout(()=>{
                    //console.log('1 on play iter ...',this.frameNo);
                    if( this.frameNo < this.framesTotal-1 )
                        this.frameNo++;
                    else
                        this.frameNo = 0;

                    //console.log('2 on play iter ...',this.frameNo);
                    if( this.frameNo == this.framesTotal-1 && this.playInLoop == false ){
                        this.onStop();
                    }else{
                        this.onPlayIter();
                    }
                }, this.frameMs / this.replayTimeScale );
            }else{
                console.error('ee on play iter will not play global wrong ');
            }
        },


        onStop(){
            this.isPlaying = false;
            this.timeLine.pause()
            clearInterval(this.iterator);
        },

        lookForKeyFramesToBuild(){
            console.log(' look for layers and key frames ');
            this.timeLine = null;
            console.log('exit 11');
            return 11;
            this.timeLine = aajs.createTimeline({
                autoplay:false,
                ease: 'linear',
            }).label('start', 0 );
            let timeLineStack = [];
            this.layers.forEach( l =>{

                let lastDump = {};
                let kFrames = l.kFrames.filter( kf => {
                    return kf!=null && 'frameNo' in kf;
                } );

                console.log('* layer: ',l.name,
                    '\n     - key frames ('+kFrames.length+')'
                );

                if( kFrames.length >= 1 ){

                    let lastFrameAt = 0;
                    let tStart = 0;
                    for( let kf=0,kfc=kFrames.length; kf<kfc; kf++ ){
                        let kframe = kFrames[ kf ];

                        if( 1 ){
                            tStart = this.msAtFrame( lastFrameAt );
                            let opts = {
                                duration: this.msAtFrame(kframe.frameNo-lastFrameAt),
                                left: kframe.values.left,
                                top: kframe.values.top,
                            };


                            lastFrameAt = kframe.frameNo;
                            lastDump = kframe.values.fullDump;
                            kframe['animate'] = 'ok';//aajs.animate( l.name, opts );
                            kframe['animateOpts'] = opts;

                            if( kf == 0 ){
                                for( let hidF = 0; hidF< kframe.frameNo; hidF ++){

                                    let timeOff = this.msAtFrame( hidF );
                                    this.timeLine.call( ()=>{
                                        console.log(' hide ',l.name, ' at '+timeOff);
                                        $(l.name).css({

                                            left: kframe.values.left,
                                            top: kframe.values.top,

                                        });
                                        $(l.name).hide();
                                    }, timeOff ) ;
                                }
                                this.timeLine.call( ()=>{
                                    $(l.name).show();
                                    $(l.name).css({

                                        left: kframe.values.left,
                                        top: kframe.values.top,

                                    });
                                    console.log(' show ',l.name, ' at before firt');
                                }, this.msAtFrame( kframe.frameNo) ) ;

                            }

                            timeLineStack.push( [opts, tStart] );
                            this.timeLine.add( l.name, opts, parseInt( tStart ) ) ;



                            console.log('       - at kframe ('+kframe.frameNo+') opts \n',  JSON.stringify(opts,null,2) );

                            /*
                            if( kf > 0 ){
                                console.log('looking for diff ...');
                                let difs = [];
                                Object.keys(kframe.values.fullDump).forEach( pName => {
                                    let cVal = kframe.values.fullDump[ pName ];
                                    if( lastDump[ pName ] != cVal ){
                                        console.log('   !* ['+pName+'] = ',  cVal ,' to last frame : ',lastDump[ pName ] );

                                    }
                                });
                            }*/
                        }else{
                            console.log('       - at kframe ('+kframe.frameNo+') set old');

                        }

                    }



                }


            });

            this.timeLine.call(()=>{console.log('START at 0 ms master start')},0);
            this.timeLine.call(()=>{console.log('END   at '+this.framesTotalMs+' ms master stop' )}, this.framesTotalMs);
            console.log( 'time line stack\n',timeLineStack);
            this.timeLineStack = timeLineStack;
        },

        playSelectionMarker( markerId ){
             aajs.animate( markerId,{
                loop:1,
                duration: 300,
                autoplay: true,
                opacity:{
                    from: 0.5,
                    to: 1.0
                },
            });
        },

        makeSelectedNode( nodeObj, properties = [] ){
             let lR = this.layers.filter( l => {
                return l.name == nodeObj.selector;
            });
            if( lR.length == 1 ){
                this.divSelected.kFrames = lR[0].kFrames;
            }

            console.log('play selection animation ....',nodeObj.selector.substring(1));
            this.playSelectionMarker( nodeObj.selector );

            this.divSelected.obj = nodeObj;
            this.divSelected.divName = nodeObj.selector;
            //this.divSelected.dSize = [ nodeObj.width(), nodeObj.height() ];
            //this.divSelected.pos = [ nodeObj.offset().left, nodeObj.offset().top ];
            this.divSelected.frameAddedAt = parseInt( this.frameNo );
            this.divSelectedName = nodeObj.selector;
            

            if( properties != [] )
                this.divSelectedProp = properties;
            

            if( this.divSelectedProp == 'all') 
                this.divSelectedProp = this.layers.filter(l=> l.divName == this.divSelected.divName )[0].kFrames.map(par => par.name );

            //this.divSelected.name = nodeObj.selector;
            //console.log(' make selected node div selected:\n',JSON.stringify(this.divSelected,null,4));

        },

        onDivFindName( properties = [] ){
            let lookRes = $(`#${this.divFindName}`);
            console.log('div find name ....'+this.divFindName,
                ' have ('+lookRes.length+')'
            );

            if( lookRes.length == 1 ){
                this.makeSelectedNode ( lookRes, properties );
                console.log('css\n',this.getCssValuesOfById( this.divFindName ));
            }

        },
        makeSelectedNodeByName( nName, properties = [], event = undefined ){

            console.log(' make selected node by name :',nName, '\nprops:',properties,'\nevent: ',event);
            
            if( event != undefined ){
                let pointC = [event.clientX, event.clientY];
                let divOnC = $($('#nstTLTable'+nName.substring(1))[0]);
                let divSize = [ divOnC.width(), divOnC.height() ];
                let seekN = mMapVal( pointC[0], 0, divSize[0], 0,1 );
                let tFrame = parseInt( this.framesTotal * seekN );
                console.log('event seek to ?',
                    '\n divSize:', divSize,
                    '\n seekN:',seekN,
                    '\n newFrame: ',tFrame
                );
                this.frameNo = tFrame;

            }
            
            
            
            this.divFindName = nName.substring(1);
            this.onDivFindName( properties );

        },

        getCssValuesOfById( byId ){
            //console.log(' get css for id: ['+byId+']');
            let fd = {};
            let compCs = window.getComputedStyle( document.getElementById( byId ) );
            compCs.forEach( pName => fd[ pName ] = compCs.getPropertyValue( pName ) );
            return fd;
        },

        getQueryAboutWhatTo(){
            let css = this.getCssValuesOfById( this.divSelectedName.substring(1) );
           
            let keysTest1 = {
               'left': css['left'],
               'top': css['top'],
            };
            // TODO should be from dialog 
            let tr = keysTest1;
        
            // is is some selected 
            if( this.divSelectedProp != 'all' && this.divSelectedProp.length != 0 ){
                console.log('nst[i] properties from selection props...');
                tr = {};
                this.divSelectedProp.forEach( p=>
                    tr[ p ] = css[ p ]
                );
            }

            this.divSelectedProp = Object.keys( tr );
            return {
                'animeOpts': 'set',
                'css': css,
                'keys': tr
            };
        },



        
        getKFrameByName( kFrameName, kFrames ){
            console.log(' name : ['+kFrameName+'] kframes:',kFrames);
            if( kFrames.length == 0 ) return [];
            let res = kFrames.find( kf => {
                console.log('       - kf property ',kf);
                return kf.name === kFrameName;
            });
            console.log('res ', res );
            if( res != undefined ) return res;
            else{
                console.error('ee wrong count of kFrames by name ['+kFrameName+'] res:\n',res);
                return -1;
            }

        },

        getLayerByName( divName ){
            let res = this.layers.filter( l => l.divName == divName );
            if( res.length == 1 )
                return res[0];
            else{
                console.error('ee wrong count of layers name ['+divName+'] returning array ',res.length);
                return res;
            }

        },

        
        onAddKeyFrame(){
            let deb = false;
            let cFrame = parseInt(this.frameNo);
            let divName = this.divSelectedName;
            let layers = this.layers;
            let layer = -1;

            let lRes = layers.findIndex( l=> l.divName == divName );
            if( lRes == -1 ){
                layer = {
                    divName:divName,
                    order: 0,
                    isVisible: true,
                    obj: null,
                    frameAddedAt: cFrame,
                    kFrames: [],
                }
                layer.name = divName;
                layer.fFrames = [];
                layers.push( layer );

            }else{
                layer = layers[ lRes ];
            }


        
            
            
            // TODO query dialog what to get
            let q = this.getQueryAboutWhatTo();
            if( q.keys.length == 0 ){
                console.error('ee no selected whatTo key as ...q res:',q);
                return 1;
            }
            // query done
            
            console.log(' on add key frameNo('+cFrame+') .... at ('+this.frameNoAtMs+')ms. ',
                '\nselected now: '+divName+' / ('+JSON.stringify(this.divSelectedProp)+')',
                '\nquery result: ',q
            );
            

           

            if( layer.kFrames.length == 0 ){
                console.log('       * is fist kFrames layer in project,\n',layer);
            }else{
                console.log('       * some kFrames in layer in project \n',layer);
            }

            for( let cssk of Object.keys(q.keys) ){
                let kFrame = this.getKFrameByName( cssk, layer.kFrames );
                if( deb ) console.log(' - css ['+cssk+'] now is ['+q.keys[cssk]+'] res :',kFrame);

                if( kFrame == -1 || kFrame.length == 0 ){ // new
                    console.log(' * first ['+cssk+'] kFrame  ....');

                    //let propKeys
                    kFrame = {
                        name: cssk,
                        'keys': new Array( this.framesTotal ),
                        lHelpers: new Array( this.framesTotal )
                    };
                    
                    kFrame.keys[cFrame] = q.keys[ cssk ];
                    kFrame.lHelpers[ cFrame ] = new layerHelper( this, layer, kFrame, cFrame );
                    kFrame.lHelpers[ cFrame ].add( q.animeOpts, q.keys[ cssk ] );

                    layer.kFrames.push( kFrame );
                    
                    
                }else{

                    if( kFrame.keys[ cFrame ] == null ){
                        kFrame.keys[ cFrame ] = q.keys[ cssk ];
                        console.info( ' [i] adding key ['+cssk+'] at frameNo ?',cFrame, deb?kFrame:'');
                        kFrame.lHelpers[ cFrame ] = new layerHelper( this, layer, kFrame, cFrame );
                        kFrame.lHelpers[ cFrame ].add( q.animeOpts, q.keys[ cssk ] );

                    } else {
                        kFrame.keys[ cFrame ] = q.keys[ cssk ];
                        console.info( ' [i] update key ['+cssk+']   to ['+kFrame.keys[ cFrame ]+']');
                        TODO
                    }
                    
                }
            }

            this.playSelectionMarker( divName );
            return 1;
        },
        
        delIt_abccc(){

            // old :(
            let kFrame = {
                frameNo: parseInt( this.frameNo ),
                values:{
                    left: this.divSelected.obj.offset().left,
                    top: this.divSelected.obj.offset().top,
                    fullDump: this.getCssValues( this.divSelected.name.substring(1) )

                },
            };

            let lR = this.layers.filter( l => {
                console.log('lookinf for ',l.name, ' == ',this.divSelectedName,l.name == this.divSelectedName);
                return l.name == this.divSelectedName;
            });
            if( lR.length == 0 ){
                console.log('   - Make layer for it..');
                this.layers.push(
                    JSON.parse( JSON.stringify( this.divSelected ) )
                );
                lR = [ this.layers[ this.layers.length - 1 ] ];
                lR.kFrames = new Array( this.framesTotal );
            }else{

            }
            if( lR.length > 1 ){
                console.error('EE to many layers with same name !! ()',lR.length);
                return 1;
            }

            lR = lR[0];
            lR.kFrames[ this.frameNo ] = kFrame;

            this.lookForKeyFramesToBuild();
        }



    }

}

</script>
<style>
.nst{
   text-shadow: none;
}


.debBorders{
    border: solid 1px red;
    border-radius: 5px;
}

.nstInfoNowBar{
    font-size: 70%;
    background-color: rgb(247, 245, 207);
    text-shadow: none;
    min-height: 30px;
}


.nstBox1{
    border: solid 3px rgb(150, 255, 138);
    border-radius: 5px;
}
.nstControlsBar{
    border: solid 3px rgb(163, 133, 246);
    border-radius: 5px;
    display:inline-block;
}
.nstControlsBar button{
    padding: 5px;
}
.nstFindBar{
    border: solid 3px rgb(190, 249, 42);
    border-radius: 5px;
    display:inline-block;
}
.nstFindBar button{
    padding: 5px;
}


.nstDebugBar{
    border: solid 3px rgb(255, 94, 180);
    border-radius: 5px;
    display:inline-block;
}
.nstDebugBar button{
    padding: 5px;
}

.nstTimeLine{
    min-width: 100vw;
    border: solid 1px orangered;
    border-radius: 5px;

}

.nstLayerTopBar{
    border: 2px rgb(180, 225, 142) solid;
    border-radius: 10px;
}

.nstFrameCssBlock{
    position: relative;
}
.nstFrameCssBlockCell{
    background-color:rgb(255, 65, 65);

    display:inline-block;
    position:relative;
    overflow:hidden;
    height: 30px;

}

.nstFrameCssBlockSmaller{
    font-size: 50%;
}
.nstFrameCssBlockSmaller div {
    max-height: 10px;
    height: 10px;
}

.nstFrameCssBlockCellSelected{
    background-color: rgb(205, 255, 56);
    border:2px solid maroon;
    
}

.nstFrameCssBlockCellEmpty{
    background-color: rgb(210, 174, 251);
    
}

</style>