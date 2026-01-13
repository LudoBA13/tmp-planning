// Google Apps Script Configuration
// These constants are defined in the global scope for GAS.

/**
 * Planning Encoding Format
 * Each planning entry is encoded as a 7-character string:
 * 
 * 1. Week (1 char):
 *    - '1', '2', '3', '4': Specific week of the month.
 *    - '0': "Tous les" (Every week).
 * 
 * 2. Day (2 chars):
 *    - 'Lu': Lundi (Monday)
 *    - 'Ma': Mardi (Tuesday)
 *    - 'Me': Mercredi (Wednesday)
 *    - 'Je': Jeudi (Thursday)
 *    - 'Ve': Vendredi (Friday)
 * 
 * 3. Time Slot (2 chars):
 *    - 'Md': Matin début (08:30)
 *    - 'Mf': Matin fin (10:00)
 *    - 'Ap': Après-midi (14:00)
 * 
 * 4. Product Type (2 chars):
 *    - 'Fr': Frais
 *    - 'Se': Sec
 *    - 'Su': Surgelé
 * 
 * Example: "1LuMdFr" -> 1st Monday, 08:30, Frais
 *          "0JeMdSe" -> Every Thursday, 08:30, Sec
 */

const PLANNING_CONSTANTS = {
	WEEKS: {
		'0': 'Tous les',
		'1': '1er',
		'2': '2e',
		'3': '3e',
		'4': '4e'
	},
	DAYS: {
		'Lu': 'lundi',
		'Ma': 'mardi',
		'Me': 'mercredi',
		'Je': 'jeudi',
		'Ve': 'vendredi'
	},
	DAY_ORDER: {
		'Lu': 0,
		'Ma': 1,
		'Me': 2,
		'Je': 3,
		'Ve': 4
	},
	TIMES: {
		'Md': '8h30',
		'Mf': '10h00',
		'Ap': '14h00'
	},
	TIME_ORDER: {
		'Md': 0,
		'Mf': 1,
		'Ap': 2
	},
	PRODUCTS: {
		'Fr': 'Frais',
		'Se': 'Sec',
		'Su': 'Surgelé'
	}
};

/**
 * Helper to parse the raw schedule string into structured objects.
 * Yields entries: { weekCode, dayCode, timeCode, productCode, suffix }
 */
const parseSchedule = function* (schedule)
{
	if (!schedule) return;

	for (let i = 0; i < schedule.length; i += 7)
	{
		const entry = schedule.substring(i, i + 7);
		yield {
			weekCode: entry.charAt(0),
			dayCode: entry.substring(1, 3),
			timeCode: entry.substring(3, 5),
			productCode: entry.substring(5, 7),
			suffix: entry.substring(1) // day + time + product
		};
	}
};

const compressPlanning = (schedule) =>
{
	if (!schedule)
	{
		return '';
	}

	const groupedBySuffix = new Map();

	for (const { weekCode, suffix } of parseSchedule(schedule))
	{
		if (!groupedBySuffix.has(suffix))
		{
			groupedBySuffix.set(suffix, new Set());
		}
		groupedBySuffix.get(suffix).add(weekCode);
	}

	let result = '';
	const requiredWeeks = new Set(['1', '2', '3', '4']);

	for (const [suffix, weeks] of groupedBySuffix.entries())
	{
		const hasAllWeeks = requiredWeeks.size === weeks.size && [...requiredWeeks].every(w => weeks.has(w));

		if (hasAllWeeks)
		{
			result += '0' + suffix;
		}
		else
		{
			const sortedWeeks = Array.from(weeks).sort();
			for (const w of sortedWeeks)
			{
				result += w + suffix;
			}
		}
	}

	return result;
};

/**
 * Groups entries by time slot and sorts them chronologically.
 * Also sorts the product list alphabetically within each group.
 */
const groupAndSortEntries = (schedule) =>
{
	const { DAY_ORDER, TIME_ORDER, WEEKS, DAYS, TIMES, PRODUCTS } = PLANNING_CONSTANTS;
	const grouped = new Map();

	for (const { weekCode, dayCode, timeCode, productCode } of parseSchedule(schedule))
	{
		// Create a sortable key: Week (1-4), Day Index, Time Index
		const sortKey = `${weekCode}-${DAY_ORDER[dayCode]}-${TIME_ORDER[timeCode]}`;

		if (!grouped.has(sortKey))
		{
			grouped.set(sortKey, {
				week: WEEKS[weekCode],
				day: DAYS[dayCode],
				time: TIMES[timeCode],
				productList: [],
				isRecurring: weekCode === '0'
			});
		}

		const productLabel = PRODUCTS[productCode];
		if (productLabel)
		{
			grouped.get(sortKey).productList.push(productLabel);
		}
	}

	const sortedKeys = Array.from(grouped.keys()).sort();

	return sortedKeys.map(key =>
	{
		const item = grouped.get(key);
		item.productList.sort((a, b) => a.localeCompare(b, 'fr'));
		return item;
	});
};

const decodePlanning = (schedule) =>
{
	if (!schedule)
	{
		return '';
	}

	schedule = compressPlanning(schedule);
	const sortedItems = groupAndSortEntries(schedule);

	return sortedItems.map(item =>
	{
		const productString = item.productList.join(', ');
		let dayLabel = item.day;
		if (item.isRecurring)
		{
			dayLabel += 's';
		}
		return `${item.week} ${dayLabel} ${item.time}: ${productString}.`;
	}).join(' ');
};

/**

 * Takes an encoded schedule, compresses it, and returns it in a sorted canonical form.

 */

const canonicalizeSchedule = (schedule) =>

{

	if (!schedule)

	{

		return '';

	}



	const compressed = compressPlanning(schedule);

	const entries = Array.from(parseSchedule(compressed));



	const { DAY_ORDER, TIME_ORDER, PRODUCTS } = PLANNING_CONSTANTS;



	entries.sort((a, b) =>

	{

		// Sort by Week Code (0 comes before 1, 2, 3, 4)

		if (a.weekCode !== b.weekCode)

		{

			return a.weekCode.localeCompare(b.weekCode);

		}

		// Sort by Day Order

		if (a.dayCode !== b.dayCode)

		{

			return DAY_ORDER[a.dayCode] - DAY_ORDER[b.dayCode];

		}

		// Sort by Time Order

		if (a.timeCode !== b.timeCode)

		{

			return TIME_ORDER[a.timeCode] - TIME_ORDER[b.timeCode];

		}

		// Sort by Product Label (alphabetical)

		const labelA = PRODUCTS[a.productCode] || '';

		const labelB = PRODUCTS[b.productCode] || '';

		return labelA.localeCompare(labelB, 'fr');

	});



	return entries.map(e => e.weekCode + e.dayCode + e.timeCode + e.productCode).join('');

};



// Node.js Compatibility Guard

// This block will be ignored in Google Apps Script but executed in Node.js

if (typeof module !== 'undefined')

{

	module.exports = {

		decodePlanning,

		compressPlanning,

		canonicalizeSchedule

	};

}
