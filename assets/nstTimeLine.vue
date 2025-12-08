<template class="nst">
    <div class="nstInfoNowBar">
        frame: ({{ frameNo }}/{{ framesTotal}}) | ms: ({{frameNoAtMs}}) |
        selected: ({{ divSelectedName }}) / ({{ propertiesSelectedStr }}) | observs: ({{ observeAtId }}) |
        aSelected: (
            <!--
                {{ animeSelected }}) 
            -->
            <NstAnimSelector 
                style="display: inline;"
                asMode="viewMini"
                :selected="animeSelected"
                />
            
            |
        TL: ({{ isPlaying ?'playing':'stop' }}) {{ playInLoop ? 'loop': '' }} <br></br>ms: (<span id="nstTLMS">- - -</span>) |
        layers: ({{layers.length}})
    </div>

   

    <div
        class="nstTimeLine">
        <!--
            Time:<br></br>
        -->
        <input
            style="min-width: 95%;"
            ref="nstTimeSlideInput"
            type="range"
            min="0"
            :max="framesTotal-1"
            step="1"
            v-model="frameNo"></input>
    </div>
       
    <div
        class="nstTimeLine">
        <!--
            Tools:<br></br>
        -->
        

        <div class="nstBox1">
            <div class="nstControlsBar">
                <button @click="frameNo = 0; nstTimeSlideInput_focus();" title="|< to start"><i class="fa-solid fa-backward-step"></i></button>
                <button @click="frameNo--;nstTimeSlideInput_focus();"title="< one left"><i class="fa-solid fa-backward"></i></button>
                <button v-if="isPlaying"
                    @click="onStop();nstTimeSlideInput_focus();" title="Stop"><i class="fa-solid fa-pause"></i></button>
                <button v-else
                    @click="onPlay();nstTimeSlideInput_focus();" title="Play"><i class="fa-solid fa-play"></i></button>
                <input type="checkbox" v-model="playInLoop"
                    title="Play in loop"></input>
                <select v-model="replayTimeScale">
                    <option v-for="value in replayTimeScaleOpts" :value="value.value">{{ value.name }}</option>

                </select>


                <button @click="frameNo++;nstTimeSlideInput_focus();"title="> one right"><i class="fa-solid fa-forward"></i></button>
                <button @click="frameNo = framesTotal;nstTimeSlideInput_focus();" title=">| to end"><i class="fa-solid fa-forward-step"></i></button>
            </div>

            <div class="nstDebugBar">
                <button @click="onLoadToLocal()" title="Load node stop time file or json"><i class="fa-solid fa-upload"></i></button>
                <button @click="onSaveToLocal()" title="Save node stop time file"><i class="fa-solid fa-floppy-disk"></i></button>
            </div>


            <div v-if="true" class="nstDebugBar">
                <button @click="test_setMulti()">sM</button> |
                <button @click="test_setSingle()">sS</button> |
                <button @click="onLoad_Start()">fL</button> |
                <button @click="divFindName='dB'; onDivFindName([]);onAddKeyFrame()">q?</button>
            </div>


            <!--
                <button @click="$refs.nstHistoryO.echo('hi')">o</button>
            -->

            <div class="nstHistoryBar">
                <NstHistory 
                    ref="nstHistoryO"
                    :layers="layers"
                    :metadata="metadata"
                    :lSelected="lSelected"
                    :divFindName="divFindName"
                    :nstTreePathSelected="nstTreePathSelected"
                    @nst-history-swap="onEmit_nstHistorySwap"
                    />
            </div>


            <div
                class="nstFindBar">

                <button
                    title="Import assets to canvas"
                    id="nstBtImportAssetsOpenShow"
                    @click="onImportAssetsToCanvas()"
                    ><i class="fa-solid fa-file-import"></i></button>

                <div 
                    v-if="showImportAssets"
                    style="
                        border:solid #c93ecb 4px;
                        border-radius: 6px;
                        background-color: #e1cbaf;
                        position: fixed;
                        margin-top:10px;
                        z-index:2;
                        padding:5px;
                        max-width:300px;
                        box-shadow: rgb(50, 50, 50) 5px 8px 15px;

                    "
                    >
                    <NstAssetsImport 
                        :homeUrl="homeUrl"
                        @nst-assets-import="onAssetsImport"
                        />

                </div>


                <button
                    title="Select node from local dome with cursor"
                    @click="onSelectNodeFromDome()"
                    :style=" 'color:'+(elSelectedIsActive?'red':'white')+';' "
                    ><i class="fa-solid fa-bullseye"></i>
                </button>

                <button
                    title="Select node from local dome with cursor"
                    @click="onTlTreeViewToogle()"
                    id="nstBtTreeOpenShow"
                    :style=" 'color:'+(elSelectedIsActive?'red':'white')+';' "
                    ><i class="fa-solid fa-diagram-project"></i>
                </button>


                #:
                <input title="Look for div node $('#....')"
                    :placeholder=" elSelectedStr "
                    type="text" v-model="divFindName"
                    style="width:125px"
                    @change="onDivFindName([])"
                    >
                




                <button 
                    :disabled="lSelected==-1"
                    @click="showProperties = !showProperties"
                    >
                    <i :class="'fa-solid fa-caret-'+(showProperties ? 'up' : 'down')"></i>
                </button>



                <div 
                    v-show="lSelected != -1 && showProperties"
                    style="
                        border:solid darkolivegreen 4px;
                        border-radius: 6px;
                        background-color: gainsboro;
                        position: absolute;
                        margin-top:10px;
                        z-index:2;
                        padding:5px;
                        max-width:290px;
                        max-height:66vh;
                        overflow-y: auto;
                        box-shadow: rgb(50, 50, 50) 5px 8px 15px;

                    "
                    >

                    <NstAnimSelector
                        asMode="edit"
                        :layerSelected="layelSelected"
                        :divSelectedName="divSelectedName"
                        :selected="animeSelected"
                        :nstTreePathSelected="nstTreePathSelected"
                        :nstTreeNodesSelected="nstTreeNodesSelected"
                        @nst-animation-change="onEmit_setAnimeChange"
                        />

                    <NstPropSelector 
                        v-if="1"
                        :layerSelected="layelSelected"
                        :divSelectedName="divSelectedName"
                        :properties="propertiesSelectedNow"
                        :selected="propertiesSelected"
                        :nstTreePathSelected="nstTreePathSelected"
                        :nstTreeNodesSelected="nstTreeNodesSelected"
                        :homeUrl="homeUrl"
                        @nst-prop-selection-change="propertiesSelectedChange"
                        @nst-value-manipulator="onEmit_setPropertiesOfNode"
                    
                        />
                            
                </div>








                <button
                    :disabled=" lSelected == -1 "
                    id="nstInsertKeyFrameNode"
                    title="Insert key frame (+)"
                    @click="onAddKeyFrame();nstTimeSlideInput_focus();"
                    ><i class="fa-solid fa-plus"></i></button>
                

            </div>

        </div>



    </div>

    <!--
    <div
        class="nstTimeLine">Slider:</div>
    -->
    <NstTView 
        style="
            box-shadow: rgb(50,50,50) 0px 5px 10px 5px;
            position:absolute;
            overflow-y: auto;
            min-width: 100%"
        @onNodeSelected="onNodeSelectedByTree"
        :pathsSelected="nstTreePathSelected"
        />


    <div
        class="nstTimeLine"
        style="
            box-shadow: rgb(50,50,50) 0px 5px 10px inset;
            overflow-y: auto;
            max-height: 80vh;
        "
        >Layers:<br></br>

        <div
            v-for="layer in layers"
             style="                    
                    display: inline-block;
                "
            >
            
            <div class="nstLayerTopBar"
            
                :style="
                    (layer.divName == divSelectedName?
                        'background-color:rgb(11, 66, 1);color:white;':
                        'background-color:rgb(228, 239, 188);color:gray;')
                    "
                >

                <input type="checkbox"
                    title="show / hide object / layer" v-model="layer.isVisible"></input>
                
                <div 
                    style="display:inline;cursor:pointer;padding-right: 60px;"
                    @click="makeSelectedNode_ByName( layer.divName, 'all' )"
                    >

                    <NstTItemNode 
                        :name="getTagNameFrom_layer( layer )"
                        :aId="layer.divName.substring(1)"
                        />
                        <!--
                        @do-item-selected="doItemSelected()"
                        -->
                    <!--
                    <span v-if="layer.divName != divSelectedName"
                        style="color:gray;"
                        >
                        {{ layer.divName }}
                    </span>
                    <span v-else
                        >
                        {{ layer.divName }}
                    </span>
                    -->
                    
                </div>
                <div class="nstTLPropTools">

                    <!--
                    <i class="fa-regular fa-circle-check"
                        :title="`Select node: \n\t[${layer.divName}]`"
                        @click="makeSelectedNode_ByName( layer.divName, [] )"></i> |
                    <i class="fa-regular fa-copy"
                        @click="console.log('TODO')"></i> | 
                    <i class="fa-solid fa-broom"
                        @click="console.log('TODO')"></i> | 
                    -->
                    <i class="fa-regular fa-trash-can"
                        @click="removeLayer_ByName( layer.divName )"></i>

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
                                :style=" 
                                        (propertiesSelected.indexOf( f.name )!=-1 &&
                                            layer.divName == divSelectedName )?'color:black;filter:sepia(0);':'color:gray;filter:sepia(0.7);'
                                    "
                                >
                                
                                <!--/*(layer.divName != divSelectedName?'nstFrameCssBlockSmaller ':'')*/-->
                                <div 
                                    :class="'debBorders '"
                                    
                                    >
                                    <!--
                                        @click="makeSelectedNode_ByName( layer.divName, [f.name], $event )"
                                    -->
                                    {{ f.name }}

                                    <div class="nstTLPropTools">

                                        <i class="fa-regular fa-circle-check"
                                            :title="`Select node: \n\t[${layer.divName}]\nwith property: \n\t[${f.name}]`"
                                            @click="makeSelectedNode_ByName( layer.divName, [f.name] )"></i> |
                                        <!--
                                        <i class="fa-regular fa-copy"
                                            @click="console.log('TODO')"></i> | 
                                        <i class="fa-solid fa-broom"
                                            @click="console.log('TODO')"></i> | 
                                        -->
                                        <i class="fa-regular fa-trash-can"
                                            @click="removeProperty_ByName( layer.divName, [f.name] )"></i>

                                    </div>

                                </div>

                                <!--
                                    <NstPropertyRow :propertyTimeline="f"></NstPropertyRow>
                                -->

                                <!-- old -->
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
                                        @click="frameNo=index; makeSelectedNode_ByName( layer.divName, [f.name] ); nstTimeSlideInput_focus();"
                                        >
                                        <small >
                                            {{ value }}                                            
                                        </small>
                                    </div>
                                </div>
                                <!-- old -->
                                

                            </div>
                           

                        </td>
                    </tr>
                </table>
            </div>


        </div>

    </div>




    <br>
    <br>
    <br>
    <br>
    <br>
    <br>



