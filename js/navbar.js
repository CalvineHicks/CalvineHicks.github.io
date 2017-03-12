$(document).ready(function() {
	$("a").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $(this).parent().addClass("active");
	});
	$(".navbar-brand").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $(".home").addClass("active");
	})
	//function to set active on page load
});