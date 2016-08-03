window.onload=function(){
	//准备数据
	var data = [
		/*{"singer":"测试","src":"music/测试.mp3","title":"测试","thum":"images/default.jpg"},
		{"singer":"测试2","src":"music/测试2.mp3","title":"测试2","thum":"images/default.jpg"}
		*/
		{"singer":"张学友","src":"http://yinyueshiting.baidu.com/data2/music/137284009/114627576172800128.mp3?xcode=ba0fc5edded117c39614b4474386abae","title":"一千个伤心的理由","thum":"images/z.jpg"},
		{"singer":"刘若英","src":"http://yinyueshiting.baidu.com/data2/music/137284009/114627576172800128.mp3?xcode=ba0fc5edded117c39614b4474386abae","title":"十年","thum":"images/l.jpg"},
		{"singer":"张学友","src":"http://yinyueshiting.baidu.com/data2/music/137284009/114627576172800128.mp3?xcode=ba0fc5edded117c39614b4474386abae","title":"如果.爱","thum":"images/x.jpg"},
		{"singer":"张学友","src":"http://yinyueshiting.baidu.com/data2/music/137284009/114627576172800128.mp3?xcode=ba0fc5edded117c39614b4474386abae","title":"旧情绵绵","thum":"images/z.jpg"},
		{"singer":"张学友","src":"http://yinyueshiting.baidu.com/data2/music/137284009/114627576172800128.mp3?xcode=ba0fc5edded117c39614b4474386abae","title":"只想一生跟你走","thum":"images/t.jpg"}
	];
	
	var player = document.getElementById('audio'); //播放器
	var playBtn = document.getElementById('playBtn');//播放/暂停
	var currentBar = document.getElementById('currentBar'); //当前播放进度
	var progressOp = document.getElementById('progressOp');  //当前播放位置
	var volumeNum = 0.3; //全局音量控制
	var musicNum = -1; //记录歌曲数量
	var timer = 0;
	var isChange = false;
	//初始化
	var musicPic = document.getElementById('musicPic'); //封面
	var playerMusicTit = document.getElementById('playerMusicTit');//歌曲名字
	var playerMusicAuthor = document.getElementById('playerMusicAuthor'); //歌手
	var playerMusicTime = document.getElementById('playerMusicTime');//歌曲时长
	player.volume = volumeNum;  //初始化播放器音量
	var listNum = document.getElementById('listNum');
	listNum.innerHTML=data.length;
	var str = '';
	var singleList = document.getElementById('singleList');
	//生成播放列表
	for(var i=0;i<data.length;i++){
		str+='<li title="'+data[i].title+'" data-src="'+data[i].src+'" id="'+i+'">'+
				'<strong class="play-time">'+toZero(i+1)+'</strong>'+
				'<strong class="music-name">'+data[i].title+'</strong>'+
				'<strong class="singer-name">'+data[i].singer+'</strong>'+
			'</li>'
	}
	singleList.innerHTML=str;
	
	//点击播放列表 切换歌曲
	singleList.onclick=function(e){
		var ev = e || event;
		var target = ev.target || ev.srcElement;
		var aLi = singleList.getElementsByTagName('li');
		for(var i=0;i<aLi.length;i++){
			aLi[i].className='';
		}
		if(target.nodeName.toLowerCase()=='li' || target.nodeName.toLowerCase()=='strong'){
			target.parentNode.className='play-current'
			//player.src = 'music/'+target.parentNode.title+'.mp3';
			player.src = target.parentNode.getAttribute('data-src');
			player.play();
			playBtn.className='play pause';
			//歌曲加载完毕
			player.addEventListener("loadeddata", function(){
				musicPic.src = data[target.parentNode.id].thum; //封面
				playerMusicTit.innerHTML = data[target.parentNode.id].title; //歌曲名字
				playerMusicAuthor.innerHTML = data[target.parentNode.id].singer;  //歌手
				playerMusicTime.innerHTML = toMinute(player.duration);  //时长
			});
			musicNum=target.parentNode.id;
			isChange = true;
			currentProcess();
		}
	}
	
	//播放、暂停
	playBtn.onclick=function(){
		if(!player.src){
			player.src = data[0].src;
			musicNum=0;
			var aLi = singleList.getElementsByTagName('li');
			aLi[musicNum].className='play-current';
		}
		if(player.paused){
			player.play();
			this.className='play pause';
			//歌曲加载完毕
			player.addEventListener("loadeddata", function(){
				musicPic.src = data[musicNum].thum; //封面
				playerMusicTit.innerHTML = data[musicNum].title; //歌曲名字
				playerMusicAuthor.innerHTML = data[musicNum].singer;  //歌手
				playerMusicTime.innerHTML = toMinute(player.duration);  //时长
			});
			//isChange = true;
			currentProcess();
		}else{
			isChange = false;
			clearInterval(timer);
			player.pause();
			this.className='play';
		}
	}
	
	//下一首
	var playNext = document.getElementById('playNext');
	playNext.onclick=function(){
		musicNum++;
		if(musicNum==data.length){
			musicNum=0;
		}
		playToggle(musicNum);
	}
	
	//上一首
	var playPrev = document.getElementById('playPrev');
	playPrev.onclick=function(){
		musicNum--;
		if(musicNum<0){
			musicNum=data.length-1;
		}
		playToggle(musicNum);
	}
	
	//歌曲切换
	function playToggle(musicNum){
		var aLi = singleList.getElementsByTagName('li');
		for(var i=0;i<aLi.length;i++){
			aLi[i].className='';
		}
		aLi[musicNum].className='play-current';
		player.src = data[musicNum].src;
		player.play();
		playBtn.className='play pause';
		//歌曲加载完毕
		player.addEventListener("loadeddata", function(){
			musicPic.src = data[musicNum].thum; //封面
			playerMusicTit.innerHTML = data[musicNum].title; //歌曲名字
			playerMusicAuthor.innerHTML = data[musicNum].singer;  //歌手
			playerMusicTime.innerHTML = toMinute(player.duration);  //时长
		});
		isChange = true;
		currentProcess();
	}
	
	//监听歌曲是否播放完毕，播放完进入下一首
	player.addEventListener('ended',function(){
		musicNum++;
		if(musicNum==data.length){
			musicNum=0;
		}
		playToggle(musicNum);
	});
	
	//当前播放进度
	function currentProcess(){
		if(isChange){ //如果是切换歌曲，则还原进度
			currentBar.style.width=0;
			progressOp.style.left=0;
		}
		clearInterval(timer);
		timer = setInterval(function(){
			var currentVal = (player.currentTime/player.duration)*currentBar.parentNode.offsetWidth;
			currentBar.style.width=currentVal+'px';
			if(currentVal>progressOp.offsetWidth){
				currentVal-=progressOp.offsetWidth;
				progressOp.style.left=currentVal+'px';
			}
			
		},1000);
	}
	
	//拖动快进、快退
	var timeX = 0;
	progressOp.onmousedown=function(e){
		var ev = e || event;
		timeX = ev.clientX-progressOp.offsetLeft;
		clearInterval(timer);
		document.onmousemove=function(e){
			var ev = e || event;
			var l = ev.clientX-timeX;
			if(l<=0){
				l=0;
			}else if(l>=progressOp.parentNode.offsetWidth-progressOp.offsetWidth){
				l=progressOp.parentNode.offsetWidth-progressOp.offsetWidth;
			}
			currentBar.style.width=l+progressOp.offsetWidth+'px';
			progressOp.style.left=l+'px';
			player.currentTime =currentBar.offsetWidth/currentBar.parentNode.offsetWidth*player.duration;
			document.title=player.currentTime;
			return false;
		}
		document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;
			currentProcess();
		}
		return false;
	}
	
	//跳跃改变播放进度
	progressOp.parentNode.onclick=function(e){
		var ev = e || event;
		if(!player.src)return;
		currentBar.style.width = ev.clientX+'px';
		progressOp.style.left = ev.clientX-progressOp.offsetWidth+'px';
		player.currentTime = (currentBar.offsetWidth/this.offsetWidth)*(player.duration);
	}
	
	//音量控制
	var volumeToggle = document.getElementById('volumeToggle');
	volumeToggle.onclick=function(){
		if(!this.onOff || this.onOff == false){  //静音
			this.className='volume-icon volume-icon-disable';
			this.onOff = true;
			player.volume = 0;
		}else{
			this.className='volume-icon';
			this.onOff = false;
			player.volume = volumeNum;
		}
	}
	
	//拖动改变音量
	var volumeRegulate = document.getElementById('volumeRegulate');
	var aSpan = volumeRegulate.getElementsByTagName('span');
	var disX = 0;
	aSpan[1].onmousedown=function(e){
		var ev = e || event;
		disX = ev.clientX - this.offsetLeft;
		document.onmousemove=function(e){
			var ev = e || event;
			var l = ev.clientX-disX;
			if(l<=0){
				l=0;
			}else if(l>=volumeRegulate.offsetWidth-aSpan[1].offsetWidth){
				l = volumeRegulate.offsetWidth-aSpan[1].offsetWidth;
			}
			aSpan[0].style.width = l +'px';
			aSpan[1].style.left = l + 'px';
			//设置音量
			volumeNum = player.volume = aSpan[0].offsetWidth/(volumeRegulate.offsetWidth-aSpan[1].offsetWidth);
			return false;
		}
		document.onmouseup=function(){
			document.onmousemove=null;
			document.onmouseup=null;
		}
		return false;
	}
	
	//跳跃改变音量
	volumeRegulate.onclick=function(e){
		var ev = e || event;
		aSpan[0].style.width = ev.clientX-457+'px';  //写死的距离，存在隐患。。应动态计算距离浏览器窗口的offsetLeft
		aSpan[1].style.left = ev.clientX-457+'px';
		player.volume = aSpan[0].offsetWidth/this.offsetWidth;
	}
	
	//展开播放器
	var oDiv = document.getElementById("player");
	var playerToggle = document.getElementById('playerToggle');
	playerToggle.onclick=function(){
		if(!this.onOff || this.onOff==false){
			oDiv.style.left=0;
			this.onOff = true;
		}else{
			playerListBox.style.top=0;
			playerListBox.style.opacity=0;
			oDiv.style.left='-541px';
			this.onOff = false;
		}
	}
	//显示列表
	var showList = document.getElementById('showList');
	var playerListBox = document.getElementById('playerListBox');
	showList.onclick=function(){
		if(!this.onOff || this.onOff==false){
			playerListBox.style.top='-507px';
			playerListBox.style.opacity=1;
			playerListBox.style.height='507px';
			this.onOff = true;
		}else{
			playerListBox.style.top=0;
			playerListBox.style.opacity=0;
			playerListBox.style.height=0;
			this.onOff = false;
		}
	}
	//关闭列表
	var closeList = document.getElementById('closeList');
	closeList.onclick=function(){
		playerListBox.style.top=0;
		playerListBox.style.opacity=0;
		playerListBox.style.height=0;
		showList.onOff=false;
	}
	
	//时间转换，以分钟计时
	function toMinute(time){
		var minute = Math.floor(time/60); //分
		var seconds = Math.floor(time%60); //秒
		return toZero(minute)+':'+toZero(seconds);
	}
	
	//低于10，补0
	function toZero(n){
		return n < 10 ? '0'+n : ''+n;
	}
	
	/*以下代码和播放器无关*/
	var winH = document.documentElement.clientHeight || document.body.clientHeight;
	document.body.style.height=winH+'px';

}