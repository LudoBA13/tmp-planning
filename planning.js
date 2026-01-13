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

	const times = {
		'Md': '8h30',
		'Mf': '10h00',
		'Ap': '14h00'
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

		const key = weekCode + dayCode + timeCode;

		if (!grouped.has(key))
		{
			grouped.set(key, {
				week: weeks[weekCode],
				day: days[dayCode],
				time: times[timeCode],
				productList: []
			});
		}

		const productLabel = products[productCode];
		if (productLabel)
		{
			grouped.get(key).productList.push(productLabel);
		}
	}

	const resultParts = [];

	for (const item of grouped.values())
	{
		const productString = item.productList.join(', ');
		resultParts.push(`${item.week} ${item.day} ${item.time}: ${productString}.`);
	}

	return resultParts.join(' ');
};

module.exports = decodePlanning;
