<style>
</style>
<template>
    <div id="nstItemTreeRoot">
        <button 
            title="Rebuild tree"
            @click="onRebuild()" class="nstButton"><i class="fa-solid fa-retweet"></i></button>

        <small>
            o: {{ isOpen }} lever: {{ level }} name: {{ name }} ch: {{ children.length }}
        </small>

        <small style="font-size: 50%;">{{ pathsSelected }}</small>
        <Transition>

            <div 
                v-if="pathsSelected.length>0"
                id="nstPathsSelectedDiv"
                style="
                    padding:12px;
                    margin: 1px 0px;
                    box-shadow: rgb(50, 50, 50) 0px 3px 8px 0px inset;
                    background-color: rgb(116 157 70);
                    border-top: 3px solid #42952d;
                    border-bottom: 2px solid #bfff79;
                    display: inline-block;
                    min-width: 100vw;
                    ">
                <div v-for="si in getSelectedListNice"
                    :title="si.indexPath">
                    
                    <span v-if="si.node!=-1"
                        class="nstTVitemSelectedLast" 
                        style="box-shadow: rgb(73 59 38) 0px 4px 7px 0px;"
                        >
                        
                        <NstTItemNode 
                            :name="si.name"
                            :aId="si.aId"
                            @do-item-selected="onScrollTo(si.indexPath)"
                            />

                    </span>
                    <span v-else>
                        
                        <i class="fa-solid fa-notdef"></i> - NaN er
                    
                    </span>


                </div>

            </div>

        </Transition>

        <!--
            <div>
                <div>Paths now selected:</div>
                ( {{ pathsSelected }} )
            </div>
            -->

         <NstTItem 
            v-for="value,i in children"
            :level="level"
            :iNo="i"
            :pathNow="'body,'"
            :pathsSelected="pathsSelected"
            :name="value.tagName"
            :mObj="value"
            @nst-tree-item-selected="onSelectedItem"
            />
        



    </div>

</template>
<script>

import { nstConvert } from '../nstLib';
import NstTItem from './nstTItem.vue';
import { ref,toRaw } from 'vue';
import NstTItemNode from './nstTItemNode.vue';
import { onScroll } from 'animejs';

//import {animate as ajsanimate, onScroll as ajsonScroll } from 'animejs';

export default{
    emits:[ 'onNodeSelected' ],
    components: {
        "NstTItem" : NstTItem,
        "NstTItemNode" : NstTItemNode 
    },
    props:[ 'pathsSelected' ],
    data(){
        return {
            name: 'body',
            mObj: document.body,
            level: 0,
            isOpen: true,
            children: ref([])
        };
    },
    mounted(){
        setTimeout(()=>{
            console.log('onSc nstItemTreeRoot: ',$('#nstItemTreeRoot'));
            
            this.onRebuild();
           
        },200);
    },  
    computed:{
        /*
        getTreeBase(){

            let fNode = ( fId, tagName = 'fNode', children = [], parentNode = null ) => {
                let n = () => {
                    return {
                        'tagName': tagName,
                        'getAttribute':(arg='' )=> {
                            console.log('n Node call - getAttribute('+arg+')');
                            return fId;
                        }, 
                        'children': children,
                        'parentNode': parentNode,
                    };

                };
                return n();
                
            };

            
            let selC = [];
            for( let sN of this.getSelectedListNice ){
                console.log('sN: ',sN);
                selC.push(
                    fNode( sN.id, sN.name, sN.node.childern )
                );
            }
            
            let sel = fNode(
                '_selected', 'fSelected', selC
            );
            for( let c of sel.children )
                c.parentNode = sel;


            let body = fNode(
                '_body', 'fBody', document.body.children 
            );


            let root = fNode(
                'fake_root', 'BODY', [sel, body]
            );

            sel.parentNode = root;




            return root;
        },
        */
        getSelectedListNice(){
            let tr = [];

            for(let e of this.pathsSelected ){
                let node = nstConvert.getElementFromDomeByIndexPath( document.body, toRaw(e) );
                tr.push({
                    indexPath: e,
                    id: node!=-1?node.getAttribute('id'):'eRId',//e[ e.length-1 ],
                    aId: node!=-1?node.getAttribute('id'):'eRId',
                    name: node!=-1?node.tagName:'Err:Select',
                    'node':node
                });
           }

            return tr;//[ {name:'div', id:'dB'} ];
        }
    },
    methods:{
        onScrollTo( indexPath ){
            let tPath = ('treePath_body_'+indexPath+',').replaceAll(',','_');
            //debugger
            let o = document.getElementById( tPath );
            let oSiTop = o.offsetTop;
            let oSiLeft = o.offsetLeft;
            document.getElementById('nstItemTreeRoot').scrollTo({
                top: oSiTop-30,
                left: oSiLeft-30,
                behavior: "smooth",
            });
        },


        onRebuild(){
            this.children = [];
            //this.children = [this.getTreeBase];
            this.children = document.body.children;
            //debugger;
        },
        onSelectedItem( data ){
            console.log('on selected item from tree target \n',data);
            this.$emit('onNodeSelected', data );
        }
    }

}

</script>