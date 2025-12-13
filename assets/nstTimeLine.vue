<template class="nst">
    <div class="nstInfoNowBar"
        id="nstInfoNowBar" >
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

    <!-- clipboard actions -->
    <div style="position:absolute; left: 20px; top: 10px; ">
    
        <div class="nstFindBar"            
            v-show="clipboardActions.length>0"            
            style="
                position: relative;
                background-color: white;
                "           
            >

            <div
                v-if="!clipboardActionsShow"
                style="
                    position: absolute;
                    left: 5px;top:-5px;
                    background-color: rgb(214 255 213);
                    "
                @click="clipboardActionsShow=!clipboardActionsShow"
                title="Clipboard - more informations"
                >
                ({{ clipboardActions.length }})

            </div>


            <div
                v-if="clipboardActionsShow"
                style="
                position: absolute;
                right: -35px;top: -10px;
                    ">
                <button
                    title="Clear clipboard"
                    @click="clipboardActions=[]"
                    >
                    <i class="fa-solid fa-xmark"></i>
                </button>

            </div>

            <div style="
                position: absolute;
                left: -15px;top: -5px;
                background-color: white;
                border-radius: 8px;
                "
                @click="clipboardActionsShow=!clipboardActionsShow"
                title="Clipboard - more informations"
                >
                <i class="fa-regular fa-clipboard"></i>
            </div>

            <div v-show="clipboardActionsShow && clipboardActions.length>0">
                <div v-for="ci,ciI in clipboardActions">
                    <a @click="clipboardActions.splice( ciI, 1 ) ">[x]</a> 
                    {{ ci.divName }} / {{ ci.propName }} key:[ {{ ci.key }}] help: [{{ci.lHelper}}]
                </div>

            </div>


        </div>

    </div>


    <div
        class="nstTimeLine"
        id="nstSeekNow">
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
            :value="frameNo"
            @input="setFrameNo"></input>
    </div>
    
       
    <div
        class="nstTimeLine">
        <!--
            Tools:<br></br>
        -->
        
        
        <div class="nstBox1">
        

            <!-- file / tools / ... START -->

            <div v-if="true" class="nstDebugBar"
                style="position:relative;"
                id="nstDebugTmpBar">

                <button @click="fileToolsShow=!fileToolsShow"
                    title="File / tools / ..."><i class="fa-solid fa-ellipsis-vertical"></i></button>


                <div 
                    v-show="fileToolsShow"
                    style="background-color: #aaccbb55;
                    width:100%;height:100%;
                    position:fixed;top:0px;left:0px;
                    z-index: 19;"
                    @mouseover="fileToolsShow=false;"                    
                    >
                
            
                
                </div>


                <Transition>

                    <div 
                        v-show="fileToolsShow"
                        id="nstToolsBlock"
                        style="
                            border:solid darkolivegreen 4px;
                            border-radius: 15px;
                            background-color: rgb(111,66,103);
                            color:white;
                            position: absolute;
                            margin-top:10px;
                            z-index:20;
                            padding:10px;
                            min-width:200px;
                            max-height:66vh;
                            top: -8px;
                            overflow-y: auto;
                            box-shadow: rgb(50, 50, 50) 5px 8px 15px;
                            

                        "
                        >


                        
                        <!-- debug section -->
                        <div><b>Debug:</b></div>
                        <div v-if="true"
                            id="nstDebugTmpBar">               

                            <button @click="test_setMulti()">sM</button>
                            <button @click="test_setSingle()">sS</button>
                            <button @click="test_loadFileOnStart()">fL</button>
                            <button @click="divFindName='dB'; onDivFindName([]);onAddKeyFrame()">q?</button>
                        
                        </div>
                       


                        <br>
                        <!-- files aks load / save animation -->
                        <div><b>File:</b></div>
                        <div
                            id="nstLoadSaveBar">
                            <button @click="onNewToLocal()" title="New node stop time file or json"><i class="fa-solid fa-file-circle-plus"></i>New file ...</button><br>
                            <button @click="onLoadToLocal()" title="Load node stop time file or json"><i class="fa-solid fa-upload"></i>Open file ...</button><br>
                            <button @click="onSaveToLocal()" title="Save node stop time file"><i class="fa-solid fa-floppy-disk"></i>Save file as ...</button>
                        </div>


                        <br>
                        <!-- undo / -->
                        <div><b>Edit:</b></div>
                        <div>
                            <div
                                id="nstHistoryBar">
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

                        </div>

                        <br>
                        <hr>
                        
                        <br>
                        <div><b>Settings: </b></div>
                        <!-- ui animation -->
                        <div
                                id="nstUiAnimationBar">
                            <div style="display: inline-block;">

                                <input type="checkbox" 
                                    title="Animate Ui"
                                    v-model="doAnimations" 
                                    id="nstAniUi"
                                    style="display:none;" />
                                <button @click="doAnimations=!doAnimations">
                                    <span v-if="doAnimations">
                                        <i class="fa-solid fa-gauge"
                                            style="color:orange;"
                                            title="Disable animation of Ui"></i>
                                        Ui animating
                                    </span>
                                    <span v-else >
                                        <i class="fa-solid fa-gauge-high"
                                                title="Enable animation of Ui"></i>
                                        Ui instant
                                    </span>
                                </button>

                            </div>
                        </div>


                        


                    </div>

                </Transition>

            </div>

            <!-- file / tools / ... END -->


   
            <div class="nstControlsBar"
                id="nstControlsBar">
                <button @click="setFrameNo( 0 ); nstTimeSlideInput_focus();" title="|< to start"><i class="fa-solid fa-backward-step"></i></button>
                <button @click="setFrameNo( frameNo-1 );nstTimeSlideInput_focus();"title="< one left"><i class="fa-solid fa-backward"></i></button>
                <button v-if="isPlaying"
                    @click="onStop();nstTimeSlideInput_focus();" title="Stop"><i class="fa-solid fa-pause"></i></button>
                <button v-else
                    @click="onPlay();nstTimeSlideInput_focus();" title="Play"><i class="fa-solid fa-play"></i></button>
                <input type="checkbox" v-model="playInLoop"
                    title="Play in loop"></input>
                <select v-model="replayTimeScale">
                    <option v-for="value in replayTimeScaleOpts" :value="value.value">{{ value.name }}</option>

                </select>


                <button @click="setFrameNo( frameNo+1 );nstTimeSlideInput_focus();"title="> one right"><i class="fa-solid fa-forward"></i></button>
                <button @click="setFrameNo( framesTotal );nstTimeSlideInput_focus();" title=">| to end"><i class="fa-solid fa-forward-step"></i></button>
            </div>

            


            <!--
                <button @click="$refs.nstHistoryO.echo('hi')">o</button>
            -->

            

            <div
                v-show="!isPlaying"
                class="nstFindBar"
                id="nstFindDivBar">
                
                <!--
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
                -->
                <VYButtonContext
                    title="Import assets to canvas"
                    icon="<i class='fa-solid fa-file-import'></i>"
                    v-model:is-showing="showImportAssets"
                    >
            
                    <NstAssetsImport 
                        :homeUrl="homeUrl"
                        @nst-assets-import="onAssetsImport"
                        />

                </VYButtonContext>

                <!--
                </div>
                -->


                <button
                    title="Select node from local dome with cursor"
                    @click="onSelectNodeFromDome()"
                    :style=" 'color:'+(elSelectedIsActive?'red':'white')+';' "
                    ><i class="fa-solid fa-bullseye"></i>
                </button>

                <button
                    title="Show tree dom view"
                    @click="onTlTreeViewToogle()"
                    id="nstBtTreeOpenShow"
                    ><i class="fa-solid fa-diagram-project"></i>
                </button>



                <div style="display: inline-block;width:130px; font-size:75%;
                        background-color: rgb(116, 157, 70); 
                        box-shadow: rgb(50, 50, 50) 0px 3px 8px 0px inset;
                        border-radius: 10px;
                        border:#e1cbaf solid 2px;
                        padding:4px 4px;margin:0px;
                        overflow-y: auto; height: 30px;
                        "
                    v-if="nstTreeNodesSelected.length > 0">
                    
                    <div style="display: inline;
                        background-color: goldenrod;">                   

                        <div v-for="o in nstTreeNodesSelected" 
                            style="
                            display: inline; padding: 1px 1px;
                           
                            "
                            class="nstTVitemSelectedLast" >
                            <NstTItemNode 
                                :mode="'tiny'"
                                :name="o.tagName"
                                :aId="o.getAttribute('id')"
                                />
                        </div>

                    </div>

                    
                </div>

                

                <div v-if="nstTreeNodesSelected.length == 0" style="display: inline-block;">

                    #:
                    <input title="Look for div node $('#....')"
                        :placeholder=" elSelectedStr "
                        type="text" v-model="divFindName"
                        style="width:125px"
                        @change="onDivFindName([])"
                        >

                </div>
                
                
                <div style="display: inline;">
                    <button @click="unSelectElement();nstTreePathSelected=[]" 
                        title="Clear selection to None"
                        :disabled="nstTreeNodesSelected.length == 0"
                        >
                        <i class="fa-regular fa-circle-xmark"></i>
                    </button>
                </div>




                <button 
                    :disabled="lSelected==-1"
                    id="nstPropertiesShowNode"
                    title="Properties of selected label / property ..."
                    @click="showProperties = !showProperties"
                    >
                    <i :class="'fa-solid fa-caret-'+(showProperties ? 'up' : 'down')"></i>
                </button>



                <div 
                    v-show="1 || lSelected != -1 && showProperties"
                    id="nstPropertiesBlock"
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

                    <NstLabel 
                        v-if="'$$Settings' == divSelectedName && propertiesSelected.length == 1 && propertiesSelected[0] == 'labels'"
                        :properties="propertiesSelected"
                        :metadata="metadata"
                        :frameNo="frameNo"
                        :labelSelected="labelSelected"
                        @nst-label-set="onEmit_setLabelChange"

                        />
                    <NstAction 
                        v-if="
                            '$$Settings' == divSelectedName && 
                            propertiesSelected.length == 1 && 
                            propertiesSelected[0] == 'actions'
                            "                        
                        :properties="propertiesSelected"
                        :metadata="metadata"
                        :replayTimeScale="replayTimeScale"
                        :frameNo="frameNo"
                        :actionsSelected="actionsSelected"
                        @nst-actions-set="onEmit_setActionsChange"
                        />


                    <NstAnimSelector
                        v-if=" ['$$Settings'].indexOf( divSelectedName ) == -1 "
                        asMode="edit"
                        :divSelectedName="divSelectedName"
                        :selected="animeSelected"
                        :nstTreePathSelected="nstTreePathSelected"
                        :nstTreeNodesSelected="nstTreeNodesSelected"
                        @nst-animation-change="onEmit_setAnimeChange"
                        />

                    <NstPropSelector 
                        v-if=" ['$$Settings'].indexOf( divSelectedName ) == -1 "
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



                    <hr></hr>


                    <button
                        :disabled="!cb_canRemove"
                        title="Remove this key frame"
                        @click="onRemoveKeyFrame();"
                        >
                        <i class="fa-regular fa-trash-can" />
                    </button>
                    <button
                        :disabled="!cb_canCopy"
                        title="Copy this key frame"
                        @click="onCopyKeyFrame( )"
                        >
                        <i class="fa-regular fa-copy" />
                    </button>
                    <button
                        :disabled="!cb_canPast"
                        title="Paste to this frame"
                        @click="onPasteKeyFrame( )"
                        >
                        <i class="fa-regular fa-paste"></i>
                    </button>

                    
                    &nbsp;
                    &nbsp;



                    <input type="checkbox" v-model="closePropertiesAfterAdding"
                        title="Close this dialog after adding ..." /> 
                    
                    &nbsp;
                    
                    <button
                        :disabled="!properties_canAdd"
                        id="nstInsertKeyFrameNodeFastBt"
                        title="Insert key frame (+)"
                        @click="onAddKeyFrame();( closePropertiesAfterAdding ? showProperties=false : '' )"
                        >
                        <i class="fa-solid fa-plus"></i>Add
                    </button>


                    
                    
                        
                        <hr>
