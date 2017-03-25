        //select、radio、checkbox组件功能实现
        var where = document.getElementById("where");
        var drink = document.getElementById("drink");
        var drink = document.getElementById("drink");
        var hotTabs = document.getElementById("hotTabs");
        var driver = document.getElementById("driver");
        var ice = document.getElementById('ice');
        var add = document.getElementById('add');
        var cup = document.getElementById("cup");
        var sugar = document.getElementById('sugar');
        var target = document.getElementById("add");
        var hotButton = document.getElementById('hotButton');
        var hotdrink = document.getElementById('hotdrink');
        var addButton = document.getElementById('addButton');
        var otherplace = document.getElementById('otherplace');
        var copyTxt = document.getElementById("forcopy");
        var otherFlag = 0;
        var submitButton = document.getElementById('submitButton');
        var randomButton = document.getElementById('randomButton');
        var drink_span = document.getElementById('drink-span');
        var num = document.getElementById('num');
        var car = document.getElementById('car');
        var cupnum = parseInt(document.getElementById('num').innerHTML); //总杯数
        var drinkId = 0;
        var drinklist = [];
        var curprice = 13;
        var totalprice = 0;
        var hotdrink_display = false;

        var price = {
            "绿妍": [13, 15],
            "红玉": [18, 20],
            "脆珠红玉": [21, 23],
            "金凤茶王": [20, 22],
            "四季春": [23, 25],
            "超级水果绿妍": [19, 21],
            "满杯红柚": [18, 20],
            "满杯红柚": [18, 20],
            "整颗爆柠绿茶": [18, 20],
            "超级鲜桔柠": [16, 18],
            "超级水果四季春": [25, 27],
            "喜芝芝庄园可可": [18, 20],
            "桂花乌龙": [18, 21],
            "樱花乌龙": [18, 21],
            "满玫金凤": [19, 22],
            "奥利奥喜芝芝可可": [21, 23],
            "喜芝芝静冈抹茶": [18, 20],
            "喜芝芝咖啡": [22, 25],
            "焦糖咖啡": [20, 23],
            "布蕾奶茶": [15, 18],
            "布蕾奥利奥奶茶": [17, 19],
            "鲜奶静冈抹茶": [14, 16],
            "斋绿妍": [7, 9],
            "斋红玉": [12, 14],
            "斋四季春": [17, 19],
            "斋金凤茶王": [14, 17]
        };

        window.onload = function () {
            // 插入 饮品选项
            var fragment = "";
            for (var key in price) {
                fragment += "<option>" + key + "</option>"
            }
            document.getElementById('drink').innerHTML = fragment;
        }

        if (!isPC()) {
            adapt("touchend");
        } else {
            adapt("click");
        }

        where.onchange = function () {
            select("where");
            var where = getSelectValue("where");
            if (where == "我不在华工南校区") {
                otherFlag = 1;
                addClass("where-div", "hide");
                //removeClass("otherplace","hide");
                removeClass("other", "hide");
            }
        }

        driver.onchange = function () {
            var text = select("driver");
            drive(text);
        }
        drink.onchange = function () {
            select("drink");
            setPrice();
        }




        //复制点单信息到粘贴板
        new Clipboard(submitButton, {
            text: function () {
                var where = getSelectValue("where").replace("我在", "");
                if (otherFlag) {
                    where = otherplace.value;
                }
                var driver = getSelectValue("driver");
                var how2pay = document.getElementById('how2pay').value;
                var isDriver = (driver == "我要开车");
                if (isDriver) {
                    var text = where + "发车！\n";
                } else {
                    var text = where + "求车！\n";
                }
                [].forEach.call(car.children, function (item) {
                    text += item.innerText.slice(0,-2);
                    text+="\n";
                });
                
                    text += "\n一共￥" + totalprice;
           
                if (isDriver && how2pay) {
                    text += "\n【支付宝账号：" + how2pay + "】";
                }
                if (car.children.length === 0) {
                    alert('(´・ω・`)客官不喝点什么吗');
                    return false;
                } else {
                    alert('o(*≧▽≦)ツ信息已经成功复制到剪切板了哦');
                }
                return text;
            }
        });


        function isPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"
            ];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }


        function adapt(event) {
            //切换冰块
            ice.addEventListener(event, function (e) {
                e.preventDefault();
                radio(e.target);
            }, false);
            //切换容量
            cup.addEventListener(event, function (e) {
                e.preventDefault();
                radio(e.target);
                setPrice();
            }, false);
            //切换甜度
            sugar.addEventListener(event, function (e) {
                e.preventDefault();
                radio(e.target);
            }, false);

            //选择加料选项
            add.addEventListener(event, function (e) {
                e.preventDefault();
                checkbox(e.target);
            }, false);

            //随机选择事件 
            randomButton.addEventListener(event, function (e) {
                e.preventDefault();
                randomSelect();
            }, false);

            //点击人气推荐按钮
            hotButton.addEventListener(event, function (e) {
                e.preventDefault();
                clickHotButton();
            }, false);

            //添加单品按钮
            addButton.addEventListener(event, function (e) {
                e.preventDefault();
                clickAddButton();
            }, false);


            //选择人气饮料按钮
            hotdrink.addEventListener(event, function (e) {
                e.preventDefault();
                if (e.target.className == "add") {
                    var drink = e.target.previousSibling.innerText || e.target.previousSibling.textContent;
                    changeSpan(drink);
                    hotdrink_display = !hotdrink_display;
                    hotdrink.style.height = hotdrink_display ? "auto" : "0";
                    setPrice();
                    return false;
                }
            }, false);

            hotTabs.addEventListener(event, function (event) {
                var e = event || window.event;
                var tab = e.target || e.srcElement;
                [].forEach.call(hotTabs.children, function (tab) {
                    tab.classList.remove('select');
                });
                tab.classList.add('select');
                var target = tab.getAttribute('href');
                var tabItems = document.getElementsByClassName('tab-item');
                [].forEach.call(tabItems, function (tabItem) {
                    tabItem.classList.remove('choosed');
                });
                document.getElementById(target).classList.add('choosed');

            });
        }


        function setPrice() {

            var drink = getSelectValue('drink');
            var cup = getRadioValue('cup');

            if (cup.indexOf("中杯") != -1) {
                curprice = price[drink][0];
            } else {
                curprice = price[drink][1];
            }
            document.getElementById("price").innerHTML = "￥" + curprice;
        }

        function setTotalPrice() {
            document.getElementById("totalprice").innerHTML = "￥" + totalprice;
        }


        function removeClass(id, classname) {
            var ele = document.getElementById(id);
            ele.className = ele.className.replace(classname, "");
        }

        function addClass(id, classname) {
            var txt = " " + classname;
            document.getElementById(id).className += txt;
        }

        function radio(target) {
            var children = target.parentNode.getElementsByTagName('a');
            if (target && target.nodeName == "A") {
                for (var i = 0, len = children.length; i < len; i++) {
                    if (children[i].className.indexOf('checked') != -1) {
                        children[i].className = "";
                        break;
                    }
                }
                target.className += "checked";
            }
        }

        function checkbox(target) {

            if (target && target.nodeName == "A") {
                if (target.className.indexOf('checked') != -1) {
                    target.className = "";
                } else {
                    target.className += "checked";
                }
            }
        }

        function drive(text) {
            if (text.indexOf("我要开车") != -1) {
                removeClass("contact", "hide");
            } else {
                addClass("contact", "hide");
            }
        }

        function getSelectValue(id) {
            var ele = document.getElementById(id);
            var index = ele.selectedIndex;
            return ele.options[index].text;
        }

        function getRadioValue(id) {
            var ele = document.getElementById(id);
            var options = ele.getElementsByTagName('a');
            for (var i = 0; i < options.length; i++) {
                if (options[i].className.indexOf("checked") != -1) {
                    return options[i].innerHTML;
                }
            }
        }

        function getCheckboxValue(id) {
            var ele = document.getElementById(id);
            var options = ele.getElementsByTagName('a');
            var arr = [];
            for (var i = 0; i < options.length; i++) {
                if (options[i].className.indexOf("checked") != -1) {
                    //配料简写
                    var txt = options[i].innerHTML.charAt(0);
                    arr.push(txt);
                }
            }
            if (arr.length !== 0) {
                arr.unshift("加");
            }
            return arr;
        }

        function select(id) {
            var ele = document.getElementById(id);
            var index = ele.selectedIndex;
            var text = ele.options[index].text;
            document.getElementById(id + "-span").innerHTML = text;
            return text;
        }

        function randomSelect() {
            if (drinklist.length === 0) {
                for (drink in price) {
                    drinklist.push(drink);
                }
            }
            var len = drinklist.length;
            var index = Math.floor(Math.random() * len);
            var drink = drinklist[index];
            changeSpan(drink);
            setPrice();
        }

        function changeSpan(txt) {
            drink_span.innerHTML = txt;
            //选中相应的option
            var options = document.getElementById('drink').options;
            for (var i = 0; i < options.length; i++) {
                if (options[i].text == txt) {
                    options[i].selected = "true";
                }
            }
        }

        function clickHotButton() {
            hotdrink_display = !hotdrink_display;
            hotdrink.style.height = hotdrink_display ? "auto" : "0";
        }

        function removeOrder(target, price, index) {
            car.removeChild(target);
            cupnum--;
            totalprice -= parseInt(price);
            setTotalPrice();
        }

        function clickAddButton() {
            var drink = getSelectValue('drink');
            var cup = getRadioValue('cup');
            var ice = getRadioValue('ice');
            var sugar = getRadioValue('sugar');
            var add = getCheckboxValue('add'); //加料数组
            //var text = "￥13 大杯波霸奶茶 常温微糖 加珍波椰";
            var isIce = drink.indexOf("*仅限冷饮*");
            if (isIce != -1 && ice == "加热") {
                alert("(´・ω・`)冷饮不可以加热噢");
                return false;
            } else if (isIce != -1) {
                drink = drink.replace("*仅限冷饮*", "");
            }
            var text = "￥" + curprice + " " + cup + drink + " " + ice + sugar + " " + add.join("");
            var htmltext = `<p id="orderDrink${drinkId}">${text}<button class="remove" onclick="removeOrder(orderDrink${drinkId},${curprice},${cupnum})">取消</button></p>`;
            document.getElementById("price").innerHTML = "￥" + curprice;
            totalprice += parseInt(curprice);
            setTotalPrice();
            cupnum++;
            drinkId++;
            num.innerHTML = cupnum;
            car.innerHTML += htmltext;
        }