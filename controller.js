(function() {
    // 避免重複載入
    var id = 'ptt-remote-v2';
    var old = document.getElementById(id);
    if (old) old.remove();

    // 建立主容器
    var b = document.createElement('div');
    b.id = id;
    b.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:99999;display:grid;grid-template-columns:repeat(3,65px);gap:6px;background:rgba(0,0,0,0.5);padding:8px;border-radius:12px;backdrop-filter:blur(4px);user-select:none;-webkit-user-select:none;touch-action:none;';

    // 按鍵定義
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

    // 發送按鍵訊號函式
    function send(k, c, keyChar) {
        var target = document.querySelector('#t') || document.body;
        target.focus();
        var opts = {
            bubbles: true,
            cancelable: true,
            keyCode: k,
            which: k,
            key: keyChar || c,
            code: c,
            view: window
        };
        target.dispatchEvent(new KeyboardEvent('keydown', opts));
        target.dispatchEvent(new KeyboardEvent('keypress', opts)); // PTT term sometimes needs this
        target.dispatchEvent(new KeyboardEvent('keyup', opts));
    }

    // 產生按鈕
    keys.forEach(function(d) {
        var btn = document.createElement('div');
        btn.innerText = d.t;
        btn.style.cssText = 'display:flex;align-items:center;justify-content:center;height:50px;font-size:16px;font-weight:bold;background:rgba(255,255,255,0.95);border:1px solid #999;border-radius:8px;color:#000;box-shadow:0 2px 4px rgba(0,0,0,0.3);cursor:pointer;';
        
        // 觸控事件處理
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            send(d.k, d.c, d.key);
            btn.style.background = '#ccc';
        }, { passive: false });
        
        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            btn.style.background = 'rgba(255,255,255,0.95)';
        }, { passive: false });
        
        // 滑鼠相容
        btn.addEventListener('mousedown', function(e) {
            e.preventDefault();
            send(d.k, d.c, d.key);
        }, { passive: false });

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
