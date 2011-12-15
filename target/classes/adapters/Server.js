(function(d){var a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c=String.fromCharCode,b=(function(){try{document.createElement("$")
}catch(e){return e
}}());
d.Base64||(d.Base64={encode:function(f){var p,n,o,m,k,h,j,e=0,g=f.length,l=Math.max,q="";
while(e<g){p=f.charCodeAt(e++)||0;
n=f.charCodeAt(e++)||0;
j=f.charCodeAt(e++)||0;
if(l(p,n,j)>255){throw b
}o=(p>>2)&63;
m=((p&3)<<4)|((n>>4)&15);
k=((n&15)<<2)|((j>>6)&3);
h=j&63;
if(!n){k=h=64
}else{if(!j){h=64
}}q+=a.charAt(o)+a.charAt(m)+a.charAt(k)+a.charAt(h)
}return q
}})
}(this));
Backbone.sync=function(h,d,c){var g;
methodMap={create:"POST",read:"GET",update:"PUT","delete":"DELETE"};
var e=methodMap[h];
var b=Settings.REST_URL+(_.isFunction(d.url)?d.url():d.url);
c.retries=0;
var a=function(j,l,k){c.retries++;
if(c.retries>=10){Application.ui.block("Could not reach server. Please try again later...");
if(c.error){c.error(j,l,k)
}}else{var i=Math.pow(c.retries,2);
Application.ui.block("Having trouble reaching server. Trying again in "+i+" seconds...");
setTimeout(function(){$.ajax(g)
},i*1000)
}};
var f=function(j,k,i){if(c.retries>0){Saiku.ui.unblock()
}c.success(j,k,i)
};
g={url:b,type:e,cache:false,data:d.attributes,contentType:"application/json",dataType:"json",success:f,error:a,beforeSend:function(j){if(!Settings.PLUGIN){var i="Basic "+Base64.encode(Saiku.session.username+":"+Saiku.session.password);
j.setRequestHeader("Authorization",i)
}}};
if(Settings.BIPLUGIN||Backbone.emulateHTTP){if(e==="PUT"||e==="DELETE"){if(Backbone.emulateHTTP){g.data._method=e
}g.type="POST";
g.beforeSend=function(i){i.setRequestHeader("X-HTTP-Method-Override",e)
}
}}$.ajax(g)
};