</template>






















<script>



/*

aajs.animate(['.myDotBox'],{'translateX':aajs.stagger(1),'translateY': aajs.stagger([0.0,-50.0], { ease: 'inOut(2)' }) });

*/




import { toRaw,reactive,ref } from 'vue';
//import NstKF from './nstKF.vue';
import {  
    //layers_to_saveJson, 
    //layers_from_json, 
   // layers_to_timeLine
   } from '../layerHelper';
import NstPropSelector from './nstPropSelector.vue';
import NstValueManipulator from './nstValueManipulator.vue';
import NstAnimSelector from './nstAnimSelector.vue';
import { nstConvert, nstImportAsset, nstLib } from '../nstLib';
import {animate as ajsanimate } from 'animejs';
import NstAssetsImport from './nstAssetsImport.vue';
import NstTView from './nstTView.vue';
import MATreeViewNST from '../MediaAssets/treeView_showHide1.json'
import NstHistory from './nstHistory.vue';
import NstTItemNode from './nstTItemNode.vue';
//import NstEases from './nstEases.vue';
//import NstiFs from './nstiFs.vue';
//import nstProperty from './nstProperty.vue';

let nstTLMSDiv = -1;



export default{
    components:{ 
        //"NstPropertyRow": nstProperty 
        //"NstKF": NstKF
        "NstHistory": NstHistory,
        "NstPropSelector": NstPropSelector,
        "NstValueManipulator": NstValueManipulator,
        "NstAnimSelector": NstAnimSelector,
        "NstAssetsImport": NstAssetsImport,
        "NstTView": NstTView,
        "NstTItemNode": NstTItemNode
        //"NstiFileSystem": NstiFs,
    },
    mounted(){
        console.log('nstTimeLine mounted ');
        //window['cycle'] = decycle;

        if(0){
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
        }

        /*
        TlTreeViewRes['timeLine'].reset();
        */
       //console.log('html is :',$('#htmlDynoHandler'));
       let TlTreeViewRes = this.nstLibO.getTimeline_FromJsonData( MATreeViewNST );
       this.TlTreeView = toRaw( TlTreeViewRes['timeLine'] );
       //console.log('html is 2:',$('#htmlDynoHandler'),TlTreeViewRes);

        setTimeout(()=>{

            //console.log('html is 3:',$('#htmlDynoHandler'),TlTreeViewRes);
            this.TlTreeView.reset();
            console.log('updated ....');
            nstTLMSDiv = $('#nstTLMS');

            
        },100);

        setTimeout(()=>{
            //this.nstTreePathSelected = [];
            console.log('nstMulti - temp force selection two');
            this.divFindName = 'dB';            
            this.onDivFindName(-8);
            this.nstTreePathSelected = [ [ 47, 1, 1, 0, 1 ], [ 47, 1, 1, 0, 0 ] ];
            this.showProperties = true;

        },500);

        //this.timeLine.restart();

        this.$refs.nstHistoryO.saveStase('mounted');

    },
    props:[ 'homeUrl' ],
    data(){

        let fps = 10.00;
        let framesTotal = 20;

        let frameMs = parseInt( 1000.00 / fps );
        let framesTotalMs = frameMs* (framesTotal-1);

        let nstTLMS = -1;
        let cellWidth = (window.innerWidth - 100) / (framesTotal - 1) ;

        let nstl = new nstLib();

        return {
            nstLibO: nstl,
            metadata: {
                fps: fps,
                framesTotal: framesTotal,
                timeLine: -1,
                frameMs: frameMs,
                framesTotalMs: framesTotalMs,
                assets: []
            },
            
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
            
            divFindName: ref(''),
            elSelected:null,
            elSelectedIsActive: false,


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
                propertiesNow:{}
            },
            */
            timeLine: null,
            timeLineStack:[],
            
            nstTLMS: nstTLMS,

            animeSelected:{ type: 'set' },
            propertiesSelected:[],
            showProperties: false,
            showImportAssets: false,
            propertiesSelectedNow:{},
            propertiesUpdateDelay:-1,
            observeAtId: null,
            observe: null,

            lSelected:-1,
            layers: [],

            nstTreePathSelected:[ 
                //[ 47, 1, 1, 0, 1 ], [ 47, 1, 1, 0, 0 ]
                //[48,1,1,0,2], [48,1,1,0,3,3,2] ,[47,1,1,0,1]
            ],
            nstTreeNodesSelected:[],
            TlTreeView: -1,

            fileDialogOpen: false,
            fileDialogOperation: '',

        };
    },
    computed:{
        divSelectedName(){
            console.log('divSelectedName -> select ('+this.lSelected+') layers',this.layers);
            if( this.lSelected == -1 ) return 'NaN';
            else if( 'divName' in this.layers[ this.lSelected ] ){
                return this.layers[ this.lSelected ]['divName'];
            } else {
                return 'NaN2';
            }
        },
        layelSelected(){
            if( this.lSelected == -1 ) return -1;
            else return this.layers[ this.lSelected ];
        },
        propertiesSelectedStr(){
            if( this.propertiesSelected == 'all' ) return 'all';
            else return this.propertiesSelected.join(', ');
        },
        propertiesSelectedNow_computed(){
            return this.propertiesSelectedNow;
        },
        //propertiesSelectedNow(){
        //    return this.getPropertiesOfNode_ById( this.divSelectedName.substring(1) );
        //}

        elSelectedStr(){
            if( this.elSelected === null )
                return 'by Id';
            else{
                let id = this.elSelected.getAttribute('id');
                let tagName = this.elSelected.tagName;
                if( id != null )
                    return 'ok: <'+tagName+'>  #'+id;
                else
                    return 'No id . . <'+tagName+'>';
            };
        },

    },
    watch:{
        replayTimeScale( nScale, oScale ){
            this.replayTimeScale = nScale;
            //this.timeLine.speed = nScale;
        },
        nstTreePathSelected( nSel, oSel ){
            console.log('nstMulti - new selection ',nSel);
            let tr = [];
            for( let s of nSel ){
                let o = nstConvert.getElementFromDomeByIndexPath(
                    document.body, s
                );
                if( o != -1 ) tr.push( o );
            }
            this.nstTreeNodesSelected = tr;
        },

        frameNo( nframe, oframe ){

            if( nframe < 0 )
                this.frameNo = 0;
            else if( nframe >= this.framesTotal )
                this.frameNo = this.framesTotal-1;
            //else
             //   console.log('(watch2) nframe in range so ok ',this.frameNo);


             let ms = this.msAtFrame( this.frameNo );

            this.frameNoAtMs = ms;
            //this.frameNo = nframe;
            if( 0 ) console.log('(watch) frameNo changed ! ',nframe,' from ',oframe,
                '\nframeNoAtMs: '+this.frameNoAtMs+" ms."
            );

            if( this.metadata.timeLine != -1 ){
                //this.timeLine.stretch( this.framesTotalMs );
                //console.log('timeLine seek to :', this.metadata.timeLine, ms);
                this.metadata.timeLine.seek( ms );
                //this.timeLine.stretch( this.framesTotalMs / this.replayTimeScale );
            }
            //this.onSeekSet();
        }
    },
    
    methods:{
        test_setMulti(){
            //this.nstTreePathSelected = [];
            console.log('nstMulti - temp force selection two');
            this.divFindName = 'dB';            
            this.onDivFindName(-8);
            this.nstTreePathSelected = [ [ 47, 1, 1, 0, 1 ], [ 47, 1, 1, 0, 0 ] ];
        },
        test_setSingle(){
            //this.nstTreePathSelected = [];
            console.log('nstMulti - temp force selection one');
            this.divFindName = 'dA';            
            this.onDivFindName(['top']);
            this.nstTreePathSelected = [ [ 47, 1, 1, 0, 0 ] ];
        },

        getTagNameFrom_layer( layer ){
            let dName = layer.divName;
            if( dName == undefined ) return 'ErrTagName2';
            let tr = document.getElementById( dName.substring(1) );
            if( tr ) return tr.tagName
            else return 'ErrTagName';
        },
        onEmit_nstHistorySwap( data ){
            console.log('got history swap !',data);
            
            //this.lSelected = -1;
            this.layers = data.history.layers;
            this.lSelected = data.history.lSelected;
            this.divFindName = data.history.divFindName;
            this.nstTreePathSelected = data.history.nstTreePathSelected;

            let lttlRes = this.nstLibO.getTimeline_FromJsonData( {
                metadata: this.metadata,
                layers: toRaw (this.layers )
            } );
            this.metadata.timeLine = lttlRes.timeLine;

            $.toast('Undo - '+data.history.note);


        },

        nstTimeSlideInput_focus(){
            this.$refs.nstTimeSlideInput.focus();
        },
        onEmit_setAnimeChange( opts ){
            this.animeSelected = opts.wantState;            
        },
        //onEmit_nstValueManipulator( opts )
        //onEmit_setPropertiesOfNobeById
        onEmit_setPropertiesOfNode( opts ){
            console.log('nstMulti- \n paths:',this.nstTreePathSelected,'\n objects:',this.nstTreeNodesSelected);
            
            for(let o of this.nstTreeNodesSelected )
                this.setPropertiesOfNode_ById( o.getAttribute('id'), opts );  
        
        },
        propertiesSelected_Set( props ){
            this.propertiesSelected = props;
        },
        propertiesSelectedChange( propState ){
            if( propState.wantState == false ){
                let pIn = this.propertiesSelected.findIndex( ps => ps == propState.pName );
                if( pIn == undefined ){
                    console.error('ee want to change selection not existing in selection :/',propState);
                }else{
                    this.propertiesSelected.splice(pIn,1);
                }
                
            }else{
                if( this.propertiesSelected.indexOf( propState.pName ) == -1 )
                    this.propertiesSelected.push( propState.pName );
            }


            
        },  

        layer_getByDivName( divName, addToLayers = true ){

            let layers = this.layers;
            let lId = layers.findIndex( l=>l.divName==divName);
            //debugger
            if( lId != -1 ) return layers[ lId ];
            else{
                let layer = {
                    divName: String(divName),
                    order: 0,
                    isVisible: true,
                    domType: 'html',
                    domSrcOver: 'local',
                    nodeObservator: null,
                    obj: null,//$(divName),
                    frameAddedAt: parseInt( this.frameNo ),
                    kFrames: [],
                    propertiesNow: {}
                };
                if( addToLayers == true )
                    layers.push( layer );


                
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


        onLoad_Start(){
            this.fileDialogOpen = true;

        },

        onLoadToLocal(){
            let fd = null;
            let onLoadDone = ( msg ) => {
                console.log('ok so data to load is \n\n',msg,'\n\n');
                this.onLoadToLocalFromString( msg );
                fd.app.closePanel();
            }; 

            fd = setOpts.FileDialog('load',{'onDone':onLoadDone});

        },

        async onLoadToLocal_old(){
            let f = await iFs.readFile('nst/nst_v3_1.ajs');
            this.onLoadToLocalFromString( f );
        },
        
        onLoadToLocalFromString( f ){
            
            let fj = JSON.parse( f );
            this.metadata = fj.metadata;

            if( 'assets' in this.metadata ){
               for( let pay of this.metadata.assets ){                
                    pay['homeUrl'] = this.homeUrl;
                    let res = nstImportAsset( pay );                    
                }
            }
            
            setTimeout(()=>{            
                let TlRes = this.nstLibO.getTimeline_FromJsonData( fj );
                this.layers = fj.layers;

                this.metadata.timeLine = TlRes.timeLine;
                //this.lSelected = -1;
                //this.frameNo = 0;
                console.log(' on load to lacal.....',TlRes);
                
                $.toast(`Loaded<br>
                    fps: ${fj.metadata.fps}<br>
                    frames: ${fj.metadata.framesTotal}`);

            },300);
            
            return 1;
            
        },

        onSaveToLocal(){
            let res2 = this.nstLibO.layers_toStr( toRaw(this.layers), toRaw( this.metadata ) );
            setOpts.FileDialog('save', JSON.stringify(res2, null, 4) );
        },

        async onSaveToLocal_old(){
            let res2 = this.nstLibO.layers_toStr( toRaw(this.layers), toRaw( this.metadata ) );

            let asName = 'nst/nst_v3_1.ajs'; 

            
            const fileExists = await iFs.exists( asName );
            await iFs.writeFile(asName, JSON.stringify(res2, null, 4) );

            $.toast(
                'Layers save in local storage<br>'+
                (fileExists ? 'Overrited<br>':'New<br>')+
                '<small>Adress:</small> '+asName
            );
        
          
        },

        onPlay(){
            this.isPlaying = true;



            // if last one play from start
            if( this.frameNo == this.framesTotal-1 )
            this.frameNo = 0;

            //this.timeLine.resume();

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
            //this.timeLine.pause()
            clearInterval(this.iterator);
        },

        playSelectionMarker( markerId ){
             aajs.animate( markerId,{
                loop:1,
                duration: 600,
                autoplay: true,
                opacity:{
                    from: 0.5,
                    to: 1.0
                },
            });
        },

        onImportAssetsToCanvas(){
            this.showImportAssets = !this.showImportAssets;
        },

        
        onAssetsImport( pay ){          
            //debugger  
            console.log('on Assets import\n ------------------------\n',
                'pay got :\n',pay,'\n---------------------------'
            );
            pay['homeUrl'] = this.homeUrl;
            let res = nstImportAsset( pay );
            res.then(ok=>{
                if( ok[0] == 0 ){
                    this.metadata.assets.push( ok[1] );
                }
                
            })
            .catch(e=>{
                
            });
            
            this.showImportAssets = false;

        },

        onTlTreeViewToogle(){
            console.log('tree view toogle ',this.TlTreeView._currentTime);
            if( this.TlTreeView._currentTime == 0 ){
                this.TlTreeView.play();
                setTimeout(()=>{
                    this.TlTreeView.pause();
                    this.TlTreeView.seek(500);

                },500);
            }else if( this.TlTreeView._currentTime == 500 ){
                this.TlTreeView.seek(1400);
                this.TlTreeView.play();
                setTimeout(()=>{
                    this.TlTreeView.reset();
                    this.TlTreeView.seek(0);

                },500);
            }else{
                //this.TlTreeView.reverse();
            }
        },

        onSelectNodeFromDome(){
            
            let onMouseMoveSelector = (e) =>{
                //console.log('nst-S mouse at ',e.clientX,e.clientY);
                if( this.elSelected && this.elSelected !== e.target ){
                    this.elSelected.classList.remove( 'nstSelectorNode' );
                }
                if( e.target !== document.body ){
                    this.elSelected = e.target;
                    e.target.classList.add( 'nstSelectorNode' );
                }
            };
            let onMouseMoveSelector_out = (e) =>{
                if( this.elSelected && this.elSelected === e.target ){
                    this.elSelected.classList.remove( 'nstSelectorNode' );
                    this.elSelected = null;
                }
            };
            let onMouseMoveSelector_click = (e) =>{
                console.log('nst-S selected at ',e.clientX,e.clientY,
                    '\n element is :',e.target
                );
                e.stopPropagation();
                if( this.elSelected != null ){
                    let id = this.elSelected.getAttribute('id');
                    this.divFindName = id;
                    this.onDivFindName([]);
                    deactivateSelector();
                }
            };

            let deactivateSelector = () => {
                document.removeEventListener( 'mouseover', onMouseMoveSelector );
                document.removeEventListener( 'mouseout', onMouseMoveSelector_out );
                document.removeEventListener( 'click', onMouseMoveSelector_click );
                if( this.elSelected != null )
                    this.elSelected.classList.remove( 'nstSelectorNode' );
                this.elSelected = null;
                this.elSelectedIsActive = false;
            };
            let activeteSelector = () => {
                document.addEventListener( 'mouseover', onMouseMoveSelector );
                document.addEventListener( 'mouseout', onMouseMoveSelector_out );
                document.addEventListener( 'click', onMouseMoveSelector_click );
                this.unSelectElement();
            };


            if( this.elSelectedIsActive == false ){
                this.elSelected = null;
                this.elSelectedIsActive = true;
                activeteSelector();

            }else{
                deactivateSelector();

            }

        },
        
        unSelectElement(){
            this.lSelected = -1;
            this.divFindName = '';
            this.propertiesSelected = [];
            //this.showProperties = true;

        },


        onDivFindName( properties = [] ){
            let lookRes = $(`#${this.divFindName}`);
            console.log('div find name .... ['+this.divFindName+'] have ('+lookRes.length+')'
            );

            console.log('[',lookRes,']',' typeof ', typeof lookRes);

            if( this.divFindName == '' ){
                this.unSelectElement();
                return 1;
            }


            if( lookRes.length == 1 ){
                this.makeSelectedNode_ByDivObj ( lookRes, properties );
                //console.log('css\n',this.getPropertiesOfNode_ById( this.divFindName ));
            }else if( lookRes != null ){
                this.makeSelectedNode_ByDivObj ( lookRes, properties );
            }

        },


        
        onNodeSelectedByTree( data ){
            //debugger
            
            this.divFindName=data.selectById; 
            let tm_nstTreePathSelected = JSON.parse( JSON.stringify( toRaw( this.nstTreePathSelected ) ) );
            this.onDivFindName(-8);
            if( data.event.event.ctrlKey == true ){
                let oById = document.getElementById( data.selectById );
                let pathIn = nstConvert.getIndexOfChildReq( oById );
                //debugger
                let iT = tm_nstTreePathSelected.findIndex( k => JSON.stringify(k) === JSON.stringify(pathIn) );
                if( iT == -1 )
                    tm_nstTreePathSelected.push( pathIn );
                else
                    tm_nstTreePathSelected.splice( iT, 1 );
                this.nstTreePathSelected = tm_nstTreePathSelected;
                 //debugger
            }
        },

        clearEmptyLayers(){
            //console.log('layers clean ',this.layers.length);
            let layers = this.layers;
            let mark4Del = [];
            for(let li=0;true && layers.length > 0;){
                if( layers[li]['kFrames'].length == 0  ){
                    //console.log('found empty layer: ',li);
                    mark4Del.push( li++ );
                }else{
                    li++;
                }
                if( li >= layers.length ) break;
            }
            if( mark4Del.length ){
                console.log('[i] Clear emty layers:',mark4Del);
                for( let i of mark4Del.reverse() )
                   this.layers.splice( i, 1 );
            }
            
            
        },

        makeSelectedNode_ByDivObj( divObj, properties = [] ){  
              
            //this.clearEmptyLayers();
            
            let layer = this.layer_getByDivName( divObj.selector );//layer_get_layerByDivName( this.layers, divObj.selector, this.frameNo );
            this.lSelected = -1;
            this.propertiesSelectedNow = this.getPropertiesOfNode_ById( divObj.selector.substring(1), this.onDivObjPropertiesUpdate );
            if( properties != -8 ) this.animeSelected = this.getAnimeOfNode_layer( layer );
            this.lSelected = this.layers.findIndex( l=>l.divName == divObj.selector ) ;
            this.nstTreePathSelected = [ nstConvert.getIndexOfChildReq( 
                document.getElementById( divObj.selector.substring(1) )
             ) ];

                        
            if( properties == -8 ){

            }else{
            
                if( properties != [] )
                    this.propertiesSelected_Set( properties );            

                if( this.propertiesSelectedStr == 'all'){
                    this.propertiesSelected_Set( layer.kFrames.map( par => par.name ) );
                }

            }

            this.$refs.nstHistoryO.saveStase('make-selected-node_by-div-obj');
        },

        removeLayer_ByName( layerName ){
            console.log('remove layer:',layerName);
            let lInd = this.layers.findIndex( l => l.divName == layerName );
            if( lInd == -1 ){
                console.error('EE can\'t remove layer ',layerName, ' index -1');
                return -1;
            }
            this.layers.splice( lInd, 1 );

            this.$refs.nstHistoryO.saveStase('remove-layer_by-name_'+layerName);
        },


        removeProperty_ByName( nodeName, properties = []){
            if( properties == undefined ){
                console.log('EE wrong properties to remove ',properties,' for nodeName:',nodeName);
                return -1;
            }

            let lInd = this.layers.findIndex(l=> l.divName == nodeName );
            if( lInd == -1 ){
                console.log('EE no layer found with nodeName: ',nodeName);
                return -2;
            } 

            let layer = this.layers[ lInd ];

            let toDel = [];
            for( let i=0,ic=layer.kFrames.length; i<ic; i++ ){                
                if( properties.indexOf( layer.kFrames[ i ]['name'] ) != -1 )
                    toDel.unshift( i );

            }
            for(let di of toDel ){
                layer.kFrames.splice( di, 1 );
            }
            
            this.$refs.nstHistoryO.saveStase('remove-property_by-name'+JSON.stringify([nodeName,properties]));
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

        getPropertiesDom_local_html( layer, byId, callBackOnChange = undefined ){
            let fd = {};            
            let node = document.getElementById( byId );
            if( node == undefined ){
                console.error('EE no element by id found :',byId);
                return undefined;
            } 
            let compCs = window.getComputedStyle( node );
            compCs.forEach( pName => {
                fd[ pName ] = node.getAttribute( pName );
                if( fd[ pName ] == null || fd[ pName ] == 'none' )
                    fd[ pName ] = compCs.getPropertyValue( pName );
            });

            // observator of changes 
            if( callBackOnChange != undefined ){
                if( this.observeAtId != byId && this.observeAtId != null ){
                    toRaw( this.observe ).disconnect();
                    console.log(`observer KILL/DISCONNECT for [${layer.domType}@${layer.domSrcOver}]#[${byId}] of node ......`);
                }
                
                this.observeAtId = String( byId );
                let observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) 
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        callBackOnChange( mutation, byId );                            
                    }
                });

                observer.observe( node, { attributes: true });
                console.log(`observer START for [${layer.domType}@${layer.domSrcOver}]#[${byId}] of node ......`);
                this.observe = observer;
            }

            return fd;
        },

        getPropertiesOfNode_ById( byId, callBackOnChange = undefined ){
            // get properties CSS from node
            let layer = this.layer_getByDivName( '#'+byId );
            console.log(` get properties [${layer.domType}@${layer.domSrcOver}]#[${byId}] of node`);
            
            if( layer.domSrcOver == 'local' && layer.domType == 'html' ){
                return this.getPropertiesDom_local_html( layer, byId, callBackOnChange );             

            }else {
                TODO
                // different then local html dome source of properties ws ?
            }

            
        },

        getAnimeOfNode_layer( layer ){
            // get animation settings for this kays
            let fNo = this.frameNo;
            let propNow = toRaw(this.propertiesSelected);
            let kFrames = layer.kFrames;
            
            let tr = -1;
            for( let kf of kFrames){
                if( propNow.includes( kf.name ) ){
                    if( kf.lHelpers[ fNo ] != null ){
                        tr = kf.lHelpers[ fNo ];
                    }

                }
            }
            
            //debugger
            if( tr == -1 ) tr = {type:'set'};
            console.log('anime opts from click: ',tr);
            return tr;

        },



        setPropertiesOfNode_ById( byId, opts ){
            let layer = this.layer_getByDivName( '#'+byId );
            console.log(` set properties  [${layer.domType}@${layer.domSrcOver}]#[${byId}] of node opts:`+JSON.stringify(opts,null,4) );

            if( layer.domSrcOver == 'local' && layer.domType == 'html' ){
               // $( '#'+byId ).css( `${opts.propName}`, `${opts.newValue}` );
               let o = { duration: 500, autoplay:true };
               o[ opts.propName ] = opts.newValue;
               console.log('so push :',o);
               ajsanimate( '#'+byId, o );
               //document.getElementById( byId ).setAttribute( opts.propName, opts.newValue );

            } else {
                TODO
                // different then local html dome source of properties ws ?
            }

        },

        onDivObjPropertiesUpdate( mutation, byId ){
            //console.log('diff div obj update : byId ['+byId+']');
            if( this.propertiesUpdateDelay == -1 ){
            }else{
                clearTimeout( this.propertiesUpdateDelay );
            }
            this.propertiesUpdateDelay = setTimeout(()=> {
                this.propertiesSelectedNow = this.getPropertiesOfNode_ById( byId );
            },100);3

        },

        getQueryAboutWhatTo(){
            let css = this.getPropertiesOfNode_ById( this.divSelectedName.substring(1) );
           
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
            let aniOpts = JSON.parse(JSON.stringify(toRaw(this.animeSelected)));
            if( aniOpts['type'] == 'ani. every' ) aniOpts['type'] = 'animate';
            //debugger
            return {
                    'animeOpts': aniOpts,
                    'css': css,
                    'keys': tr
                };
        },



        
        getKFrameByName( kFrameName, kFrames ){
            if( kFrames.length == 0 ) return [];
            
            let kFramesR = toRaw( kFrames );
            //console.log(' name : ['+kFrameName+'] kframes:',kFrames);


            let res = kFramesR.find( kf => {
                //console.log('       - kf property ',kf);
                return kf.name == kFrameName;
            });
            //console.log('res ', res );
            if( res != undefined ) return res;
            else{
                //console.error('ee wrong count of kFrames by name ['+kFrameName+'] res:\n',res);
                return -1;
            }

        },

        
        


        onAddKeyFrame(){
            console.log('nstMulti- onAddKeyFrame \n paths:',this.nstTreePathSelected,'\n objects:',this.nstTreeNodesSelected);
            let tnstps = JSON.parse( JSON.stringify( toRaw( this.nstTreePathSelected )));
            let propSel = JSON.parse( JSON.stringify( toRaw( this.propertiesSelected ) ) );
            
            
            for(let o of this.nstTreeNodesSelected ){
                this.divFindName = o.getAttribute('id'); 
                this.onDivFindName( -8 );
                this.onAddKeyFrameWithAllSet();

            }
            this.nstTreePathSelected = tnstps;
            //this.onAddKeyFrameWithAllSet();
        },

        onAddKeyFrameWithAllSet(){

        
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
                    kFrame.lHelpers[ cFrame ] = q.animeOpts;

                    layer.kFrames.push( kFrame );
                    
                    
                }else{

                    if( kFrame.keys[ cFrame ] == null ){
                        kFrame.keys[ cFrame ] = q.keys[ cssk ];
                        console.info( ' [i] adding key ['+cssk+'] at frameNo ?',cFrame, deb?kFrame:'');
                        kFrame.lHelpers[ cFrame ] = q.animeOpts;

                    } else {
                        kFrame.keys[ cFrame ] = q.keys[ cssk ];
                        console.info( ' [i] update key ['+cssk+']   to [',
                            kFrame.keys[ cFrame ],'] \n q: \n',q);
                        kFrame.lHelpers[ cFrame ] = q.animeOpts;
                    }
                    
                }
            }



            let lttlRes = this.nstLibO.getTimeline_FromJsonData( {
                metadata: this.metadata,
                layers: toRaw (this.layers )
            } );

            //let lttlRes = layers_to_timeLine( toRaw(this.layers), {
            //    fps: this.fps, framesTotal: this.framesTotal,
            //    frameMs: this.frameMs
            //} );
            //debugger
            console.log('timeline rebuild result\n---------------------------------\n',
                lttlRes);
            this.metadata.timeLine = lttlRes.timeLine;

            //this.playSelectionMarker( divName );

            this.$refs.nstHistoryO.saveStase('on-add-key-frame');

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

