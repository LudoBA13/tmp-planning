const { parseHumanReadable } = require('./planning');

const runTest = (input, expected) =>
{
	const actual = parseHumanReadable(input);
	if (actual === expected)
	{
		console.log(`PASS`);
	}
	else
	{
		console.log(`FAIL`);
		console.log(`  Input:    "${input}"`);
		console.log(`  Expected: "${expected}"`);
		console.log(`  Actual:   "${actual}"`);
		process.exit(1);
	}
};

// Test single entry
runTest(
	'1er lundi 8h30: Frais.',
	'1LuMdFr'
);

// Test multiple products
runTest(
	'1er lundi 8h30: Frais, Sec.',
	'1LuMdFr1LuMdSe'
);

// Test multiple sentences
runTest(
	'1er lundi 8h30: Frais. 2e mardi 14h00: Sec.',
	'1LuMdFr2MaApSe'
);

// Test "Tous les" (Week 0) and plurals
runTest(
	'Tous les jeudis 8h30: Sec.',
	'0JeMdSe'
);

// Test mixed
runTest(
	'Tous les jeudis 8h30: Sec. 1er mardi 10h00: Frais, Surgelé.',
	'0JeMdSe1MaMfFr1MaMfSu'
);

console.log('All parsing tests passed!');
