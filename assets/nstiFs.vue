<template>
    nst - iFs operation:{{ operation }}


    <div>({{ filesInDir }}) Directory: <input type="input" v-model="dirName" /></div>
    
    <hr></hr>
    <div class="nstDebugBar">
        Save File:

        <div>
            File name: 
            <input type="input" v-model="fileName" 
                style="
                    width:200px;
                "/>
        </div>
        <div>
            <small><textarea v-model="dataTo" 
                rows="6"
                style="
                    width:100%;

                "/></small>

        </div>
        <div>
            <button @click="saveTo_clipboard()">To clipboard</button>
            <button @click="saveTo_SaveAs()">Save as</button>
            <button @click="saveTo_iFs()">Save in iFs</button>

        </div>
        
    </div>

    <hr></hr>
    <div class="nstDebugBar">
        Load File:

        <div>
            <div v-for="f in dirContentDirs"
                @click="onDirectoryChange(f.name)"
                class="nstPropItem"
                :title="'Directory reated at: '+f.createdAt"
                >
                
                <i v-if="f.name == '..'" class="fa-solid fa-arrow-turn-up"></i>
                <i v-else class="fa-solid fa-folder"></i> 

                {{ f.name }}  </div>

            <div v-for="f in dirContentFiles"
                :title="'File created at: '+f.createdAt"
                @click="fileName=f.name"
                class="nstPropItem">
                <i class="fa-regular fa-file"></i>
                {{ f.name }}
            </div>


        </div>

    </div>



</template>

<script>
import { a as testa} from '@/test.js'


export default{
    props:['operation'],
    data(){
        return {
            dirName: 'nst',
            fileName: timestampToNiceTime_DomSafe()+'.js',
            filesInDir: -1,
            dirContentFiles:['loading ...'],
            dirContentDirs:['loading ...'],

            dataTo:`erties [html@local]#[dDivSvg] of node
nstTimeLine.vue:745
 make selected node by name : #dDivSvg 
props: (1) ['left'] 
event:  undefined
nstTimeLine.vue:690
div find name ....dDivSvg  have (1)
nstTimeLine.vue:654
 get properties [html@local]#[dDivSvg] of node
nstTimeLine.vue:745
observer START for [html@local]`,
        };
    },
    computed:{
        
    },
    watch:{
        dirName(nV,oV){
            this.readDirectory();
        }
    },
    mounted(){
        this.readDirectory();
    },
    methods:{

        onDirectoryChange( dName ){
            if( dName == '..' ){
                if( this.dirName.indexOf('/') != -1 ){
                    let dt = this.dirName.split('/');
                    dt.splice( dt.length-1,1 );
                    this.dirName = dt.join('/');
                }
            }else
                this.dirName+= '/'+dName;
        },
        
        timestampToNiceTime_DomSafe( ms ){ return timestampToNiceTime_DomSafe( ms ); },
        
        readDirectory(){
            iFs.readDirectory(this.dirName).then(res =>{
                this.filesInDir = res.filesCount;
                //this.updateDirectoryList();
                res.directories.unshift({name:'..',createdAt: -1});
                this.dirContentDirs = res.directories;
                this.dirContentFiles = res.files;

            })
            .catch(e=>{
                console.error('EE on read file ?\n',e);
                this.dirContent = ['Wrong directory name'];
            });
            
        },

        saveTo_clipboard(){
            navigator.clipboard.writeText( this.dataTo );
            $.toast('In clipboard: '+`${this.dataTo.length} characters`);
        },
        
        saveTo_SaveAs(){
            downloadStringAsFile( this.dataTo, this.fileName, 'application/javascript' );
        },
        
        async saveTo_iFs(){
            await iFs.createDirectory(this.dirName);
            let path = `${this.dirName}/${this.fileName}`;

            const fileExists = await iFs.exists( path );

            if( fileExists == true ){
                let  userConfirmation = confirm(`File: [${path}] exists. Do you want to overrite?`);
                if (userConfirmation) {
                    // yes 
                } else {
                    // no - abord
                   return 1;
                }
            }

            await iFs.writeFile(path, this.dataTo );

            $.toast(
                'Layers save in local storage<br>'+
                (fileExists ? 'Overrited<br>':'New<br>')+
                '<small>Adress:</small> '+path
            );


            this.readDirectory();

        },


    }




}

</script>