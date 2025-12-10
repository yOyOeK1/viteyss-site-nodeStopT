<template>
    <!--
    nstAnimSelector of <b>({{ divSelectedName }}) </b> mode:({{ asMode }})
    -->

    <div class="debBorders" v-if="asMode == 'edit'">



        <div>
            Key type:         
            <select v-model="wantState.type" @change="onChangeKeyType()">
                <option v-for="atype in typesOfAnimation" 
                    :value="atype" >{{makeStrFirstLeterBig(atype)}}</option>``
            </select>
        </div>

        <div>
            <div>            
                onBegin: 
                <div title="js Function bind - onBegin" 
                    class="nstBubbleDiv">
                    f(<i class="fa-solid fa-rocket"></i>): 
                    <input type="text" v-model="wantState.onBegin"
                        style="width:100px;"
                        @change="onChangeKeyType()" />
                </div>
            </div>

            <div>
                onComplete: 
                <div title="js Function bind - onComplete" 
                    class="nstBubbleDiv">
                    f(<i class="fa-solid fa-rocket"></i>): 
                    <input type="text" v-model="wantState.onComplete"
                        style="width:100px;"
                        @change="onChangeKeyType()" />
                </div>
            </div>


            <div v-show="[ 'animate', 'ani. every', 'ani. stagger' ].indexOf( wantState.type ) != -1">
                Ease: 
                <NstEases 
                        ref="easeSelectorO"
                        nameOf="easePlot1"
                        style="display: inline-block;"
                        :easeNow="wantState.ease"
                        @on-ease-selected="onEaseSelected"/>
            </div>

        </div>

        
        



        <div v-show="[ 'animate', 'ani. every', 'ani. stagger' ].indexOf( wantState.type ) != -1">
            Settings for animation:<br></br>

            <div title="Loop" class="nstBubbleDiv">
                <i class="fa-solid fa-repeat"></i>
                <input type="text" v-model="wantState.loop" 
                    maxlength="5"
                    style="width:50px;"
                    @change="onChangeKeyType()"
                    />
            </div>
            | 
            <div title="Alternate" 
                class="nstBubbleDiv">
                <i class="fa-solid fa-left-right"></i>
                <input type="checkbox" v-model="wantState.alternate"
                    @change="onChangeKeyType()" />
            </div>
            |
            <div title="Autoplay" 
                class="nstBubbleDiv">
                <i class="fa-solid fa-play"></i>
                <input type="checkbox" v-model="wantState.autoplay" 
                @change="onChangeKeyType()" />
            </div>
           

        </div>
    
    </div>




    <div v-else style="border:solid red 2px;">
        <span v-if="asMode != 'viewMini'">
            {{ wantState.type }}
        </span>
        <span v-if="asMode == 'viewMini'"
            :title="wantState.type">
            [{{ typeof wantState.type == 'string' ? wantState.type.substring(0,1).toUpperCase():'?' }}]
        </span>

        <div 
            :title="`Loop [${wantState.loop}]`" class="nstAniViewCell">
            <i class="fa-solid fa-repeat"></i>
            <span v-if="asMode != 'viewMini'">
                {{ wantState.loop}} | 
            </span>
        </div>
        <div 
            :title="`Alternate [${wantState.alternate}]`" class="nstAniViewCell">
            <i class="fa-solid fa-left-right"></i>
            <span v-if="asMode != 'viewMini'">
                {{ wantState.alternate }} | 
            </span>
        </div>
        <div 
            :title="`Autoplay [${wantState.autoplay}]`" class="nstAniViewCell">
            <i class="fa-solid fa-play"></i>
            <span v-if="asMode != 'viewMini'">
                {{ wantState.autoplay }} |
            </span>
        </div>
        <div v-if="wantState.onBegin != ''  && wantState.onBegin != undefined" 
            :title="'onBegine: ['+wantState.onBegin+']'"  class="nstAniViewCell">
            onBegin f(<i class="fa-solid fa-rocket"></i>):
            
        </div>
        <div v-if="wantState.onComplete != '' && wantState.onComplete != undefined" 
            :title="'onComplete: ['+wantState.onComplete+']'"  class="nstAniViewCell">
            onComplete f(<i class="fa-solid fa-rocket"></i>):
            
        </div>
    </div>



