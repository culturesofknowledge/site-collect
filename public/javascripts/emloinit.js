console.log("loading emloinit.js");
var selectorMap = { };
  selectorMap["author"          ] =  "authors";
  selectorMap["addressee"       ] =  "addressees";
  selectorMap["origin"          ] =  "origin_id";
  selectorMap["destination"     ] =  "destination_id";
  selectorMap["place_mention"   ] =  "place_mentioned";
  selectorMap["mentioned"       ] =  "people_mentioned";
  selectorMap["contributors"    ] =  "contributors",
  selectorMap["manifestations"  ] =  "manifestations"; 

  var itemTypeIdMap = { };
  itemTypeIdMap["person"] = "iperson_id";
  itemTypeIdMap["place"] = "location_id";
  itemTypeIdMap["repository"] = "institution_id";

  var itemTypeNameMap = { };
  itemTypeNameMap["person"] = "primary_name";
  itemTypeNameMap["place"]  = "location_name";
  itemTypeNameMap["repository"] = "institution_name";
  
  var itemAddMap = { };
  itemAddMap["author_add"]        = "author";
  itemAddMap["addressee_add"]     = "addressee";
  itemAddMap["mentioned_add"]     = "mentioned";
  itemAddMap["origin_add"]        = "origin";
  itemAddMap["destination_add"]   = "destination";
  itemAddMap["place_mention_add"] = "place_mention";
  
  var opts = {};
  opts.gender =  {
    ""     : ""
    , "Male"  : "M"
    , "Female": "F"
    , "Other or Unknown" : ""
  };
  
  var tEditor = { }; // need dynamic tables editor here
  function log( selector, message ) {
    $( selector ).val(function(_, val){return val + message; });
    $( "#log").scrollTop( 0 );
  }

  function tabdef( selector , itemType) {
    var jSelector = '#' + selectorMap[selector] ;
    console.log('tabdef ',selector, jSelector, itemType);
    // Datatable Editor Methods Begin >>>
/*        tEditor[jSelector] = new $.fn.dataTable.Editor( {
          ajax: "/work/work/" + $('#workID').val(),
        table: jSelector,
        fields: [ {
                label: selector + "_name",
                name: "name"
            }, {
                label: selector + "_item_id",
                name: "last_name"
            }, {
                label: selector + "_id",
                name: "position"
            }
        ],
        formOptions: {
            bubble: {
                title: 'Edit',
                buttons: false
            }
        }
    } );
 
    $('button.new').on( 'click', function () {
        tEditor[jSelector]
            .title( 'Create new row' )
            .buttons( { "label": "Add", "fn": function () { tEditor[jSelector].submit() } } )
            .create();
    } );
 
    $(jSelector).on( 'click', 'tbody td', function (e) {
      console.log('index ',$(this).index(),' bubble edit',this);
      if ( $(this).index() < 3 ) {
          console.log('bubble edit',this);
          tEditor[jSelector].bubble( this );
        }
    } );
 
    $(jSelector + ' tbody').on( 'click', 'a.remove', function (e) {
      console.log ( 'delete editor', jSelector, this);
      tEditor[jSelector]
      .title( 'Delete row' )
      .message( 'Are you sure you wish to delete this row?' )
      .buttons( { "label": "Delete", "fn": function () { tEditor[jSelector].submit() } } )
      .remove( $(this).closest('tr') );
    } ); 
    
*/    // Datatable Editor Methods End >>>
    
    // Delete Row link click
    console.log ( 'deleteRow', jSelector, this);
    console.log('index ',$(this).index(),' deleteRow',this);
    $(jSelector + ' tbody').on('click', 'td a.linkdeleteitem', deleteRow);
    $(jSelector + ' tbody').on('click', 'td a.linkedititem', editRow);
    
    var t = $( jSelector ).DataTable( {
      ordering: true,
      info : false,
      "columnDefs": [
        {
          "targets": [ 1,2,3 ],
          "visible": false,
          "searchable": false
        },
        {
          "data": null,
          //"defaultContent": "<button>del</button>",
          "targets": -1,
          render: function ( data, type, full, meta ) {
            console.log('tabdef d ',selector, data, type, full);
            //console.log('tabdef r ',selector, row);
            // If upload has no works permit delete
            // var editfield = '<a href="/work/work/' + $('#workID').val() + '/' + itemType + '/' + selector+'/remove/' ;
            var editfield = '<a href="#" tabSelector="' 
                          + jSelector + '" rel="/work/' 
                          + $('#workID').val()  
                          + '/'  
                          + selectorMap[selector]
                          + '/'  
                          + data[3] 
                          + '/delete/' ;
            editfield += '" class="linkdeleteitem">Del</a>';
            //if (variable === undefined || variable === null) {
            if (data[1] !== data[2]) {
              editfield +='/ <a href="#" tabSelector="' 
                        + jSelector 
                        + '" edittype="'
                        + itemType 
                        + '" rel="/admin/'
                        + itemType +'/' + itemType +'s/'  
                        + data[3];
              editfield += '"  class="linkedititem">Edit</a>';
            }
            console.log("editfield:",editfield);
            return editfield;
          }
        }
      ]
    }) ;   
  }
  
  function tabadd( selector, item ) {
    console.log("enter tabadd");
    var jSelector = '#'+ selectorMap[selector];
    var t = $( jSelector ).DataTable();
    var notExist = true;
    console.log('selector', selector);
    console.log(  t.column( 1 ).data() );
    t.column( 1 ).data().each( function ( d, j ) {
      if( item.value == d  ) notExist = false;
    } );
    console.log(notExist);
    if ( notExist ) {
      tabAddItem( t, item )
    }
    //t.column( 1 ).data().unique().sort().each( function ( d, j ) {
    return notExist;  

    function tabAddItem( t, item ) {
      console.log("enter tabaddItem");
      var sData = item;
      sData.thing={};
      sData.selector = selectorMap[selector];
      //if (tabadd('#'+ sData.selector, item)){
        sData.workID    = $('#workID').val();
        sData.upload_uuid = $('#upload_uuid').val();
        sData.call = '/work/'+ sData.workID +'/' + sData.itemType + '/new', 
        sData.itemID    = item.value;
        sData.emloID    = item.emloid;
        sData.itemName  = item.name;
        sData.thing[selector] = sData.selector+" "+item.value;
        console.log(sData);
        request = $.ajax({
          url:    sData.call, 
          type:   'POST', 
          data:   sData,
          success:tabcallback
        });
        //}
        //alert( "The following data would have been submitted to the server: \n\n"+sData );
        //return false;
    }
  
    function tabcallback(data,status,item) {
      console.log("enter tabcallback");
      console.log(data);
      console.log(status);
      var item_name = itemTypeNameMap[data.itemType];
      var emlo_id   = itemTypeIdMap[data.itemType];
      var uemlo_id  = "union_"+emlo_id;
      console.log("item-name",data.item[item_name]);
      console.log("item-id",data.item[emlo_id]);
      console.log("item-uid",data.item[uemlo_id]);
      t.row.add( [
        data.item[item_name],
        data.item[emlo_id],
        data.item[uemlo_id],
        data.item._id,
        ""
      ] ).draw();
      console.log("table t: ",t)
    }
  }
      
  function tabarray( selector, item ) {
    // Get the data from your table into an array
    var tableData = [];
    $(selector + " tbody tr").each(function () {
      var row = [];
      $(this).find("td").each(function () {
        row.push(this.innerHTML);
      });
      tableData.push(row);
    });
    console.log(tableData);
    // Make your form
    var form = $("<form>").attr("action", "/work/man/")
    .attr("method", "post");
    
    // Make a form field with your tableData (JSON serialized in this case)
    var tableInput = $("<input>")
    .attr("type", "hidden")
    .attr("id", selector)
    .attr("value", JSON.stringify(tableData));
    console.log(tableInput);
    //request = $.ajax({url:'/work/man', type:'POST', data:tableInput});
    //console.log(request);
    // Some browsers require the form to be in the dom before it'll submit.
    //$(document.body).append(form);
    // Add the field to the form and submit
    $('#frmWork').append(tableInput)
      .submit()
    ;
  }
          
