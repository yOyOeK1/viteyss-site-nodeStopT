<style>
.nstAIassAsRadio {
    display: inline-block;
    border-radius: 5px;
    border: solid rgb(156, 126, 86) 1px;
    background-color: white;
    padding:3px;
    margin-right: 3px;
}
.nstAIassAsRadio input{
    display: inline;
     margin:0px; padding:0px;
}
.nstAIInline{
    display: inline;
}
.nstAICloud{
    border-radius: 5px;
    border: solid rgb(156, 126, 86) 1px;
    background-color: rgb(182, 167, 247);
    padding:3px;
}
.nstAICloud li{
    border-bottom: 1px salmon solid;
    font-size: 110%;
}
</style>

<template>
    <b>Import assets to canvas:</b>

    <br></br>

    <div class="nstAICloud">
        <li>From <b>http(s)</b> or <small>({{ this.homeUrl }})</small></li>

        <small>
            Add to assets as:
        </small> 

        <div>
            <div class="nstAIassAsRadio">
                <input type="radio" id="chkAddToAssets" v-model="addToAssets" value="linked"/>
                <label for="chkAddToAssets"
                    style="display: inline;"
                    >
                    <i class="fa-solid fa-link"></i> 
                    linked
                </label>
                
            </div>

            <div class="nstAIassAsRadio">
                <input type="radio" id="chkBakeIn" v-model="addToAssets" value="bakeIn"/>
                <label for="chkBakeIn"
                    style="display: inline;"
                    >
                    <i class="fa-solid fa-cube"></i>
                    baked in
                </label>
                
            </div>
            
        </div>

    
        <input type="text" 
            placeholder="http(s)://...."
            v-model="fromHttp" />

        <div>
            <button @click="onImport('http')" class="nstButton">
                <i class="fa-solid fa-cloud-arrow-down"></i>
                Import
            </button>
        </div>

    </div>

    or

    <div class="nstAICloud">
        <li>Local file system ....</li>
        <div><small>Local assets will be baked in.</small></div>
        <div>
            <WWorkerLF 
            :homeUrl="setHomeUrl"
            multi="false"
            :onDone="onLocalFileLoadedByWorkel"
            />
        </div>
        
        <!--
            <input type="text" 
            placeholder="~/Pictures/..."
            v-model="fromLocalFile" />
            
            
            <button @click="onImport('localFile')">Import</button>
        -->
    </div>




</template>
<script>
import { nstConvert, nstMediaExtensions } from '../nstLib';
import WWorkerLF from '@viteyss-site-settings1/assets/wWokerLocalFile.vue';

export default{
    components:{
        'WWorkerLF': WWorkerLF
    },
    emits:[ 'nst-assets-import' ],
    props:[ 'homeUrl' ],
    data(){
        return { 
            setHomeUrl: siteByKey.s_vyssettings1Page.o.homeUrl,


            fromHttp : '',//"./assets/ico_viteyss_32.png",
            //fromHttp : '',//'https://storage.ko-fi.com/cdn/useruploads/3deecaee-883e-461d-8bd4-4295523683e9_tiny.png',//"./MediaAssets/osdMapTest1.svg",
            fromLocalFile: '',
            addToAssets: 'linked',
            
        };
    },
    methods:{
        onLocalFileLoadedByWorkel( a = '' ){
            console.log('got local ',a);
            let fitem = a[0]['org']['fh'];

            this.$emit('nst-assets-import',{
                id: nstConvert.strToSafeIdName( 'lfs_'+fitem.name ),//'assetInject'+parseInt(Date.now()%10000),
                assetSrc: 'localFile',
                src: '',
                addToAssets: this.addToAssets,
                'fileData' : {
                    'b64': a[0]['res'],
                    'name': fitem.name,
                    'ext': fitem.name.substring( fitem.name.lastIndexOf('.') ),
                    'size': fitem.size,
                    'type': fitem.type,
                    'fileHandle': fitem
                },
                props:{
                    'left': null, 'top': 0, 'opacity': 0.5,
                    'position':'fixed'
                }
            });


        },
        // old
        async getFile_deleteIt( callBack ) {
            let pickerOpts = {
                types: [
                    {
                    description: "Images / media / html",
                    accept: {
                        "*/*": nstMediaExtensions//[".svg", ".png", ".gif", ".jpeg", ".jpg"],
                    },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
                };
            let [fileHandle] = await window.showOpenFilePicker( pickerOpts );
            let file = await fileHandle.getFile();
            let reader = new FileReader();
            reader.onload = (e) =>{               

                callBack( 'ok', {
                    'b64':e.target.result,
                    'name': file.name,
                    'ext': file.name.substring( file.name.lastIndexOf('.') ),
                    'size': file.size,
                    'type': file.type,
                    'fileHandle': fileHandle
                });
            };
            reader.onerror = (e) =>{
                console.error( 'EE get file error \n',e);
                callBack('ee',e);
            };
            
            reader.readAsDataURL( file );

        },




        onImport( impWhat ){
            switch ( impWhat ) {

                case 'http':
                    this.$emit('nst-assets-import',{
                        id: nstConvert.strToSafeIdName( 'http_'+this.fromHttp ),//'assetInject'+parseInt(Date.now()%10000),
                        assetSrc: impWhat,
                        src: this.fromHttp,
                        addToAssets: this.addToAssets,
                        props:{
                            'left': null, 'top': 0, 'opacity': 0.5,
                            'position':'fixed'
                        }
                    });
                    break;

                // old delete it 
                /*
                case 'localFile':                    
                    let onLoaded = ( statusIs, fileData ) => {
                        console.log('fileData: status:['+statusIs+'] data:\n',fileData);
                        this.$emit('nst-assets-import',{
                            id: nstConvert.strToSafeIdName( 'lfs_'+fileData.name ),//'assetInject'+parseInt(Date.now()%10000),
                            assetSrc: impWhat,
                            src: '',
                            addToAssets: this.addToAssets,
                            'fileData' : fileData,
                            props:{
                                'left': null, 'top': 0, 'opacity': 0.5,
                                'position':'fixed'
                            }
                        });
                    
                    };                
                    this.getFile( onLoaded );
                    break;
                    */
                default:
                    console.log('NaN import asset what ?? ', impWhat);
                    break;

            }
           
        }

    }



}

</script>