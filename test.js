const decodePlanning = require('./planning');

const runTest = (input, expected) =>
{
	const actual = decodePlanning(input);
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

runTest('', '');
runTest('1LuMdFr1LuMdSe1LuMdSu3LuMdSe', '1er lundi 8h30: Frais, Sec, Surgelé. 3e lundi 8h30: Sec.');
runTest('1LuMdSe1LuMdFr3LuMdSe2MaMfFr', '1er lundi 8h30: Frais, Sec. 2e mardi 10h00: Frais. 3e lundi 8h30: Sec.');
runTest('1JeMdSe1MaMdFr', '1er mardi 8h30: Frais. 1er jeudi 8h30: Sec.');
runTest('1MaMdSe1MaMdFr', '1er mardi 8h30: Frais, Sec.');
runTest('2MaMdSe1MaMdFr', '1er mardi 8h30: Frais. 2e mardi 8h30: Sec.');
runTest('1MaMdSe1MaMfFr', '1er mardi 8h30: Sec. 1er mardi 10h00: Frais.');
runTest('1MaApSe1MaMdFr', '1er mardi 8h30: Frais. 1er mardi 14h00: Sec.');
runTest('1MaMdFr1MaApSe', '1er mardi 8h30: Frais. 1er mardi 14h00: Sec.');
runTest('1JeMdSe2JeMdSe3JeMdSe4JeMdSe', 'Tous les jeudis 8h30: Sec.');

console.log('All tests passed!');
