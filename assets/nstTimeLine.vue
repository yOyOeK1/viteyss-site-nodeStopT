<template class="nst">
    <div class="nstInfoNowBar">
        frame: ({{ frameNo }}/{{ framesTotal}}) | ms: ({{frameNoAtMs}}) |
        selected: ({{ divSelectedName }}) / ({{ propertiesSelectedStr }}) |
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
                <button @click="divFindName='dB'; onDivFindName([]);onAddKeyFrame()">q?</button> |
            </div>



            <div
                class="nstFindBar">#:
                <input title="Look for div node $('#....')"
                    type="text" v-model="divFindName"
                    @change="onDivFindName([])"
                    >

                <button
                    v-if=" lSelected != -1 "
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
                    @click="makeSelectedNode_ByName( layer.divName, 'all' )">
                
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
                                        (propertiesSelected.indexOf( f.name )!=-1 &&
                                            layer.divName == divSelectedName )?'font-weight:bold;':'opacity:0.5;'
                                    "
                                    @click="makeSelectedNode_ByName( layer.divName, [f.name], $event )"
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
                                                propertiesSelected.indexOf( f.name ) != -1 ?'nstFrameCssBlockCellSelected ':'')
                                            "
                                        @click="frameNo=index; makeSelectedNode_ByName( layer.divName, [f.name] )"
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
                                        @click="frameNo=index; makeSelectedNode_ByName( layer.divName, [f.name] )"
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
                                        <a @click="frameNo=f-1; makeSelectedNode_ByName( layer.divName )">
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
import { layerHelper, 
    layers_to_saveJson, layers_from_json } from '../layerHelper';
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
            /*
            divSelectedName: '',
            divSelectedProps: [],
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
            */
            timeLine: timeLine,
            timeLineStack:[],
            nstTLMS: nstTLMS,
            propertiesSelected:[],
            lSelected:-1,
            layers:[]

        };
    },
    computed:{
        divSelectedName(){
            if( this.lSelected == -1 ) return 'NaN';
            else{
                return this.layers[ this.lSelected ].divName;
            } 
        },
        layelSelected(){
            if( this.lSelected == -1 ) return -1;
            else return this.layers[ this.lSelected ];
        },
        propertiesSelectedStr(){
            if( this.propertiesSelected == 'all' ) return 'all';
            else return this.propertiesSelected.join(', ');
        }
    },
    watch:{
        replayTimeScale( nScale, oScale ){
            this.replayTimeScale = nScale;
            this.timeLine.speed = nScale;
        },
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
        propertiesSelected_Set( props ){
            this.propertiesSelected = props;
        },

        layer_getByDivName( divName, addToLayers = true ){
            let lId = this.layers.findIndex( l=>l.divName==divName);
            //debugger
            if( lId != -1 ) return this.layers[ lId ];
            else{
                let layer = {
                    divName: String(divName),
                    order: 0,
                    isVisible: true,
                    obj: $(divName),
                    frameAddedAt: parseInt( this.frameNo ),
                    kFrames: [],
                };
                if( addToLayers == true )
                    this.layers.push( layer );

                return layer;
            }
        },


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







        

        onDivFindName( properties = [] ){
            let lookRes = $(`#${this.divFindName}`);
            console.log('div find name ....'+this.divFindName,
                ' have ('+lookRes.length+')'
            );

            if( lookRes.length == 1 ){
                this.makeSelectedNode_ByDivObj ( lookRes, properties );
                //console.log('css\n',this.getCssValuesOfById( this.divFindName ));
            }

        },



        makeSelectedNode_ByDivObj( divObj, properties = [] ){    
            let layer = this.layer_getByDivName( divObj.selector );//layer_get_layerByDivName( this.layers, divObj.selector, this.frameNo );
            this.lSelected = this.layers.findIndex( l=>l.divName == divObj.selector ) ;
            
            
            
            if( properties != [] )
                this.propertiesSelected_Set( properties );            

            if( this.propertiesSelectedStr == 'all'){
                this.propertiesSelected_Set( layer.kFrames.map( par => par.name ) );
            }
            
        },


        makeSelectedNode_ByName( nName, properties = [], event = undefined ){

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
            let prop = this.propertiesSelected;
            console.log( typeof prop )
            if( prop != 'all' && prop.length != 0 ){
                console.log('nst[i] properties from selection props...');
                tr = {};
                prop.forEach( p=>
                tr[ p ] = css[ p ]
            );
        }
        
        this.propertiesSelected_Set( Object.keys( tr ) );
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

        
        


        onAddKeyFrame(){
            let deb = false;
            let cFrame = parseInt(this.frameNo);
            let divName = this.divSelectedName;
            let layer = this.layelSelected;
            if( layer == -1 ) return -1;
            
            
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
                        kFrame.lHelpers[ cFrame ].update( q.animeOpts, q.keys[ cssk ] );
                    }
                    
                }
            }

            this.playSelectionMarker( divName );
            return 1;
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