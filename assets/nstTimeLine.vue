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

   

    <div v-if="lSelected != -1"
        style="border-radius:5px; border:solid blueviolet 2px;padding:5px; margin:5px;">
        
        <NstAnimSelector
            asMode="edit"
            :layerSelected="layelSelected"
            :divSelectedName="divSelectedName"
            :selected="animeSelected"
            
            @nst-animation-change="onEmit_setAnimeChange"
        
            />

        <NstPropSelector 
            v-if="1"
            :layerSelected="layelSelected"
            :divSelectedName="divSelectedName"
            :properties="propertiesSelectedNow"
            :selected="propertiesSelected"
            
            @nst-prop-selection-change="propertiesSelectedChange"
            @nst-value-manipulator="onEmit_setPropertiesOfNobeById"
        
            />
    </div>
        
    <div
        class="nstTimeLine">Tools:<br></br>

        <div class="nstBox1">
            <div class="nstControlsBar">
                <button @click="frameNo = 0; nstTimeSlideInput_focus();">|<</button>
                <button @click="frameNo--;nstTimeSlideInput_focus();"><</button>
                <button v-if="isPlaying"
                    @click="onStop();nstTimeSlideInput_focus();">stop</button>
                <button v-else
                    @click="onPlay();nstTimeSlideInput_focus();">play</button>
                <input type="checkbox" v-model="playInLoop"
                    title="Play in loop"></input>
                <select v-model="replayTimeScale">
                    <option v-for="value in replayTimeScaleOpts" :value="value.value">{{ value.name }}</option>

                </select>


                <button @click="frameNo++;nstTimeSlideInput_focus();">></button>
                <button @click="frameNo = framesTotal;nstTimeSlideInput_focus();">>|</button>
            </div>

            <div class="nstDebugBar">
                <button @click="onSaveToLocal()">save</button> | 
                <button @click="onLoadToLocal()">load</button>
            </div>


            <div class="nstDebugBar">
                <button @click="onLoad_Start()">fL</button> |
                <button @click="divFindName='dB'; onDivFindName([]);onAddKeyFrame()">q?</button>
            </div>



            <div
                class="nstFindBar">

                <i class="fa-solid fa-bullseye"
                    title="Select node from local dome with cursor"
                    @click="onSelectNodeFromDome()"
                    :style=" 'color:'+(elSelectedIsActive?'red':'black')+';' "
                    ></i>


                #:
                <input title="Look for div node $('#....')"
                    :placeholder=" elSelectedStr "
                    type="text" v-model="divFindName"
                    @change="onDivFindName([])"
                    >

                <button
                    v-if=" lSelected != -1 "
                    id="nstInsertKeyFrameNode"
                    title="Insert key frame"
                    @click="onAddKeyFrame();nstTimeSlideInput_focus();"
                    >+</button>
                

            </div>

        </div>



    </div>


    <div class="nstDebugBar" v-if="fileDialogOpen!=10">
        <!--
            <NstiFileSystem 
            :operation="fileDialogOperation"
            />
            -->

    </div>




    <div
        class="nstTimeLine">Time:<br></br>

        <input
            style="min-width: 100%;"
            ref="nstTimeSlideInput"
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
import { nstLib } from '../nstLib';
import {animate as ajsanimate } from 'animejs';
//import NstiFs from './nstiFs.vue';
//import nstProperty from './nstProperty.vue';

let nstTLMSDiv = -1;



