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

// 1. Color System

const COLOR_SYSTEM_KEYS = [
	'primary',
	'secondary',
	'success',
	'info',
	'warning',
	'danger',
	'light',
	'dark',
	'blue',
	'indigo',
	'purple',
	'pink',
	'red',
	'orange',
	'yellow',
	'green',
	'teal',
	'cyan',
	'gray-',
	'white',
	'black',
	'brand-',
];

// 2. Typography

const TYPOGRAPHY_KEYS = [
	'font-',
	'display-',
	'h1-',
	'h2-',
	'h3-',
	'h4-',
	'h5-',
	'h6-',
	'lead-',
];

// 3. Spacing

const SPACING_KEYS = ['spacer-'];

// 4. General

const GENERAL_KEYS = ['body-', 'border-', 'box-shadow-', 'aspect-ratio'];

// 5. Components

const COMPONENT_KEYS = ['btn-', 'alert-', 'input-', 'container-'];

// Category Definitions

const CATEGORY_DEFINITIONS = [
	{category: 'colorSystem', keys: COLOR_SYSTEM_KEYS},
	{category: 'typography', keys: TYPOGRAPHY_KEYS},
	{category: 'spacing', keys: SPACING_KEYS},
	{category: 'general', keys: GENERAL_KEYS},
	{category: 'components', keys: COMPONENT_KEYS},
];

const CATEGORY_MAP: Record<string, {category: string; setLabel: string}> =
	CATEGORY_DEFINITIONS.reduce(function (acc, definition) {
		const category = definition.category;
		const keys = definition.keys;

		keys.forEach(function (key) {
			const cleanKey = key.replace('-', '');
			let setLabel = cleanKey;

			if (category === 'colorSystem') {
				const themeColors = [
					'primary',
					'secondary',
					'success',
					'info',
					'warning',
					'danger',
					'light',
					'dark',
				];
				const grayColors = ['white', 'black', 'gray'];

				if (themeColors.indexOf(cleanKey) !== -1) {
					setLabel = 'theme-colors';
				}
				else if (grayColors.indexOf(cleanKey) !== -1) {
					setLabel = 'grays';
				}
			}
			else if (category === 'typography') {
				const typeBasics = ['font', 'display', 'lead'];
				if (typeBasics.indexOf(cleanKey) === -1) {
					setLabel = 'headings';
				}
			}

			acc[key] = {
				category,
				setLabel,
			};
		});

		return acc;
	}, {});

function toKebabCase(str: string): string {
	return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function toCamelCase(str: string): string {
	return str.replace(/[-_](.)/g, function (match, group1) {
		return group1.toUpperCase();
	});
}

function parseTokenHierarchy(cssVarName: string) {
	const cleanName = cssVarName.replace(/^--|--$/g, '').trim();
	const lowerName = cleanName.toLowerCase();

	const matchedKey = Object.keys(CATEGORY_MAP).find(function (key) {
		return lowerName.startsWith(key);
	});

	const config = matchedKey
		? CATEGORY_MAP[matchedKey]
		: {category: 'general', setLabel: 'others'};

	return {
		category: config.category,
		set: config.setLabel,
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

		const isColor =
			colorKeywords.some(function (keyword) {
				return lowerId.includes(keyword);
			}) || token.category === 'colorSystem';

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
