<template>
    nstPropSelector of <b>({{ divSelectedName }})</b>

    <hr></hr>

    <div>
        Selected: ({{ selected.length }})
    </div>
    <div  class="nstPropSelPropList">
        <div v-for="sProp,sIn in selected"
            class="nstPropItem">
            <div @click="$emit('nst-prop-selection-change', {pName: sProp, wantState: false } );"
               title="Click to remove from this key frame"
               style="display: inline;"
               >
                {{ sIn }}: {{ sProp }}  = > [{{properties[ sProp ]}}]
                
            </div>
            <NstValueManipulator 
                :nValue="properties[ sProp ]"
                :nName="sProp"
                :divName="divSelectedName" 
                style="display: inline;" 
                @nst-value-manipulator="nstSetPropertyNewValue"/>
        </div>

    </div>
    
    <hr></hr>
    
    <div>
        Properties: ({{ Object.keys(properties).length - selected.length }})
    </div>
    <div>
        <input type="text" v-model="searchPropStr"></input>
    </div>

    <div class="nstPropSelPropList" 
        ref="nstPropSelPropList">
        <div v-for="pval,pname,pind in propertiesFilterd">
            <div v-if="!selected.includes( pname )"
                @click="$emit('nst-prop-selection-change', {pName: pname, wantState: true } );"
                class="nstPropItem"
                title="Click to to key frame"
                >
                {{ pind }}: {{ pname }} = ({{ pval }})
            </div>
        </div>

    </div>
</template>
<script>
import { toRaw } from 'vue';
import NstValueManipulator from './nstValueManipulator.vue';

export default{
    emits: ['nst-prop-selection-change', 'nst-value-manipulator'],
    props:[ 'properties', 'selected', 'layerSelected', 'divSelectedName' ],
    components:{ 
        "NstValueManipulator": NstValueManipulator
    },    
    data(){    
        return {
            searchPropStr: '',
            mIsMounted: false,

        };
    },
    watch:{        
    },  
    computed:{        
        propertiesFilterd( ){            
            let tr = [];            
            for( let pName of Object.keys(this.properties) ){
                if( pName == this.searchPropStr ){
                    tr.push( {score: 5, name: pName, d:this.properties[ pName ] });
                    

                }else if( pName.indexOf( this.searchPropStr ) != -1 ){
                    tr.push( {score: 1, name: pName, d:this.properties[ pName ] });

                }                    
            };
           
            tr.sort( (a,b) => b.score - a.score  );
            let trSorted = {};
            tr.forEach(e=> trSorted[ e.name ] = e.d+', '+e.score );

            if( this.mIsMounted == true )
                this.$refs.nstPropSelPropList.scrollTop = 0;

            return trSorted;
        }      
    },
    methods:{
        nstSetPropertyNewValue( opts ){
            this.$emit('nst-value-manipulator',opts);
        }

    },
    mounted(){
        console.log('nst properties selector on  mounted !',
            '\nselected on Start:',toRaw(this.selected)
        );
        this.mIsMounted = true;

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

.nstPropSelPropList{
    background-color: #f3fff8;
    display: inline-block;
    overflow-y: overlay;
    overflow-x: overlay;
    border-radius: 5px;
    border: solid rgb(168, 255, 149) 3px;
    min-width: 90%;
    max-height: 180px;
    margin: 5px;
}
.nstPropItem{
    cursor: pointer;
    border-radius: 3px;
    border: solid 1px rgb(252, 153, 249);
    margin: 1px;
    margin-left: 5px;
    margin-right: 5px;
    background-color: rgb(238, 251, 191);
}
.nstPropItem:hover{
    background-color: white;
}
</style>