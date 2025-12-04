<template>
    <div 
        :style="'margin-left:'+(level==1?0:9)+'px;padding-left:5px;'+
            'padding-top:2px;padding-bottom:2px;'+
           'border-left: solid gray 1px;border-bottom: solid gray 1px;border-radius:6px;'+
           'background-color:rgb('+((iNo%2)==0?'255,255,255':'249,240,230')+');'

        "
        v-if="['META','TITLE','LINK','SCRIPT'].indexOf(name)==-1"
        :title="'Path index tree: '+pathNow+iNo+'\nLevel: '+level+'\nChildren index: '+iNo"
        >
        <span @click="isOpen=!isOpen"
            style="display: inline;margin: 0px;padding: 0px;" 
            :disabled="children.length==0">
            <span v-if="children.length == 0">
                <i class="fa-regular fa-square-full"></i>
            </span>
            <span v-else>
                <i v-if="!isOpen" class="fa-regular fa-square-plus"></i>
                <i v-else class="fa-regular fa-square-minus"></i>
            </span>
        </span>
        <u>{{ name }}</u> {{ aId }} 
            <!--<small>
                (ch: {{ children.length }})
            </small>-->
            <i v-if="aId!=''" 
                @click="doItemSelected()"
                :title="'Select this #'+aId" class="fa-solid fa-bullseye"></i>


        <div v-if="isOpen">
            <div v-if="level < 10">
                <div v-for="valuee,i in children">                    
                    <NstTItem                         
                        :level="level+1"
                        :iNo="i"
                        :pathNow="pathNow+iNo+','"
                        :name="valuee.tagName"
                        :mObj="valuee"
                        @nst-tree-item-selected="nstTreeItemSelected_emit"
                        />
                    </div>
            </div>
        </div>
        


    </div>




</template>
<script>
import { ref } from 'vue';
export default{
    emits:[ 'nst-tree-item-selected' ],
    props:[ 'level', 'iNo', 'pathNow', 'name', 'mObj' ],
    data(){

        let children = [];
        let aId = '';
        let isOpen = false;

        

        let moc = this.mObj.children;
        aId = this.mObj.getAttribute('id');
        if( aId == null ) aId = '';
        console.log('doing childrens id: ['+aId+'] for level: ',this.level, '  ', moc.length);
        
        if( aId == 'nstItemTreeRoot' ){
            isOpen = false;
            children = [];
        }else{
            children = moc;
            if( this.level < 2 ) 
                this.isOpen = true;
        }



        return {
            isOpen: isOpen,
            children: children,
            aId:aId,
        };
    },
    mounted(){
        console.log(' pathNow:', this.pathNow);       
    },
    methods:{
        doItemSelected(  ){
            //console.log( ' do item selected from tree ',this.mObj);
            if( this.aId != '' ){
                this.nstTreeItemSelected_emit({'selectById':this.aId});
            }
        },
        nstTreeItemSelected_emit( data ){
            console.log(' level: '+this.level+' aId:'+this.aId,
                ' got data\n',data
            );
            this.$emit('nst-tree-item-selected', data);
        }
    }

}

</script>