$(document).ready(function() {
	$(".button").click(function() {
		flickr()
	});

	$('.input').on("keypress", function(enter) {
		if(enter.which == 13) {
			flickr()
		}
	});
});

function flickr () {
	$('.blog,.requests').empty();
	var key = `529fb3079d8bcd370484f6fab2dfe113`
	var sentRequests = 0;
	var receivetRequests = 0;
	var arr = []
	
	$('.input').val().split(",").forEach(function (inputItem) {
		if (inputItem.trim() !== "")	{
			sentRequests ++ 
			$('.requests').append(`<div class="request" data-name="`+ inputItem +`">`+ inputItem+`</div>`)
			$.ajax({
				url:'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key='+ key +'&format=json&text='+ inputItem.trim() +'&nojsoncallback=1',
				success : function (response,name) {
					receivetRequests ++
					response.photos.photo.slice(0,5).forEach(function(item) {
						arr.push({
							url :`https://live.staticflickr.com/`+item.server+`/`+ item.id+`_`+item.secret+`.jpg`,
							name : inputItem
						});
					})
					
					if (sentRequests == receivetRequests) {
						for(var i = 0 ; i < arr.length - 1; ++i) {
							var b = Math.floor(Math.random() * (arr.length - 1))
							var a = arr[i];
							arr[i] = arr[b];
							arr[b] = a
						}

						arr.forEach(function (item) {
							$('.blog').append(`<img class='img `+item.name+`' src='`+item.url+`" name="`+item.name+`'>`)
						});

						$(".blog").sortable({
							connectWith: ".request"
						});
					}
				}
			});
		}
	});

	$(".request").sortable({
		receive: function(e, ui) {
			if(!$(ui.item[0]).hasClass($(this).data('name'))) {
				ui.sender.sortable('cancel')
			}
			
			if($(".blog .img").length == 0) {
				alert("Flicker layout is correct")
			}
		}	
	});

	$(document).ajaxError(function() {
		alert("ERROR 404")
		alert("Failed to send the request, solve the problem and try the folder again")
	});
}
