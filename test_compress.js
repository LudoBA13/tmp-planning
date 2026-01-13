const { compressPlanning } = require('./planning');

const runTest = (input, expected) =>
{
	const actual = compressPlanning(input);
	if (actual === expected)
	{
		console.log(`PASS: "${input}" -> "${actual}"`);
	}
	else
	{
		console.log(`FAIL: "${input}"`);
		console.log(`  Expected: "${expected}"`);
		console.log(`  Actual:   "${actual}"`);
		process.exit(1);
	}
};

runTest('1JeMdSe2JeMdSe3JeMdSe4JeMdSe', '0JeMdSe');

console.log('All compression tests passed!');
