/**
 * Encyclopédia — composants pédagogiques sans dépendances.
 * Un seul fichier pour tous les articles statiques.
 * Convention: [data-stepper] et form[data-quiz].
 */
function initializeStepper(root) {
  const panels = [...root.querySelectorAll('[data-step-panel]')];
  const captions = [...root.querySelectorAll('[data-step-captions] li')].map(el => el.textContent.trim());
  const caption = root.querySelector('[data-step-caption]');
  const status = root.querySelector('[data-step-status]');
  const back = root.querySelector('[data-step-back]');
  const next = root.querySelector('[data-step-next]');
  const count = captions.length;
  if (!count || !caption || !status || !back || !next) {
    console.warn('Encyclopédia: simulateur incomplet', root);
    return;
  }
  let step = 0;
  function render() {
    panels.forEach(panel => {
      const min = Number(panel.dataset.stepMin ?? 0);
      const max = Number(panel.dataset.stepMax ?? min);
      panel.toggleAttribute('hidden', !(step >= min && step <= max));
    });
    caption.textContent = captions[step];
    status.textContent = `Étape ${step + 1} sur ${count} : ${captions[step]}`;
    back.disabled = step === 0;
    next.textContent = step === count - 1 ? 'Recommencer ↻' : 'Suivant →';
  }
  back.addEventListener('click', () => { step = Math.max(0, step - 1); render(); });
  next.addEventListener('click', () => { step = (step + 1) % count; render(); });
  render();
}

function initializeQuiz(form) {
  const groups = [...form.querySelectorAll('fieldset[data-answer]')];
  const result = form.querySelector('[data-quiz-result]');
  if (!groups.length || !result) {
    console.warn('Encyclopédia: QCM incomplet', form);
    return;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    let correct = 0;
    const details = document.createElement('ol');
    groups.forEach((group, i) => {
      const answer = group.dataset.answer;
      const picked = group.querySelector('input[type="radio"]:checked')?.value;
      const ok = picked === answer;
      correct += Number(ok);
      group.dataset.result = ok ? 'correct' : 'incorrect';
      const detail = document.createElement('li');
      detail.textContent = (ok ? 'Bonne réponse. ' : 'À revoir. ') + (group.dataset.explanation || 'Consulte la leçon pour revoir cette notion.');
      details.append(detail);
    });
    result.replaceChildren();
    const title = document.createElement('strong');
    title.textContent = `Résultat : ${correct}/${groups.length}`;
    result.append(title, details);
    result.hidden = false;
    result.setAttribute('tabindex', '-1');
    result.focus({preventScroll:true});
    result.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',block:'nearest'});
  });
  form.addEventListener('change', event => {
    const group = event.target.closest('fieldset[data-answer]');
    if (group) delete group.dataset.result;
  });
}

document.querySelectorAll('[data-stepper]').forEach(initializeStepper);
document.querySelectorAll('form[data-quiz]').forEach(initializeQuiz);
