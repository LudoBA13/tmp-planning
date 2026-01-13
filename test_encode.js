const { encodePlanning } = require('./planning');

const runTest = (input, expected) =>
{
	const actual = encodePlanning(input);
	if (actual === expected)
	{
		console.log(`PASS`);
	}
	else
	{
		console.log(`FAIL`);
		console.log(`  Input:    ${JSON.stringify(input)}`);
		console.log(`  Expected: "${expected}"`);
		console.log(`  Actual:   "${actual}"`);
		process.exit(1);
	}
};

// Test single entry
runTest(
	[{ week: '1', day: 'Lu', time: 'Md', product: 'Fr' }],
	'1LuMdFr'
);

// Test multiple products in one object
runTest(
	[{ week: '1', day: 'Lu', time: 'Md', products: ['Fr', 'Se'] }],
	'1LuMdFr1LuMdSe'
);

// Test multiple entries
runTest(
	[
		{ week: '1', day: 'Lu', time: 'Md', products: ['Fr'] },
		{ week: '2', day: 'Ma', time: 'Ap', products: ['Se'] }
	],
	'1LuMdFr2MaApSe'
);

// Test "Tous les" (week 0)
runTest(
	[{ week: '0', day: 'Je', time: 'Mf', product: 'Su' }],
	'0JeMfSu'
);

// Test canonicalization (compression + sorting)
runTest(
	[
		{ week: '1', day: 'Je', time: 'Md', product: 'Se' },
		{ week: '2', day: 'Je', time: 'Md', product: 'Se' },
		{ week: '3', day: 'Je', time: 'Md', product: 'Se' },
		{ week: '4', day: 'Je', time: 'Md', product: 'Se' },
		{ week: '1', day: 'Ma', time: 'Md', product: 'Fr' }
	],
	'0JeMdSe1MaMdFr'
);

console.log('All encoding tests passed!');
