<template>
    Import assets .... :)

    <br></br>
    Add to assets as: 
    <div>
        <div style="display: inline;">
            <input type="radio" id="chkAddToAssets" v-model="addToAssets" value="linked"
                style="display: inline;"/>
            <label for="chkAddToAssets"
                style="display: inline;">linked</label>
            
        </div>

        <div style="display: inline;">
            <input type="radio" id="chkBakeIn" v-model="addToAssets" value="bakeIn"
                style="display: inline;"/>
            <label for="chkBakeIn"
                style="display: inline;">baked in</label>
            
        </div>
        
    </div>

    <div>
        From http .... ({{ this.homeUrl }})
        <input type="text" 
        placeholder="http:// ....svg"
        v-model="fromHttp" />


        <button @click="onImport('http')">Import</button>
    </div>

     <div>
        Local file system ....
        <input type="text" 
        placeholder="~/Pictures/..."
        v-model="fromLocalFile" />


        <button @click="onImport('localFile')">Import</button>
    </div>



</template>
<script>

export default{
    emits:[ 'nst-assets-import' ],
    props:[ 'homeUrl' ],
    data(){
        return { 
            fromHttp : "./MediaAssets/osdMapTest1.svg",
            fromLocalFile: '',
            addToAssets: 'linked',
            
        };
    },
    methods:{

        async getFile( callBack ) {
            let pickerOpts = {
                types: [
                    {
                    description: "Images / media",
                    accept: {
                        "image/*": [".svg", ".png", ".gif", ".jpeg", ".jpg"],
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
                        id: 'assetInject'+parseInt(Date.now()%10000),
                        assetSrc: impWhat,
                        src: this.fromHttp,
                        addToAssets: this.addToAssets,
                        props:{
                            'left': null, 'top': 0, 'opacity': 0.5,
                            'position':'fixed'
                        }
                    });
                    break;

                case 'localFile':                    
                    let onLoaded = ( statusIs, fileData ) => {
                        console.log('fileData: status:['+statusIs+'] data:\n',fileData);
                        this.$emit('nst-assets-import',{
                            id: 'assetInject'+parseInt(Date.now()%10000),
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

                default:
                    console.log('NaN import asset what ?? ', impWhat);
                    break;

            }
           
        }

    }



}

</script>