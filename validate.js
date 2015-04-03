 /*---------All the Functions stay here--------- */

function clearForm(){
	var myForm = document.getElementById("search_form");
	for(var i = 0; i<myForm.length; i++){
		var formType = myForm[i].type.toLowerCase();
		if(formType == "text") myForm[i].value = "";
		if(formType == "checkbox") myForm[i].checked = false;
		if(formType == "select-one") myForm[i].selectedIndex = 0;
	}
	document.getElementById("result").innerHTML = "";
}

/* ---------jQuery Part--------- */

$(document).ready(function(){
	// Initialization
	var currentIndex = 1;
	var inputPageNum = currentIndex;
	var previousIndex = 1;
	$("#1").html(1);
	$("#2").html(2);
	$("#3").html(3);
	$("#4").html(4);
	$("#5").html(5);

	$("#1").closest('.pageBar').addClass('active');
	$("#previousPage").closest('.pageBar').addClass('disabled');
	$("#pagination").hide();

	// Clickable functions
	$("#clear").click(function(){
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#pagination").hide();
		currentIndex = 1;
		inputPageNum = currentIndex;
		$("#1").closest('.pageBar').addClass('active');
	})

	$("#previousPage").click(function(){
		if(inputPageNum == 1){
			$("#previousPage").closest('.pageBar').addClass('disabled');
			return false;
		}else{
			$("#previousPage").closest('.pageBar').removeClass('disabled');
		}
		if(currentIndex == 1){
			$("#1").closest('.pageBar').removeClass('active');
			var currentPage = $("#"+currentIndex).text();
			$("#5").html(--currentPage);
			$("#4").html(--currentPage);
			$("#3").html(--currentPage);
			$("#2").html(--currentPage);
			$("#1").html(--currentPage);
			$("#5").closest('.pageBar').addClass('active');
			currentIndex = 5;
			previousIndex = currentIndex;
			inputPageNum = $("#"+currentIndex).text();
		}else{
			$("#"+currentIndex--).closest('.pageBar').removeClass('active');
			$("#"+currentIndex).closest('.pageBar').addClass('active');
			inputPageNum = $("#"+currentIndex).text();
			previousIndex = currentIndex;
		}	
	})
	$("#nextPage").click(function(){
		if(currentIndex == 5){
			$("#5").closest('.pageBar').removeClass('active');
			var currentPage = $("#"+currentIndex).text();
			$("#1").html(++currentPage);
			$("#2").html(++currentPage);
			$("#3").html(++currentPage);
			$("#4").html(++currentPage);
			$("#5").html(++currentPage);
			$("#1").closest('.pageBar').addClass('active');
			currentIndex = 1;
			previousIndex = currentIndex;
			inputPageNum = $("#"+currentIndex).text();
		}else{
			$("#"+currentIndex++).closest('.pageBar').removeClass('active');
			$("#"+currentIndex).closest('.pageBar').addClass('active');
			inputPageNum = $("#"+currentIndex).text();
			previousIndex = currentIndex;
		}
	})
	$("#1").click(function(){
		currentIndex = 1;
		inputPageNum = $("#1").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 1;
	})
	$("#2").click(function(){
		currentIndex = 2;
		inputPageNum = $("#2").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 2;
	})
	$("#3").click(function(){
		currentIndex = 3;
		inputPageNum = $("#3").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 3;
	})
	$("#4").click(function(){
		currentIndex = 4;
		inputPageNum = $("#4").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 4;
	})
	$("#5").click(function(){
		currentIndex = 5;
		inputPageNum = $("#5").text();
		$("#"+previousIndex).closest('.pageBar').removeClass('active');
		$("#"+currentIndex).closest('.pageBar').addClass('active');
		previousIndex = 5;
	})

	$("#submit, #1, #2, #3, #4, #5, #previousPage, #nextPage").click(function(){
		if($("#search_form").valid() == true){
			var data = $("#search_form").serialize();
			data += "&inputPageNum="+inputPageNum;
			//alert(data);
			$.ajax({
				type: "GET",
				url:'ebay_search.php',
				data: data,
	           	dataType:'json',
	           	success: function(response){
	           		
	           		//alert("Success");
	           		var response_array = $.map(response, function(el) { return el; });
	           		//alert(response_array);
					var ack = response.ack;
					var resultCount = parseInt(response.resultCount);
					var pageNumber = parseInt(response.pageNumber);
					var itemCount = parseInt(response.itemCount);
					//Handling "previous" & "next" button in pagination
	           		pageNumber == 1 ? $("#previousPage").closest('.pageBar').addClass('disabled') : $("#previousPage").closest('.pageBar').removeClass('disabled');

					if(ack == "No results found"){
						$("#pagination").hide();
						$("#result").html("<h2>No results found</h2>");
						return false;
					}else{
						var items = [];
						var result = "";
						var bound = 0;
						var num = 0;
						// num = (resultCount/itemCount) + 1;
						// switch(num){
						// 	case 1: $("#2").hide();
						// 	case 2: $("#3").hide();
						// 	case 3: $("#4").hide();
						// 	case 4: $("#5").hide();
						// 	break;
						// }
						if(pageNumber * itemCount <= resultCount){
							bound = (resultCount < itemCount) ? resultCount : itemCount;
						}else{
							bound = resultCount % itemCount;
						}
						//alert(bound);
						// alert(response_array[4]);
						if(resultCount < itemCount){
							$("#pagination").hide();
						}
						for(var j = 0; j<bound; j++){
							items = response_array.slice(4);
							// alert(items);
						}

						var start = itemCount*(pageNumber-1)+1;
						var end = start + bound - 1;
						result += "<h3 id='result_head'>"+ start +"-"+ end + " items out of "+ resultCount+"</h3>";

						for(var index = 0; index < bound; index++){
							result += "<div class='media'>";
							result += "<a class='pull-left' href='#'>";
							result += "<img src='"+items[index].basicInfo.galleryURL+"' alt='N/A' class='media-object' width='80' height='80'/>";
							result += "</a>";
							result += "<div class='media-body'>";
							result += "<div class='media-heading'><a href='"+items[index].basicInfo.viewItemURL+"'><h5>"+items[index].basicInfo.title+"</h5></a></div>";
							var shippingCost = (items[index].basicInfo.shippingServiceCost == "0.0" || items[index].basicInfo.shippingServiceCost == "") ? "FREE Shipping" : "+ $"+items[index].basicInfo.shippingServiceCost+" for shipping";
							result += "<h6><b>Price: $"+items[index].basicInfo.convertedCurrentPrice+"</b>&nbsp;&nbsp;&nbsp;("+shippingCost+")";
							result += "&nbsp;&nbsp;&nbsp;<i>Location: "+items[index].basicInfo.location+"</i>";
							if(items[index].basicInfo.topRatedListing == "true"){
								result += "<img src='http://cs-server.usc.edu:45678/hw/hw8/itemTopRated.jpg' alt='N/A' width='40' height='40'/>";
							}
							result += "<a href='#'>&nbsp;&nbsp;&nbsp;View Details&nbsp;&nbsp;&nbsp;</a><a href='facebookShare'><img src='http://cs-server.usc.edu:45678/hw/hw8/fb.png' alt='N/A'/ width='20' height='20'></a></h6>";
							result += "</div></div>";
						}

						$("#result").html(result);
						$("#pagination").show();
						//$("#result").html(ack+" "+resultCount+" "+pageNumber+" "+itemCount);
					}
	           	}
			})
		}
	})

	/* -------Validation Part-------- */

	$("#search_form").validate({
		highlight: function(element) {
            $(element).closest('.highlight').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.highlight').removeClass('has-error');
        },
        errorClass: 'errMsg',
    rules: {
        keywords: {
        	required: true,
        },
        lowestPrice: {
        	number: true,
        	positiveNum: true,
        },
        highestPrice: {
        	number: true,
        	positiveNum: true,
        	biggerThan: "#lowestPrice",
        },
        shipping_time:{
        	validDigit: true,
        	greaterThanOne: true,
        	number: true,
        }
    },
    messages: {
        keywords: {
        	required: "Please enter a keyword",
        } ,
        lowestPrice: {
        	number: "Price should be a valid decimal number",
        	positiveNum: "Minimum price cannot be below 0",
        },
        highestPrice: {
        	number: "Price should be a valid decimal number",
        	positiveNum: "Maximum price cannot be less than minimum price or below 0",
        	biggerThan: "Maximum price cannot be less than minimum price or below 0",
        },
        shipping_time: {
        	validDigit: "Max handling time should be a valid digit",
        	greaterThanOne: "Max handling time should be greater than or equal to 1",
        	number: "Max handling time should be a valid digit",
        }
    }
	});

	/* -------Adding customized method for validation---------- */

	jQuery.validator.addMethod("positiveNum", function(value, element) {
	  return this.optional(element) || value >= 0;
	});
	jQuery.validator.addMethod("biggerThan", function(value, element, param) {
		var temp = $(param).val();
		if(temp == ""){
			temp = 0;
		}
	  return this.optional(element) || parseFloat(value) >= parseFloat(temp);
	});
	jQuery.validator.addMethod("validDigit", function(value, element, param) {	
	  return this.optional(element) || value % 1 === 0;
	});
	jQuery.validator.addMethod("greaterThanOne", function(value, element, param) {	
	  return this.optional(element) || value >= 1;
	});
});








