console.log("loading emlotables.js");
$(document).ready(function(){
  console.log("readying emlotables.js");
  var strHTMLOutput = '';
  // Disable search and ordering by default
  $.extend( $.fn.dataTable.defaults, {
    searching: false,
    ordering:  false,
    paging:    false
  } );
  // For this specific table we are going to enable ordering
  // (searching is still disabled)
  // tabdef('#addressees');
  var itemType = 'person';
  $('.searchp').each(function(){
    tabdef(this.id , itemType);
  });
  
  itemType = 'place';
  $('.srchloc').each(function(){
    //tabdef('#'+ this.id +'s');
    tabdef(this.id , itemType);
  });
    
    //manifestation table setup
  var oTable = $('#manifestation').dataTable({
    "columnDefs": [
    {
      "targets": [ 0 ],
      "visible": false,
      "searchable": false
    },
    {
      "targets": [ 9 ],
      "visible": false
    }
    ]
  });
  
});