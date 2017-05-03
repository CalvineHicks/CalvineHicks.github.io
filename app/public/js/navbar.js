$(document).ready(function() {
	$("a").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $(this).parent().addClass("active");
	});
	$("#logo").on("click", function(){
	   $(".nav").find(".active").removeClass("active");
	   $("#Home").addClass("active");
	});
	if (window.location.href.indexOf("Search") > -1) {
	   $("#Search").addClass("active");}
	else if (window.location.href.indexOf("FAQs") > -1) {
	   $("#FAQs").addClass("active");}
	else if (window.location.href.indexOf("Resources") > -1) {
	   $("#Resources").addClass("active");}
	else if (window.location.href.indexOf("ContactUs") > -1) {
	   $("#ContactUs").addClass("active");}
	else {
	   $("#Home").addClass("active");}
	//function to set active on page load
});