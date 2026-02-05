(function() {
    var id = 'ptt-remote-v2';
    var old = document.getElementById(id);
    if (old) old.remove();

    var b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:99999;display:grid;grid-template-columns:repeat(3,65px);gap:6px;background:rgba(0,0,0,0.6);padding:8px;border-radius:12px;backdrop-filter:blur(4px);user-select:none;-webkit-user-select:none;touch-action:none;';

    // 定義按鍵
    var keys = [
        { t: 'PgUp', k: 33, c: 'PageUp' },
        { t: '↑', k: 38, c: 'ArrowUp' },
        { t: 'PgDn', k: 34, c: 'PageDown' },
        { t: '←', k: 37, c: 'ArrowLeft' },
        { t: 'OK', k: 13, c: 'Enter' },
        { t: '→', k: 39, c: 'ArrowRight' },
        { t: 'End', k: 35, c: 'End' },
        { t: '↓', k: 40, c: 'ArrowDown' },
        { t: '離開(q)', k: 81, c: 'KeyQ', key: 'q' }
    ];

    // 發送單一按鍵
    function send(k, c, keyChar) {
        var target = document.querySelector('#t') || document.body;
        target.focus();
        var opts = { bubbles: true, cancelable: true, keyCode: k, which: k, key: keyChar || c, code: c };
        target.dispatchEvent(new KeyboardEvent('keydown', opts));
        target.dispatchEvent(new KeyboardEvent('keypress', opts));
        target.dispatchEvent(new KeyboardEvent('keyup', opts));
    }

    // 自動輸入字串函式
    async function sendString(str) {
        if(!str) return;
        for (var i = 0; i < str.length; i++) {
            var char = str[i];
            var code = char.toUpperCase().charCodeAt(0);
            send(code, 'Key' + char.toUpperCase(), char);
            await new Promise(r => setTimeout(r, 50)); // 稍微延遲避免掉字
        }
    }

    // 執行登入巨集
    async function doLogin() {
        if (!window.MY_PTT_ID || !window.MY_PTT_PASS) {
            alert('請先在書籤中設定帳號密碼！');
            return;
        }
        // 輸入帳號
        await sendString(window.MY_PTT_ID);
        send(13, 'Enter'); // Enter
        await new Promise(r => setTimeout(r, 800)); // 等待密碼欄位出現

        // 輸入密碼
        await sendString(window.MY_PTT_PASS);
        send(13, 'Enter'); // Enter
        
        // 幫你多按一個 Enter (處理資訊頁)
        await new Promise(r => setTimeout(r, 1000));
        // 注意：這裡不自動處理「刪除重複連線」，因為太危險，如果不小心選錯會很麻煩，留給手動按 Y
    }

    // 產生「一鍵登入」按鈕 (放在最上面)
    var loginBtn = document.createElement('div');
    loginBtn.innerText = '⚡ 一鍵登入';
    loginBtn.style.cssText = 'grid-column:1/-1;display:flex;align-items:center;justify-content:center;height:40px;font-size:16px;font-weight:bold;background:#28a745;border:1px solid #1e7e34;border-radius:8px;color:#fff;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;margin-bottom:5px;';
    loginBtn.onclick = function() { doLogin(); };
    b.appendChild(loginBtn);

    // 產生方向鍵
    keys.forEach(function(d) {
        var btn = document.createElement('div');
        btn.innerText = d.t;
        btn.style.cssText = 'display:flex;align-items:center;justify-content:center;height:50px;font-size:16px;font-weight:bold;background:rgba(255,255,255,0.95);border:1px solid #999;border-radius:8px;color:#000;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;';
        
        var trigger = function(e) {
            e.preventDefault();
            send(d.k, d.c, d.key);
            // 視覺回饋
            btn.style.background = '#ccc';
            setTimeout(()=> btn.style.background = 'rgba(255,255,255,0.95)', 100);
        };

        btn.addEventListener('touchstart', trigger, { passive: false });
        btn.addEventListener('mousedown', trigger, { passive: false });
        b.appendChild(btn);
    });

    // 關閉按鈕
    var x = document.createElement('div');
    x.innerHTML = '❌ 關閉';
    x.style.cssText = 'grid-column:1/-1;text-align:center;color:#fff;font-weight:bold;padding:5px;background:rgba(200,50,50,0.8);border-radius:5px;cursor:pointer;margin-top:5px;';
    x.onclick = function() { b.remove(); };
    b.appendChild(x);

    document.body.appendChild(b);
})();
