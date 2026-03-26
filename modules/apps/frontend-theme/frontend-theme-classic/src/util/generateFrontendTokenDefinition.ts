/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'fs';
import path from 'path';
import scss from 'postcss-scss';
import * as sass from 'sass';
import tinycolor from 'tinycolor2';
import {fileURLToPath} from 'url';

interface TokenDefinition {
	fullId: string;
	defaultValue: string;
	category: string;
	set: string;
	tokenId: string;
	tokenLabel: string;
	[key: string]: any;
}

interface VarPair {
	sass: string;
	css: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_MAP: Record<string, {category: string; setLabel?: string}> = {
	'body-': {category: 'general', setLabel: 'body'},
	'border-': {category: 'general', setLabel: 'borders'},
	'box-shadow-': {category: 'general', setLabel: 'box-shadows'},
	'brand-': {category: 'colorSystem', setLabel: 'brand-colors'},
	'btn-': {category: 'buttons'},
	'danger': {category: 'colorSystem', setLabel: 'theme-colors'},
	'dark': {category: 'colorSystem', setLabel: 'theme-colors'},
	'display-': {category: 'typography', setLabel: 'displays'},
	'font-': {category: 'typography', setLabel: 'font-family'},
	'gray-': {category: 'colorSystem', setLabel: 'grays'},
	'gray-dark': {category: 'colorSystem', setLabel: 'theme-colors'},
	'h1-': {category: 'typography', setLabel: 'headings'},
	'h2-': {category: 'typography', setLabel: 'headings'},
	'h3-': {category: 'typography', setLabel: 'headings'},
	'h4-': {category: 'typography', setLabel: 'headings'},
	'h5-': {category: 'typography', setLabel: 'headings'},
	'h6-': {category: 'typography', setLabel: 'headings'},
	'info': {category: 'colorSystem', setLabel: 'theme-colors'},
	'light': {category: 'colorSystem', setLabel: 'theme-colors'},
	'primary': {category: 'colorSystem', setLabel: 'theme-colors'},
	'secondary': {category: 'colorSystem', setLabel: 'theme-colors'},
	'spacer-': {category: 'spacing', setLabel: 'spacing'},
	'success': {category: 'colorSystem', setLabel: 'theme-colors'},
	'warning': {category: 'colorSystem', setLabel: 'theme-colors'},
	'white': {category: 'colorSystem', setLabel: 'grays'},
	'black': {category: 'colorSystem', setLabel: 'grays'},
};

/**
 * Recursively strips var(--name, fallback) to get the final literal value.
 */
function formatDefaultValue(value: string, isColor: boolean): string {
	if (!value) {
		return '';
	}
	let cleanValue = value.trim();

	while (cleanValue.includes('var(')) {
		const firstCommaIndex = cleanValue.indexOf(',');
		if (firstCommaIndex === -1) {
			const match = cleanValue.match(/^var\(\s*(--[a-zA-Z0-9-]+)\s*\)$/);
			if (match) {
				cleanValue = match[1];
			}
			break;
		}

		const lastParenIndex = cleanValue.lastIndexOf(')');
		cleanValue = cleanValue
			.substring(firstCommaIndex + 1, lastParenIndex)
			.trim();
	}

	cleanValue = cleanValue
		.replace(/['"]/g, '')
		.replace(/%23/g, '#')
		.replace(/%20/g, ' ');

	if (isColor) {
		const color = tinycolor(cleanValue);
		if (color.isValid()) {
			return color.toHexString().toLowerCase();
		}
	}

	return cleanValue;
}

function toKebabCase(str: string): string {
	return str.replace(/([a-z0-0])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
	return str.replace(/[-_](.)/g, function (match, group1) {
		return group1.toUpperCase();
	});
}

function parseTokenHierarchy(cssVarName: string) {
	const cleanName = cssVarName.replace(/^--|--$/g, '').trim();
	let category = 'general';
	let customSetLabel = '';

	for (const prefix in CATEGORY_MAP) {
		if (cleanName.indexOf(prefix) === 0) {
			category = CATEGORY_MAP[prefix].category;
			customSetLabel = CATEGORY_MAP[prefix].setLabel || '';
			break;
		}
	}

	const parts = cleanName.split('-');
	let set = customSetLabel;

	if (!set) {
		set = parts[0];
		if (
			parts.length > 1 &&
			['btn', 'container', 'input', 'alert'].includes(parts[0])
		) {
			set = parts[0] + '-' + parts[1];
		}
	}

	return {
		category,
		set,
		tokenId: cleanName,
		tokenLabel: cleanName,
	};
}

function organizeIntoGroups(tokenList: TokenDefinition[]) {
	const categoriesMap: Record<string, any> = {};

	tokenList.sort(function (a, b) {
		return a.tokenLabel.localeCompare(b.tokenLabel);
	});

	tokenList.forEach(function (token) {
		const category = token.category;
		const defaultValue = token.defaultValue;
		const set = token.set;
		const tokenId = token.tokenId;
		const tokenLabel = token.tokenLabel;

		if (!categoriesMap[category]) {
			categoriesMap[category] = {
				label: toKebabCase(category),
				name: category,
				sets: {},
			};
		}

		if (!categoriesMap[category].sets[set]) {
			categoriesMap[category].sets[set] = {
				label: set,
				name: toCamelCase(set),
				tokens: [],
			};
		}

		const isColorCandidate =
			category === 'colorSystem' ||
			/color|bg|background|border-color/.test(tokenId.toLowerCase()) ||
			(defaultValue &&
				(defaultValue.indexOf('#') !== -1 ||
					defaultValue.indexOf('rgb') !== -1));

		const finalValue = formatDefaultValue(defaultValue, !!isColorCandidate);

		const isActuallyColor =
			!!isColorCandidate && tinycolor(finalValue).isValid();

		let tokenName = toCamelCase(tokenId);
		if (isActuallyColor && !tokenName.toLowerCase().endsWith('color')) {
			tokenName += 'Color';
		}

		let editorType = 'String';
		if (isActuallyColor) {
			editorType = 'ColorPicker';
		}
		else if (/px|rem|em|%|vh|vw/.test(finalValue)) {
			editorType = 'Length';
		}

		categoriesMap[category].sets[set].tokens.push({
			defaultValue: finalValue,
			editorType,
			label: tokenLabel,
			mappings: [{type: 'cssVariable', value: tokenId}],
			name: tokenName,
			type: 'String',
		});
	});

	const sortedCategories = Object.values(categoriesMap).sort(function (a, b) {
		return a.label.localeCompare(b.label);
	});

	return sortedCategories.map(function (cat) {
		const sortedSets = Object.values(cat.sets).sort(function (
			a: any,
			b: any
		) {
			return a.label.localeCompare(b.label);
		});

		return {
			frontendTokenSets: sortedSets.map(function (set: any) {
				return {
					frontendTokens: set.tokens,
					label: set.label,
					name: set.name,
				};
			}),
			label: cat.label,
			name: cat.name,
		};
	});
}

function createTemporaryRootMap(varPairs: VarPair[], srcCssDir: string) {

	// Geramos o conteúdo do :root automaticamente baseado no scraping

	const rootEntries = varPairs
		.map((p) => `  --${p.css}: #{$${p.sass}};`)
		.join('\n');

	const content = `:root {\n${rootEntries}\n}`;

	// Salvamos na pasta de CSS para que o build do Liferay o veja

	fs.writeFileSync(
		path.resolve(srcCssDir, '_generated-root-map.scss'),
		content
	);
}

function cleanLiferayValue(rawValue: string): string {
	if (!rawValue) {
		return '';
	}

	let value = rawValue.trim();

	// Se o valor contiver var(), extraímos o fallback (o que vem após a vírgula)
	// Ex: var(--alert-font-size, 0.875rem) -> 0.875rem

	if (value.includes('var(')) {
		const lastCommaIndex = value.lastIndexOf(',');
		if (lastCommaIndex !== -1) {
			value = value
				.substring(lastCommaIndex + 1)
				.replace(/\)+$/, '')
				.trim();
		}
		else {

			// Caso seja var(--nome) sem fallback, removemos o var()

			value = value.replace(/^var\(\s*|\s*\)$/g, '');
		}
	}

	return value;
}

function generateTokensFromBuiltCSS(): void {
	const buildCssDir = path.resolve(__dirname, '../../build/css');
	const webInfDir = path.resolve(__dirname, '../WEB-INF');

	if (!fs.existsSync(buildCssDir)) {
		console.error(`❌ Pasta de build não encontrada: ${buildCssDir}`);

		return;
	}

	// 1. LOCALIZAÇÃO DINÂMICA DO ARQUIVO
	// Procuramos um arquivo que: comece com 'main.', termine com '.css' e NÃO tenha '.rtl.'

	const files = fs.readdirSync(buildCssDir);
	const mainCssFile = files.find(
		(f) =>
			f.startsWith('main.') && f.endsWith('.css') && !f.includes('.rtl.')
	);

	if (!mainCssFile) {
		console.error(
			'❌ Arquivo main.(hash).css não encontrado na pasta build/css/'
		);

		return;
	}

	const builtCssPath = path.join(buildCssDir, mainCssFile);
	console.log(`⚡ Lendo tokens de: ${mainCssFile}`);

	const cssContent = fs.readFileSync(builtCssPath, 'utf8');
	const root = scss.parse(cssContent);
	const tokenList: TokenDefinition[] = [];

	// 2. VARREDURA E LIMPEZA

	root.walkDecls((decl) => {
		if (decl.prop.startsWith('--')) {
			const fullId = decl.prop.replace('--', '');

			// Usamos a nova função de limpeza para pegar o valor final após a vírgula

			const finalValue = cleanLiferayValue(decl.value);

			const hierarchy = parseTokenHierarchy(fullId);

			if (!tokenList.some((t) => t.fullId === fullId)) {
				tokenList.push({
					fullId,
					defaultValue: finalValue,
					category: hierarchy.category,
					set: hierarchy.set,
					tokenId: fullId,
					tokenLabel: fullId,
				});
			}
		}
	});

	// 3. ORGANIZAÇÃO E SALVAMENTO

	const output = {frontendTokenCategories: organizeIntoGroups(tokenList)};

	if (!fs.existsSync(webInfDir)) {
		fs.mkdirSync(webInfDir);
	}

	fs.writeFileSync(
		path.join(webInfDir, 'frontend-token-definition.json'),
		JSON.stringify(output, null, 2),
		'utf-8'
	);

	console.log(
		`\x1b[32m✔ Sucesso!\x1b[0m ${tokenList.length} tokens extraídos.`
	);
}

generateTokensFromBuiltCSS();

// function generateTokens(): void {
// 	const srcCssDir = path.resolve(__dirname, '..', 'css', 'custom_properties');
// 	const buildDir = path.resolve(__dirname, '..', '..', 'build', 'css');
// 	const mainScss = path.resolve(buildDir, '_exposed_variables.scss');

// 	const varPairs: VarPair[] = [];

// 	const findExposedVarsRegex =
// 		/\$([a-z0-9-_]+)\s*:\s*var\s*\(\s*--([a-z0-9-_]+)/gi;

// 	const files = fs.readdirSync(srcCssDir).filter(function (f) {
// 		return f.endsWith('.scss');
// 	});

// 	files.forEach(function (file) {
// 		const content = fs.readFileSync(path.join(srcCssDir, file), 'utf8');
// 		let match;
// 		while ((match = findExposedVarsRegex.exec(content)) !== null) {
// 			const sName = match[1];
// 			const cName = match[2];

// 			const exists = varPairs.some(function (v) {
// 				return v.sass === sName;
// 			});
// 			if (!exists) {
// 				varPairs.push({sass: sName, css: cName});
// 			}
// 		}
// 	});

// 	// return createTemporaryRootMap(varPairs, srcCssDir);

// 	let rootContent = '';
// 	varPairs.forEach(function (pair) {
// 		rootContent +=
// 			'\n' +
// 			"  @if global-variable-exists('" +
// 			pair.sass +
// 			"') {\n" +
// 			'    $temp-val: $' +
// 			pair.sass +
// 			';\n' +
// 			'    $type: type-of($temp-val);\n' +
// 			"    @if $type == 'color' or $type == 'number' or $type == 'string' {\n" +
// 			'        --' +
// 			pair.css +
// 			': #{$temp-val};\n' +
// 			'    }\n' +
// 			'  }\n';
// 	});

// 	const reflectorScss =
// 		"@import 'clay/functions/global-functions';\n" +
// 		"@import '" +
// 		mainScss.replace(/\\/g, '/') +
// 		"';\n\n" +
// 		':root { ' +
// 		rootContent +
// 		' }';

// 	try {
// 		const result = sass.compileString(reflectorScss, {
// 			loadPaths: [path.dirname(mainScss)],
// 			syntax: 'scss',
// 		});

// 		const root = scss.parse(result.css);
// 		const tokenList: TokenDefinition[] = [];

// 		root.walkDecls(function (decl) {
// 			if (decl.prop.indexOf('--') === 0) {
// 				const fullId = decl.prop.replace('--', '');
// 				const rawValue = decl.value.trim();

// 				const hierarchy = parseTokenHierarchy(fullId);

// 				if (
// 					!tokenList.some(function (t) {
// 						return t.fullId === fullId;
// 					})
// 				) {
// 					tokenList.push({
// 						fullId,
// 						defaultValue: rawValue,
// 						category: hierarchy.category,
// 						set: hierarchy.set,
// 						tokenId: hierarchy.tokenId,
// 						tokenLabel: hierarchy.tokenLabel,
// 					});
// 				}
// 			}
// 		});

// 		const output = {frontendTokenCategories: organizeIntoGroups(tokenList)};
// 		const webInfDir = path.resolve(__dirname, '..', 'WEB-INF');

// 		if (!fs.existsSync(webInfDir)) {
// 			fs.mkdirSync(webInfDir);
// 		}

// 		fs.writeFileSync(
// 			path.join(webInfDir, 'frontend-token-definition.json'),
// 			JSON.stringify(output, null, 2),
// 			'utf-8'
// 		);

// 		console.log(
// 			'\x1b[32m:heavy_check_mark: Finished: ' +
// 				tokenList.length +
// 				' tokens generated.\x1b[0m'
// 		);
// 	}
// 	catch (error: any) {
// 		console.error(':x: Erro:', error.message);
// 	}
// }

// generateTokens();