$(document).ready(function() {
  console.log("readying emloinit.js");
  var workID = $('#workID').val();
  var iworkID = $('#iwork_id').val();
  var uploadUuid = $('#upload_uuid').val();
  
  if ( iworkID ) {
    console.log("enable the lookups");
    $('.searchp').autocomplete({
      source: function(req,res) {
        $.ajax({
          url: "/autocomplete/"+"newperson/"+uploadUuid+'/'+req.term,
          dataType: "jsonp",
          data: {
            term: req.term
          },
          success: function(data) {
            //console.log(data);
            //console.log(this);
	          var lowerTerm = req.term.toLowerCase(),
		          spaceLowerTerm = " " + lowerTerm;
	          data.sort( function( o1, o2 ) {
		          /*
		          Order: term match at beginning, term match after space, compare case
		           */
		          var low1 = o1.name.toLowerCase(),
			          low2 = o2.name.toLowerCase(),
			          index1Space = low1.indexOf(spaceLowerTerm),
			          index1 = low1.indexOf(lowerTerm),
			          index2Space = low2.indexOf(spaceLowerTerm),
			          index2 = low2.indexOf(lowerTerm);

		          if( ( index1 === 0 && index2 === 0 ) ||                   // both at beginning
			          ( index1Space !== -1 && index2Space !== -1 ) ) {      // both at beginning of a word
			          return low1 > low2;
		          }

		          if( index1 === 0 ) {
			          return -1;
		          }

		          if( index2 === 0 ) {
			          return 1;
		          }

		          if( index1Space !== -1 ) {
			          return -1;
		          }

		          if( index2Space !== -1 ) {
			          return 1;
		          }

		          return low1 > low2;//index1 - index2;
	          });
            res($.map(data, function(item) {
              item.label = item.name + item.date;
              return {
                label: item.label,
                value: item.value,
                name:  item.name,
                date:  item.date,
                emloid:item.emloid
              };
            }));
          },
          error: function(xhr) {
            console.log(xhr);
            alert(xhr.status + ' : ' + xhr.statusText);
          }
        });
      },
      minLength : 2,
      delay: 300,
      select: function( event, ui ) {
        event.preventDefault();  // prevent default value return
        //$( this ).val(ui.item.label);
        $( this ).val("");

        console.log("ui ->",ui.item);
        console.log(this);
        console.log(this.id);
        ui.item.itemType = 'person';
        tabadd(this.id , ui.item);
      },
      open:function(e,ui) {
	      var acData = $(this).data('ui-autocomplete');
	      acData
		      .menu
		      .element
		      .find('li')
		      .each(function () {
			      var me = $(this);
			      var keywords = acData.term.split(' ').join('|');
			      me.html(me.text().replace(new RegExp("(" + keywords + ")", "gi"), '<b>$1</b>'));// '<span style="text-decoration:underline">$1</span>'));
		      });

        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        console.log("searchp close",this);
        //$( this ).val("");
      }
    });
    
    //console.log(config.host);
    $('.srchloc').autocomplete({
      source: function(req,res) {
        $.ajax({
          url: "/autocomplete/"+"newplace/"+uploadUuid+'/'+req.term,
          dataType: "jsonp",
          data: {
            term: req.term
          },
          success: function(data) {
            console.log(data);
            console.log(this);
            res($.map(data, function(item) {
              return {
                label: item.label,
                value: item.value,
                name:  item.label,
                emloid:item.emloid
              };
            }));
          },
          error: function(xhr) {
            console.log(xhr);
            alert(xhr.status + ' : ' + xhr.statusText);
          }
        });
      },
      minLength : 2,
      delay: 300,
      select: function( event, ui ) {
        event.preventDefault();  // prevent default value return
        //$( this ).val(ui.item.label);
        $( this ).val("");
        
        console.log(this);
        console.log(this.id);
        ui.item.itemType = 'place';
        tabadd(this.id , ui.item);
               
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        console.log("srchloc close",this);
      }
    });
  }  
} ); 
