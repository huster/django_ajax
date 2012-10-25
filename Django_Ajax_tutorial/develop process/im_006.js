var timer = null;
var autoLayout_album = {
    columnCount: 4,
    divWidth: 222,
    marginTop: 14,
    marginLeft: 14,
    colArray: [],
    freeLeft: 0,
    rightLoad: true,
    defaults: {
        contentID: "",
        rightLoad: true,
        leftID: null,
        rightID: null,
        linkUrl: "",
        noText: "",
        loadingID: "",
        callBack: null
    },
    numbers: 0,
    isHasNextPage: true,
    pageAuto: false,
    searchPage: false,
    loading: true,
    divId: 0,
    init: function(options, sta, dataObj) {
        var _jsonUrl, freeLeft, columns, w;
        if (typeof options == "object") {//第一次加载，divId = 0 的时候
            $("#footer").hide();
            if (document.getElementById("firstload")) {
                $("#imloading").hide();
               
            }
            $.extend(autoLayout_album.defaults, options);
            var opts = autoLayout_album.defaults;
            if (!opts.rightLoad) {
                autoLayout_album.rightLoad = false
            }
            w = document.documentElement.clientWidth - 17;
            var h = document.documentElement.clientHeight;
            var objDiv;
            var heightArray = [];
            columns = Math.floor((w + autoLayout_album.marginLeft) / (autoLayout_album.divWidth + autoLayout_album.marginLeft));
            freeLeft = 0;
            columns = Math.max(columns, 4);
            var contentWidth = columns * 236 - 14 + "px";
            document.getElementById(opts.contentID).style.width = contentWidth;
			document.getElementById("content").style.width = contentWidth;
			try{
			document.getElementById("zhimeisheetbar").style.width = freeLeft + autoLayout_album.divWidth * (columns - 1) + autoLayout_album.marginLeft * (columns - 1) + 3 +"px";
			}catch(e){}
			try{
			document.getElementById("sheetbarsearch").style.width = contentWidth;
			}catch(e){}
			
            document.getElementById("topchannel").style.width = contentWidth;
            document.getElementById("topsysmenu").style.width = contentWidth;
            document.getElementById("footer-p").style.width = contentWidth;
            if (autoLayout_album.pageAuto) {
                columns = Math.max(columns, 4);
                var _widthPage = autoLayout_album.divWidth * (columns - 1) + autoLayout_album.marginLeft * (columns - 1) - 17 + "px";
                if (!autoLayout_album.searchPage) {
                    $(".sheet").css({
                        marginLeft: freeLeft + "px",
                        width: _widthPage
                    })
                }
                document.getElementById("content").style.width = contentWidth;
                document.getElementById("topsysmenu").style.width = contentWidth;
                document.getElementById("topchannel").style.width = contentWidth;
                document.getElementById("footer-p").style.width = contentWidth
            }
			autoLayout_album.updateDiv();
			heightArray = autoLayout_album.colArray;
            /*
			for (var i = 0; i < columns; i++) {
                heightArray[i] = 0
            }
			*/
            if (document.getElementById(opts.leftID)) {
                var leftBoard = document.getElementById(opts.leftID);
                leftBoard.style.display = "block";
                leftBoard.style.left = freeLeft + "px";
                leftBoard.style.top = heightArray[0] + "px";
                heightArray[0] = (leftBoard.offsetHeight + autoLayout_album.marginTop)
            }
           
            if (!autoLayout_album.rightLoad) {
                heightArray.splice(heightArray.length - 1, 1)
            }
            document.getElementById(autoLayout_album.defaults.contentID).style.height = Math.max.apply(Math, heightArray) + "px";
            _jsonUrl = opts.linkUrl
        } else {
            w = document.documentElement.clientWidth;
            columns = Math.floor((w + autoLayout_album.marginLeft) / (autoLayout_album.divWidth + autoLayout_album.marginLeft));
            freeLeft = 0;
            columns = Math.max(columns, 4);
            var contentWidth = columns * 235 - 13 + "px";
            document.getElementById(autoLayout_album.defaults.contentID).style.width = contentWidth;
            var heightArray = autoLayout_album.colArray;
            _jsonUrl = options;
            $("#imloading").css({
                visibility: ""
            })
        }
        if (!sta) {
            $.ajax({
                type: "GET",
                url: encodeURI(_jsonUrl),
                dataType: "json",
                async: true,
                success: function(json) {
                    $("#imloading").show();
                    initContent(json)
                }
            })
        } else {
            initContent(dataObj)
        }
        function initContent(json) {
            autoLayout_album.loading = false;
            var _jsonMain = eval(json);
            var picBoard = _jsonMain.result;
			var current_user = _jsonMain.current_user;
			
			if (!_jsonMain.hasNextPage) {
                autoLayout_album.isHasNextPage = false;
                $("#imloading").css({
                    visibility: ""
                }).find("div").removeClass("loading").addClass("notmore").text("no more content");
				$("#footer").show();
            }
			
			try{
            	if (picBoard.length == 0) {
                	$("#" + autoLayout_album.defaults.noText).show()
            	} else {
               	 $("#" + autoLayout_album.defaults.noText).hide()
            	}
			}
			catch(e){
				$("#imloading").hide();
				return false;	
			}
            if (picBoard.length == 0) {
                $("#imloading").hide();
                if (autoLayout_album.defaults.callBack) {
                    autoLayout_album.defaults.callBack()
                }
                $("#footer").remove("fixedfooter").show();
                autoLayout_album.isHasNextPage = false;
                if (document.getElementById("firstload")) {
                    document.getElementById("firstload").style.display = "none"
                }
                return
            }
            for (var j = 0,
            len = picBoard.length; j < len; j++) {
				
                var picWidth = picBoard.width;
                var picHeight = picBoard.height;
                var imgList = '';
				//var _isMeFollow = "";//picBoard[j].isMe == 1 ? '<div class="follow"><a href="javascript:;" status="follow" class="longbutton concern jquery-option" onclick="$.Edit_Album('+picBoard[j].id+')" >Edit</a></div>':'<div class="follow"><a href="'+picBoard[j].url+'" status="follow" class="longbutton concern jquery-option">View</a></div>';
				
                var editorCount = parseInt(picBoard[j].editor_count) + 1;
				var _isMeFollow = '<div style="text-align: center;padding: 4px 0 12px 0;"><span class="albuminfo">' + picBoard[j].img_count + ' Clips</span><span class="infodot"><img src="../tpl/zhimei/images/dot_1.gif"/></span><span class="albuminfo">' + picBoard[j].fans_count + ' Fans</span><span class="infodot"><img src="../tpl/zhimei/images/dot_1.gif"/></span><span class="albuminfo">' + editorCount + ' Editors</span></div>';
              
                var rows = Math.min.apply(Math, heightArray);
                var cols = $.inArray(rows, heightArray);
				
                var _le = freeLeft + autoLayout_album.divWidth * cols + autoLayout_album.marginLeft * (cols) + "px";
                var _to = rows + "px";
                var inserDiv = ['<div id="' + autoLayout_album.divId + '" columns="' + cols + '" class="mbox" style="left:' + _le + ";top:" + _to + '; "><div class="followlist">', '<h3 class="mboxTitle"><!--<span class="number floatright">'+picBoard[j].img_count+' Clips</span>--><a class="t" title="'+picBoard[j].title+'" target="_blank" href="'+picBoard[j].url+'">'+picBoard[j].title+'</a></h3>', ''+picBoard[j].imgs+_isMeFollow+'</div><div style="clear:both;"></div><div  class="groupCorner" style="display:block;"></div></div>'].join("");
			
               $(document.getElementById(autoLayout_album.defaults.contentID)).append(inserDiv);
                autoLayout_album.numbers++;
                heightArray[cols] += (parseInt(document.getElementById(autoLayout_album.divId).offsetHeight) + autoLayout_album.marginTop);
                var _thisBoard = $(document.getElementById(autoLayout_album.divId));
                 _thisBoard.hover(function() {
                    $(this).addClass("hover");
					$(this).children('.groupCorner').hide();
                },
                function() {
                    $(this).removeClass("hover");
					$(this).children('.groupCorner').show();
                });
                autoLayout_album.divId++
				
               
            }
            $("#imloading").hide();
			
            autoLayout_album.colArray = heightArray;
			
            document.getElementById(autoLayout_album.defaults.contentID).style.height = Math.max.apply(Math, heightArray) + "px";
            $(".maskDiv").css({
                height: $("body").height()
            });
            $("#footer").removeClass("fixedfooter").show();
            if (document.getElementById("firstload")) {
                document.getElementById("firstload").style.display = "none"
            }
            autoLayout_album.loading = true;
            
            function _getComment(json, isMe) {
                var commentHtml = [];
                for (var m = 0; m < json.length; m++) {
                    var ask = "";
                    if (isMe != 1) {
                        ask = '<a class="gray">Reply</a>'
                    }
					xHtml = ['<li class="cf"><div class="uhead" style="height:30px;"><a href="' + json[m].user_url + '"><img src="' + json[m].avt + '" /></a></div>', '<div class="uinfo"><p><a href="' + json[m].user_url + '" class="gray">' + json[m].user_name + "</a></p>", '<p class="recoment" commentId="' + json[m].comment_id + '">' + json[m].comment + "&nbsp;" + ask + "</p></div></li>"].join("");
                    commentHtml[m] = xHtml
                }
                return commentHtml.join("")
            }
        }
    },
    updateDiv: function() {
        var k = autoLayout_album.defaults;
        if (k.contentID == "") {
            return
        }
        var q;
        var f = [];
        var g = document.documentElement.clientWidth - 17;
        var u = document.documentElement.clientHeight;
        var a = Math.max(Math.floor((g + autoLayout_album.marginLeft) / (autoLayout_album.divWidth + autoLayout_album.marginLeft)), 4);
        var o = 0;
        var l = a * 236 - 14 + "px";
        if (document.getElementById(autoLayout_album.defaults.contentID)) {
            document.getElementById(autoLayout_album.defaults.contentID).style.width = l
        }
        document.getElementById("topchannel").style.width = l;
		document.getElementById("content").style.width = l;
		try{
			document.getElementById("zhimeisheetbar").style.width = (a - 1)* 236 + 3 + "px";
		}catch(e){}
		try{
			document.getElementById("sheetbarsearch").style.width = l;
		}catch(e){}
		
        document.getElementById("topsysmenu").style.width = l;
        document.getElementById("footer-p").style.width = l;
        if (autoLayout_album.columnCount > a) {
            a = autoLayout_album.columnCount
        }
        for (var s = 0; s < a; s++) {
            f[s] = 0
        }
        if (document.getElementById(k.leftID)) {
            var n = document.getElementById(k.leftID);
            n.style.left = "0px";
            n.style.top = f[0] + "px";
            f[0] = (n.offsetHeight + autoLayout_album.marginTop)
        }
        if (k.rightID) {
            for (var m = 0,
            d = k.rightID.length; m < d; m++) {
                var p = document.getElementById(k.rightID[m]);
                p.style.left = o + autoLayout_album.divWidth * (a - 1) + autoLayout_album.marginLeft * (a - 1) + "px";
                p.style.top = f[a - 1] + "px";
                var b;
                if (p.style.marginTop) {
                    b = parseInt(p.style.marginTop)
                } else {
                    b = 0
                }
                f[a - 1] += (p.offsetHeight + autoLayout_album.marginTop + b)
            }
        }
        if (!autoLayout_album.rightLoad) {
            f.splice(f.length - 1, 1)
        }
        q = autoLayout_album.getElements(k.contentID);
        for (var r = 0,
        t = q.length; r < t; r++) {
            if (q[r] == document.getElementById("leftLabel") || q[r] == document.getElementById("rightLabel1") || q[r] == document.getElementById("rightLabel2") || q[r] == document.getElementById("rightLabel3") || parseInt(q[r].offsetHeight) == 0) {
                continue
            } else {
                var e = Math.min.apply(Math, f);
                var c = $.inArray(e, f);
                q[r].setAttribute("columns", c);
                q[r].style.left = o + autoLayout_album.divWidth * c + autoLayout_album.marginLeft * c + "px";
                if(k.rightID.length > 0)
				{
					q[r].style.top = e + "px";
				}
				else
					q[r].style.top = e + "px";
                f[c] += (parseInt(q[r].offsetHeight) + autoLayout_album.marginTop)
            }
        }
        if (autoLayout_album.pageAuto) {
            a = Math.max(a, 4);
            var v = autoLayout_album.divWidth * (a - 1) + autoLayout_album.marginLeft * (a - 1) - 17 + "px";
            if (!autoLayout_album.searchPage) {
                $(".sheet").css({
                    marginLeft: o + "px",
                    width: v
                })
            }
            document.getElementById("content").style.width = l;
            document.getElementById("topsysmenu").style.width = l;
            document.getElementById("topchannel").style.width = l;
            document.getElementById("footer-p").style.width = l
        }
        autoLayout_album.colArray = f;
        document.getElementById(k.contentID).style.height = Math.max.apply(Math, f) + "px"
    },
    debounceFunc: function(d, a, b) {
        var e;
        return function c() {
            var h = this,
            g = arguments;
            function f() {
                if (!b) {
                    d.apply(h, g)
                }
                e = null
            }
            if (e) {
                clearTimeout(e)
            } else {
                if (b) {
                    d.apply(h, g)
                }
            }
            e = setTimeout(f, a || 30)
        }
    },
    reshareCountIncr: function(a) {
        var h = $("div[dataid|=" + a + "]").parent().attr("id");
        var f = autoLayout_album.getElements(h);
        for (var d = 0,
        e = f.length; d < e; d++) {
            if ($(f[d]).attr("dataid") == a) {
                $(f[d]).find(".reshareNum").html(parseInt($(f[d]).find(".reshareNum").text()) + 1);
                if ($(f[d]).find(".reshareNum").parent().css("display") == "none") {
                    if ($(f[d]).find(".reshareNum").parent().next().css("display") == "none" && $(f[d]).find(".reshareNum").parent().next().next().css("display") == "none") {
                        $(f[d]).find(".reshareNum").parent().parent().show();
                        var b = 20;
                        var g = $(f[d]).attr("columns");
                        var j = parseInt($(f[d]).css("top"));
                        c(autoLayout_album.defaults.contentID, g, b, j)
                    }
                    $(f[d]).find(".reshareNum").parent().show()
                }
            }
        }
        function c(r, n, p, q) {
            var m = autoLayout_album.getElements(r);
            for (var o = m.length; o--;) {
                var l = $(m[o]).attr("columns");
                var k = parseInt($(m[o]).css("top"));
                if (l == n && k > q) {
                    $(m[o]).css({
                        top: k + p
                    })
                }
            }
            autoLayout_album.colArray[n] += p;
            document.getElementById(autoLayout_album.defaults.contentID).style.height = Math.max.apply(Math, autoLayout_album.colArray) + "px"
        }
    },
    getElements: function(f) {
        var b;
        var a = document.getElementById(f).children;
        var d = [];
        for (var e = 0,
        c = a.length; e < c; e++) {
            if (a[e] != document.getElementById("leftLabel") && a[e] != document.getElementById("rightLabel1") && a[e] != document.getElementById("rightLabel2") && a[e] != document.getElementById("rightLabel3") && a[e] != document.getElementById("rightLabel4")) {
                d.push(a[e])
            }
        }
        b = d;
        return b
    },
    updateHeight: function(h, d, f, g) {
        var c = autoLayout_album.getElements(h);
        for (var e = c.length; e--;) {
            var b = $(c[e]).attr("columns");
            var a = parseInt($(c[e]).css("top"));
            if (b == d && a > g) {
                $(c[e]).css({
                    top: a + f
                })
            }
        }
        autoLayout_album.colArray[d] += f;
        document.getElementById(autoLayout_album.defaults.contentID).style.height = Math.max.apply(Math, autoLayout_album.colArray) + "px"
    },
    eachAction: function(jsonUrl) {
		 var _thisBoard = $(".imBoard");
        _thisBoard.find("a.forward-btn").die().live("click",
        function() {
            if (typeof loginUser.id == "undefined" || loginUser.id == "") {
                var _path = window.location.pathname;
                window.location.href = "/login?flag=4&p=" + _path;
                return
            }
            var _id = $(this).attr("to");
            var _userId = $(this).attr("userId");
            var _title = $(this).parent().parent().parent().find(".contentsms").text();
            var _pic = $(this).parent().parent().parent().find(".picUrl").attr("src");
            reshare({
                id: _id,
                userId: _userId,
                title: _title,
                mediumZoom: _pic
            })
        });
		/*
        _thisBoard.find(".edit-btn").die().live("click",
        function() {
            editShare.edit($(this).attr("to"))
        });
		*/
        _thisBoard.find(".comment-btn").die().live("click",
        function() {
            openComment($(this), 0)
        });
        _thisBoard.find(".recoment .blue").die().live("click",
        function() {
            openComment($(this).parent().parent().parent().parent(), $(this).parent().attr("commentid"), $(this).parent().prev().find("a").text())
        });
        _thisBoard.find(".commentSubmit").die().live("click",
        function() {
            submitComment($(this))
        });
        _thisBoard.find(".commentClose").die().live("click",
        function() {
            closeComment($(this))
        });
        _thisBoard.find(".favourite-btn").die().live("click",
        function() {
            if(!$.Check_Login())
				return false;
				
            var ajaxObj = $(this);
			
            var share_id = ajaxObj.attr("share_id");
			var size = ajaxObj.attr("size");
			var pid = ajaxObj.attr("pid");
			
			var query = new Object();
			query.id = share_id;

			
            var txt = ajaxObj.text();
            var newTxt, ajaxUrl, likesNum;
            if (txt == "Like") {
                newTxt = "Cancle";
                ajaxUrl = SITE_PATH+"services/service.php?m=share&a=fav";
                ajaxObj.addClass("unfavourite-btn");
                likesNum = parseInt(ajaxObj.parent().parent().find(".likeNum").text()) + 1
            } else {
                newTxt = "Like";
                ajaxUrl = SITE_PATH+"services/service.php?m=share&a=removefav";
                ajaxObj.removeClass("unfavourite-btn");
                likesNum = parseInt(ajaxObj.parent().parent().find(".likeNum").text()) - 1
            }
            $.ajax({
                type: "POST",
                url: ajaxUrl,
                dataType: "json",
                data:query,
                success: function(data) {
                    if (eval(data)) {
                        ajaxObj.html(newTxt);
                        //var _par = ajaxObj.parent().parent();
                        //ajaxObj.parent().parent().find(".likeNum").html(likesNum);
                        
                    }
                }
            })
        });
		
		
        $(window).resize(function() {
            autoLayout_album.debounceFunc(autoLayout_album.updateDiv(), 30, true)
        });
        if (autoLayout_album.loading && typeof jsonUrl == "string") {
            $(window).scroll(function() {
                autoLayout_album.onscroll(jsonUrl);
				if ($(document.documentElement).scrollTop() > 0 || $(document.body).scrollTop() > 0) {
            	$("#backtotop").show();
            	$("#backtotop").die().live("click",
            	function() {
                	$("body,html").animate({
                    	scrollTop: 0
                },
                500)
            	})
        } else {
            $("#backtotop").hide()
        }
            })
        }
        function openComment(obj, cid, userName) {
            var comThis = obj.parent().parent();
            $.Check_Login();
            var _textarea = comThis.find(".commentTextarea").eq(0);
            var _sta = true;
            if (comThis.find(".postcomment").css("display") == "block") {
                _sta = false
            }
            _textarea.keyup(function() {
                var _val = $(this).val();
                if (_val.indexOf("Reply " + $(this).attr("toName") + ":") == -1) {
                    $(this).attr("cid", 0)
                }
            });
            comThis.find(".postcomment").show();
            var _post = comThis.find(".postcomment");
            if (cid) {
                _textarea.attr("cid", cid);
                _textarea.attr("toName", userName);
                _textarea.focus().val("Reply " + userName + ":")
            } else {
                _textarea.attr("cid", 0);
                _textarea.focus()
            }
            comThis.find(".lightblue").text(comThis.find(".commentTextarea").val().length);
            if (comThis.find(".commentTextarea").val().length > 0) {
                comThis.find(".unpincomment").removeClass().addClass("commentSubmit pincomment");
            }
            var addHeight = _post.height() + 20;
            var cols = _post.offsetParent().attr("columns");
            var docTop = parseInt(_post.offsetParent().css("top"));
            if (_sta) {
                updateHeight(autoLayout_album.defaults.contentID, cols, addHeight, docTop)
            }
            var _objRea = comThis.offsetParent();
			
			$(comThis.find(".commentTextarea")).keyup(function(){
				 var comThis = $(this).parent().parent().parent().parent().parent();
				 var index = ($.trim($(this).val())).length;
					
				
            	if (index > 0) {
                	comThis.find(".unpincomment").removeClass().addClass("commentSubmit pincomment");
           		}
				else
				{
					comThis.find(".pincomment").removeClass().addClass("unpincomment");
				}
				 if(index < 141 && index != 0)
				 {
					  var _post = comThis.find(".postcomment");
					  var this_height = 0;
					  var old_height = $(this).height();
					 $('.postcomment .commentbody .submit .count em').text(index);	
					 var inBei = Math.round(index/16);
					 this_height = 28 + 16*inBei;
					
					 $(this).css('height',this_height);
					 var addHeight = this_height - old_height;
					 var docTop = parseInt(_post.offsetParent().css("top"));
					 updateHeight(autoLayout_album.defaults.contentID, cols, addHeight, docTop);
				 }
				 
			})
        }
        function submitComment(obj) {
			
            if ($(this).hasClass("unpincomment")) {
                return
            }
            $(this).removeClass().addClass("unpincomment").text("Sending");
            var _obj = obj,
            content;
            var _textObj = _obj.parent().parent().find(".commentTextarea");
			
            content = _obj.parent().parent().find(".commentTextarea").val();
            var _l = 0;
            if ($.trim(content).length == 0 || $.trim(content).length > 140) {
                alert("Please enter comment");
                return
            }
            var parentObj = _obj.parent().parent().parent().parent().parent();
            var commentObj = parentObj.find(".comentMain");
            var cid = parentObj.find("commentTextarea").attr("cid");
            var boardPicId = parentObj.parent().parent().attr("dataid");
			
			var parent_id = _obj.parent().parent().find(".commentTextarea").attr('cid');
			
			if(parent_id == 'undefined')
				parent_id = 0;
            var currHeight = 0;
			
            function filter(str) {
                str = str.replace(/&/g, "&amp;");
                str = str.replace(/</g, "&lt;");
                str = str.replace(/>/g, "&gt;");
                str = str.replace(/'/g, "&acute;");
                str = str.replace(/"/g, "&quot;");
                str = str.replace(/\|/g, "&brvbar;");
                return str
            }
			var query = new Object();
			query.share_id = boardPicId;
			query.content = content;
			query.parent_id = parent_id;
			
			$.ajax({
			url: SITE_PATH+"services/service.php?m=share&a=addcomment",
			type: "POST",
			cache:false,
			data:query,
			dataType: "json",
			success: function(data){
				var commnetJson = data.commnet;
				if(data.status == 1)
				{
					var xHtml = ['<li class="cf">', '<div class="uhead" style="width:30px;height:30px;"><a href="'+commnetJson.u_url+'"><img src="' + commnetJson.avt + '" /></a></div>', '<div class="uinfo">', '<p><a href="javascript:void(0);" class="gray">' + commnetJson.user.user_name + "</a></p>", "<p>" + filter(commnetJson.content) + "</p>", "</div>", "</li>"].join("");
                	commentObj.append(xHtml);
                	parentObj.find(".commentTextarea").val("");
                	parentObj.find(".lightblue").text(0);
                	parentObj.find(".submit a").removeClass().addClass("unpincomment").text("Submit");
                	parentObj.find(".commentNum").html(parseInt(parentObj.find(".commentNum").text()) + 1);
                	if (parentObj.find(".commentNum").parent().css("display") == "none") {
                    	parentObj.find(".commentNum").parent().show();
                    	if (parentObj.find(".commentNum").parent().prev().css("display") == "none" && parentObj.find(".commentNum").parent().next().css("display") == "none") {
                        	parentObj.find(".commentNum").prev().prev().hide();
                        	parentObj.find(".commentNum").parent().parent().show();
                        	var addHeight = 24;
                        	var cols = parentObj.offsetParent().attr("columns");
                        	var docTop = parseInt(parentObj.offsetParent().css("top"));
                        	updateHeight(autoLayout_album.defaults.contentID, cols, addHeight, docTop)
                    	}
                	}
                	var liHeight = commentObj.find("li:last-child").height() + 16;
                	var cols = parentObj.parent().parent().attr("columns");
                	var docTop = parseInt(parentObj.parent().parent().css("top"));
                	var currH = liHeight - currHeight + 1;
                	updateHeight(autoLayout_album.defaults.contentID, cols, currH, docTop);
                	if (parentObj.find(".commentTextarea").height() > 28) {
                    	var pobj = parentObj.find(".commentTextarea");
                    	var _h = pobj.height();
                    	pobj.css({
                        	height: "28px"
                    	});
                    	var _addHeight = 28 - _h;
                    	var cols = parentObj.offsetParent().attr("columns");
                    	var docTop = parseInt(parentObj.offsetParent().css("top"));
                    	updateHeight(autoLayout_album.defaults.contentID, cols, _addHeight, docTop)
                	}
				}
				else
				{
					alert(result.error);
				}
			}
		});
		
        }
        function closeComment(obj) {
            var _par = obj.parent().parent();
            var addHeight = -parseInt(_par.height() + 19);
            var cols = _par.offsetParent().attr("columns");
            var docTop = parseInt(_par.offsetParent().css("top"));
            updateHeight(autoLayout_album.defaults.contentID, cols, addHeight, docTop);
            _par.hide()
        }
        function updateHeight(objs, col, diffHeight, bTop) {
            var objDiv = autoLayout_album.getElements(objs);
            for (var i = objDiv.length; i--;) {
                var colums = $(objDiv[i]).attr("columns");
                var docTop = parseInt($(objDiv[i]).css("top"));
                if (colums == col && docTop > bTop) {
                    $(objDiv[i]).css({
                        top: docTop + diffHeight
                    })
                }
            }
            autoLayout_album.colArray[col] += diffHeight;
            document.getElementById(autoLayout_album.defaults.contentID).style.height = Math.max.apply(Math, autoLayout_album.colArray) + "px"
        }
    },
    pageNum: 3,
    autoTimer: null,
    scrollEvent: function(d) {
        if (autoLayout_album.pageNum <= 20) {
            var f = $(document).scrollTop();
            var b = document.documentElement.clientHeight;
            var a = parseInt(f + b);
			
            var c = Math.min.apply(Math, autoLayout_album.colArray);
            try{
            var e = parseInt(c + $("#" + autoLayout_album.defaults.contentID).offset().top);
            }catch(e){return;}
            
            if (a > e) {
				
                $("#imloading").show();
                if (autoLayout_album.autoTimer !== null) {
                    return
                }
                	autoLayout_album.autoTimer = setTimeout(function() {
                    autoLayout_album.init(d +"&p="+ autoLayout_album.pageNum +"&v=" +Math.random()*9999999);
                    autoLayout_album.pageNum++;
                    autoLayout_album.autoTimer = null
                },
                300)
            }
        }
    },
    onscroll: function(a) {
		
        autoLayout_album.loading = false;
			
        if (autoLayout_album.isHasNextPage) {
            autoLayout_album.scrollEvent(a)
        }
		else
		{
			$("#imloading").show();	
		}
    }
};