</template>
<script>
import { toRaw,ref } from 'vue';
import NstEases from './nstEases.vue';

function defWantState(){
    return {
        type: -1,
        duration: -1,
        delay: -1,
        loop: -1,
        ease: -1
    };
}

export default{
    components:{
        "NstEases": NstEases
    },
    emits: ['nst-animation-change'],
    props:{
        'asMode':{ type: String, default: '' }, 
        'selected':{ type: Object, default: defWantState()  },
        'nstTreePathSelected':{ type: Array, default: [] },
        'nstTreeNodesSelected':{ type: Array, default: [] },
        //'layerSelected':{type: String, default: ''}, 
        'divSelectedName':{type: String, default: ''} 
    },
    data(){    
        return {
            mIsMounted: false,
            
            //selectedType:null,
            wantState:defWantState(),

            //typesOfAnimation: ref([]),//[ 'set', 'animate', "others"],
            
        };
    },
    watch:{
        selected( nVal, oVal ){
            console.log('nstAS @ watch selected changed ! ',JSON.stringify(toRaw(nVal),null,4))
            this.wantState = toRaw( nVal );
            //this.sendUpdateToEase();
        },
        
    },  
    computed:{       
        typesOfAnimation(){
            if( this.nstTreeNodesSelected.length == 1 ){
                //this.wantState.type =  'set'; 
                return [ 'set', 'animate', "others"];
            }else if( this.nstTreeNodesSelected.length > 1 ){
                //this.wantState.type = 'set';
                return [ 'set', 'ani. every', "ani. stagger", "others multi"];
            }else{
                //this.wantState.type = 'set';
                return ['set','oiysh err'];
            }
        }
    },
    methods:{

        onEaseSelected( ease ){
            console.log(' nstAs - on ease selected ',JSON.stringify(ease,null,4));
            this.wantState.ease = ease.easeStr;
        },

        makeStrFirstLeterBig( str ){
            return makeStrFirstLeterBig( str );
        },
        onChangeKeyType(){
            console.log('changed ! animation to: ',this.wantState.type);//,this.$refs.selectedTypeSel.value);
            
            let tr = toRaw(this.wantState);
            if( tr.type == 'set' ) delete tr['ease'];
            tr['loop'] = parseInt( tr['loop'] );
            this.$emit('nst-animation-change', { 
                pName: this.divSelectedName, 
                'wantState': tr 
            });
        },
        

    },
    mounted(){
        console.log('nst animation selector on  mounted !',
            '\nselected on Start:',toRaw(this.selected)
        );
        this.mIsMounted = true;
        
        //this.wantState = this.selected;
        let nSelected = this.selected;
        // sets default of animimation selection 
        if( !('loop' in nSelected)  ) nSelected['loop'] = 0;
        if( !('alternate' in nSelected )  ) nSelected['alternate'] = false;
        if( !('autoplay' in nSelected )  ) nSelected['autoplay'] = false;
        if( !('onBegin' in nSelected ) ) nSelected['onBegin'] = '';
        if( !('onComplete' in nSelected ) ) nSelected['onComplete'] = '';

        this.wantState = nSelected;


        /*
        if( this.selectedOnStart.length == 0 ){
            console.log('nst - select empty set defaults');
            this.selected = ['left','right','opacity','background-color'];
        }else{
            this.selected = this.selectedOnStart;
        }
            */
    },
    unmounted(){
        console.log('nst properties selector UN mounted !');
    }


}
</script>
<style>

.nstAniViewCell{
    display: inline-block;
    border: solid blue 2px;
}

</style>
