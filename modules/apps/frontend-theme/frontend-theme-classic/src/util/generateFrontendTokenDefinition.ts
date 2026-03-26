/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

interface TokenDefinition {
	category: string;
	defaultValue: string;
	fullId: string;
	set: string;
	tokenId: string;
	tokenLabel: string;
	[key: string]: any;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATEGORY_MAP: Record<string, {category: string; setLabel?: string}> = {
	'black': {category: 'colorSystem', setLabel: 'grays'},
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
};

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
		const set = token.set;
		const tokenId = token.tokenId;

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

		let editorType = 'String';
		const lowerId = tokenId.toLowerCase();

		const colorKeywords = [
			'color',
			'bg',
			'background',
			'primary',
			'secondary',
			'success',
			'info',
			'warning',
			'danger',
			'light',
			'dark',
			'gray',
			'white',
			'black',
		];
		const lengthKeywords = [
			'width',
			'height',
			'padding',
			'margin',
			'spacer',
			'radius',
			'size',
			'border-width',
		];

		const isColor = colorKeywords.some(function (keyword) {
			return lowerId.includes(keyword);
		});

		const isLength = lengthKeywords.some(function (keyword) {
			return lowerId.includes(keyword);
		});

		if (isColor) {
			editorType = 'ColorPicker';
		}
		else if (isLength) {
			editorType = 'Length';
		}

		categoriesMap[category].sets[set].tokens.push({
			defaultValue: '',
			editorType,
			label: token.tokenLabel,
			mappings: [{type: 'cssVariable', value: tokenId}],
			name: toCamelCase(tokenId),
			type: 'String',
		});
	});

	const sortedCategories = Object.values(categoriesMap).sort(function (
		a: any,
		b: any
	) {
		return a.label.localeCompare(b.label);
	});

	return sortedCategories.map(function (cat: any) {
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

function generateTokens(): void {
	const srcCssDir = path.resolve(__dirname, '..', 'css', 'custom_properties');
	const webInfDir = path.resolve(__dirname, '..', 'WEB-INF');

	if (!fs.existsSync(srcCssDir)) {
		console.error(`❌ Directory: ${srcCssDir} not found.`);

		return;
	}

	const uniqueCssVars = new Set<string>();
	const files = fs.readdirSync(srcCssDir).filter(function (f) {
		return f.endsWith('.scss');
	});

	files.forEach(function (file) {
		const content = fs.readFileSync(path.join(srcCssDir, file), 'utf8');
		const findCssVarsRegex = /--([a-z0-9-_]+)/gi;

		let match;
		while ((match = findCssVarsRegex.exec(content)) !== null) {
			uniqueCssVars.add(match[1]);
		}
	});

	const tokenList: TokenDefinition[] = [];
	uniqueCssVars.forEach(function (varName) {
		const hierarchy = parseTokenHierarchy(varName);
		tokenList.push({
			category: hierarchy.category,
			defaultValue: '',
			fullId: varName,
			set: hierarchy.set,
			tokenId: varName,
			tokenLabel: varName,
		});
	});

	const output = {frontendTokenCategories: organizeIntoGroups(tokenList)};

	if (!fs.existsSync(webInfDir)) {
		fs.mkdirSync(webInfDir);
	}

	fs.writeFileSync(
		path.join(webInfDir, 'frontend-token-definition.json'),
		JSON.stringify(output, null, 2),
		'utf-8'
	);
}

generateTokens();
