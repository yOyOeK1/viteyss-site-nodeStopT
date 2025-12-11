<template>

    <div v-if="mode == 'tiny'" style="display: inline;">
        #{{ aId }}
    </div>
    <div v-else style="display: inline;">

         <
        <div
            style="display: inline; font-size: 75%;"
            v-if="mode != 'tiny'"
            >
                <span v-if="aId != '$Settings'">
                    {{ name.toLowerCase() }}
                </span>
                <span v-else>
                    <i class="fa-solid fa-screwdriver-wrench"></i>
                </span>
        </div> 
        &nbsp;
        <div style="display: inline;">
            <div v-if="aId!=''" style="display: inline; cursor: pointer;"
                @click="doItemSelected"
                >
                #{{ aId }}
            </div>
            <div v-else style="display: inline;">
                #{{ aId }}
            </div>
        </div>
            
        />


    </div>

</template>

<script>

export default{
    props:[ 'name', 'aId', 'mode' ],//, 'onItemSelected'  ]
    emits:[ 'do-item-selected' ],
    methods:{
        doItemSelected(event ){
            this.$emit( 'do-item-selected',{ event: event } );
        }
    }
}

</script>