var colors = ['blue', 'green', 'white', 'yellow', 'orange', 'red'],
		pieces = document.getElementsByClassName('piece');

// Returns j-th adjacent face of i-th face
function mx(i, j) {
	return ([2, 4, 3, 5][j % 4 |0] + i % 2 * ((j|0) % 4 * 2 + 3) + 2 * (i / 2 |0)) % 6;
	// return 1;

}

function getAxis(face) {
	return String.fromCharCode('X'.charCodeAt(0) + face / 2); // X, Y or Z
}

// Moves each of 26 pieces to their places, assigns IDs and attaches stickers
function assembleCube() {
	function moveto(face) 
	{
	
		// console.log(face);
		id = id + (1 << face);
		pieces[i].children[face]
			.appendChild(document.createElement("div"))
			.setAttribute("class", "sticker " + colors[face]);
		return "translate" + getAxis(face) + "(" + ((face % 2) * 4 - 2) + "em)";
	}
	// for (var id, x, i = 0; id = 0, i < 26; i++) {
	// 	x = mx(i, i % 18);
	// 	pieces[i].style.transform = 'rotateX(0deg)' + moveto(i % 6) +
	// 		(i > 5 ? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : '') : '');
	// 	pieces[i].setAttribute('id', 'piece' + id);
	// }


	for (var id, x, i = 0; (id = 0), i < 26; i++) {
		x = mx(i, i % 18);
		pieces[i].style.transform =
			"rotateX(0deg)" +
			moveto(i % 6) +
			(i > 5 ? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : "") : "");
		pieces[i].setAttribute("id", "piece" + id);

		let str1 = pieces[i].style.transform ; 
		// console.log("STR1" , str1);
	}



}

