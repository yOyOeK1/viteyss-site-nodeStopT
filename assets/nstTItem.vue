<template>


    <div 
        :style="'margin-left:'+(level==0?0:9)+'px;padding-left:5px;'+
            'padding-top:2px;padding-bottom:2px;'+
           'border-left: solid gray 1px;'+
           //`border-bottom: solid gray 1px;`+
           `border-radius:6px;`+
           'background-color:rgb('+((iNo%2)==0?'255,255,255':'249,230,250')+');'

        "
        
        v-if="['META','TITLE','LINK','SCRIPT'].indexOf(name)==-1"
        :title="'Path index tree: '+pathNow+iNo+'\n'+
            'Path computed: '+myDoomIndexPath+'\n'+
            'Level: '+level+'\nChildren index: '+iNo"
        >

        <span @click="isOpen=!isOpen"
            style="display: inline;margin: 1px;padding: 0px;" 
            :disabled="children.length==0">
            <span v-if="children.length == 0" style="color:gray;">|_
                <!--
                    <i class="fa-regular fa-square-full"></i>
                -->
            </span>
            <span v-else>
                <i v-if="!isOpen" class="fa-regular fa-square-plus"></i>
                <i v-else class="fa-regular fa-square-minus"></i>
            </span>
        </span>


        <span :class="
            (isSelectedLast?'nstTVitemSelectedLast':
                (isSelectedComputed()?'nstTVitemSelected':'')
            )
            ">
                {{ isSelectedLast }}
                <section 
                    :id="
                    ('treePath_'+pathNow+iNo+',').replaceAll(',','_')
                    "
                    :ref="
                    ('treePath_'+pathNow+iNo+',').replaceAll(',','_')
                    " 
                    style="display:inline;"> 
                    
                    <NstTItemNode 
                        :name="name"
                        :aId="aId"
                        @do-item-selected="doItemSelected"
                        />

                </section>

        </span>

        <div v-if="isOpen">
            <div v-if="level < 10" >
                
                <div v-for="valuee,i in children">                    
                    <NstTItem                         
                        :level="level+1"
                        :iNo="i"
                        :pathNow="pathNow+iNo+','"
                        :pathsSelected="pathsSelected"
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
import { ref,toRaw } from 'vue';
import { nstConvert } from '../nstLib';
import NstTItemNode from './nstTItemNode.vue';



export default{
    components:{
        'NstTItemNode': NstTItemNode
    },
    emits:[ 'nst-tree-item-selected' ],
    props:[ 'level', 'iNo', 'pathNow', 'pathsSelected', 'name', 'mObj' ],
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
        let myDom = this.myIndexPath();
        let isSel = toRaw(this.isSelectedComputed());

        return {
            isOpen: isSel?isSel:isOpen,
            children: children,
            aId:aId,
            myDoomIndexPath: myDom
        };
    },
    mounted(){
        //console.log(' pathNow:', this.pathNow);       
    },
    computed:{
        isSelectedLast(){
            //console.log('myPath',this.myDoomIndexPath);
            let mPath = JSON.stringify( toRaw(this.myDoomIndexPath) );//this.myIndexPath();
            if( this.pathsSelected.length > 0 ){
                for( let i=0,ic=this.pathsSelected.length-1; i<=ic; i++ ){
                    if( this.pathsSelected[i].length-1 == this.level ){
                        let tComp = JSON.stringify( this.pathsSelected[i] );
                        
                        if(  mPath === tComp )
                            return true;
                    }
                }
    
            }
            return false;
        }
    },
    methods:{
        isSelectedComputed(){
            //console.log('myPath2',this.myDoomIndexPath);
            let mPath = this.myDoomIndexPath?this.myDoomIndexPath:this.myIndexPath();
            if( this.pathsSelected.length > 0 ){
                for( let i=0,ic=this.pathsSelected.length; i<ic; i++ ){
                    if( this.pathsSelected[i].length >= this.level && 
                        this.pathsSelected[i][this.level] == this.iNo 
                    ){
                    
                        let selPath = this.pathsSelected[i].slice(0,this.level+1);
                        if( JSON.stringify(mPath) == JSON.stringify(selPath) ){
                            return true;
                        }
                        
                    }
                }
    
            }
            return false;
        },
        myIndexPath(){
            let o = toRaw( this.mObj );
            //;this.getIndexOfChildReq( o, o.parentNode.children, [] );
            let tr = nstConvert.getIndexOfChildReq( o );
            return tr;
        },
        /*
        getIndexOfChildReq( oLookFor, lookIn, tr ){
            //console.log('get index ',tr,' tagName now :',oLookFor.tagName, ' look in: ',lookIn.length);
            if( oLookFor.tagName == 'BODY' ){
                return tr;
            }

            let ind = -1;
            for( let i=0,ic=lookIn.length; i<ic; i++){
                if( lookIn[i] == oLookFor ){
                    ind = i;
                    break;
                }
            }
            if( ind != -1 ){
                tr.unshift( ind );
                return this.getIndexOfChildReq( oLookFor.parentNode, oLookFor.parentNode.parentNode.children, tr );
            }
        },
        */

        doItemSelected( event  ){
            //console.log( ' do item selected from tree ',this.mObj, ' event: ',event);
            if( this.aId != '' ){
                this.nstTreeItemSelected_emit({'selectById':this.aId, 'event': event });
            }
        },
        nstTreeItemSelected_emit( data ){
           // console.log(' level: '+this.level+' aId:'+this.aId,
            //    ' got data\n',data
            //);
            this.$emit('nst-tree-item-selected', data);
        }
    }

}

</script>