<style>

.nstPlotsvg {
  width: 200px;
  height: 200px;
}

rect.hbar {
  mask: url(#mask-stripe)
}
polygon.hbar {
  mask: url(#mask-stripe)
}
polygon.lbar {
  mask: url(#mask-stripel)
}
.thing-1 {
  fill: blue;
}
.thing-2 {
  fill: rgb(221, 244, 69);
}
.thing-3 {
  fill: rgb(0, 118, 255);
}
</style>
<template>

    <div 
        :style="`
            width:${optsions.size[0]}px; 
            height: ${optsions.size[1]}px;
            `"
        >

        <svg 
            :style="`
            width:${optsions.size[0]+optsions.margin}px; 
            height: ${optsions.size[1]+optsions.margin}px;
            `">
            <defs>
            <pattern id="pattern-stripe" 
                width="4" height="4" 
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)">
                <rect width="2" height="4" transform="translate(0,0)" fill="white"></rect>
            </pattern>
            <mask id="mask-stripe">
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-stripe)" />
            </mask> 
            <pattern id="pattern-stripel" 
                width="8" height="10" 
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(90)">
                <rect width="6" height="8" transform="translate(0,0)" fill="white"></rect>
            </pattern>
            <mask id="mask-stripel">
                <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-stripel)" />
            </mask>      
            </defs>

                <!--
                
                    points="50,50 150,50 150,150 50,150" 
                -->
                <polygon
                    :points="getDataPoints" 
                    class="hbar thing-3"
                    />
                <polyline
                    :points="getDataPoints" 
                    stroke="#ffaa63ff" fill="none"
                    stroke-width="5px"
                    stroke-opacity="1.0"
                    style="transform:translate(10px, 10px);"
                    
                    />
            <g x="30" y="10">
                <polygon
                    :points="getDataPoints" 
                    class="hbar thing-3"
                    />
            </g>
        

            <!-- bar chart 
            <rect class="hbar thing-2" x="0" y="0" width="50" height="200"></rect>
            <rect class="hbar thing-2" x="0" y="130" width="200" height="20"></rect>
            <rect class="hbar thing-2" x="102" y="25" width="50" height="75"></rect>
            -->
            
            <!-- horizontal bar chart 
            <rect class="hbar thing-1" x="0" y="200" width="10" height="50"></rect>
            <rect class="hbar thing-1" x="0" y="251" width="123" height="50"></rect>
            <rect class="hbar thing-1" x="0" y="302" width="41" height="50"></rect>
            -->
            
        </svg>

    </div>

</template>
<script>
export default{
    props: [ 'plotPoints', 'optsions' ],
    data(){
        return {            
        };
    },
    computed:{
        getDataPoints(){
            return this.plotPoints;
        }

    }
}

</script>