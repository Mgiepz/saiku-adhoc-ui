/**
 * Change settings here
 */
var Settings = {
    VERSION: "AdhocReporting 0.0 SNAPSHOT",
    BASE_URL: "http://localhost:8080/pentaho/content",
    REST_MOUNT_POINT: "/saiku-adhoc/rest",
    MODELS_PREFETCH: true,
    BIPLUGIN: true,
    HIDE_ERRORS: false,
    START_WITH_REPORT: true,
    DRAG_RESIZE: true,
    QUERY_PROPERTIES: {
        'saiku.adhoc.query.automatic_execution': 'true'
    },
    PLUGINS: [
        "ReportDesigner"
    ],
    //LOCALSTORAGE_EXPIRATION: 10 * 60 * 60 * 1000 /* 10 hours, in ms */
    LOCALSTORAGE_EXPIRATION: 0 * 60 * 60 * 1000 /* 10 hours, in ms */
};

/**
 * Extend settings with query parameters
 */
Settings.GET = function () {
    var qs = document.location.search;
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        var value = decodeURIComponent(tokens[2]);
        if (! isNaN(value)) value = parseInt(value);
        if (value === "true") value = true;
        if (value === "false") value = false;
        params[decodeURIComponent(tokens[1]).toUpperCase()]
            = value;
    }

    return params;
}();
_.extend(Settings, Settings.GET);

Settings.REST_URL = Settings.BASE_URL
    + Settings.REST_MOUNT_POINT;
    
/*Some static stuff, dunno where to put it*/
var Constants = {
	horizontalAlignments: ["LEFT","CENTER","RIGHT"],
	verticalAlignments: ["TOP","CENTER","BOTTOM"]
}    

var AggTypes = {
   "NONE" : "None",
   "SUM" : "Sum",
   "AVERAGE" : "Average",
   "COUNT" : "Count",
   "COUNT_DISTINCT" : "Count Distinct",
   "MINIMUM" : "Minimum",
   "MAXIMUM" : "Maximum"
}

var defaultCalcColumn =
{"name":"Calculated Column",
"id":"NEW",
"description":"",
"formula" : "=\"Hello World\"",
"category":"CALCULATED",
"sort":"NONE",
"fieldType":"",
"uid":null,
"defaultAggType":"NONE",
"elementFormat":
	{"horizontalAlignment":"LEFT",
	"verticalAlignment":"CENTER",
	"fontName":null,
	"fontColor":null,
	"backgroundColor":null,
	"fontSize":null
	},
"columnHeaderFormat":
	{"horizontalAlignment":null,
	"verticalAlignment":null,
	"fontName":null,
	"fontColor":null,
	"backgroundColor":null,
	"fontSize":null
	},
"aggTypes":["NONE"],
"selectedAggType":"NONE",
"formatMask":null,
"forGroupOnly":false,
"selectedSummaryType":"NONE"
};

//Backbone.emulateHTTP=true;    
//Backbone.emulateJSON=true;