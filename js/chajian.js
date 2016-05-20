// JavaScript Document


function getByClass(oParent,sClass){
	if(oParent.getElementsByClassName){
	   return oParent.getElementsByClassName(sClass);
	}
	   var re=new RegExp('\\b'+sClass+'\\b')
	   var aEle=document.getElementsByTagName('*');
	   var result=[];
	   for(var i=0; i<aEle.length; i++){
		   if(re.test(aEle[i].className)){
			   result.push(aEle[i]);
		   }
	   }
	   return result;

}

function move(obj,json,opational){
	
	opational=opational||{};
	opational.time=opational.time||300;
	opational.fn=opational.fn||null;
	opational.type=opational.type||'ease-out';
	
	var start={};
	var dis={};
	for(var key in json){
		start[key]=parseFloat(getStyle(obj,key));
		dis[key]=json[key]-start[key];
	}
	
	var count=Math.round(opational.time/30);
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		
		n++;
		
		for(var key in json){
			
			//var cur=start[key]+n*dis[key]/count;
			switch(opational.type){
				case 'linear':
					var a=n/count;
					var cur=start[key]+dis[key]*a;
					break;	
				case 'ease-in':
					var a=n/count;
					var cur=start[key]+dis[key]*a*a*a;
					break;	
				case 'ease-out':
					var a=1-n/count;
					var cur=start[key]+dis[key]*(1-a*a*a);
					break;	
			}
		
		
			if(key=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity='+cur*100+')';
			}else{
				obj.style[key]=cur+'px';
			}
		}
		
		if(n==count){
			clearInterval(obj.timer);
			opational.fn && opational.fn();
		}
		
	},30);	
}

function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];	
}

//进度条
function dot(obj,json,h){
		var　gd = obj.getContext("2d");
		json=json || {};
		json.cx=json.cx || 300;
		json.cy=json.cy || 300;
		json.r=json.r || 150;
		json.deg=json.deg || 360;
		
		var d = 0;
		var r=parseInt(Math.random()*256);
		var g=parseInt(Math.random()*256);
		var b=parseInt(Math.random()*256);
		gd.lineWidth = "15";
		gd.font = h + "px kaiti";
		gd.fillStyle = 'rgba('+r+','+g+','+b+',1)';
		var timer = setInterval(function(){
			gd.clearRect(0,0,obj.width,obj.height);
			gd.beginPath();
			gd.arc(json.cx,json.cy,json.r,d2a(0),d2a(d++),false);
			gd.strokeStyle = 'rgba('+r+','+g+','+b+',1)';
			gd.stroke();
			
			//写文字
			var str = Math.floor(d/360*100) + "%";
			var w = gd.measureText(str).width;
			gd.fillText(str,json.cx-w/2,json.cy+h);
			if(d > json.deg){
				clearInterval(timer);
			}
		},1);
	}
//弧度转角度
function d2a(n){
	return n*Math.PI/180;	
}

//鼠标滚轮
function addMouseWheel(obj,fn){
	//1.判断浏览器
	if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
		//ff
		obj.addEventListener('DOMMouseScroll', fnWheel,false);
	}else{
		//other
		obj.onmousewheel=fnWheel;
	}
	//2.确定方向
	function fnWheel(ev){
		var oEvt=ev||event;
		if(oEvt.wheelDelta){
			//ie chrome 	-120下
			var down=oEvt.wheelDelta<0?true:false;
		}else{
			//ff 			3下
			var down=oEvt.detail>0?true:false;
		}
		//3.回调传参
		fn(down);
	}
	
}
var timer=null;
function move1(obj,iTarget,time,fn){
	var start=obj.scrollTop;
	var dis=iTarget-start;
	var count=Math.round(time/30);
	var n=0;
	
	clearInterval(timer);
	timer=setInterval(function(){
		n++;
		var a=1-n/count;
		var cur=start+dis*(1-a*a*a);
		obj.scrollTop=cur;
		
		
		if(n==count){
			clearInterval(timer);	
			fn && fn();
		}
		
	},30);	
}

//getpos
function getPos(obj){
	var l=t=0;
	
	while(obj){
	//for(;obj;){
		//找	累加	l
		l+=obj.offsetLeft;	//取到定位父级的距离
		t+=obj.offsetTop;	//取到定位父级的距离
		obj=obj.offsetParent;	//把obj的定位父级变成obj
		
	}
	return {left:l,top:t};
		
}

//检验表单
 var json={
			mail: 	/^\w+@\w+\.[a-zA-Z]{2,3}\.[a-zA-Z]{1,2}$/,
			tel:	/^(0[1-9]\d{1,2}-?)?[1-9]\d{6,7}$/,
			age:	/^(1[6-9]|[2-9]\d|100)$/,
			user:	/^[\u4e00-\u9fa5]+$/,
			qq:		/^[0-9]{5,}$/,
			pass:	/^.{6,}$/,
			pass2:	/^.{6,}$/	
		};
function checkForm(id,fn){	
	 var oFm=document.getElementById(id)
	 var aIpt=oFm.getElementsByTagName('input');
	 
	 oFm.onsubmit=function(){
		 var bOk=true; //假设检验成功
		 for(var i=0; i<aIpt.length; i++){
			 if(aIpt[i].name){ //有names属性再往下走
				 var re=json[aIpt[i].name];
				 if(!check(re,aIpt[i])){
					 bOk=false;
				}
			} 
		 }
		 if(bOk==false){
			 return false;
		 }
	 }
		for(var i=0;i<aIpt.length;i++){
		if(aIpt[i].name){
			var re = json[aIpt[i].name];
			(function(re){
				aIpt[i].onblur=function(){
					check(re,this);
				};	
			})(re);
		}
	}
		
	function check(re,oIpt){
		if(!re.test(oIpt.value)){
			oIpt.className='error';
			return false;
		}else{
			if(oIpt.name=='pass2'){
				if(fn && fn(oIpt)==false){//pass2,他的2次校验失败了
				    oIpt.className='error';
					return false;
				}else{
					oIpt.className='ok';
					return true;
				}
			}else{
				oIpt.className='ok';//除pass2以外第一次校验成功了
				return true;
			}
		}
	}
}