<style>
.nstEBorder{
    border:sandybrown 2px solid;
    border-radius: 8px;
    padding:5px;
    background-color: #a3cef4;
}
</style>

<template>


<div v-if="showLabels">
    [{{ easeNow }} ] easeNow showLabels:[{{ showLabels }}]
</div>


<small v-if="showLabels">Ease:</small>
<select v-model="isType">
    <option v-for="value in eases"
        :value="value.type"
        >
        {{ value.type }} {{ ( Object.keys(value.param).length>0 ?
            '(P:'+Object.keys(value.param).length+')':'' ) }}
    </option>

</select>

<div 
    :id="mId+`Controls`"
    :style="`${isType=='default'?'display:none;':'display: inline-block; width:140px;'}`"
    >




    <div v-if="isType != 'default'"
        class="nstEBorder">
        <small v-if="showLabels">Variont:</small> 

        <div style="display: inline-block;">
        
            <div v-for="vari in isVariants"
                style="width:45%;display: inline-block;"
                >                
                <input type="radio" v-model="isVaria"
                    :value="vari" 
                    :id="'nstE_'+mId+vari"
                    style="display:none;"
                    />
                <label :for="'nstE_'+mId+vari" 
                    :title="vari"
                    class="nstAIassAsRadio"
                    :style="`min-width:100%;
                        background-color:${(isVaria==vari?'#004b02':'white')};
                        display: initial;
                        font-size: 75%;
                        overflow: hidden;
                        ${(isVaria==vari?'color:white':'')};
                        `"><div
                            style="display: inline;">{{ vari }}</div></label>
            </div>
        
        </div>

    </div>






    
    <div v-if="isType != 'default' && Object.keys( isParam ).length>0"
        >
        <!--
            <div>Parameters:</div>
            -->

        <div>        

            <div v-for="par in Object.keys( isParam )"
                :id="`mId_param`+par"
                class="nstEBorder"
                >
            
                <small>{{ par }}:</small>
                <div style="float: right;">
                    <input type="number" 
                        v-model="isParam[ par ]" 
                        @change="onParamChange()"
                        min="0"
                        max="10"
                        step="0.05"
                        style="width: 45px; margin:-5px;"/>
                </div>

                <input type="range" 
                    v-model="isParam[ par ]" 
                    @change="onParamChange()"
                    min="0"
                    max="10"
                    step="0.05"
                    style="width: 100%; margin:-5px;"/>
                <br></br>
                
            
        
            </div>
        
        </div>

    </div>


    
</div>
<div 
    :style="`display: ${isType == 'default'?'none':'inline-block'}; 
    width:130px;
    height:140px; 
    vertical-align:top;
    background-color: #d8ff6b;
    border: solid 2px sandybrown;
    border-radius: 15px;
    padding-top:10px;
    margin: 5px 5px;
    box-shadow: rgb(0, 0, 0) 1px 3px 6px;`"
    :id="mId+`Plot`">


    <div v-show="isType != 'default'" style="position:reactive;">
        <!--
            <div>Plot:</div>
        -->
        <div 
            :style="`display: inline-block ;
                width: ${plotOpts.size[0]}px;
                height: ${plotOpts.size[1]}px;
                `">
                
            <!--
                <div 
                v-html="injectPlotHtml"
                :style="`
                    position: absolute;
                    z-index: 10;
                    
                    width: ${plotOpts.size[0]}px;
                    height: ${plotOpts.size[1]+50}px;
                    `"
                    :id="'nstEasesPlot'+mId"
                    />
                    -->
                
                
            <NstPlot 
                style="
                    position: absolute;
                    z-index: 10;
                    "
                :plotPoints="plotPoints"
                :optsions="plotOpts"
                />
        </div>

    </div>






</div>




</template>

<script>
import { ref,toRaw } from 'vue';
import { nstConvert } from '../nstLib';

import {animate as ajsanimate, stagger as ajsstagger } from 'animejs';
import NstPlot from './nstPlot.vue';


export default{
    props: [ 'nameOf', 'easeNow' ],
    emits: [ 'on-ease-selected' ],
    components:{
        "NstPlot": NstPlot
    },
    data(){

        let mId = 'Midnst'+this.nameOf;


        let plotOpts = {
                size: [ 100, 100  ],
                margin: 30              
            };
        let svgPlotSrc = 'https://192.168.43.220:8080/yss/siteNo/0/MediaAssets/ease_plot2.svg';
        let svgStyle = `
            width:${plotOpts.size[0]-plotOpts.margin};
            height:${plotOpts.size[1]-plotOpts.margin}px;
            padding:${plotOpts.margin/2}px;z-index:50;`;


        return {
            showLabels: false,

            mId: mId,

            injectPlotHtml: nstConvert.dataToNodeStr( svgStyle, mId+'SVG', svgPlotSrc, '.svg', false ),

            eases: [
                { type: 'default', param: {}, varia: [ 'defaultEase' ] },
                { type: 'Linear', param: {}, varia: [ 'linear' ] },
                { type: 'Power', param: { power: 1.675 }, varia: [ 'in', 'out', 'inOut', 'outIn' ] },
                { type: 'Quad', param: {}, varia: [ 'inQuad', 'outQuad', 'inOutQuad', 'outInQuad' ] },
                { type: 'Cubic', param: {}, varia: [ 'inCubic', 'outCubic', 'inOutCubic', 'outInCubic' ] },
                { type: 'Quart', param: {}, varia: [ 'inQuart', 'outQuart', 'inOutQuart', 'outInQuart' ] },
                { type: 'Quint', param: {}, varia: [ 'inQuint', 'outQuint', 'inOutQuint', 'outInQuint' ] },
                { type: 'Sine', param: {}, varia: [ 'inSine', 'outSine', 'inOutSine', 'outInSine' ] },
                { type: 'Exponential', param: {}, varia: [ 'inExpo', 'outExpo', 'inOutExpo', 'outInExpo' ] },
                { type: 'Circular', param: {}, varia: [ 'inCirc', 'outCirc', 'inOutCirc', 'outInCirc' ] },
                { type: 'Bounce', param: {}, varia: [ 'inBounce', 'outBounce', 'inOutBounce','outInBounce' ] },
                { type: 'Back', param: { overshoot: 1.70158 }, varia: [ 'inBack', 'outBack', 'inOutBack', 'outInBack' ] },
                { type: 'Elastic', param: { amplitude: 1, period: .3 }, varia: [ 'inElastic', 'outElastic', 'inOutElastic', 'outInElastic' ] }
            ],


            isType: 'Back', 
            isParam: { overshoot: 1.70158 }, 
            isVaria: 'inBack',
            isVariants: [],

            plotPoints: '',
            plotOpts : plotOpts,
            plotDelay: -1,
            
        };

    },
    mounted(){
        console.log('nstE ',
            '\n\teaseNow:',this.easeNow,
            '\n\tplot: ',$('#nstEasesPlot'+this.mId));
        if(0)
            setTimeout(()=>{
                this.isType ='default'; 
                this.isVaria = 'defaultEase';
                this.isParam = {};
                //this.redrawPlot();
            },50);

    },
    watch:{
        isType(nv, ov){
            console.log('nstE @ watch is Type ',nv);
            let eId = this.eases.findIndex( e => e.type == nv );
            if( eId == -1 ){
                this.isParam = {};
                this.isVariants = [];
                
            } else {
                this.isParam = this.eases[eId].param;
                this.isVariants = this.eases[eId].varia;
                this.isVaria = this.eases[eId].varia[0];

                this.redrawPlot();

            } 

        },
        isVaria( nv, ov ){
            console.log('nstE @ watch is varia ',nv);
            this.redrawPlot();
        },
        isParam( np, op ){
            //console.log('nstE param change : ',np)
            console.log('nstE @ watch is Param ',np);
            this.redrawPlot();
        },     

        easeNow(ns, os){
            console.log('nstE @ watch easeStr to set: \nnew:',ns,'\n\old:',os);
            this.newSelectionUpdate( ns );
        }


    },
    computed:{},  
    methods:{

        newSelectionUpdate( easeStr ){
            if( easeStr == undefined ){
                this.isType ='default'; 
                this.isVaria = 'defaultEase';
                this.isParam = {};
                console.log('nstE < - gon new easeStr to set: ',easeStr);
            }else{
                let t = easeStr.split('(');
                let eStr = t[0];
                let pT = [];
                if( t.length == 2 ){
                    pT = t[1].replaceAll(' ','').split(')')[0].split(',');
                }
                //{ type: 'Back', param: { overshoot: 1.70158 }, varia: [ 'inBack', 'outBack', 'inOutBack', 'outInBack' ] },
                let eId = this.eases.findIndex( e => {
                    //e.type == eStr
                    let vId = e.varia.findIndex( v => v == eStr );
                    if( vId !=-1 ){
                        let varia = e.varia[ vId ];
                        let ki = 0;
                        Object.keys( e.param ).forEach( k => { 
                            e.param[ k ] = pT[ ki++ ];
                        });   
                        this.isType = e.type;
                        this.isVaria = varia;
                        this.isParam = e.param;
                        console.log('nstE < - gon new easeStr to set to : ',[this.isType, this.isVaria,
                            toRaw(this.isParam)]);

                        //return 0;
                    }
                });
            }
        },

        onSelectionEmit(){
            console.log('nstE emits selections ... ');
            this.$emit('on-ease-selected',{                
                'type': this.isType,
                'param': this.isParam,
                'varia': this.isVaria,
                'easeStr':this.getEaseStr()
            });
        },      

        redrawPlot(){
            if( this.plotDelay != -1 ){
                clearTimeout( this.plotDelay );
                this.plotDelay = -1;
            }                

            if( this.plotDelay == -1 )
                this.plotDelay = setTimeout(()=> this.redrawPlot_run(), 60 );
            
        },


        getEaseStr(){
            let ease = `${this.isVaria}`;
            let pK = Object.keys( this.isParam );            
            if( pK.length == 1 ){
                ease = `${ease}( ${this.isParam[ pK ]} )`;
            }else if( pK.length > 1 ){
                let tr = [];
                for(let k of pK )
                    tr.push( `${this.isParam[ k ]}` );
                ease = `${ease}( ${tr.join(',')} )`;                
            }
            return ease;
        },
        redrawPlot_run(){
            if( this.isType == 'default' ) return 1;
            this.onSelectionEmit();

            let opts = {
                ease: this.getEaseStr()
            };


            // plot data of ease to dataPlot START
            let pOpts = this.plotOpts;

            let dataPlot = [];
            for(let i=0;i<pOpts.size[0]-pOpts.margin;i++ ){
                dataPlot.push({x:-1, y:-1});
            }

            let marG = pOpts.margin/2;
            ajsanimate( [dataPlot], {
                'x': ajsstagger(1),
                'y': ajsstagger([pOpts.size[1]-pOpts.margin,0.00], opts ),
                'fps': pOpts.size[0]*1000,
                'duration': 1,
                'onComplete':(e)=>{ 
                    let dtr = [];//'50,50 150,50 150,150 50,150'
                    dataPlot.forEach(d=>{
                        dtr.push( `${parseInt(d.x)+marG},${parseInt(d.y)+marG}` );
                    });
                     dtr.push(`${pOpts.size[0]-marG},${pOpts.size[1]-marG}` );
                    this.plotPoints = dtr.join(' ');

                } 
            });
            // plot data of ease to dataPlot END


            /*
            ajsanimate( ['.myDotBox'], {
                'translateX': ajsstagger(1),
                'translateY': ajsstagger([0.00,-50.00], opts ) 
            });
            */

            let epxn = document.getElementById('easePlotX');
            if( epxn != undefined )            
                ajsanimate( [ epxn.children ], {
                    'stroke-width':[0.0,2,0.2],
                    'blur':[0,2,0],
                    'stroke':'purple',
                    ease:'outBounce',
                    alterate:true,
                    duration:1000
                });

        },
        onParamChange(){ this.redrawPlot() },
        onChange(){
            console.log('on change eases -- ',this.isSelectedType);



        }
    }

}

</script>