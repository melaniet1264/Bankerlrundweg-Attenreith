const STATION = 1;
const CORRECT_ANSWER = 'A';
const SECRET_NUMBER = '5';
let selected = null;

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function getJSON(key, fallback = {}) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}

function renderPass() {
  const pass = getJSON('bankerlPass', {});
  const box = $('#passport');
  if (!box) return;
  box.innerHTML = '';
  for (let i = 1; i <= 7; i++) {
    const el = document.createElement('div');
    const v = pass[i];
    el.className = 'pass-slot' + (v ? ' collected' : '');
    el.innerHTML = `<span>${i}</span><strong>${v || '–'}</strong>`;
    box.appendChild(el);
  }
  $('#passCount').textContent = Object.keys(pass).filter(k => pass[k]).length;
}

function selectAnswer(btn) {
  selected = btn.dataset.answer;
  $$('.answers button').forEach(b => b.classList.toggle('selected', b === btn));
  $('#saveAnswer').disabled = false;
  $('#feedback').textContent = '';
}

function checkAnswer() {
  if (!selected) return;
  const feedback = $('#feedback');
  if (selected === CORRECT_ANSWER) {
    const answers = getJSON('bankerlAnswers', {});
    answers[STATION] = { answer: selected, correct: true };
    localStorage.setItem('bankerlAnswers', JSON.stringify(answers));

    const pass = getJSON('bankerlPass', {});
    pass[STATION] = SECRET_NUMBER;
    localStorage.setItem('bankerlPass', JSON.stringify(pass));
    renderPass();

    feedback.textContent = '';
    $('#savedAnswer').classList.remove('hidden');
    $('#savedAnswer').hidden = false;
    $('#nextStation')?.classList.remove('hidden');
    if ($('#nextStation')) $('#nextStation').hidden = false;
    $('#saveAnswer').disabled = true;
    $$('.answers button').forEach(b => b.disabled = true);
    $('#savedAnswer').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } else {
    feedback.textContent = 'Leider nicht ganz richtig. Versuch es noch einmal! 🙂';
    $('#savedAnswer').classList.add('hidden');
    $('#savedAnswer').hidden = true;
    $('#nextStation')?.classList.add('hidden');
    if ($('#nextStation')) $('#nextStation').hidden = true;
  }
}

function resetInteractionView() {
  // Success and next-station content stay hidden on every fresh page load.
  // The pass may retain numbers earned previously, but this success message
  // appears only after the visitor presses "Antwort prüfen" in this session.
  $('#savedAnswer').classList.add('hidden');
  $('#savedAnswer').hidden = true;
  if ($('#nextStation')) {
    $('#nextStation').classList.add('hidden');
    $('#nextStation').hidden = true;
  }
}


$$('.answers button').forEach(b => b.addEventListener('click', () => selectAnswer(b)));
$('#saveAnswer')?.addEventListener('click', checkAnswer);
renderPass();
resetInteractionView();
