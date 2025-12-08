<template>


    <div>
        <!--
            nstPropSelector of <b>({{ divSelectedName }})</b>
        -->

        
        <div class="debBorders" >
            Selected: ({{ selected.length }})

            <img :src="homeUrl+'assets/icon_left_top.svg'" 
                title="Add property: left, top"
                @click="$emit('nst-prop-selection-change', {pName: 'left', wantState: true } );$emit('nst-prop-selection-change', {pName: 'top', wantState: true } );"/>
            <i class="fa-regular fa-eye-slash"
                title="Add property: display"
                @click="$emit('nst-prop-selection-change', {pName: 'display', wantState: true } );"></i>
            <img :src="homeUrl+'assets/icon_opacity.svg'" 
                title="Add property: opacity"
                @click="$emit('nst-prop-selection-change', {pName: 'opacity', wantState: true } );"/>


            
            <div  class="nstPropSelPropList">
                <div v-for="sProp,sIn in selected"
                    class="nstPropItem">
                    <div @click="$emit('nst-prop-selection-change', {pName: sProp, wantState: false } );"
                    title="Click to remove from this key frame"
                    style="display: inline;cursor: pointer;"
                    >
                        {{ sIn }}: {{ sProp }}  <!--  => [{{properties[ sProp ]}}]-->
                        
                    
                        
                    </div>
                    <NstValueManipulator 
                        :nValue="properties[ sProp ]"
                        :nName="sProp"
                        :divName="divSelectedName" 
                        style="display: inline; " 
                        @nst-value-manipulator="nstSetPropertyNewValue"/>

                </div>

            </div>
        </div>
                
        <div class="debBorders" >
            Properties: ({{ Object.keys(properties).length - selected.length }})
        
            <input type="text" v-model="searchPropStr"
                placeholder="search ..."
                ref="nstPropSelSearchDiv"
                style="max-width:100px;"></input>
        
            <div class="nstPropSelPropList" 
                ref="nstPropSelPropListDiv">
                <div v-for="pval,pname,pind in propertiesFilterd">
                    <div v-if="!selected.includes( pname )"
                        @click="$emit('nst-prop-selection-change', {pName: pname, wantState: true } );"
                        class="nstPropItem"
                        style="cursor: pointer;"
                        title="Click to to key frame"
                        >
                        {{ pind }}: {{ pname }} [ {{ pval }} ]
                    </div>
                </div>

            </div>
        </div>



    </div>
</template>
<script>
import { toRaw,ref } from 'vue';
import NstValueManipulator from './nstValueManipulator.vue';

export default{
    emits: ['nst-prop-selection-change', 'nst-value-manipulator' ],
    props:[ 
        'properties', 'selected', 
        'nstTreePathSelected', 'nstTreeNodesSelected',
        'layerSelected', 'divSelectedName', 'homeUrl' 
    ],
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
                    tr.push( {score: 10, name: pName, d:this.properties[ pName ] });
                    

                }else if( pName.indexOf( this.searchPropStr ) != -1 ){
                    tr.push( {score: 3, name: pName, d:this.properties[ pName ] });

                }                    
            };
           
            tr.sort( (a,b) => b.score - a.score  );
            let trSorted = {};
            tr.forEach(e=> trSorted[ e.name ] = e.d);//+', '+e.score );

            if( this.mIsMounted == true )
                this.$refs.nstPropSelPropListDiv.scrollTop = 0;

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
        if( this.selected.length == 0 ){
            this.searchPropStr = 'opacit';
            this.$refs.nstPropSelSearchDiv.focus();


        } 

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
    min-width: 100%;
    max-height: 70px;
    border-radius: 5px;
    
}
.nstPropItem{
    
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