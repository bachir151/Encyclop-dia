#!/usr/bin/env node
/**
 * Encyclopédia v0.3 — contrôle des données et des pages statiques.
 * Utilisation : node outils/verifier.mjs
 */
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const allowedTypes = new Set(['utilise', 'application', 'analogie', 'contraste', 'exemple']);
const allowedStatuses = new Set(['a_rediger', 'demonstration', 'publie']);
const fail = message => errors.push(message);
const prerequisites = concept => Array.isArray(concept?.prerequis) ? concept.prerequis : [];
function readJson(name) {
  try {
    const value = JSON.parse(readFileSync(resolve(root, 'donnees', name), 'utf8'));
    if (!Array.isArray(value)) fail(name + ' doit contenir un tableau.');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    fail('Lecture de ' + name + ' impossible : ' + error.message);
    return [];
  }
}

const concepts = readJson('concepts.json');
const relations = readJson('relations.json');
const ids = new Map();

for (const [index, concept] of concepts.entries()) {
  const at = 'concepts[' + index + ']';
  if (!concept || typeof concept !== 'object') { fail(at + ' invalide.'); continue; }
  const id = concept.id;
  if (typeof id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(at + ' : ID invalide.');
    continue;
  }
  if (ids.has(id)) fail('ID dupliqué : ' + id);
  ids.set(id, concept);
  if (!allowedStatuses.has(concept.statut)) fail(id + ' : statut inconnu ' + String(concept.statut));
  for (const field of ['titre', 'categorie', 'resume']) {
    if (typeof concept[field] !== 'string' || !concept[field].trim()) fail(id + ' : ' + field + ' doit être un texte non vide.');
  }
  if (!Array.isArray(concept.position) || concept.position.length !== 3 || !concept.position.every(Number.isFinite)) {
    fail(id + ' : position doit contenir trois nombres finis.');
  }
  if (typeof concept.couleur !== 'string' || !/^#[0-9a-f]{6}$/i.test(concept.couleur)) fail(id + ' : couleur hexadécimale invalide.');
  if (concept.statut === 'a_rediger' && concept.url != null) fail(id + ' : un article à rédiger ne doit pas avoir une URL.');
  if (!Array.isArray(concept.prerequis)) fail(id + ' : prerequis doit être un tableau.');
  if (concept.url !== null && concept.url !== undefined) {
    if (typeof concept.url !== 'string' || !concept.url.trim() || concept.url.startsWith('/') ||
      concept.url.includes('\\') || concept.url.split('/').includes('..') ||
      /^(?:[a-z]+:|\/\/)/i.test(concept.url)) {
      fail(id + ' : URL non locale ou invalide.');
    } else {
      const file = resolve(root, concept.url, 'index.html');
      if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile()) {
        fail(id + ' : page absente pour ' + concept.url + 'index.html');
      }
    }
  }
  if (concept.statut === 'publie' && !concept.url) fail(id + ' : un article publié doit avoir une URL.');
}

for (const [id, concept] of ids) {
  for (const prerequisite of prerequisites(concept)) {
    if (!ids.has(prerequisite)) fail(id + ' : prérequis inexistant ' + String(prerequisite));
    if (prerequisite === id) fail(id + ' : prérequis réflexif.');
  }
}

const colors = new Map();
function visit(id, stack) {
  const color = colors.get(id) || 0;
  if (color === 2) return;
  if (color === 1) {
    fail('Cycle de prérequis : ' + [...stack, id].join(' → '));
    return;
  }
  colors.set(id, 1);
  for (const prerequisite of prerequisites(ids.get(id))) {
    if (ids.has(prerequisite)) visit(prerequisite, [...stack, id]);
  }
  colors.set(id, 2);
}
for (const id of ids.keys()) visit(id, []);

const relationKeys = new Set();
for (const [index, relation] of relations.entries()) {
  const at = 'relations[' + index + ']';
  if (!relation || typeof relation !== 'object') { fail(at + ' invalide.'); continue; }
  if (!ids.has(relation.source) || !ids.has(relation.cible)) {
    fail(at + ' : concept source ou cible inexistant.');
  }
  if (!allowedTypes.has(relation.type)) fail(at + ' : type inconnu ' + String(relation.type));
  if (typeof relation.explication !== 'string' || !relation.explication.trim()) fail(at + ' : explication manquante.');
  if (relation.source === relation.cible) fail(at + ' : auto-relation.');
  const key = [relation.source, relation.cible, relation.type].join('/');
  if (relationKeys.has(key)) fail(at + ' : relation dupliquée ' + key);
  relationKeys.add(key);
}

if (errors.length) {
  console.error('❌ Encyclopédia : ' + errors.length + ' erreur(s) de cohérence :');
  for (const error of errors) console.error(' - ' + error);
  process.exitCode = 1;
} else {
  console.log('✅ Encyclopédia : ' + concepts.length + ' concepts, ' + relations.length + ' relations.');
  console.log('   Champs des concepts, statuts, prérequis, cycles, relations et existence des pages : OK.');
}
