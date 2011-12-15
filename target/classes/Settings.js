var Settings={VERSION:"AdhocReporting 0.0 SNAPSHOT",BASE_URL:"http://localhost:8080/pentaho/content",REST_MOUNT_POINT:"/saiku-adhoc/rest",MODELS_PREFETCH:true,BIPLUGIN:true,HIDE_ERRORS:false,START_WITH_REPORT:true,QUERY_PROPERTIES:{"saiku.adhoc.query.automatic_execution":"true"},PLUGINS:["ReportDesigner"],LOCALSTORAGE_EXPIRATION:0*60*60*1000};
Settings.GET=function(){var a=document.location.search;
a=a.split("+").join(" ");
var e={},d,b=/[?&]?([^=]+)=([^&]*)/g;
while(d=b.exec(a)){var c=decodeURIComponent(d[2]);
if(!isNaN(c)){c=parseInt(c)
}if(c==="true"){c=true
}if(c==="false"){c=false
}e[decodeURIComponent(d[1]).toUpperCase()]=c
}return e
}();
_.extend(Settings,Settings.GET);
Settings.REST_URL=Settings.BASE_URL+Settings.REST_MOUNT_POINT;
var Constants={horizontalAlignments:["LEFT","CENTER","RIGHT"],verticalAlignments:["TOP","CENTER","BOTTOM"]};
var AggTypes={NONE:"None",SUM:"Sum",AVERAGE:"Average",COUNT:"Count",COUNT_DISTINCT:"Count Distinct",MINIMUM:"Minimum",MAXIMUM:"Maximum"};
var defaultCalcColumn={name:"Calculated Column",id:"NEW",description:"",formula:'="Hello World"',category:"CALCULATED",sort:"NONE",fieldType:"",uid:null,defaultAggType:"NONE",elementFormat:{horizontalAlignment:"LEFT",verticalAlignment:"CENTER",fontName:"Arial",fontColor:"#662b1b",backgroundColor:null,fontSize:10},columnHeaderFormat:{horizontalAlignment:"LEFT",verticalAlignment:"CENTER",fontName:"Arial",fontColor:"#662b1b",backgroundColor:null,fontSize:10},aggTypes:["NONE"],selectedAggType:"NONE",formatMask:null,forGroupOnly:false,selectedSummaryType:"NONE"};