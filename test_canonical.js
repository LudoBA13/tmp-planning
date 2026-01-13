const { canonicalizeSchedule } = require('./planning');

const runTest = (input, expected) =>
{
	const actual = canonicalizeSchedule(input);
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

// Test sorting
runTest('1MaMdSe1MaMdFr', '1MaMdFr1MaMdSe');
runTest('1JeMdSe1MaMdFr', '1MaMdFr1JeMdSe');
runTest('2MaMdSe1MaMdFr', '1MaMdFr2MaMdSe');

// Test compression + sorting
runTest('1JeMdSe2JeMdSe3JeMdSe4JeMdSe', '0JeMdSe');
runTest('1JeMdSe1MaMdFr2JeMdSe3JeMdSe4JeMdSe', '0JeMdSe1MaMdFr'); // 0 comes before 1

console.log('All canonicalization tests passed!');
