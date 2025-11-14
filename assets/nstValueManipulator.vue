<template>


    <div v-if="!isClose"  style="display: inline;" >

        <div v-show="false"
            @click="isClose=true"
            style="display: inline;
                border-radius:5px; 
                border: dotted 3px black;
            ">
            <i class="fa-solid fa-arrow-left"></i>
        </div>

        <div style="border-radius: 5px; border: dotted 3px black; display: inline;">
            
            <input type="text" :value="nValue" ref="myManipulator" name="setNewValueAsInput"
                @change="onSend_RAWMsg7()" 
                style="width:100px;"/>


        </div>

        
    </div>


    <div v-else
        v-show="false"
        @click="isClose=false">
        <i class="fa-solid fa-wrench"></i>

    </div>


</template>
<script>
export default{
    emits: [ 'nst-value-manipulator' ],
    props: [ 'nValue','nName', 'divName' ],
    data(){
        return {
            isClose: false,
            mIsMounte: false,
            //vType: this.getTypeFromNVal(),
            //mValue: this.normalizeVal(),
            inputValue: '',
            orgValue: this.nValue
        };
    },
    mounted(){
        this.inputValue = this.valueType;
        
    },
    computed:{
        valueType(){
            return String(this.nValue);
            /*
            if( String(this.nValue).endsWith('px') ){
                return 'px';
            }else{
                return String(this.nValue);
            }
                */
        },
        normalizePx(){ return parseInt( this.nValue.replaceAll('px','') ); },
        propertyRaw(){ return this.nValue; }
    },
    watch:{        
    },
    methods:{
        setPxMsg(  ){
            debugger
            this.$emit( 'nst-value-manipulator', 
                { propName: this.nName, newValue: this.inputValue+'px' } );
        },
        onSend_RAWMsg7( ){
            this.$emit( 'nst-value-manipulator', 
                { propName: this.nName, newValue: this.$refs.myManipulator.value } );
        },
        setWithSufixMsg( sufix ){
            debugger
            this.$emit( 'nst-value-manipulator', 
                { propName: this.nName, newValue: this.inputValue+sufix } );
        }

        
        
    }

}

</script>