/*
function validation(){
		var keywords = document.getElementsByName("keywords")[0].value;
		var lowestPrice = document.getElementsByName("lowestPrice")[0].value;
		var highestPrice = document.getElementsByName("highestPrice")[0].value;
		var maxHandlingTime = document.getElementsByName("shipping_time")[0].value;
		var errorMessage = "";
		if(maxHandlingTime == ""){
			maxHandlingTime = 1;
		}
		if(isNaN(lowestPrice) || isNaN(highestPrice)){
			errorMessage = errorMessage + "Price can only be numbers\n\n";
		}
		if(isNaN(maxHandlingTime) || parseFloat(maxHandlingTime) < 1){
			errorMessage = errorMessage + "Handling Time must be numbers and should not be smaller than one\n\n";
		}
		if(maxHandlingTime % 1 !== 0){
			errorMessage = errorMessage + "Handling Time can only be integer\n\n";
		}
		if(parseFloat(lowestPrice) < 0 || parseFloat(highestPrice) < 0){
			errorMessage = errorMessage + "Price cannot be negative\n\n";
		}else if(parseFloat(highestPrice) < parseFloat(lowestPrice)){
			errorMessage = errorMessage + "Invalid Price Range\n\n";
		}
		if(keywords){

		}else{
			errorMessage = errorMessage + "Keywords required\n\n";
		}
		if (errorMessage) {
			alert(errorMessage);
		}	
		return true;
	}
	*/
