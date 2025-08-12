
/* ---------- Final RPS Game with Reset High Score ---------- */
(function(){
    const Maindict = {"r":1,"p":2,"s":0};
    const Reversedict = {1:"Rock",2:"Paper",0:"Scissors"};
    const moves = {"r":"Rock","p":"Paper","s":"Scissors"};

    // DOM
    const roundNumEl = document.getElementById('roundNum');
    const scoreEl = document.getElementById('score');
    const streakEl = document.getElementById('streak');
    const statusEl = document.getElementById('lastResult');
    const highscoreEl = document.getElementById('highscore');
    const moveControls = document.getElementById('moveControls');
    const newGameBtn = document.getElementById('newGameBtn');
    const quitBtn = document.getElementById('quitBtn');
    const resetHighBtn = document.getElementById('resetHighBtn');

    // state
    let round = 0, score = 0, streak = 0, running = false;
    const MAX_ROUNDS = 10;
    const STORAGE_KEY = 'tawhid_rps_highscore';
    let highscore = loadHighscore();
    highscoreEl.textContent = highscore;

    // helpers
    function randComputer(){ return [0,1,2][Math.floor(Math.random()*3)]; }
    function loadHighscore(){ try{ const v = localStorage.getItem(STORAGE_KEY); return v ? parseInt(v,10) : 0; }catch(e){ return 0; } }
    function saveHighscore(val){ try{ localStorage.setItem(STORAGE_KEY, String(val)); }catch(e){} }
    function clearHighscore(){ try{ localStorage.removeItem(STORAGE_KEY); }catch(e){} }
    function updateUI(){
        roundNumEl.textContent = `${Math.min(round, MAX_ROUNDS)} / ${MAX_ROUNDS}`;
        scoreEl.textContent = score;
        streakEl.textContent = streak;
        highscoreEl.textContent = highscore;
    }

    function resetState(){
        round = 0; score = 0; streak = 0; running = false;
        updateUI();
        statusEl.innerHTML = 'Press "New Game" or click any move to start.';
    }

    function startGame(){
        round = 0; score = 0; streak = 0; running = true;
        statusEl.innerHTML = 'Game started — Play 10 rounds by choosing Rock / Paper / Scissors.';
        updateUI();
    }

    function endGame(){
        running = false;
        let msg = `<strong>Game Over!</strong> Final Score: ${score}.`;
        if(score > highscore){
            highscore = score;
            saveHighscore(highscore);
            msg += ` <br>🎉 New High Score: ${highscore}!`;
        } else {
            msg += ` <br>High Score: ${highscore}.`;
        }
        statusEl.innerHTML = msg;
        updateUI();
    }

    function flashButton(el, type){
        if(!el) return;
        if(type==='win'){ el.classList.add('clicked'); setTimeout(()=>el.classList.remove('clicked'),360); }
        else if(type==='lose'){ el.classList.add('clicked'); setTimeout(()=>el.classList.remove('clicked'),360); }
    }

    function handleMove(userChar){
        if(!running){
            startGame();
        }
        if(!running) return;
        if(round >= MAX_ROUNDS){
            endGame();
            return;
        }

        const user = Maindict[userChar];
        const computer = randComputer();

        let roundResultText = '';
        if(user === computer){
            streak = 0;
            roundResultText = "It's a draw!";
            // small visual nudge on draw
            document.querySelectorAll('.card').forEach(c=>{ c.style.transform='translateY(-3px)'; setTimeout(()=>c.style.transform='translateY(0)',180); });
        } else if (
            (user === 1 && computer === 0) ||
            (user === 2 && computer === 1) ||
            (user === 0 && computer === 2)
        ){
            // win
            score += 10;
            streak += 1;
            roundResultText = "You Win!";
            if(streak === 5){
                score += 10;
                roundResultText += " 🔥 Win Streak Bonus +10!";
                streak = 0;
            }
            const btn = document.querySelector(`[data-move="${userChar}"]`);
            flashButton(btn,'win');
        } else {
            // lose
            score -= 5;
            streak = 0;
            roundResultText = "You Lose!";
            const btn = document.querySelector(`[data-move="${userChar}"]`);
            flashButton(btn,'lose');
        }

        round += 1;

        // show round result
        statusEl.innerHTML = `
            <div class="round-title">Round ${round} / ${MAX_ROUNDS}</div>
            <div>You chose: <strong>${moves[userChar]}</strong></div>
            <div>Computer chose: <strong>${Reversedict[computer]}</strong></div>
            <div style="margin-top:8px"><strong>${roundResultText}</strong></div>
            <div style="margin-top:8px" class="small">Score: ${score} &nbsp; | &nbsp; Win Streak: ${streak}</div>
        `;

        updateUI();

        if(round >= MAX_ROUNDS){
            setTimeout(endGame, 420);
        }
    }

    // attach events
    moveControls.addEventListener('click', function(e){
        const btn = e.target.closest('button');
        if(!btn) return;
        const m = btn.getAttribute('data-move');
        if(!m) return;
        if(!running && round >= MAX_ROUNDS){
            statusEl.innerHTML = 'Game finished. Press "New Game" to play again.';
            return;
        }
        handleMove(m);
    });

    newGameBtn.addEventListener('click', function(){ startGame(); });
    quitBtn.addEventListener('click', function(){ running=false; statusEl.innerHTML='Game Quit. Press \"New Game\" to play again.'; });

    // Reset High Score button behavior
    resetHighBtn.addEventListener('click', function(){
        if(confirm('Are you sure you want to reset the High Score to 0?')){
            clearHighscore();
            highscore = 0;
            highscoreEl.textContent = highscore;
            alert('High Score has been reset to 0.');
        }
    });

    // small helper: search placeholder action
    window.search = function(){
        const val = document.getElementById('searchInput').value.trim();
        if(!val) { alert('Please enter a search term.'); return; }
        alert('Searching for: ' + val);
    }

    // init
    resetState();
})();


  // Disable Right Click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    alert("🚫 Right click is disabled!");
  });

  // Disable Inspect & View Source
  document.onkeydown = function(e) {
    if (e.keyCode == 123) return false; // F12
    if (e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74)) return false; // Ctrl+Shift+I/J
    if (e.ctrlKey && e.keyCode == 85) return false; // Ctrl+U
    if (e.ctrlKey && e.shiftKey && e.keyCode == 67) return false; // Ctrl+Shift+C
  };

  // Extra: Block DevTools Detection
  (function() {
    var element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        alert("🚫 Developer tools are disabled!");
        window.location.reload();
      }
    });
    console.log(element);
  })();