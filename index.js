//import { s_vysnodeStopTPage } from "./c_vys_nodeStopT_Page.js";
import { s_vysnodeStopTPage } from './site.js';

var msg = 'hello from viteyss-site-nodeStopT    index.js..';
console.log(msg);



//let s = new s_vysnodeStopTPage()
let tr = 'not set MODE['+import.meta.env.MODE+']';

console.log('* * 88 index.js ...................... running MODE['+import.meta.env.MODE+']');
if (import.meta.env.DEV) {
    console.log('* * 88 index.js Running in development mode');

    
    
} else if (import.meta.env.PROD) {
    console.log('* * 88 index.js Running 2 in production build');
    $('head').append(`<link rel="stylesheet" type="text/css" href="siteNo/7//tmp/bundle-vysite.css">`);
    //import "./c_vys_nodeStopT_Page.js";
    tr = s_vysnodeStopTPage;


} else {
  // This case might occur if you're using a custom environment setup
  console.log('* * 88 index.js Running in an unknown environment');
}


export { tr as s_vysnodeStopTPage }