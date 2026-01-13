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

console.log('All encoding tests passed!');
