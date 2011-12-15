var Table=Backbone.View.extend({initialize:function(a){this.workspace=a.workspace;
_.bindAll(this,"render","process_data");
this.workspace.bind("query:result",this.render)
},render:function(a){_.delay(this.process_data,0,a)
},process_data:function(b){var c=b.data;
if(c==null){return this.no_results(b)
}var a=c.resultset;
var d=[];
for(column in c.metadata){d.push({sTitle:c.metadata[column].colName})
}$(this.el).empty();
$(this.el).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="contents"></table>');
$("#contents").dataTable({aaData:a,aoColumns:d,bAutoWidth:true,bLengthChange:false,iDisplayLength:30,bFilter:false,bSort:false,bJQueryUI:false,sPaginationType:"full_numbers"})
},no_results:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>No results</td></tr>")
},error:function(a){$(a.workspace.el).find(".workspace_results table").html("<tr><td>"+a.data[0][0].value+"</td></tr>")
}});