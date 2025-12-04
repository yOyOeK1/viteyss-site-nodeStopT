<template>
    <div id="nstItemTreeRoot">
        Tree View: <button @click="onRebuild()"><i class="fa-solid fa-retweet"></i></button>
        <small>
            o: {{ isOpen }} lever: {{ level }} name: {{ name }} ch: {{ children.length }}
        </small>



         <NstTItem 
            v-for="value,i in children"
            :level="level+1"
            :iNo="i"
            :pathNow="'body,'"
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
    props:[  ],
    data(){
        return {
            name: 'body',
            mObj: document.body,
            level: 0,
            isOpen: true,
            children: ref([])
        };
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