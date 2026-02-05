(function() {
    /* 避免重複載入 */
    var id = 'ptt-web-controller';
    var old = document.getElementById(id);
    if (old) old.remove();

    /* 建立介面容器 */
    var b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:999999;display:grid;grid-template-columns:repeat(3,60px);gap:6px;background:rgba(0,0,0,0.6);padding:8px;border-radius:12px;backdrop-filter:blur(4px);user-select:none;-webkit-user-select:none;touch-action:none;font-family:sans-serif;';

    /* 核心輸入函式 */
    function sendKey(code, key, type) {
        var target = document.querySelector('#t') || document.body;
        if(target) target.focus();
        
        var opts = { bubbles:true, cancelable:true, keyCode:code, which:code, key:key };
        target.dispatchEvent(new KeyboardEvent('keydown', opts));
        if(type !== 'special') target.dispatchEvent(new KeyboardEvent('keypress', opts));
        target.dispatchEvent(new KeyboardEvent('keyup', opts));
    }

    /* 自動打字函式 */
    async function typeString(str) {
        var status = document.getElementById('ptt-status-text');
        if(status) status.innerText = '輸入中...';
        
        var target = document.querySelector('#t') || document.body;
        target.focus();

        for(var i=0; i<str.length; i++) {
            var char = str[i];
            sendKey(char.charCodeAt(0), char, 'char');
            await new Promise(r => setTimeout(r, 80)); /* 稍微延遲避免掉字 */
        }
        if(status) status.innerText = '';
    }

    /* 執行登入邏輯 */
    async function doLogin() {
        if (!window.MY_PTT_ID || !window.MY_PTT_PASS) {
            alert('錯誤：書籤中未設定帳號密碼！');
            return;
        }
        
        await typeString(window.MY_PTT_ID);
        sendKey(13, 'Enter', 'special'); 
        
        await new Promise(r => setTimeout(r, 1000)); /* 等待密碼欄位 */
        
        await typeString(window.MY_PTT_PASS);
        sendKey(13, 'Enter', 'special');
    }

    /* 按鈕定義 */
    var keys = [
        {t:'PgUp',k:33,s:'s'}, {t:'↑',k:38,s:'s'}, {t:'PgDn',k:34,s:'s'},
        {t:'←',k:37,s:'s'}, {t:'OK',k:13,s:'s'}, {t:'→',k:39,s:'s'},
        {t:'End',k:35,s:'s'}, {t:'↓',k:40,s:'s'}, {t:'離開(q)',k:81,key:'q'}
    ];

    /* 產生登入按鈕 */
    var loginBtn = document.createElement('div');
    loginBtn.innerHTML = '⚡ 登入 <span id="ptt-status-text" style="font-size:10px;font-weight:normal"></span>';
    loginBtn.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;justify-content:center;height:40px;font-size:15px;color:#fff;background:#28a745;border-radius:8px;margin-bottom:5px;cursor:pointer;font-weight:bold;';
    loginBtn.onclick = function(e) { e.preventDefault(); doLogin(); };
    b.appendChild(loginBtn);

    /* 產生方向鍵 */
    keys.forEach(function(d){
        var btn=document.createElement('div');
        btn.innerText=d.t;
        btn.style.cssText='display:flex;align-items:center;justify-content:center;height:45px;font-size:16px;font-weight:bold;background:rgba(255,255,255,0.95);border-radius:8px;color:#000;cursor:pointer;';
        
        var press = function(e){
            e.preventDefault();
            sendKey(d.k, d.key||d.t, d.s);
            btn.style.background='#ccc';
            setTimeout(function(){btn.style.background='rgba(255,255,255,0.95)'}, 100);
        };
        btn.addEventListener('touchstart', press, {passive:false});
        btn.addEventListener('mousedown', press, {passive:false});
        b.appendChild(btn);
    });

    /* 關閉鈕 */
    var x=document.createElement('div');
    x.innerHTML='❌';
    x.style.cssText='grid-column:1/-1;text-align:center;color:#fff;padding:2px;background:rgba(255,50,50,0.8);border-radius:5px;margin-top:2px;cursor:pointer;font-size:12px;';
    x.onclick=function(){b.remove();};
    b.appendChild(x);

    document.body.appendChild(b);
})();
