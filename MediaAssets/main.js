//console.log('nst main.js GOGO');


import { s_vysnodeStopTPage } from '@viteyss-site-nodeStopT/site.js';
import { s_vyssettings1Page } from '@viteyss-site-settings1/c_vys_settings1_Page.js';

window['cl'] = ( msg ) => {
    console.log('nst cl :',msg );
};


let pager = {
    wsCallback( msg ){ console.log(`nst ws msg `,msg) },

};


function initNST(){

    wsConnectIn( pager );
	wsConnectOut();





}

document.addEventListener("DOMContentLoaded", function() {
    
    console.log( 'nst init ...' );
    initNST();

    let page = new s_vysnodeStopTPage();
    let settings = new s_vyssettings1Page();

    settings['o'] = settings;

    window['siteByKey'] = {
        's_vysnodeStopTPage' : page,
        's_vyssettings1Page': settings
    };

    window['pager'] = {
        currentPage: 1
    };

    page['homeUrl'] = '../';
    page['o'] = { homeUrl: page.homeUrl };
    page['instanceOf'] = {
        ver: 0.1
    };
    document.getElementById('appNST').innerHTML =
        page.getHtml();
    page.getHtmlAfterLoad();


    window.addEventListener( 'resize', ()=>{
        page.onWindowResize(
            window.innerWidth, window.innerHeight
        ); 
    });


});