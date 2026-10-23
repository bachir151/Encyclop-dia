/** Simulation didactique : ce code ne pilote aucun service réel. */
(() => {
  const root = document.querySelector('[data-service-lab]');
  if (!root) return;
  const runningEl = root.querySelector('[data-running]');
  const enabledEl = root.querySelector('[data-enabled]');
  const commandEl = root.querySelector('[data-command]');
  const explanationEl = root.querySelector('[data-explanation]');
  const logEl = root.querySelector('[data-log]');
  let running = false;
  let enabled = false;
  let history = [];
  const commands = {
    start: ['sudo systemctl start demo', 'systemd reçoit une demande de démarrage immédiat.'],
    stop: ['sudo systemctl stop demo', 'systemd reçoit une demande d’arrêt immédiat.'],
    restart: ['sudo systemctl restart demo', 'systemd redémarre le service maintenant.'],
    enable: ['sudo systemctl enable demo', 'L’activation pour les prochains démarrages change ; le processus actuel ne change pas.'],
    disable: ['sudo systemctl disable demo', 'L’activation automatique est retirée ; le processus actuel ne change pas.'],
    'enable-now': ['sudo systemctl enable --now demo', 'Le service est configuré pour les futurs démarrages ET lancé maintenant.'],
    reboot: ['(redémarrage simulé de Linux)', 'Au redémarrage, systemd démarre les services activés. Dans ce modèle, le service suit donc la valeur « au démarrage ».'],
    reset: ['(remise à zéro de la simulation)', 'Retour à l’état initial.']
  };
  function render(command, explanation) {
    runningEl.textContent = running ? 'En cours' : 'Arrêté';
    enabledEl.textContent = enabled ? 'Activé' : 'Désactivé';
    runningEl.dataset.state = running ? 'on' : 'off';
    enabledEl.dataset.state = enabled ? 'on' : 'off';
    commandEl.textContent = command;
    explanationEl.textContent = explanation;
    logEl.replaceChildren(...history.map(item => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
  }
  root.querySelectorAll('[data-service-action]').forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.serviceAction;
      if (action === 'start' || action === 'restart') running = true;
      if (action === 'stop') running = false;
      if (action === 'enable' || action === 'enable-now') enabled = true;
      if (action === 'enable-now') running = true;
      if (action === 'disable') enabled = false;
      if (action === 'reboot') running = enabled;
      if (action === 'reset') { running = false; enabled = false; history = []; }
      const [command, explanation] = commands[action];
      history.unshift(command + ' → ' + (running ? 'en cours' : 'arrêté') + ', ' + (enabled ? 'activé' : 'désactivé'));
      history = history.slice(0, 6);
      render(command, explanation);
    });
  });
  render('aucune', 'État initial : service arrêté et non activé au démarrage.');
})();
