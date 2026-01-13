const decodePlanning = (schedule) =>
{
	if (!schedule)
	{
		return '';
	}

	const weeks = {
		'1': '1er',
		'2': '2e',
		'3': '3e',
		'4': '4e'
	};

	const days = {
		'Lu': 'lundi',
		'Ma': 'mardi',
		'Me': 'mercredi',
		'Je': 'jeudi',
		'Ve': 'vendredi'
	};

	const dayOrder = {
		'Lu': 0,
		'Ma': 1,
		'Me': 2,
		'Je': 3,
		'Ve': 4
	};

	const times = {
		'Md': '8h30',
		'Mf': '10h00',
		'Ap': '14h00'
	};

	const timeOrder = {
		'Md': 0,
		'Mf': 1,
		'Ap': 2
	};

	const products = {
		'Fr': 'Frais',
		'Se': 'Sec',
		'Su': 'Surgelé'
	};

	const grouped = new Map();

	for (let i = 0; i < schedule.length; i += 7)
	{
		const entry = schedule.substring(i, i + 7);
		const weekCode = entry.charAt(0);
		const dayCode = entry.substring(1, 3);
		const timeCode = entry.substring(3, 5);
		const productCode = entry.substring(5, 7);

		// Create a sortable key: Week (1-4), Day Index, Time Index
		// This ensures Week -> Day -> Time sorting order
		const sortKey = `${weekCode}-${dayOrder[dayCode]}-${timeOrder[timeCode]}`;

		if (!grouped.has(sortKey))
		{
			grouped.set(sortKey, {
				week: weeks[weekCode],
				day: days[dayCode],
				time: times[timeCode],
				productList: []
			});
		}

		const productLabel = products[productCode];
		if (productLabel)
		{
			grouped.get(sortKey).productList.push(productLabel);
		}
	}

	const sortedKeys = Array.from(grouped.keys()).sort();
	const resultParts = [];

	for (const key of sortedKeys)
	{
		const item = grouped.get(key);
		item.productList.sort((a, b) => a.localeCompare(b, 'fr'));
		const productString = item.productList.join(', ');
		resultParts.push(`${item.week} ${item.day} ${item.time}: ${productString}.`);
	}

	return resultParts.join(' ');
};

module.exports = decodePlanning;
