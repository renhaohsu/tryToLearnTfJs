var firebase;
var config = {
  databaseURL: "https://chatroomtestinggg.firebaseio.com/"
};
firebase.initializeApp(config);

//要寫入的資料物件
var postData = {
  id:'a',
  num:123
};
//每次寫入資料庫都產生一組 key
// var newPostKey = firebase.database().ref().child('posts').push().key;
// var updates = {};
// updates[newPostKey] = postData;
//寫入資料
// firebase.database().ref('/test/').update(updates);


var database = firebase.database().ref('/test/');


var UserName = document.getElementById('UserName');
var UserContent = document.getElementById('UserContent');
var btn = document.getElementById('btn');

// btn.addEventListener('click',function(){
//     var UserPostData = {
//       name: UserName.value,
//       content: UserContent.value
//     };
//     database.push(UserPostData);
//     UserContent.value = '';
//   });


//使用 .on 來讀取資料，這個方法可以在每次資料庫有變動的時候，就把資料回傳讓我們知道
//透過 for 迴圈轉換成陣列，並將陣列的內容依序顯示在網頁上，就可以看到一個聊天室雛形誕生了，不過要注意的是一開始我先把畫面清空，避免產生的內容重複發生。

//這樣可以把新增的東西貼到html裡


// var show = document.getElementById('show')

// database.on('value', function(snapshot) {
// 	show.innerHTML = ('')
// 	for (var i in snapshot.val()) {
// 		show.innerHTML += `<span> ${snapshot.val()[i].name} 說：
// 			${snapshot.val()[i].content} </span><br/>`
// 	}
 // console.log(snapshot.val());
// });

// 看完寫入和讀取之後，就真的要來做一個聊天室了，首先來看一下一個基礎的聊天室，需要有哪些功能：

// 姓名
// 發送時間
// 對話內容
// 可以區隔是自己發的內容還是別人發的內容
// 打完字按下 enter 就送出 ( 不然每次還要用滑鼠點也是頗累人 )
// 由這五個功能可以發現我們的資料庫需要有四個欄位：姓名、時間、內容、id，其他的基本上都可以透過網頁前端來解決，我們先把寫入資料庫的事情搞定，因為需要「時間」，所以在每次按下按鈕時都會觸發 new Date()，為了避免個位數與十位數在排版上的差異，所以一律補零，最後就是在寫入的物件新增一個 time 的屬性記錄當下時間。

// id 則是在一開始的時候先設定一個變數 ms = new Date().getTime()，目的是讓打開網頁的使用者知道自己是誰 ( getTime()的目的在獲取從 1970/1/1 到現在的毫秒數，很難重複 )，這樣子我們讀取資料的時候，才可以知道哪個帳號是自己說的話，就可以透過樣式標記出來。( 當然如果是使用帳號登入之類的方式就更簡單判斷 )

btn.addEventListener('click', write, false);

var ms = new Date().getTime()

function write(){
	var date = new Date();
 	var h = date.getHours();
  	var m = date.getMinutes();
  	var s = date.getSeconds();
  	if(h<10){
    	h = '0'+h;
  	}
  	if(m<10){
    	m = '0' + m;
  	}
  	if(s<10){
    	s = '0' + s;
  	}
  	var now = h+':'+m+':'+s;  //獲取按下按鈕或 enter 的當下時間


    var UserPostData = {
      name: UserName.value,
      content: UserContent.value,
      time: now,
      id: 'id' + ms
    };
    database.push(UserPostData);
    UserContent.value = '';
}


// 完成後再來看看讀取的程式，這邊我將會用到 .once 以及 .limitToLast(1).on 這兩種方法，第一個 .once 的目的在於資料庫的「完整資料」在「第一次」全部載入，因為沒有必要在每次送出訊息的時候都重新載入一次 ( 如果純粹用 .on 就會全部重新載入 )，而 .once 只會載入一次，而 .limitToLast(1).on 則是在資料庫有變動的時候，載入最後一筆訊息，同樣的，這個步驟也是避免每次發送訊息都載入完整資料庫。

// 將資料顯示在畫面上則是用了 jQuery 的 prepend，這樣才會顯示在開頭，然後用一點點 CSS 做顏色的區隔。

//第一次載入資料庫時顯示所有內容
database.once('value', function (snapshot) {
	show.innerHTML = ('');
	for (var i in snapshot.val()) {
		show.innerHTML += `<div><div> ${snapshot.val()[i].time} </div>
		${snapshot.val()[i].name} 說：
		${snapshot.val()[i].content} </div>`
	}	
	
})

//每一次資料庫有變動時，獲取最新一筆內容呈現
database.limitToLast(1).on('value', function (snapshot) {
	for (var i in snapshot.val()) {
		show.innerHTML += `<div id="${snapshot.val()[i].id}">
		<div>${snapshot.val()[i].time} </div>
		${snapshot.val()[i].name} 說：
		${snapshot.val()[i].content} </div>`
	}
	//如果是自己發出去的文字，就改變顏色
	var id_ms = document.getElementById('id'+ms);
	id_ms.style.color = 'red';
});