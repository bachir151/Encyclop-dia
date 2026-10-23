import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Exécuter le véritable vérificateur sur une copie temporaire du catalogue.
function verify(change) {
  const root = mkdtempSync(join(tmpdir(), 'encyclopedia-verifier-'));
  try {
    mkdirSync(join(root, 'outils'));
    mkdirSync(join(root, 'donnees'));
    copyFileSync(new URL('./verifier.mjs', import.meta.url), join(root, 'outils/verifier.mjs'));
    copyFileSync(new URL('../donnees/relations.json', import.meta.url), join(root, 'donnees/relations.json'));
    const concepts = JSON.parse(readFileSync(new URL('../donnees/concepts.json', import.meta.url), 'utf8'));
    for (const concept of concepts) {
      if (!concept.url) continue;
      mkdirSync(join(root, concept.url), { recursive: true });
      writeFileSync(join(root, concept.url, 'index.html'), '<!doctype html>');
    }
    change(concepts);
    writeFileSync(join(root, 'donnees/concepts.json'), JSON.stringify(concepts));
    const result = spawnSync(process.execPath, [join(root, 'outils/verifier.mjs')], { encoding: 'utf8' });
    assert.ifError(result.error);
    return result;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('le catalogue actuel reste valide', () => {
  assert.equal(verify(() => {}).status, 0);
});

for (const [name, change, message] of [
  ['position absente', c => { delete c[0].position; }, /position/],
  ['position non numérique', c => { c[0].position = [0, '1', 2]; }, /position/],
  ['titre absent', c => { delete c[0].titre; }, /titre/],
  ['couleur invalide', c => { c[0].couleur = 'rouge'; }, /couleur/],
  ['prérequis objet', c => { c[0].prerequis = {}; }, /prerequis doit être un tableau/],
  ['prérequis chaîne', c => { c[0].prerequis = 'ipv4'; }, /prerequis doit être un tableau/],
  ['article à rédiger avec URL', c => { c[0].statut = 'a_rediger'; }, /ne doit pas avoir une URL/],
  ['cycle pédagogique', c => { c.find(x => x.id === 'ipv4').prerequis = ['arp']; }, /Cycle de prérequis/],
]) {
  test(name + ' : diagnostic sans exception', () => {
    const result = verify(change);
    assert.equal(result.status, 1);
    assert.match(result.stderr, message);
    assert.doesNotMatch(result.stderr, /TypeError|ReferenceError/);
  });
}
