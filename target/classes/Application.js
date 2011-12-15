var Application={toolbar:{},tabs:new TabSet(),session:null,events:_.extend({},Backbone.Events),routers:[],ui:{block:function(a){$(".processing,.processing_container").fadeIn();
$(".processing_message").text(a)
},unblock:function(){$(".processing,.processing_container").fadeOut()
}}};
Backbone.emulateHTTP=true;