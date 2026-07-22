import test from"node:test";import assert from"node:assert/strict";import{DEFAULT_THEME_COLOR,normalizeThemeColor}from"../functions/_lib/theme.js";
test("normaliza colores hexadecimales globales",()=>{assert.equal(normalizeThemeColor(" #7A205F "),"#7a205f");assert.equal(normalizeThemeColor(DEFAULT_THEME_COLOR),DEFAULT_THEME_COLOR);});
test("rechaza colores globales inválidos",()=>{assert.equal(normalizeThemeColor("red"),null);assert.equal(normalizeThemeColor("#123"),null);assert.equal(normalizeThemeColor(null),null);});
