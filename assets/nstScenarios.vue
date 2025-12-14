<style>
.nstScenarios button{
    padding:3px;

}
</style>

<template>


<div v-if="modeView=='debug'">
    nst - scenario ( 's ) 
<pre style="font-size: 85%;line-height: 95%;">* lScenario:    ({{ lScenario }})
* scenarios:      [{{ scenarios }}]</pre>  

</div>

<pre v-if="0">* mode:   [<select v-model="modeView">
    <option v-for="value in ['view','edit','selection','debug']">
        {{ value }}
    </option>

    </select>]</pre>




<div v-if="scenario && (modeView =='view' || modeView=='debug')"
    style="cursor: pointer;"
    @click="modeView='selection'"
    >
    <i class="fa-solid fa-clapperboard"></i> [{{lInd}}]: {{ scenario.name }}
</div>

<div v-show="modeView == 'edit'  || modeView=='debug'"
    class="nstScenarios">
    
    <button
        @click="modeView='selection'"
        title="Cancel edit"
        ><i class="fa-solid fa-left-long"></i></button>

    [ {{ lInd }} ]:


    <input
        v-if="scenario!=null"
        type="text" 
        ref="inputScenarioRef"
        v-model="scenario.name"
        style="width:85px;"
        />         
              
    <button
        :disabled="!canSave"
        @click="onChangeAction( 'name' );modeView='selection'"
        title="Save changes in scenario"
        ><i class="fa-solid fa-floppy-disk" /></button>
        
    <button
        @click="onChangeAction( 'clone' )"
        title="Clone scenario"
        ><i class="fa-regular fa-clone" /></button>
    <button
        @click="onChangeAction( 'remove' )"
        :disabled="canRemove"
        title="Remove scenario"
        ><i class="fa-regular fa-trash-can" /></button>
    

</div>
    
<div v-if="modeView == 'selection'  || modeView=='debug' "
    class="nstScenarios">
    
    
    <button
        @click="modeView='view'"
        title="Back to view mode"
        ><i class="fa-solid fa-left-long"></i></button>
    
    

    <select :value="lScenario" @change="onChangeAction( 'scenario', $event )"
        ref="lScenarioMy"
        style="width:120px"> 
        <option  v-for="cliV,cliI in scenarios"
            :value="cliV.id">
            [ {{ cliI }} ]: 
            <!--(#{{cliV.id}}) -->
            {{ cliV.name }}
        </option>
    </select>

    <button
        @click="onEditModeRequest()"
        title="Edit scenario"
        ><i class="fa-regular fa-pen-to-square"></i></button>
    <button
        @click="onChangeAction( 'clone' )"
        title="Clone scenario"
        ><i class="fa-regular fa-clone" /></button>
    <button
        :disabled="!canRemove"
        @click="onChangeAction( 'remove' )"
        title="Remove scenario"
        ><i class="fa-regular fa-trash-can" /></button>



</div>

</template>

<script>
export default{
emits: [ 'scenario-change', 'scenarios-change' ],
props: {
    'lScenario': { type: String, default: '-1' },
    'scenarios': { type: Array, default: [{ id: '-1', name:'Main', opts: { } }] },

},
data(){
    return {
        modeView:'view',
        scerarioOrg: null,
        lInd: -1,
        scenario: null,//this.scenarioNow==-1?{name:''}:JSON.cloneRaw( this.scenarios[ this.scenarioNow ] ),
    };
},
mounted(){
    console.log('nstscenario @MOUNTED this.scenarios,',this.scenarios,'\nthis.lScenario:',this.lScenario);
    this.rebuildScenarioAndOrg();   
},  
watch:{
    scenarios(nv,ov){
        console.log('nstscenario @ scenarios ',nv);
        this.rebuildScenarioAndOrg();
        //this.scenario = JSON.cloneRaw( this.scenarios[ nv ] );
        //console.log('nstscenario @ scenario:',this.scenario);
    },
    lScenario(nv,ov){
        console.log('nstscenario @ lScenario ',nv);
        this.rebuildScenarioAndOrg();
        //this.scenario = JSON.cloneRaw( this.scenarios[ nv ] );
        //console.log('nstscenario @ scenario:',this.scenario);
    }
},
computed:{
    
    canSave(){
        if( this.scenario == null ) return false;
        if( this.scenario.name != this.scerarioOrg.name )
            return true;

        return false;
        /*
        scenarioNow == 0 || ( scenarioNow != 0 && 
        $refs.inTescenarioName &&
        'value' in $refs.inTescenarioName &&
        `${$refs.inTescenarioName.value}`===`${scenario.name}` )
        */
    },
    canRemove(){
        return this.lScenario != -1;
    }
        
},
methods:{
    rebuildScenarioAndOrg(){
        let lInd = '-1';
        let res = this.scenarios.findIndex( s => {
            lInd++;
            if( s.id == this.lScenario ){
                this.scenario = JSON.cloneRaw( s );
                this.scerarioOrg = JSON.cloneRaw( s );
                this.lInd = lInd;
                return true;
            }
            return false;
        });

        if( res == '-1' ){
            this.$emit('scenario-change', '-1' );
        }
    },

    onChangeSelected( v ){
        console.log('nstscenario on change selection: ',v);
        this.$emit('scenario-change',{
            selected: parseInt(v),
        });
    },

    makeUidOnStr( strr ){
        let uid = `_tt${Date.now()}`;
        let pTest = `${strr}`.indexOf( '_tt');
        if( pTest > 0 ) strr = strr.substring( 0, pTest );
        return `${strr}${uid}`;
    },


    onEditModeRequest(){
        this.modeView='edit';
        setTimeout(()=>{
            this.$refs.inputScenarioRef.focus();
        },100);
    },
    onChangeAction( action, event = '' ){
        if( this.scenarios == undefined ){
            console.log('nstscenario error ! this.scenarios:',this.scenarios);
            return -1;
        }
        let res = false;
        let scenarios = null;
        if( action == 'scenario'){
            console.log('nstscenario - emit scenario ');
            this.$emit('scenario-change', event.target.value );

        }else if( action == 'remove' ){
            console.log('nstscenario - emit remove ');
            scenarios = JSON.cloneRaw( this.scenarios );
            let sIn = scenarios.findIndex( s => s.id == this.lScenario );
            if( sIn != -1 ){
                scenarios.splice( sIn, 1 );
                res = true;
            }

        }else if( action == 'clone' ){
            console.log('nstscenario - emit clone ');
            let clone = JSON.cloneRaw( this.scenario );
            clone.id = this.makeUidOnStr(clone.id);
            clone.name = this.makeUidOnStr( clone.name );
            scenarios = JSON.cloneRaw( this.scenarios );
            scenarios.push( clone );
            res = true;
            setTimeout(()=>this.$emit('scenario-change', clone.id ),200);

        }else if( action == 'name'){
            scenarios = JSON.cloneRaw( this.scenarios );
            for( let s of scenarios){ 
                if( s.id == this.scenario.id ){
                    s.name = this.scenario.name
                    res = true;
                    break;
                }
            }
        }
        
        if( res )
            this.$emit('scenarios-change',{scenarios});

    }


}



}


</script>