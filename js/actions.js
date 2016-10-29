$(document).ready(function(){
  var i = 1;
  var botIdToMove = null;

	$('#addBotButton').mousedown(function(){
		$(".gridArea").append('<div id="bot" class="bot-bot"></div>');
    $('.gridArea #bot').attr("id","bot" + i);
    i += 1;
	});
		
	$(document).on('click', '.bot-bot', function(){ 
      botIdToMove = $(this).attr('id');
   		$(document).keydown(function(e) {
   			switch (e.which) {
    			case 37:
       				$('#' + botIdToMove).stop().animate({
            			left: '-=20px'
        			}); //left arrow key
        			break;
    			case 38:
       				$('#' + botIdToMove).stop().animate({
            			top: '-=20px'
        			}); //up arrow key
        			break;
    			case 39:
        			$('#' + botIdToMove).stop().animate({
            			left: '+=20px'
        			}); //right arrow key
       			 	break;
    			case 40:
        			$('#' + botIdToMove).stop().animate({
            			top: '+=20px'
        			}); //bottom arrow key
       				break;
    			}
			})
	}); 
});
// 	$('#upload').fileupload({
//   // This function is called when a file is added to the queue
//   add: function (e, data) {
//     //This area will contain file list and progress information.
//     var tpl = $('<li class="working">'+
//                 '<input type="text" value="0" data-width="48" data-height="48" data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" />'+
//                 '<p></p><span></span></li>' );

//     // Append the file name and file size
//     tpl.find('p').text(data.files[0].name)
//                  .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

//     // Add the HTML to the UL element
//     data.context = tpl.appendTo(ul);

//     // Initialize the knob plugin. This part can be ignored, if you are showing progress in some other way.
//     tpl.find('input').knob();

//     // Listen for clicks on the cancel icon
//     tpl.find('span').click(function(){
//       if(tpl.hasClass('working')){
//               jqXHR.abort();
//       }
//       tpl.fadeOut(function(){
//               tpl.remove();
//       });
//     });

//     // Automatically upload the file once it is added to the queue
//     var jqXHR = data.submit();
//   },
//   progress: function(e, data){

//         // Calculate the completion percentage of the upload
//         var progress = parseInt(data.loaded / data.total * 100, 10);

//         // Update the hidden input field and trigger a change
//         // so that the jQuery knob plugin knows to update the dial
//         data.context.find('input').val(progress).change();

//         if(progress == 100){
//             data.context.removeClass('working');
//         }
//     }
// });
// //Helper function for calculation of progress
// function formatFileSize(bytes) {
//     if (typeof bytes !== 'number') {
//         return '';
//     }

//     if (bytes >= 1000000000) {
//         return (bytes / 1000000000).toFixed(2) + ' GB';
//     }

//     if (bytes >= 1000000) {
//         return (bytes / 1000000).toFixed(2) + ' MB';
//     }
//     return (bytes / 1000).toFixed(2) + ' KB';
// }	
// 	});

function createGrid(size) {
    var ratioW = Math.floor($("#grid-panel").width()/size) - 1,
        ratioH = Math.floor($(window).height()/size) - 1;
    
    var child = $('<div />', {
        class: 'grid', 
        width: ratioW * size, 
        height: ratioH * size
    }).addClass('grid').appendTo('body');

    for (var i = 0; i < ratioH; i++) {
        for(var p = 0; p < ratioW; p++){
            $('<div />', {
                width: size - 1, 
                height: size - 1
            }).appendTo(child);
        }
    }
    child.appendTo($(".gridArea"));
}


	
