import {defineConfig, createServer, createBuilder, build } from 'vite'
import vue from '@vitejs/plugin-vue';
import fs from 'fs'

let siteJson = JSON.parse( fs.readFileSync('site.json').toString() );
console.log('-- site j \n',siteJson);

//exit(1);

let inLineConf = {
  plugins: [vue()],
  build: {
    // Target environment for the build (e.g., esnext, es2015)
    target: 'esnext',
    
    // Output directory for the build (default: dist)
    //outDir: 'distBin',

    // Whether to generate sourcemaps
    //sourcemap: true,

    // Minification strategy: 'terser', 'esbuild', or false
    minify: 'terser',

    // Rollup options can be directly specified here
    rollupOptions: {
      // Input entry points for the build
      input: {
        //main: './c_vys_nodeStopT_Page.js', // For multi-page applications
         anotherEntry: './c_vys_nodeStopT_Page.js',
      },
      output: {
        // Customize asset file names (e.g., for CSS, images)
        assetFileNames: 'assets2/[name].[hash][extname]',

        // Customize JavaScript chunk file names
        chunkFileNames: 'js/[name].[hash].js',

        // Customize entry point file names
        entryFileNames: 'js/[name].[hash].js',

        // Globals for UMD builds (if building a library)
        // globals: {
        //   vue: 'Vue',
        // },
      },
      // Externalize dependencies (e.g., for libraries)
      // external: ['vue'],
    },
    emptyOutDir: true, 

    // Target environment for the generated code (e.g., 'es2015', 'modules').
    target: 'es2015', 

    // Whether to copy the public directory contents to the output directory. Defaults to true.
    copyPublicDir: true, 

  },
};

let inLineConf2 = {
    plugins: [vue()],
    stats: 'verbose',
    //logLevel: '.',
    build:{
        lib:{
            entry: {
                "test02": "./index.js"
                /*
               'yssBundlerTest': './src/yssMainJssTest.js',
                'otCl':"node_modules/node-yss/yss/libs/otCl.js",
               ode-yss/yss/libs/marked_0.3.6_lib_marked.js",
"node_modules/node-yss/yss/libs/jquery.flexslider.js",
"node_modules/node-yss/yss/libs/httpVueLoader.js"*/

        }, // Your main JavaScript file
            name: 'bundleYss.js', // The name of the output bundle
            fileName: 'bundle-vysite'
        },
        rollupOptions:{     
            external: ['vue'],
            output: {
                // Provide global variables to use in the UMD build
                globals: {
                    vue: 'Vue'
                }
            }
            
        },
        outDir: './tmp',
        sourcemap: true,
        emptyOutDir: true, 

    }

};



if( 0 ){ ///host
    let buildItConf = defineConfig( inLineConf2 );
    
    var mser = await createServer(buildItConf);
    await mser.listen()

}else{
    await build( inLineConf2,{logLevel:'vite:*'} );

}

