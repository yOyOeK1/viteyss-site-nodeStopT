<template>
    <b>Set label:</b>

    <div>

        Label:
        <input v-model="isLabel" 
            @change="$emit( 'nst-label-set',{label:isLabel} )"/>
        
    </div>
    <small>
        Current frame: {{frameNo}} @ {{frameNo*metadata.frameMs}} ms.
    </small>
    
</template>

<script>
export default{
    props:[ 'labelSelected','properties', 'metadata', 'frameNo' ],
    emits:[ 'nst-label-set' ],
    data(){
        return {
            isLabel: this.labelSelected
        };
    },
    watch:{
        labelSelected( nv, ov ){ this.isLabel = this.labelSelected; },
    }


}

</script>