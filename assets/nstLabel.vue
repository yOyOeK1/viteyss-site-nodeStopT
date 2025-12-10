<template v-if="labelSelected">
    <b>Set label:</b>

    <div>

        Label:
        <input v-model="isLabel" 
            @change="$emit( 'nst-label-set',{label:isLabel} )"/>
        
    </div>
    
</template>

<script>
export default{
    props:[ 'labelSelected','properties', 'metadata', 'frameNo' ],
    emits:[ 'nst-label-set' ],
    data(){
        //console.log('nstL 1 [',this.labelSelected,'] len:',this.labelSelected.length );

        return {
            isLabel: this.labelSelected
        };
    },
    watch:{
        labelSelected( nv, ov ){ 
            console.log('nstL 2 ',this.labelSelected);
            this.isLabel = this.labelSelected; 
        },
    }


}

</script>