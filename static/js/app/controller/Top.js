define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/AccountCtr',
    'app/interface/UserCtr',
    'app/module/tencentCloudLogin'
], function(base, GeneralCtr, AccountCtr, UserCtr, TencentCloudLogin) {

    init();
    
    // 初始化页面
    function init() {
    	base.showLoadingSpin()
    	if(base.isLogin()){
    		$("#head-user-wrap .nickname").text(sessionStorage.getItem("nickname"))
    		$("#head-user-wrap").removeClass("hidden");
    		$.when(
    			getBanner()
    		)
    	}else{
    		$("#head-button-wrap").removeClass("hidden");
    		$.when(
    			getBanner()
    		)
    	}
    	addListener();
    }
    
    // 获取banner
    function getBanner(){
        return GeneralCtr.getBanner({}).then((data) => {
        	data.forEach((item) => {
        		if (item.location === 'web_download') {
	            	$('#downImg').attr("src",base.getPic(item.pic));
	        	} else if (item.location === 'web_trade') {
	            	$('#tradeBanner').css("background-image","url('"+base.getPic(item.pic)+"')");
	        	}
        	})
        }, (msg) => {
            base.showMsg(msg || "加载失败");
        });
    }
    
    function addListener(){
    	
    	$("#headLogout").click(function(){
    		base.logout()
    	})
    	$(".am-modal-mask").click(function(){
    		$(this).parent(".dialog").addClass("hidden")
    	})
    	
    	$("#head .head-nav-wrap .advertise .goHref").off("click").click(function(){
    		if(!base.isLogin()){
	    		base.goLogin();
	    		return false;
	    	}else{
	    		var thishref = $(this).attr("data-href");
				base.gohref(thishref)
	    	}
    	})
    	
    	$("#head .head-nav-wrap .invitation").off("click").click(function(){
    		if(!base.isLogin()){
	    		base.goLogin();
	    		return false;
	    	}else{
	    		var thishref = $(this).attr("data-href");
				base.gohref(thishref)
	    	}
    	})
    	
    	$("#head-user-wrap .isTradePwdFlag").click(function(){
    		var _this = $(this);
    		
    		UserCtr.getUser().then((data)=>{
    			if(data.tradepwdFlag&&data.realName){
    				base.gohref(_this.attr("data-href"))
    			}else if(!data.tradepwdFlag){
    				base.showMsg("請先設置資金密碼")
    				setTimeout(function(){
    					base.gohref("../user/setTradePwd.html?type=1")
    				},1800)
    			}else if(!data.realName){
    				base.showMsg("請先进行身份验证")
    				setTimeout(function(){
    					base.gohref("../user/identity.html")
    				},1800)
    			}
    		},base.hideLoadingSpin)
    	})
    }
});
