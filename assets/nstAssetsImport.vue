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



</template>
<script>

export default{
    emits:[ 'nst-assets-import' ],
    props:[ 'homeUrl' ],
    data(){
        return { 
            fromHttp : "./MediaAssets/osdMapTest1.svg",
            addToAssets: 'linked',
            
        };
    },
    methods:{
        onImport( impWhat ){
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
        }

    }



}

</script>