.nstBubbleDiv{
    border-radius: 7px;
    border: solid #1b3ad5 2px;
    margin-bottom:1px;
    margin-right:2px;
    margin:0px;
    padding-top:2px;
    padding-bottom:2px;
    padding-right:5px;
    display:inline-block;
    background-color: #ffebeb;
}
.nstBubbleDiv input{
    border-radius: 5px;
}

.nstInfoNowBar{
    font-size: 70%;
    background-color: rgb(247, 245, 207);
    text-shadow: none;
    min-height: 33px;
    max-height: 33px;
    overflow-y: auto;
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
.nstButton{
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

.nstHistoryBar {
    border: solid 3px rgb(255, 162, 0);
    border-radius: 5px;
    display:inline-block;
}
.nstHistoryBar button{
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
    border-radius: 10px;
    padding: 4px 4px; 
    border-radius:6px;
    position: relative;

}

.nstTLPropTools{
    display:inline-block;
    position:absolute;
    right: -2px;
    top:-6px;
    border-radius: 7px;
    border: solid 2px #059b11;
    background-color: #dcdcdc;
    cursor:pointer;
    padding:2px;
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


.nstSelectorNode{
    outline: 6px double blue;
    background-color: rgba(248, 29, 87, 0.1);
    
}

</style>
