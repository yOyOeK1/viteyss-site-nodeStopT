
sold='"jssrc":'
snew='"jssrc":["tmp\/bundle-vysite.js"],'
sed -i "s/${sold}.*/${snew}/g" ./site.json