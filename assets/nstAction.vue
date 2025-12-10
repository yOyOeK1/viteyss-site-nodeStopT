<template>
    <b>Set action at frame:</b>
    <!--
        [{{ isActions }}]
-->
    <div>
        <input type="checkbox" v-model="isStop"
            id="nstAStop" 
            @change="onChange()"
            />
        <label for="nstAStop" style="display: inline;">
            Stop
        </label>
    </div>

    

    
    <div>
        <input type="checkbox" v-model="isPlay"
        id="nstAPlay" 
        @change="onChange()"
        />
        <label for="nstAPlay" style="display: inline;">
            Play            
        </label>
    </div>
   
   
    <div>
        <input type="checkbox" v-model="isGOTO"
            id="nstAGOTO" 
            @change="onChange()"
            />
        <label for="nstAGOTO" style="display: inline;">
            GOTO to ms. / label
        </label>

        <input type="text" v-model="isGOTOValue" 
            v-show="isGOTO == true"
            placeholder="ms. or label"
            @change="onChange()"
            />

    </div>


    <div>
        <input type="checkbox" v-model="isSpeed"
            id="nstASpeed" 
            @change="onChange()"
            />
        <label for="nstASpeed" style="display: inline;">
            Set playback speed
        </label>

        <input type="text" v-model="isSpeedValue" 
            v-show="isSpeed == true"
            @change="onChange()"
            placeholder=""/>
    </div>

    <div>
        <input type="checkbox" v-model="isFPS"
            id="nstAFPS" 
            @change="onChange()"
            />
        <label for="nstAFPS" style="display: inline;">
            Force FPS change
        </label>

        <input type="number" step="1" min="0" v-model="isFPSValue" 
            v-show="isFPS == true"
            @change="onChange()"
            placeholder="ms. or label"/>

    </div>
    
    <div>
        <input type="checkbox" v-model="isFuncion"
            id="nstAFuncion" 
            @change="onChange()"
            />
        <label for="nstAFuncion" style="display: inline;">
            Funcion to execute
        </label>

        <textarea v-model.lazy.trim="isFuncionValue" 
            v-show="isFuncion == true"
            placeholder="console.log('hello world');"/>

    </div>

    
</template>

<script>
import { ref, toRaw } from 'vue';


export default{
    props:[ 'actionsSelected','properties', 'metadata', 'replayTimeScale', 'frameNo' ],
    emits:[ 'nst-actions-set' ],
    data(){
        return {
            isActions: this.actionsSelected,

            isPlay: false,
            isStop:false,
            isGOTO: false,
            isGOTOValue: ref(''),
            isSpeed: false,
            isSpeedValue: this.replayTimeScale,
            isFPS: false,
            isFPSValue: this.metadata.fps,
            isFuncion : false,
            isFuncionValue: ref(
                ''//'console.log("hi ",tl);'
            ),
    
            isMounted: false,
        };
    },
    mounted(){ this.isMounted = true; this.onChange() },
    watch:{
        actionsSelected( action, ov ){ 
            console.log(`nstA got actions selectied - change `,action);
            if( action == undefined ){
                this.setItAsDefault();
                return -1;
            }
            this.isActions = action;             
            this.isFPSValue = this.metadata.fps;

            this.isStop = 'stop' in action;
            this.isPlay = 'play' in action;
            this.isGOTO = action.goto;
            this.isGOTOValue = action.gotov;
            this.isSpeed = action.speed;
            this.isSpeedValue  = action.speedv;
            this.isFPS = action.fps;
            this.isFPSValue = action.fpsv;
            this.isFuncion = action.func;
            this.isFuncionValue = action.funcv;

        },
    },
    methods:{
        setItAsDefault(){
            this.isMounted = false;
            this.isPlay = false;
            this.isStop = false; 
            this.isGOTO = false;
            this.isGOTOValue = '';
            this.isSpeed = false;
            this.isSpeedValue = this.replayTimeScale;
            this.isFPS = false;
            this.isFPSValue = this.metadata.fps;
            this.isFuncion = false
            this.isFuncionValue = '';
            this.isMounted = true;
        },
        onChange(){
            if( this.isMounted == false ) return 1;
            let gotovStr = `${toRaw( this.isGOTOValue )}`;
            let gotovInt = parseInt( gotovStr );
            console.log('gotov int is type of ',(typeof gotovInt),
                `\n and [${gotovInt}] `);
            let gotov = `${gotovInt}` == 'NaN' ? gotovStr : gotovInt;
            let speedv = parseFloat( toRaw( this.isSpeedValue ) );
            let fpsv = parseInt( toRaw( this.isFPSValue ) );
            let funcv = toRaw( this.isFuncionValue );            
            let tr2 = {
                'goto': this.isGOTO,
                'gotov': gotov,
                'speed': this.isSpeed,
                'speedv': speedv,
                'fps': this.isFPS,
                'fpsv': fpsv,
                'func': this.isFuncion,
                'funcv': funcv
            };
            if( this.isStop ) tr2['stop'] = true;
            if( this.isPlay ) tr2['play'] = true;
            console.log(`so action is \n `,JSON.stringify(tr2,null,4));
            this.$emit( 'nst-actions-set',{ action: tr2 });
        },

        
    }


}

</script>