<pre style="font-size: 75%;">
 Current frame:   .....  {{frameNo}} @ {{frameNo*metadata.frameMs}} ms.
 Multi selection:  ....  
 [ <div v-for="o in nstTreeNodesSelected" style="display: inline-block;" >< {{o.tagName.toLowerCase()}} #{{ o.getAttribute('id') }} /> </div> ]
 Properties selected: .  [ {{ `${propertiesSelected}` }} ]
 Properties @:    .....  {{ 1 }} //TODO
 Dom info. :    .......  {{ lSelected!=-1?layers[ lSelected ]['domType']:'- -' }} @ {{ lSelected!=-1?layers[ lSelected ]['domSrcOver']:'- -' }} 
</pre>
                            
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
            v-for="layer,layerInd in layers"
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
                <div class="nstTLPropTools"
                    v-if="layer.divName != '$$Settings'">

                    <!--
                    <i class="fa-regular fa-circle-check"
                        :title="`Select node: \n\t[${layer.divName}]`"
                        @click="makeSelectedNode_ByName( layer.divName, [] )"></i> |
                    <i class="fa-regular fa-copy"
                        @click="console.log('TODO')"></i> | 
                    <i class="fa-solid fa-broom"
                        @click="console.log('TODO')"></i> | 
                    -->
                    
                    <button
                        title="Clone"
                        @click="onCloneLayer_ByName( layerInd )"
                        >
                        <i class="fa-regular fa-clone"></i>
                    </button>
                    
                    <button
                        title="Remove this layer"
                        @click="onRemoveLayer_ByName( layerInd )"
                        >
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                        

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
                                            @click="makeSelectedNode_ByName( layer.divName, [f.name] )"></i> 
                                        <!--
                                        <i class="fa-regular fa-copy"
                                            @click="console.log('TODO')"></i> 
                                        <i class="fa-solid fa-broom"
                                            @click="console.log('TODO')"></i>  
                                        -->
                                        <i class="fa-regular fa-trash-can"
                                            v-if="layer.divName != '$$Settings'"
                                            @click="removeProperty_ByName( layer.divName, [f.name] )"></i>

                                    </div>

                                </div>

                                <!--
                                    <NstPropertyRow :propertyTimeline="f"></NstPropertyRow>
                                -->

                                <!-- old tlcell -->
                                <div style=""
                                    :id="'XXnst'+layer.divName.substring(2)+'_'+f.name"
                                    >
                                    <div v-for="(value,index) in f.keys"
                                        :style="
                                            'width:'+UIkeyCellWidth+'px;'+
                                            'left:0px;'
                                            "
                                        :title="value!=null?'property [ '+f.name+' ] = '+value:'select this cell [ '+f.name+' ] at frame: '+index"
                                        :class="'nstFrameCssBlockCell '+
                                            (value==null?'nstFrameCssBlockCellEmpty ':'')+
                                            (index==frameNo && 
                                                layer.divName == divSelectedName &&
                                                propertiesSelected.indexOf( f.name ) != -1 ?'nstFrameCssBlockCellSelected ':'')
                                            "
                                        @click.ctrl.stop="makeSelectedNode_ByName( layer.divName, [f.name], 'withCtrl', {propName:f.name, frameNo: index})"
                                        @dblclick.stop="showProperties=true"
                                        @click=" if( !$event.ctrlKey ){onStop();setFrameNo( index ); makeSelectedNode_ByName( layer.divName, [f.name]); } "
                                        >
                                        <small 
                                            class="nstCell">
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
    <hr></hr>

    <!--
        <VYButtonContext>
            abc:[
            o
            ]
        </VYButtonContext>
        -->
<hr>

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
import {animate as ajsanimate, stagger as ajsstagger, utils as ajsutil } from 'animejs';
import NstAssetsImport from './nstAssetsImport.vue';
import NstTView from './nstTView.vue';
import MATreeViewNST from '../MediaAssets/treeView_showHide1.json'
import MAPropBtNST from '../MediaAssets/propButton3.json'
import NstHistory from './nstHistory.vue';
import NstTItemNode from './nstTItemNode.vue';

import NstAction from './nstAction.vue';
import NstLabel from './nstLabel.vue';
import VyButtonContext from './vyButtonContext.vue';

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
        "NstTItemNode": NstTItemNode,
        "NstLabel": NstLabel, 
        "NstAction": NstAction,
        "VYButtonContext": VyButtonContext,
        //"NstTLCell": NstTimeLineCell,
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
                this.timeLine.label('end', this.metadata.framesTotalMs )
                .call(()=>{ 
                    console.log('R/tl END @ '+this.metadata.framesTotalMs+'ms');
                    nstTLMSDiv.append(', R/tl END @ '+this.metadata.framesTotalMs+'ms');
                }, this.metadata.framesTotalMs)

            },200);
        }

        /*
        TlTreeViewRes['timeLine'].reset();
        */
       //console.log('html is :',$('#htmlDynoHandler'));
       let TlTreeViewRes = this.nstLibO.getTimeline_FromJsonData( MATreeViewNST );
       this.TlTreeView = toRaw( TlTreeViewRes['timeLine'] );

       let TlPropBtRes = this.nstLibO.getTimeline_FromJsonData( MAPropBtNST );
       this.TlPropBt = toRaw( TlPropBtRes['timeLine'] );
       //console.log('html is 2:',$('#htmlDynoHandler'),TlTreeViewRes);

        setTimeout(()=>{

            //console.log('html is 3:',$('#htmlDynoHandler'),TlTreeViewRes);
            this.TlTreeView.reset();
            console.log('updated ....');
            nstTLMSDiv = $('#nstTLMS');

            this.TlPropBt.reset();
            this.TlPropBt.speed = 2;
            ajsutil.set('#nstPropertiesBlock',{'display':'none'});
            console.log('updated ....');
            //nstTLMSDiv = $('#nstTLMS');

            
        },100);

        setTimeout(()=>{
            //this.nstTreePathSelected = [];
            if( 1 ){
                console.log('nstMulti - temp force selection two');
                this.divFindName = 'dB';            
                this.onDivFindName(-8);
                this.nstTreePathSelected = [ [ 47, 1, 1, 0, 1 ], [ 47, 1, 1, 0, 0 ] ];
                this.showProperties = false;
                this.onWindowResize( window.innerWidth, window.innerHeight);
            }
            
           this.test_loadFileOnStart(); // load test file
           this.onNewToLocal();

        },500);

        //this.timeLine.restart();

        this.$refs.nstHistoryO.saveStase('mounted');

    },
    props:[ 'homeUrl' ],
    data(){

        
        let fps = 10.00;
        let framesTotal = 20;
        
        let frameMs = parseInt( 1000.00 / fps );
        //let framesTotalMs = frameMs* (framesTotal-1);


        let nstTLMS = -1;
        let nstl = new nstLib();


        return {
            nstLibO: nstl,

            doAnimations: true,


            metadata: this.nstDef_metadata(),
            
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
            //framesTotalMs: framesTotalMs,

            iterator: null,

            UIkeyCellWidth: ref(1.00),
            
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

            closePropertiesAfterAdding: true,
            labelSelected:'',
            actionsSelected:-1,
            animeSelected:{ type: 'set' },
            propertiesSelected:[],
            showProperties: false,
            showImportAssets: false,
            propertiesSelectedNow:{},
            propertiesUpdateDelay:-1,
            observeAtId: null,
            observe: null,

            fileToolsShow: false,

            clipboardActionsShow: false,
            clipboardActions: [
                //{ divName: 'div', propName: 'pro', propVal:11.5 }
            ],

            lSelected:-1,
            layers: ref([]),

            nstTreePathSelected:[ 
                //[ 47, 1, 1, 0, 1 ], [ 47, 1, 1, 0, 0 ]
                //[48,1,1,0,2], [48,1,1,0,3,3,2] ,[47,1,1,0,1]
            ],
            nstTreeNodesSelected:[],
            TlTreeView: -1,
            TlPropBt: -1,

            fileDialogOpen: false,
            fileDialogOperation: '',

        };
    },
    computed:{
        divSelectedName(){
            console.log('divSelectedName -> select ('+this.lSelected+') layers',this.layers);
            if( this.lSelected == -1 || this.layers.length == 0 || this.layers.length < this.lSelected ) return 'NaN';
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
        
        
        cb_canRemove(){
            if( this.lSelected == -1 ) return false;
            if( this.propertiesSelected.length == 0 ) return false;
            for( let pName of this.propertiesSelected){
                let pFrames = this.getKFrames( this.layers[ this.lSelected ]['divName'], pName );
                if( pFrames != -1 ) console.log( `pFrames toRaw (${JSON.stringify(toRaw(pFrames[ 'keys' ][ this.frameNo ]))})  as raw:`,pFrames[ 'keys' ][ this.frameNo ] );
                if( pFrames != -1 && JSON.stringify(toRaw( pFrames[ 'keys' ][ this.frameNo ] ) ) != 'null' ) 
                    return true;
            }
            
            return false;

        },
        cb_canCopy(){
            return this.cb_canRemove;

        },
        cb_canPast(){
            return this.lSelected != -1 && this.clipboardActions.length > 0;
        },
        properties_canAdd(){
            return this.nstTreePathSelected.length>0;
        }

    },
    watch:{
        showProperties( nS, oS ){
            console.log(`nstTL @ watch showProperties change `,nS,' from ',oS);
            let mitT = 500;
            if( nS == true ){
                this.TlPropBt.seek(0);
                this.TlPropBt.play();
                $('#nstPropertiesBlock').show();
                setTimeout(()=>{
                    this.TlPropBt.pause();
                    //this.TlPropBt.seek(1000);

                },mitT);
            }else {
                this.TlPropBt.seek(1000);
                this.TlPropBt.play();
                setTimeout(()=>{
                    this.TlPropBt.reset(true);
                    $('#nstPropertiesBlock').hide();


                },mitT);
            }





        },
        replayTimeScale( nScale, oScale ){
            this.replayTimeScale = nScale;
            if( this.metadata.timeLine != -1 ){
                this.metadata.timeLine.speed = parseFloat(nScale);
            }
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

            if( tr.length == 0 ){
                this.unSelectElement();
            }

        },

        /*
        frameNo( nframe, oframe ){
            return -1;
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
            */
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


        update_metadata( metadata ){
            if( !('onLoad' in metadata ) ) metadata['onLoad'] = {};
            if( !('cloneCounter' in metadata ) ) metadata['cloneCounter'] = 0;

            return metadata;
        },

        update_layers( layers, metadata ){
            if( layers.length == 0 ){
                return [ this.layer_getSetting( metadata ) ];
            }else if( layers[0].divName != '$$Settings' ){
                layers.unshift( this. layer_getSetting( metadata ) )
            }
            return layers;
        },

        nstDef_metadata( fps=10, framesTotal = 20 ){
            let frameMs = parseInt( 1000.00 / fps )
            return {
                fps: fps,
                framesTotal: framesTotal,
                timeLine: -1,
                frameMs: frameMs,
                framesTotalMs: frameMs* (framesTotal-1),
                assets: [],
                cloneCounter: 0,
                onLoad: {}
            };
        },
        


        getKFrames( divName, pName ){
            let layers = this.layers;
            let lId =  layers.findIndex( l => `${l.divName}` == `${divName}` );
            if( lId == -1 ) return -1;
            let pId = this.layers[ lId ]['kFrames'].findIndex( p => p.name == pName );
            return pId == -1 ? -1 : this.layers[ lId ]['kFrames'][ pId ];
        },

        /** so one liner iFs file load */
        async test_loadFileOnStart( iFsPath = undefined ){
            if( iFsPath == undefined ){
                //iFsPath = 'nst/nst_v3_1.ajs'
                iFsPath = 'nst/testsClone/actionsGoTo_label.js';
                iFsPath = 'nst/tests_clone/251212tt151408_db_clone.js';
                iFsPath = 'nst/251203tt_7seg_2.js';
                //iFsPath = 'nst/tests_Manipulator/251213tt091833.js';
                //iFsPath = 'nst/tests/251212tt_clone3.js';
            }
            //this.fileDialogOpen = true;
            this.lSelected = -1;
            let f = await iFs.readFile( iFsPath);
            this.onLoadToLocalFromString( f );

        },

        getTagNameFrom_layer( layer ){
            let dName = layer.divName;
            if( dName == undefined ) return 'ErrTagName2';
            let tr = document.getElementById( dName.substring(1) );
            if( tr ) return tr.tagName
            else return 'ErrTagName';
        },
        nstTimeSlideInput_focus(){
            this.$refs.nstTimeSlideInput.focus();
        },

        onWindowResize( w = undefined, h = undefined, framesTotal = undefined ){
            //console.log(`nstTL on resize - `,w,' x ',h,' with total frames:',framesTotal);
            let rMargin = 60;
            if( framesTotal == undefined ) framesTotal = this.framesTotal;
            if( w == undefined ){
                this.UIkeyCellWidth = 2;                
            } else {            
                let tmpO = { 
                    'wtarget': (w - rMargin) / ( framesTotal - 1),
                    'wstart': this.UIkeyCellWidth,
                    'w':0  };
                if( this.doAnimations ){
                    let upDateFunc = () =>{
                        //console.log('nstTL_w compute animation START',tmpO);
                        
                        ajsanimate( tmpO, {
                            autoplay:true,
                            duration:500,
                            ease: 'outSine',
                            fps: 30,
                            'w': [tmpO.wstart, tmpO.wtarget],
                            onUpdate:()=>{
                                //console.log('nstTL_w compute animation ',tmpO.w);
                                this.UIkeyCellWidth = tmpO.w;
                            }
                        });
                    };
                    mkTrashHold( 'nstTL_w_resize', upDateFunc, 550 );
                }else{
                    this.UIkeyCellWidth = parseInt(tmpO.wtarget);
                }
            }
            //console.log(`nstTL on cell [${this.UIkeyCellWidth}]`);
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
            this.setTimeLine( lttlRes.timeLine );
            
            $.toast('Undo - '+data.history.note);


        },


        onEmit_setLabelChange( opts ){
            this.labelSelected = opts.label;
        },
        onEmit_setActionsChange( opts ){
            let ff = nstConvert.parseActionSettings( opts.action );

            if(1) console.log(`nstTL action set: `, JSON.rawDumpNice( opts ), //JSON.stringify(toRaw(opts),null,4),
                '\nso after parsing functions:\n',ff
                );
            
            this.actionsSelected = opts.action;
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

        setTimeLine( timeLine ){
            console.log( 'nstTL - set time line ....' );
            this.metadata.timeLine = timeLine;
            window['nstTlMata'] = timeLine;
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

        
        layer_getSetting( metadata ){
            return {
                divName: '$$Settings',
                order: -1,
                isVisible: true,
                domType: 'settings',
                domSrcOver: 'local',
                nodeObservator: null,
                obj: null,//$(divName),
                frameAddedAt: 0,
                kFrames: [
                    {
                        "name": "labels",
                        "keys": new Array( metadata.framesTotal ),
                        "lHelpers": new Array( metadata.framesTotal ),
                    },
                    {
                        "name": "actions",
                        "keys": new Array( metadata.framesTotal ),
                        "lHelpers": new Array( metadata.framesTotal ),
                    }
                ],
                propertiesNow: {}
            };
        },

        layer_getByDivName( divName, addToLayers = true ){

            let layers = this.layers;

            // if zero add settings / labels / actions layer START
            if( layers.length == 0 ){
                layers.push( this.layer_getSetting( this.metadata ) );
            }
            // if zero add settings / labels / actions layer END


            let lId = layers.findIndex( l=>l.divName==divName);
            if( lId != -1 ) return layers[ lId ];
            else if( divName != '$Settings' ){
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


        onNewToLocal(){
            setTimeout(()=>{
                this.unSelectElement();
                this.nstTreePathSelected = [];
                this.metadata.timeLine = -1;
                this.metadata = this.nstDef_metadata();
                this.layers = this.update_layers( [], this.metadata );
                this.frameNo = 0;
                this.rebuildTimeLimeMain();
                this.onDivFindName([]);
                
                $.toast('New file started ....'+this.layers.length);
            },2);
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

        /*
        async onLoadToLocal_old(){
            let f = await iFs.readFile('nst/nst_v3_1.ajs');
            this.onLoadToLocalFromString( f );
        },
        */
        
        onLoadToLocalFromString( f ){
            
            let fj = JSON.parse( f );
            let metadata = this.update_metadata( fj.metadata );
            this.metadata = metadata;

            if( 'assets' in metadata ){
               for( let pay of metadata.assets ){                
                    pay['homeUrl'] = this.homeUrl;
                    let res = nstImportAsset( pay );                    
                }
            }

            if( 'onLoad' in metadata )
                fj.layers = this.nstLibO.onLoadTasks( metadata['onLoad'], fj.layers );
                       
            
            setTimeout(()=>{            
                let TlRes = this.nstLibO.getTimeline_FromJsonData( fj );
                fj.layers = this.update_layers( fj.layers, metadata );
                this.layers = fj.layers;

                this.setTimeLine( TlRes.timeLine );
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


        setFrameNo( e = '',b='' ){
            console.log('nstTl setFrameNo \n\te:[',e,']\n\tb:[',b,'] \nplaying ['+this.isPlaying+'] type ['+(typeof e)+']');
            if( this.isPlaying ) return 1;

            let fNo = 0;
            if( typeof e != 'number' ){
                fNo = parseInt( e.target.value );                
            }else fNo = e;

            if( fNo < 0 ) fNo = 0;
            else if( fNo > this.framesTotal ) fNo = this.framesTotal;
            
            this.frameNo = fNo;
            let fMs = fNo * this.frameMs;
            this.frameNoAtMs = parseInt(fMs);
            let tl = this.metadata.timeLine;
            if( tl == -1 ) return -1;
            //console.log('nstTl - setFrameNo / seek: frameNo: ',fNo,' ('+fMs+') ms.');
            //this.metadata.timeLine.seek( fMs+1, true );
            tl.reset();
            //tl.currentTime = fMs; 
            tl.seek( fMs, true );
            //this.metadata.timeLine.seek( fMs );
        },

        onPlay(){
            if( this.metadata.timeLine == -1 ) return -1;

            if( this.frameNo == this.framesTotal-1 ){
                this.metadata.timeLine.restart();    
            }

            this.isPlaying = true;
            this.metadata.timeLine.play();

            this.onPlayIter();
            //this.timeLine.play();
        },
        onPlayIter(){
            if( this.isPlaying == true ){
                let tl = this.metadata.timeLine

                if( this.iterator != -1 ){
                    clearInterval(this.iterator);                    
                }

                this.iterator = setTimeout(()=>{

                    this.frameNo = parseInt( 
                        (tl._currentTime) / this.frameMs
                        );
                    this.frameNoAtMs = tl.currentTime;
                        
                    if( this.isPlaying == true ){
                        this.onPlayIter();
                    }
                    if( tl.paused == true ){
                        //this.onStop();
                        if( this.playInLoop ){
                            tl.restart();
                        }else{
                            this.onStop();
                        }
                    }

                }, this.frameMs / this.replayTimeScale );
            }else{
                console.error('ee on play iter will not play global wrong ');
            }
        },

        onStop(){
            console.log('onStop ');
            if( this.iterator != -1 ){
                clearInterval(this.iterator);
                this.iterator = -1;
            }
            
            if( this.metadata.timeLine != -1 ){
                this.metadata.timeLine.pause();
                let fMs = parseInt( this.metadata.timeLine._currentTime / this.frameMs);
                this.setFrameNo( fMs );
            }
            this.isPlaying = false;
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

            this.nstTreePathSelected = [];
            
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
                    if( id != null ){
                        this.divFindName = id;
                        this.onDivFindName([]);
                    }else{
                        $.toast('<i class="fa-solid fa-bullseye" /> - Inspector cancel no id in node.');
                    }
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
            this.onStop();
            this.observeAtId = -1;

        },


        onDivFindName( properties = [] ){
            if( this.divFindName == '$Settings' ){
                this.makeSelectedNode_ByDivObj( {selector:'$'+this.divFindName}, properties );
                
                return 1;
            }


            let lookRes = $(`#${this.divFindName}`);
            console.log('div find name .... ['+this.divFindName+'] have '+
                '\n length: ('+lookRes.length+')'+ 
                '\n typeof:', typeof lookRes+
                '\n node: [',lookRes,']');

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
            let tm_nstTreePathSelected = JSON.cloneRaw( this.nstTreePathSelected  );
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
            if( properties != -8 ) this.animeSelected = this.getAnimeOfNode_layer( layer );
            this.lSelected = this.layers.findIndex( l=>l.divName == divObj.selector ) ;

            if( divObj.selector == '$$Settings' ){
                this.propertiesSelected_Set( properties );
                console.log('nstTL makeSelectedNode_ByDivObj\n$$Settings .... prop:',properties);

                let labActId = this.layers[ this.lSelected ]['kFrames'].findIndex( k=> k.name == properties[0] );
                if( labActId == -1 ) return -1;
                if( properties[0] == 'labels' ){
                    this.labelSelected = this.layers[ this.lSelected ]['kFrames'][ labActId ]['keys'][ this.frameNo ];   
                }else if( properties[0] == 'actions' ){
                    this.actionsSelected = this.layers[ this.lSelected ]['kFrames'][ labActId ]['keys'][ this.frameNo ];
                }


                return 1;
            }
            
            this.propertiesSelectedNow = this.getPropertiesOfNode_ById( divObj.selector.substring(1), this.onDivObjPropertiesUpdate );
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
            //this.makeSelectedNode_ByName 
            this.$refs.nstHistoryO.saveStase('remove-property_by-name'+JSON.stringify([nodeName,properties]));
        },

        /*** For timeline clicks : if event parameter added */
        makeSelectedNode_ByName( nName, properties = [], event = undefined, opts = {} ){

            console.log(' make selected node by name :',nName, '\nprops:',properties,'\nevent: ',event);
            

            // select / unselect propertie
            if( event == 'withCtrl' ){
                let iOf = this.propertiesSelected.indexOf( opts.propName );
                if( iOf == -1 ){
                    this.propertiesSelected.push( opts.propName );
                    if( this.doAnimations )
                        this.animatePropertySelected( properties, nName );

                    if( 'frameNo' in opts )
                        this.setFrameNo( opts.frameNo );
                }else{
                    this.propertiesSelected.splice( iOf, 1 );

                }


                return 1;

            }else{
                console.log('nstTL - click event',event);
                if( event != undefined ){
                    let pointC = [event.clientX, event.clientY];
                    let divOnC = $($('#nstTLTable'+nName.substring(1))[0]);
                    let divSize = [ divOnC.width(), divOnC.height() ];
                    let seekN = mMapVal( pointC[0], 0, divSize[0], 0,1 );
                    let tFrame = parseInt( this.framesTotal * seekN );
                    if(1)console.log('event seek to ?',
                            '\n divSize:', divSize,
                            '\n seekN:',seekN,
                            '\n newFrame: ',tFrame
                        );                 
                        
                }

            }
            
            //this.showProperties = true;
            
            if( this.doAnimations )
                this.animatePropertySelected( properties, nName );
            
            if( event == 'withCtrl' ) return 1;

            this.divFindName = nName.substring(1);
            this.onDivFindName( properties );

        },

        animatePropertySelected( properties, nName ){
            setTimeout(()=>{
                console.log('grid stager start ', properties);
                
                for( let propName of properties){
                    let obR = document.getElementById(`XXnst${nName.substring(2)}_${propName}`);
                    console.log('obR ',obR);
                    if( obR == null ) return -1;
                    let chil = obR.children;
                    if( chil.length == 0 ) return -1;
                    let grid = [ chil.length, 0 ];

                    ajsanimate( chil, {
                        scale: [
                            { to: [1.0, ajsstagger([1.2,0.5], {
                                    grid,
                                    min: 1,
                                    from: parseInt(this.frameNo)
                                })] },
                            { to: 1 }
                        ],
                        boxShadow: [
                            { to: '0 0 0.5rem 0 currentColor' },
                            { to: '0 0 0rem 0 currentColor' }
                        ],
                        delay: ajsstagger(60, {
                            grid,
                            from: parseInt(this.frameNo)
                        }),
                        duration:300
                    });

                }
            
            },50);

        },

        getPropertiesDom_local_html( layer, byId, callBackOnChange = undefined ){
            let fd = {};            
            let node = document.getElementById( byId );
            if( node == undefined ){
                console.error('EE no element by id found :',byId);
                return undefined;
            } 
            let compCs = window.getComputedStyle( node );
            //console.log('compCs : ',compCs);
            for( let pNameK of Object.keys( compCs ) ){
                let pName = compCs[ pNameK ];
                fd[ pName ] = node.getAttribute( pName );
                if( fd[ pName ] == null || fd[ pName ] == 'none' )
                    fd[ pName ] = compCs.getPropertyValue( pName );
            }

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
            let aniOpts = JSON.cloneRaw( this.animeSelected );
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

        mkNiceStr( o ){ return '\n\t-----START -------\n'+
            JSON.stringify( toRaw( o ) , null, 4)+
            '\n\t------END--------------'; },

        doDebugDump(){
            let tr = `\n\ndebug dump ---------------------------------\n
                \n * paths tree selected: ${this.mkNiceStr( this.nstTreePathSelected )}\n
                \n * objects tree: ${this.mkNiceStr( this.nstTreeNodesSelected) }\n
                \n * lSelected : ${this.mkNiceStr( this.lSelected ) }\n
                \n * propertiesSelected: ${this.mkNiceStr( this.propertiesSelected ) }\n`;

            if( this.lSelected != -1 ){
                tr+= `\n * divName: ${this.mkNiceStr( this.layers[ this.lSelected ]['divName'] ) }\n`;
            }




                /*
                \n * : ${this.mkNiceStr( this.prope ) }\n
                \n * : ${this.mkNiceStr( this. ) }\n
                \n * : ${this.mkNiceStr( this. ) }\n
            `;*/
            return tr;
        },

        onPasteKeyFrame(){

            let fNo = parseInt( this.frameNo );
            if( this.nstTreeNodesSelected.length == 0 ) return -1;
            let tr = [];   
            let divName = '';        
            
            for( let cb of this.clipboardActions ){
                //for( let divO of this.nstTreeNodesSelected ){
                //    let divName = divO.getAttribute('id');
                    divName = `#${this.divFindName}`;
                    for( let layer of this.layers ){
                        if( layer.divName.substring(1) === divName.substring(1) ){
                            let pId = layer.kFrames.findIndex( p => p.name === cb.propName );
                            if( pId == -1 ){
                                tr.push('as new property ['+cb.propName+']');
                                layer.kFrames.unshift( {
                                    'name': cb.propName,
                                    'keys': new Array( this.framesTotal ),
                                    'lHelpers': new Array(  this.framesTotal )
                                } );
                                pId = 0;
                            }else{
                                tr.push('added to existing ['+cb.propName+']');
                            }
                            
                            layer.kFrames[ pId ]['keys'][ this.frameNo ] = cb.key;
                            layer.kFrames[ pId ]['lHelpers'][ this.frameNo ] = cb.lHelper;


                        }
                    }
                //}
            }


            if( tr.length > 0 ){
                this.rebuildTimeLimeMain();            
                $.toast( 'Paste to ['+divName+'] with result <br>* '+tr.join(' <br>* ') );
            }

        },


        onCloneLayer_ByName( layerInd ){
            let lSrc = JSON.cloneRaw( this.layers[ layerInd ] );
            let ndivName = lSrc.divName.substring(1)+`_cl`+this.metadata.cloneCounter++;
            let onLoad = this.metadata.onLoad;
            onLoad[ ndivName ] = {
                'action': 'clone',
                lSrc, 
                ndivName                
            };
            
            this.layres = this.nstLibO.onLoadTasks( onLoad, this.layers );
            this.rebuildTimeLimeMain();
            


           
            /*
            this.divFindName = ndivName;
            this.onDivFindName([]);
            this.rebuildTimeLimeMain();
            */

        },
        onRemoveLayer_ByName( layerInd ){
            if( this.lSelected == layerInd ){
                this.unSelectElement();
                this.onDivFindName([]);
                this.observeAtId = -1;
            }
            
            this.layers.splice( layerInd,1  );
            this.rebuildTimeLimeMain();
            
        },
        onCopyKeyFrame( ){
            let fNo = parseInt( this.frameNo );
            console.log('nstMulti- onCopyKeyFrame  frameNo('+fNo+')',this.doDebugDump() );
            let res = this.onCopyKeyFrame_execute();
            this.onExecuteToast( res );
        },

        onCopyKeyFrame_execute(){
            let fNo = parseInt( this.frameNo );
            if( this.lSelected == -1 ) return -1;
            //if( this.propertiesSelected.length != 1) return -2;
            //let pNames = `${this.propertiesSelected}`;
            let layer = this.layers[ this.lSelected ];
            for( let pName of this.propertiesSelected ){
                let kInd = layer.kFrames.findIndex( p => p.name == pName );
                if( kInd == -1 ) return -3;

                let cItem = { 
                    'divName': `${layer.divName}`, 
                    'propName': pName, 
                    'key': toRaw( layer.kFrames[ kInd ][ 'keys' ][ fNo ] ),
                    'lHelper': toRaw( layer.kFrames[ kInd ][ 'lHelpers' ][ fNo ] )
                };
                let isTest = this.clipboardActions.findIndex( ci => ci.divName == cItem.divName && ci.propName == cItem.propName );
                if( isTest == -1 ){
                    this.clipboardActions.push( cItem ); 
                    console.log('nstTl cb add ',cItem); 
                }else{
                    this.clipboardActions[ isTest ]['key'] = cItem.key;
                    this.clipboardActions[ isTest ]['lHelper'] = cItem.lHelper; 
                    console.log('nstTl cb update ',cItem); 
                }                 
                    //layer.kFrames[ kInd ][ 'lHelpers' ][ fNo ]
            }            
            return -20;
        },


        onExecuteToast( res ){
            if( res == 0 )
                $.toast(`Removed key frame <br>Result: [${res}]`);
            else if (res == -20 )
                $.toast(`Added to clipboard<br>Actions ...`);
            else if (res == -1 )
                $.toast(`EE     Nothing selected for action.`);
            else if (res == -2 )
                $.toast(`EE     Wrong properties selection count.`);
            else if (res == -19 )
                $.toast(`EE     No properties found to remove.`);
            else if (res == -4 )
                $.toast(`EE     Nothing to remove. Key frame is empty.`);
            else if (res == -3 )
                $.toast(`EE     No kFrame name definition`);
            else if (res == -8 )
                $.toast(`Skip is all ready...`);

            else
                $.toast(`Removing error: (${res})`);
        },


        onRemoveKeyFrame(){
            let fNo = parseInt( this.frameNo );
            console.log('nstMulti- onRemoveKeyFrame  frameNo('+fNo+')',this.doDebugDump() );
            let res = this.onRemoveKeyFrame_execute();
            this.onExecuteToast( res );
        },
        onRemoveKeyFrame_execute(){
            let fNo = parseInt( this.frameNo );
            if( this.lSelected == -1 ) return -1;
            if( this.propertiesSelected.length == 0) return -2;
            let layer = this.layers[ this.lSelected ];

            let kInd = -1;
            for(let pName of this.propertiesSelected ){
                kInd = layer.kFrames.findIndex( p => p.name == pName );
                if( kInd == -1 ) return -3;
                if( layer.kFrames[ kInd ][ 'keys' ][ fNo ] == null ) return -4;
                layer.kFrames[ kInd ][ 'keys' ][ fNo ] = null;
                layer.kFrames[ kInd ][ 'lHelpers' ][ fNo ] = null;
            }

            if( kInd == -1 ) return -19;

            this.rebuildTimeLimeMain();
            this.makeSelectedNode_ByName( layer.divName, [ layer.kFrames[ kInd ]['name'] ] );
            this.nstTimeSlideInput_focus();

            return 0;
        },


        onAddKeyFrame(){
            console.log('nstMulti- onAddKeyFrame ',this.doDebugDump() );


            if( this.divFindName == '$Settings'){
                if( this.propertiesSelected == 'labels' ){
                    let labId = this.layers[ this.lSelected ]['kFrames'].findIndex( k=> k.name == 'labels' );
                    if( labId == -1 ) return -1;
                    this.layers[ this.lSelected ]['kFrames'][ labId ]['keys'][ this.frameNo ] = `${this.labelSelected}`;

                    this.rebuildTimeLimeMain();


                }else if( this.propertiesSelected == 'actions' ){
                    let actId = this.layers[ this.lSelected ]['kFrames'].findIndex( k=> k.name == 'actions' );
                    if( actId == -1 ) return -1;
                    this.layers[ this.lSelected ]['kFrames'][ actId ]['keys'][ this.frameNo ] = 
                        JSON.cloneRaw( this.actionsSelected );
                    
                    this.rebuildTimeLimeMain();

                }

                return 1;

            }



            let tnstps = JSON.cloneRaw( this.nstTreePathSelected );
            let propSel = JSON.cloneRaw( this.propertiesSelected );
            
            
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

            this.rebuildTimeLimeMain();

        },

        rebuildTimeLimeMain(){
            let lttlRes = this.nstLibO.getTimeline_FromJsonData( {
                metadata: this.metadata,
                layers: toRaw (this.layers )
            } );

            console.log('timeline rebuild result\n---------------------------------\n',
                lttlRes);
                
            this.setTimeLine(  lttlRes.timeLine );            
            this.$refs.nstHistoryO.saveStase('on-rebuild-frame');

            return 1;
        },

        

    }

}

</script>
<style>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from{
    opacity: 0;
}
.v-leave-to {
  opacity: 0;
  
}



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




.nstTVitemSelected{
    /*outline: 2px solid rgb(84, 132, 88);
    */
    background-color: rgb(186, 199, 139);
    border-radius: 6px;
    padding:2px;
}
.nstTVitemSelectedLast{
    /*outline: 2px solid rgb(6, 85, 1);
    */color: rgb(255, 255, 255);
    background-color: rgb(11, 66, 1);
    border-radius: 6px;
    padding:2px;
}



</style>
