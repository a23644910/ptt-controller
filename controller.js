(function() {
    var id = 'ptt-smart-controller';
    var old = document.getElementById(id);
    if (old) old.remove();

    /* --- 1. 智慧帳號管理 --- */
    function getCredentials() {
        var uid = localStorage.getItem('ptt_uid');
        var pwd = localStorage.getItem('ptt_pwd');
        
        if (!uid || !pwd) {
            var inputUid = prompt("【初次設定】請輸入 PTT 帳號：");
            if(!inputUid) return null;
            var inputPwd = prompt("【初次設定】請輸入 PTT 密碼：");
            if(!inputPwd) return null;
            
            localStorage.setItem('ptt_uid', inputUid);
            localStorage.setItem('ptt_pwd', inputPwd);
            alert("設定完成！帳密已儲存在此瀏覽器，下次會自動帶入。");
            return { uid: inputUid, pwd: inputPwd };
        }
        return { uid: uid, pwd: pwd };
    }

    function clearCredentials() {
        if(confirm('確定要清除儲存的帳號密碼嗎？')) {
            localStorage.removeItem('ptt_uid');
            localStorage.removeItem('ptt_pwd');
            alert('已清除，請重新點擊「登入」進行設定。');
        }
    }
    /* ---------------------- */

    var b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:999999;display:grid;grid-template-columns:repeat(3,60px);gap:6px;background:rgba(0,0,0,0.6);padding:8px;border-radius:12px;backdrop-filter:blur(4px);user-select:none;-webkit-user-select:none;touch-action:none;font-family:sans-serif;';

    /* 打字核心 */
    function sendKey(code, key, type) {
        var target = document.querySelector('#t') || document.body;
        if(target) target.focus();
        var opts = { bubbles:true, cancelable:true, keyCode:code, which:code, key:key };
        target.dispatchEvent(new KeyboardEvent('keydown', opts));
        if(type !== 'special') target.dispatchEvent(new KeyboardEvent('keypress', opts));
        target.dispatchEvent(new KeyboardEvent('keyup', opts));
    }

    async function typeString(str) {
        var status = document.getElementById('ptt-status-text');
        if(status) status.innerText = '輸入中...';
        var target = document.querySelector('#t') || document.body;
        target.focus();
        for(var i=0; i<str.length; i++) {
            sendKey(str[i].charCodeAt(0), str[i], 'char');
            await new Promise(r => setTimeout(r, 80));
        }
        if(status) status.innerText = '';
    }

    async function doLogin() {
        var creds = getCredentials();
        if (!creds) return; // 使用者取消
        
        await typeString(creds.uid);
        sendKey(13, 'Enter', 'special');
        await new Promise(r => setTimeout(r, 1000));
        await typeString(creds.pwd);
        sendKey(13, 'Enter', 'special');
    }

    /* 介面按鈕 */
    var keys = [
        {t:'PgUp',k:33,s:'s'}, {t:'↑',k:38,s:'s'}, {t:'PgDn',k:34,s:'s'},
        {t:'←',k:37,s:'s'}, {t:'OK',k:13,s:'s'}, {t:'→',k:39,s:'s'},
        {t:'End',k:35,s:'s'}, {t:'↓',k:40,s:'s'}, {t:'離開(q)',k:81,key:'q'}
    ];

    /* 登入按鈕 */
    var loginBtn = document.createElement('div');
    loginBtn.innerHTML = '⚡ 登入 <span id="ptt-status-text" style="font-size:10px;font-weight:normal"></span>';
    loginBtn.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;justify-content:center;height:40px;font-size:15px;color:#fff;background:#28a745;border-radius:8px;margin-bottom:5px;cursor:pointer;font-weight:bold;';
    loginBtn.onclick = function(e) { e.preventDefault(); doLogin(); };
    b.appendChild(loginBtn);

    /* 清除設定按鈕 (小小的放在左下角) */
    var resetBtn = document.createElement('div');
    resetBtn.innerHTML = '⚙️';
    resetBtn.style.cssText = 'grid-column:1;font-size:12px;color:#ccc;text-align:center;padding-top:5px;cursor:pointer;';
    resetBtn.onclick = clearCredentials;
    
    /* 關閉鈕 */
    var x = document.createElement('div');
    x.innerHTML = '❌';
    x.style.cssText = 'grid-column:3;text-align:center;color:#fff;padding-top:5px;cursor:pointer;';
    x.onclick = function(){ b.remove(); };
    
    // 把功能鍵加到最後
    // 這裡我們需要把 keys 渲染完再加 footer
    keys.forEach(function(d){
        var btn=document.createElement('div');
        btn.innerText=d.t;
        btn.style.cssText='display:flex;align-items:center;justify-content:center;height:45px;font-size:16px;font-weight:bold;background:rgba(255,255,255,0.95);border-radius:8px;color:#000;cursor:pointer;';
        var press = function(e){ e.preventDefault(); sendKey(d.k, d.key||d.t, d.s); };
        btn.addEventListener('touchstart', press, {passive:false});
        btn.addEventListener('mousedown', press, {passive:false});
        b.appendChild(btn);
    });
    
    b.appendChild(resetBtn);
    var spacer = document.createElement('div'); b.appendChild(spacer); // 佔位
    b.appendChild(x);

    document.body.appendChild(b);
})();
