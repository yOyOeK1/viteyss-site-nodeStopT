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




        <span v-if="
            nValue.startsWith('rgb(')            
            ">
            <input type="color" 
                title="Set color rgb ( R, G, B )"
                :value="nValue" 
                @input.layze="$refs.myManipulator.value=$event.target.value;onSend_RAWMsg7()"
                />
        </span>

        


        <VyButtonContext
            v-else
            :title="`Manipulate data of: [${nName}]`"
            icon='<i class="fa-solid fa-gears"></i>'
            v-model:is-showing="showManipulator"
            >

            <span v-if="[ 'opacity' ].indexOf( nName ) != -1">
                <b>As opacity ...</b>
                <div>
                    <input type="range" min="0" max="1" step="0.05" 
                        title="set normal [ 0.0 .... 1.0 ]"
                        :value="nValue" 
                        @input.layze="$refs.myManipulator.value=$event.target.value;onSend_RAWMsg7()"
                        />
                </div>

            </span>


            <span v-else-if="
                nValue.startsWith('rgba(') 
                ">
                RGBa: {{ rgbaToHexRGB( nValue ) }} {{ toHex( parseFloat(nValue.split(',')[3].split(')')[0])*255.00 ) }}
                <br></br>
                <input type="color" 
                    title="Set color rgba ( R, G, B, .... )"
                    ref="valRGB"
                    :value="rgbaToHexRGB( nValue )" 
                    @input.layze="onSend_RAW(`${$event.target.value}${toHex($refs.valRGBA.value*255.00)}`)"
                    />

                Alpha: {{ JSON.stringify(parseFloat(nValue.split(',')[3].split(')')[0]) ) }}
                <input type="range" 
                    min="0" max="1" step="0.05"
                    title="Set color rgba ( .. , .. , .. , A )"
                    ref="valRGBA"
                    :value="parseFloat(nValue.split(',')[3].split(')')[0])" 
                    @input.layze="onSend_RAW(`${$refs.valRGB.value}${toHex($event.target.value*255.00)}`)"
                    />
            </span>


            <span v-else>
                <hr></hr>
                Nice do + or - or slide pim pim o.O
                But this one is unknown :(<br></br>
                <pre>name: [{{ nName  }}]<br>value:[{{ nValue }}]</pre>
            </span>

        </VyButtonContext>

    </div>

    
</div>





<div v-else
    v-show="false"
    @click="isClose=false">
    <i class="fa-solid fa-wrench"></i>

</div>


</template>
<script>
import VyButtonContext from '@viteyss-site-settings1/UiAssets/vyButtonContext.vue';

export default{
    components: { 
        VyButtonContext,
    },
    
    emits: [ 'nst-value-manipulator' ],
    props: [ 'nValue','nName', 'divName' ],
    data(){
        return {
            isClose: false,
            mIsMounte: false,
            //vType: this.getTypeFromNVal(),
            //mValue: this.normalizeVal(),
            inputValue: '',
            orgValue: this.nValue,

            showManipulator: false
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
        onSend_RAW( msg ){

            mkTrashHold( 'nstValueManupulator'+this.nName, ()=>{
                this.$emit( 'nst-value-manipulator', 
                    { propName: this.nName, newValue: msg } );

            }, 150 );


        },
        setWithSufixMsg( sufix ){
            debugger
            this.$emit( 'nst-value-manipulator', 
                { propName: this.nName, newValue: this.inputValue+sufix } );
        },

        toHex(d) {
            return  ("0"+(Number(parseInt(d)).toString(16))).slice(-2).toUpperCase()
        },
        toNumber( hex ){
            return parseInt( Number("0x"+hex ) );
        },
        rgbaToHexRGB( rgbaI ){
            let rgba = rgbaI.split('(')[1].split(')')[0].split(',');
            return '#'+
                //'('+JSON.stringify(rgba)+')'+
                this.toHex( rgba[ 0 ])+
                this.toHex( rgba[ 1 ])+
                this.toHex( rgba[ 2 ]);
        }

        
        
    }

}

</script>