function getPieceBy(face, index, corner) 
{
	return document.getElementById('piece' +
		((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner));
}

// Swaps stickers of the face (by clockwise) stated times, thereby rotates the face
function swapPieces(face, times) {
	for (var i = 0; i < 6 * times; i++) {
		var piece1 = getPieceBy(face, i / 2, i % 2),
				piece2 = getPieceBy(face, i / 2 + 1, i % 2);
		for (var j = 0; j < 5; j++) {
			var sticker1 = piece1.children[j < 4 ? mx(face, j) : face].firstChild,
					sticker2 = piece2.children[j < 4 ? mx(face, j + 1) : face].firstChild,
					className = sticker1 ? sticker1.className : '';
			if (className)
				sticker1.className = sticker2.className,
				sticker2.className = className;
		}
	}
}

// Animates rotation of the face (by clockwise if cw), and then swaps stickers
function animateRotation(face, cw, currentTime) 
{
	console.log("DEBUG3",face);  //FACE value 
	console.log("DEBUG13",cw);   //is clockwise
	console.log("DEBUG5",currentTime);

	var k = .3 * (face % 2 * 2 - 1) * (2 * cw - 1),
			qubes = Array(9).fill(pieces[face]).map(function (value, index) {
				return index ? getPieceBy(face, index / 2, index % 2) : value;
			});
	
	console.log("DWBIG6",k);
	console.log("COUBES6",qubes);


	(function rotatePieces() {
		var passed = Date.now() - currentTime,
				style = 'rotate' + getAxis(face) + '(' + k * passed * (passed < 300) + 'deg)';
		qubes.forEach(function (piece) {
			piece.style.transform = piece.style.transform.replace(/rotate.\(\S+\)/, style);
		});
		//time to make animation
		if (passed >= 300)
			return swapPieces(face, 3 - 2 * cw);
		requestAnimationFrame(rotatePieces);
	})();
}

// Events
var eventss = [];



function mousedown(md_e) {
    var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
		element = md_e.target.closest(".element"),
		face = [].indexOf.call((element || cube).parentNode.children, element);
		
	// console.log(startXY[0],startXY[1],startXY[2]);
	// console.log(element);  //capture which div is clicked upon
	// console.log(face);  //capture which face index is clicked upon
	function mousemove(mm_e) 
	{
		if (element) {
			var gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
			//get coordinates element clicked upon
			// console.log(gid);

			if (gid && gid.input.includes("anchor")) {
                // if(!bas)
				mouseup();
                var e = element.parentNode.children[
					mx(face, Number(gid) + 3)
				].hasChildNodes();
                // animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
                // console.log(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
                var a = [mx(face, Number(gid) + 1 + 2 * e), e, Date.now()];
                animateRotation(a[0],a[1],a[2]);
                eventss.push([a[0],!a[1],a[2]]);
                // animateRotation(a[0],!a[1],a[2]);
			}
        } 
        else
			pivot.style.transform =
				"rotateX(" +	(startXY[0] - (mm_e.pageY - md_e.pageY) / 2) +	"deg)" +
				"rotateY(" +	(startXY[1] + (mm_e.pageX - md_e.pageX) / 2) +		"deg)";
	}
	function mouseup() {
		document.body.appendChild(guide);
		scene.removeEventListener("mousemove", mousemove);
		document.removeEventListener("mouseup", mouseup);
		scene.addEventListener("mousedown", mousedown);
	}
	(element || document.body).appendChild(guide);
	scene.addEventListener("mousemove", mousemove);
	document.addEventListener("mouseup", mouseup);
	scene.removeEventListener("mousedown", mousedown);
}










// function mousedown(md_e) {
// 	var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
// 			element = md_e.target.closest('.element'),
// 			face = [].indexOf.call((element || cube).parentNode.children, element);
// 	// console.log(startXY[0],startXY[1],startXY[2]);
// 			//ancestor target .closest
// 	function mousemove(mm_e) {
// 		if (element) 
// 		{
// 			//when element of cube is touched
// 			var gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
// 			// console.log("gid ",gid);
// 			if (gid && gid.input.includes('anchor')) {
// 				mouseup();
// 				var e = element.parentNode.children[mx(face, Number(gid) + 3)].hasChildNodes();
//                 var a = [mx(face, Number(gid) + 1 + 2 * e), e, Date.now()];

// 				animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
// 				//plug the coffee and save steps
// 				eventss.push([a[0],!a[1],a[2]]);

// 			}
// 		}
// 		 else pivot.style.transform =
// 			'rotateX(' + (startXY[0] - (mm_e.pageY - md_e.pageY) / 2) + 'deg)' +
// 			'rotateY(' + (startXY[1] + (mm_e.pageX - md_e.pageX) / 2) + 'deg)';
// 	}
// 	function mouseup() {
// 		document.body.appendChild(guide);
// 		scene.removeEventListener('mousemove', mousemove);
// 		document.removeEventListener('mouseup', mouseup);
// 		scene.addEventListener('mousedown', mousedown);
// 	}

// 	(element || document.body).appendChild(guide);
// 	scene.addEventListener('mousemove', mousemove);
// 	document.addEventListener('mouseup', mouseup);
// 	scene.removeEventListener('mousedown', mousedown);
// }


const timer = ms => new Promise(res => setTimeout(res, ms));


var undo = function()
{
	console.log("DEBIG1");
	document.getElementsByClassName("run_button").disabled = true; 
    eventss.reverse();
    eventss.forEach(async (i,ind) => {
        // console.log(i[0],i[1],i[2]);
        // await runner(i);
        await timer(1000*ind);
        animateRotation(i[0],i[1],Date.now());
        // console.log(ind);
        // setTimeout(()=>{animateRotation(i[0],i[1],Date.now());},5000);
    })
	eventss = [];
	document.getElementsByClassName("run_button").disabled = false; 
}

var resetset = function()
{
	// assembleCube();
	// eventss = [];
	// console.log("FUORK ",eventss) ; 
	//check already optimsed function 
	if(eventss.length == 0)
	{
		var person = alert("Already Solved");

	}
	document.getElementsByClassName("run_button").disabled = true; 
	eventss.reverse();
    eventss.forEach(async (i,ind) => {
        animateRotation(i[0],i[1],Date.now());
    })
	eventss = [];
	document.getElementsByClassName("run_button").disabled = false; 
}





document.ondragstart = function() { return false; }
window.addEventListener('load', assembleCube);
scene.addEventListener('mousedown', mousedown);

























// function getAxis(face) {
// 	return String.fromCharCode("X".charCodeAt(0) + face / 2); // X, Y or Z
// }

// // Moves each of 26 pieces to their places, assigns IDs and attaches stickers
// function assembleCube() {
// 	function moveto(face) {
// 		id = id + (1 << face);
// 		pieces[i].children[face]
// 			.appendChild(document.createElement("div"))
// 			.setAttribute("class", "sticker " + colors[face]);
// 		return "translate" + getAxis(face) + "(" + ((face % 2) * 4 - 2) + "em)";
// 	}
// 	for (var id, x, i = 0; (id = 0), i < 26; i++) {
// 		x = mx(i, i % 18);
// 		pieces[i].style.transform =
// 			"rotateX(0deg)" +
// 			moveto(i % 6) +
// 			(i > 5 ? moveto(x) + (i > 17 ? moveto(mx(x, x + 2)) : "") : "");
// 		pieces[i].setAttribute("id", "piece" + id);
// 	}
// }

















// function getPieceBy(face, index, corner) {
// 	return document.getElementById(
// 		"piece" +
// 			((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner)
// 	);
// }

// // Swaps stickers of the face (by clockwise) stated times, thereby rotates the face
// function swapPieces(face, times) {
// 	for (var i = 0; i < 6 * times; i++) {
// 		var piece1 = getPieceBy(face, i / 2, i % 2),
// 			piece2 = getPieceBy(face, i / 2 + 1, i % 2);
// 		for (var j = 0; j < 5; j++) {
// 			var sticker1 = piece1.children[j < 4 ? mx(face, j) : face].firstChild,
// 				sticker2 = piece2.children[j < 4 ? mx(face, j + 1) : face].firstChild,
// 				className = sticker1 ? sticker1.className : "";
// 			if (className)
// 				(sticker1.className = sticker2.className), (sticker2.className = className);
// 		}
// 	}
// }

// // Animates rotation of the face (by clockwise if cw), and then swaps stickers
// function animateRotation(face, cw, currentTime) {
// 	var k = 0.3 * ((face % 2) * 2 - 1) * (2 * cw - 1),
// 		qubes = Array(9)
// 			.fill(pieces[face])
// 			.map(function (value, index) {
// 				return index ? getPieceBy(face, index / 2, index % 2) : value;
// 			});
// 	(function rotatePieces() {
// 		var passed = Date.now() - currentTime,
// 			style =
// 				"rotate" + getAxis(face) + "(" + k * passed * (passed < 300) + "deg)";
// 		qubes.forEach(function (piece) {
// 			piece.style.transform = piece.style.transform.replace(
// 				/rotate.\(\S+\)/,
// 				style
// 			);
// 		});
// 		if (passed >= 300) return swapPieces(face, 3 - 2 * cw);
// 		requestAnimationFrame(rotatePieces);
// 	})();
// }

// // Events
// var eventss = [];
// function mousedown(md_e) {
//     var startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number),
// 		element = md_e.target.closest(".element"),
//         face = [].indexOf.call((element || cube).parentNode.children, element);
// 	function mousemove(mm_e) {
// 		if (element) {
//             var gid = /\d/.exec(document.elementFromPoint(mm_e.pageX, mm_e.pageY).id);
// 			if (gid && gid.input.includes("anchor")) {
//                 // if(!bas)
// 				mouseup();
//                 var e = element.parentNode.children[
// 					mx(face, Number(gid) + 3)
// 				].hasChildNodes();
//                 // animateRotation(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
//                 // console.log(mx(face, Number(gid) + 1 + 2 * e), e, Date.now());
//                 var a = [mx(face, Number(gid) + 1 + 2 * e), e, Date.now()];
//                 animateRotation(a[0],a[1],a[2]);
//                 eventss.push([a[0],!a[1],a[2]]);
//                 // animateRotation(a[0],!a[1],a[2]);
// 			}
//         } 
//         else
// 			pivot.style.transform =
// 				"rotateX(" +
// 				(startXY[0] - (mm_e.pageY - md_e.pageY) / 2) +
// 				"deg)" +
// 				"rotateY(" +
// 				(startXY[1] + (mm_e.pageX - md_e.pageX) / 2) +
// 				"deg)";
// 	}
// 	function mouseup() {
// 		document.body.appendChild(guide);
// 		scene.removeEventListener("mousemove", mousemove);
// 		document.removeEventListener("mouseup", mouseup);
// 		scene.addEventListener("mousedown", mousedown);
// 	}
// 	(element || document.body).appendChild(guide);
// 	scene.addEventListener("mousemove", mousemove);
// 	document.addEventListener("mouseup", mouseup);
// 	scene.removeEventListener("mousedown", mousedown);
// }

// // async function delay(){
// //     return new Promise(()=>setTimeout(()=>{},5000));
// // }
// const timer = ms => new Promise(res => setTimeout(res, ms));
// // async function runner(i)
// // {
// //     await delay();
// //     animateRotation(i[0],i[1],Date.now());
// // }

// var undo = function()
// {
//     eventss.reverse();
//     eventss.forEach(async (i,ind) => {
//         // console.log(i[0],i[1],i[2]);
//         // await runner(i);
//         await timer(1000*ind);
//         animateRotation(i[0],i[1],Date.now());
//         // console.log(ind);
//         // setTimeout(()=>{animateRotation(i[0],i[1],Date.now());},5000);
//     })
//     eventss = [];
// }
// document.ondragstart = function () {
// 	return false;
// };
// window.addEventListener("load", assembleCube);
// scene.addEventListener("mousedown", mousedown);












