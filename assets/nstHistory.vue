<template>
    <button
        title="Undo"
        :disabled="counter==1 || current == 0"
        @click="onSwap(-1)"
        >
        <i class="fa-solid fa-reply"></i>
    </button>
    <div style="display:inline-block;min-width:18px;min-height: 18px;">
        <div style="transform:rotate(-90deg);position:absolute;font-size: 75%;">
            {{ current }}/{{counter }}
        </div>
    </div>
    <button
        title="Redu"
        :disabled="current == (counter-1)"
        @click="onSwap(1)"
        >
        <i class="fa-solid fa-share"></i>
    </button>

</template>
<style>
</style>
<script>

import{ toRaw } from 'vue';

export default{
    props:[ 'layers', 'metadata', 'lSelected', 'divFindName',
        'nstTreePathSelected'
     ],
    emits:[ 'nst-history-swap' ],
    data(){
        return {
            current: 0,
            counter: 0,
            history: []
        };
    },
    methods:{
        echo(msg){
            console.log('echo: ',msg)
        },
        onSwap( direction ){
            
            this.current+= direction;

            if( this.current < 0 ){
                this.current = 0;
                return -1;
            } else if ( this.current > this.counter ) {
                this.current = this.counter;
                return -2;
            }


            this.$emit( 'nst-history-swap', {
                'msg': 'Swap to history',
                'counter': this.counter,
                'current': this.current,
                'history': toRaw( this.history[ this.current ] )
            });
        },
        
        saveStase( note, opts = undefined ){

            let layers = JSON.parse( JSON.stringify(toRaw(this.layers)));
            let meta = -1;//toRaw( this.metadata );
            //meta['timeLine'] = -1;

            this.history.push({
                'note': note,
                'entryDate': Date.now(),
                'No': this.counter,
                'lSelected': parseInt(this.lSelected),
                'layers': layers,
                'divFindName': `${this.divFindName}`,
                'metadata': meta,
                'opts': opts,
                'nstTreePathSelected': JSON.parse( JSON.stringify(toRaw( this.nstTreePathSelected ) ) )

            });

            this.counter++
            this.current = this.counter-1;

            if(0)
                console.log('nstHistory save state ',this.current+' / '+this.counter,
                    '\n\n----------------------------------------\n\n',
                    JSON.stringify(toRaw(this.history),null,4),
                    '\n\n-----------------------------------------'
                );
        }
    }

}
</script>