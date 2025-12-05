
<style>
.nstTVitemSelected{
    /*outline: 2px solid rgb(84, 132, 88);
    */background-color: rgb(228, 239, 188);
    border-radius: 6px;
    padding:2px;
}
.nstTVitemSelectedLast{
    /*outline: 2px solid rgb(6, 85, 1);
    */color: rgb(255, 255, 255);
    background-color: rgb(11, 66, 1);
    border-radius: 6px;
    padding:2px;
}
</style>
<template>
    <div id="nstItemTreeRoot">
        <button 
            title="Rebuild tree"
            @click="onRebuild()" class="nstButton"><i class="fa-solid fa-retweet"></i></button>

        <small>
            o: {{ isOpen }} lever: {{ level }} name: {{ name }} ch: {{ children.length }}
        </small>

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
import NstTItem from './nstTItem.vue';
import { ref } from 'vue';
export default{
    emits:[ 'onNodeSelected' ],
    components: {
        "NstTItem" : NstTItem
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
        setTimeout(()=>this.onRebuild(),200);
    },  
    methods:{
        onRebuild(){
            this.children = [];
            this.children = document.body.children;
        },
        onSelectedItem( data ){
            console.log('on selected item from tree target \n',data);
            this.$emit('onNodeSelected', data );
        }
    }

}

</script>