export default{
    components:{ 
        //"NstPropertyRow": nstProperty 
        //"NstKF": NstKF
        "NstPropSelector": NstPropSelector,
        "NstValueManipulator": NstValueManipulator,
        "NstAnimSelector": NstAnimSelector,
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


        setTimeout(()=>{
            console.log('updated ....');
            nstTLMSDiv = $('#nstTLMS');
            },100
        );

        //this.timeLine.restart();
    },
    data(){

        let fps = 10.00;
        let framesTotal = 20;

        let frameMs = parseInt( 1000.00 / fps );
        let framesTotalMs = frameMs* (framesTotal-1);

        let nstTLMS = -1;
        let cellWidth = (window.innerWidth - 100) / (framesTotal - 1) ;


        return {
            nstLibO: new nstLib(),
            metadata: {
                fps: fps,
                framesTotal: framesTotal,
                timeLine: -1,
                frameMs: frameMs,
                framesTotalMs: framesTotalMs
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
            
            divFindName:'',
            elSelected:null,


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
            propertiesSelectedNow:{},
            propertiesUpdateDelay:-1,
            observeAtId: null,
            observe: null,

            lSelected:-1,
            layers:[],

            fileDialogOpen: false,
            fileDialogOperation: '',

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
                console.log('timeLine seek to :', this.metadata.timeLine, ms);
                this.metadata.timeLine.seek( ms );
                //this.timeLine.stretch( this.framesTotalMs / this.replayTimeScale );
            }
            //this.onSeekSet();
        }
    },
    
    methods:{
        nstTimeSlideInput_focus(){
            this.$refs.nstTimeSlideInput.focus();
        },
        onEmit_setAnimeChange( opts ){
            this.animeSelected = opts.wantState;            
        },
        //onEmit_nstValueManipulator( opts )
        onEmit_setPropertiesOfNobeById( opts ){
            this.setPropertiesOfNode_ById( String(this.divSelectedName).substring(1), opts );  
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
                
            }else
                this.propertiesSelected.push( propState.pName );


            
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
                    domType: 'html',
                    domSrcOver: 'local',
                    nodeObservator: null,
                    obj: null,//$(divName),
                    frameAddedAt: parseInt( this.frameNo ),
                    kFrames: [],
                    propertiesNow: {}
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


        onLoad_Start(){
            this.fileDialogOpen = true;

        },

        async onLoadToLocal(){
            
            
            let f = await iFs.readFile('nst/nst_v3_1.ajs');
            let fj = JSON.parse( f );
            
            
            
            
            let TlRes = this.nstLibO.getTimeline_FromJsonData( fj );
            //debugger
            this.layers = fj.layers;
            this.metadata.timeLine = TlRes.timeLine;
            //this.lSelected = -1;
            //this.frameNo = 0;
            console.log(' on load to lacal.....',TlRes);


            
            $.toast(`Loaded<br>
                fps: ${fj.metadata.fps}<br>
                frames: ${fj.metadata.framesTotal}`);

            return 1;
            
        },

        async onSaveToLocal(){
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
                    this.onDivFindName(['x']);
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
            };


            if( this.elSelectedIsActive == false ){
                this.elSelected = null;
                this.elSelectedIsActive = true;
                activeteSelector();

            }else{
                deactivateSelector();

            }
                       
        },
        

        onDivFindName( properties = [] ){
            let lookRes = $(`#${this.divFindName}`);
            console.log('div find name ....'+this.divFindName,
                ' have ('+lookRes.length+')'
            );

            console.log('[',lookRes,']',' typeof ', typeof lookRes);

            if( lookRes.length == 1 ){
                this.makeSelectedNode_ByDivObj ( lookRes, properties );
                //console.log('css\n',this.getPropertiesOfNode_ById( this.divFindName ));
            }else if( lookRes != null ){
                this.makeSelectedNode_ByDivObj ( lookRes, properties );
            }

        },


        


        makeSelectedNode_ByDivObj( divObj, properties = [] ){    
            let layer = this.layer_getByDivName( divObj.selector );//layer_get_layerByDivName( this.layers, divObj.selector, this.frameNo );
            this.lSelected = -1;
            this.propertiesSelectedNow = this.getPropertiesOfNode_ById( divObj.selector.substring(1), this.onDivObjPropertiesUpdate );
            this.animeSelected = this.getAnimeOfNode_layer( layer );
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

        getPropertiesDom_local_html( layer, byId, callBackOnChange = undefined ){
            let fd = {};            
            let node = document.getElementById( byId );
            if( node == undefined ) return undefined;
            let compCs = window.getComputedStyle( node );
            compCs.forEach( pName => {

                //fd[ pName ] = compCs.getPropertyValue( pName );
                fd[ pName ] = node.getAttribute( pName );
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
                        if (mutation.type === 'attributes' && mutation.attributeName === 'style') 
                            callBackOnChange( mutation, byId );                            
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
                //TODO
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
                //TODO
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
        return {
                'animeOpts': JSON.parse(JSON.stringify(toRaw(this.animeSelected))),
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
    margin-bottom:5px;
    margin-right:2px;
    margin:0px;
    padding-top:5px;
    padding-bottom:5px;
    padding-right:5px;
    display:unset;
    background-color: #ffebeb;
}
.nstBubbleDiv input{
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


.nstSelectorNode{
    outline: 6px double blue;
    background-color: rgba(248, 29, 87, 0.1);
    
}

</style>
