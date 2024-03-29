const assert = require('./assert');

module.exports = (() => {
	'use strict';

	/**
	 * Utilities for working with timezones.
	 *
	 * @public
	 * @module lang/timezone
	 */
	const timezone = {
		/**
		 * Gets a list of names in the tz database (see https://en.wikipedia.org/wiki/Tz_database
		 * and https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
		 *
		 * @public
		 * @static
		 * @returns {String[]}
		 */
		getTimezones() {
			return timezoneNames;
		},

		/**
		 * Indicates if a timezone name exists.
		 *
		 * @public
		 * @static
		 * @param {String} name - The timezone name to find.
		 * @returns {Boolean}
		 */
		hasTimezone(name) {
			assert.argumentIsRequired(name, 'name', String);

			return this.getTimezones().some((candidate) => {
				return candidate === name;
			});
		},

		/**
		 * Attempts to guess the timezone of the current computer.
		 *
		 * @public
		 * @static
		 * @returns {String|null}
		 */
		guessTimezone() {
			let guess;

			try {
				guess = Intl.DateTimeFormat().resolvedOptions().timeZone;
			} catch (e) {
				guess = null;
			}

			return guess;
		}
	};

	const timezoneData = [
		[
			"Africa",
			"Abidjan",
			"Accra",
			"Addis_Ababa",
			"Algiers",
			"Asmara",
			"Asmera",
			"Bamako",
			"Bangui",
			"Banjul",
			"Bissau",
			"Blantyre",
			"Brazzaville",
			"Bujumbura",
			"Cairo",
			"Casablanca",
			"Ceuta",
			"Conakry",
			"Dakar",
			"Dar_es_Salaam",
			"Djibouti",
			"Douala",
			"El_Aaiun",
			"Freetown",
			"Gaborone",
			"Harare",
			"Johannesburg",
			"Juba",
			"Kampala",
			"Khartoum",
			"Kigali",
			"Kinshasa",
			"Lagos",
			"Libreville",
			"Lome",
			"Luanda",
			"Lubumbashi",
			"Lusaka",
			"Malabo",
			"Maputo",
			"Maseru",
			"Mbabane",
			"Mogadishu",
			"Monrovia",
			"Nairobi",
			"Ndjamena",
			"Niamey",
			"Nouakchott",
			"Ouagadougou",
			"Porto-Novo",
			"Sao_Tome",
			"Timbuktu",
			"Tripoli",
			"Tunis",
			"Windhoek"
		],
		[
			"America",
			"Adak",
			"Anchorage",
			"Anguilla",
			"Antigua",
			"Araguaina",
			"Argentina/Buenos_Aires",
			"Argentina/Catamarca",
			"Argentina/ComodRivadavia",
			"Argentina/Cordoba",
			"Argentina/Jujuy",
			"Argentina/La_Rioja",
			"Argentina/Mendoza",
			"Argentina/Rio_Gallegos",
			"Argentina/Salta",
			"Argentina/San_Juan",
			"Argentina/San_Luis",
			"Argentina/Tucuman",
			"Argentina/Ushuaia",
			"Aruba",
			"Asuncion",
			"Atikokan",
			"Atka",
			"Bahia",
			"Bahia_Banderas",
			"Barbados",
			"Belem",
			"Belize",
			"Blanc-Sablon",
			"Boa_Vista",
			"Bogota",
			"Boise",
			"Buenos_Aires",
			"Cambridge_Bay",
			"Campo_Grande",
			"Cancun",
			"Caracas",
			"Catamarca",
			"Cayenne",
			"Cayman",
			"Chicago",
			"Chihuahua",
			"Ciudad_Juarez",
			"Coral_Harbour",
			"Cordoba",
			"Costa_Rica",
			"Creston",
			"Cuiaba",
			"Curacao",
			"Danmarkshavn",
			"Dawson",
			"Dawson_Creek",
			"Denver",
			"Detroit",
			"Dominica",
			"Edmonton",
			"Eirunepe",
			"El_Salvador",
			"Ensenada",
			"Fort_Nelson",
			"Fort_Wayne",
			"Fortaleza",
			"Glace_Bay",
			"Godthab",
			"Goose_Bay",
			"Grand_Turk",
			"Grenada",
			"Guadeloupe",
			"Guatemala",
			"Guayaquil",
			"Guyana",
			"Halifax",
			"Havana",
			"Hermosillo",
			"Indiana/Indianapolis",
			"Indiana/Knox",
			"Indiana/Marengo",
			"Indiana/Petersburg",
			"Indiana/Tell_City",
			"Indiana/Vevay",
			"Indiana/Vincennes",
			"Indiana/Winamac",
			"Indianapolis",
			"Inuvik",
			"Iqaluit",
			"Jamaica",
			"Jujuy",
			"Juneau",
			"Kentucky/Louisville",
			"Kentucky/Monticello",
			"Knox_IN",
			"Kralendijk",
			"La_Paz",
			"Lima",
			"Los_Angeles",
			"Louisville",
			"Lower_Princes",
			"Maceio",
			"Managua",
			"Manaus",
			"Marigot",
			"Martinique",
			"Matamoros",
			"Mazatlan",
			"Mendoza",
			"Menominee",
			"Merida",
			"Metlakatla",
			"Mexico_City",
			"Miquelon",
			"Moncton",
			"Monterrey",
			"Montevideo",
			"Montreal",
			"Montserrat",
			"Nassau",
			"New_York",
			"Nipigon",
			"Nome",
			"Noronha",
			"North_Dakota/Beulah",
			"North_Dakota/Center",
			"North_Dakota/New_Salem",
			"Nuuk",
			"Ojinaga",
			"Panama",
			"Pangnirtung",
			"Paramaribo",
			"Phoenix",
			"Port-au-Prince",
			"Port_of_Spain",
			"Porto_Acre",
			"Porto_Velho",
			"Puerto_Rico",
			"Punta_Arenas",
			"Rainy_River",
			"Rankin_Inlet",
			"Recife",
			"Regina",
			"Resolute",
			"Rio_Branco",
			"Rosario",
			"Santa_Isabel",
			"Santarem",
			"Santiago",
			"Santo_Domingo",
			"Sao_Paulo",
			"Scoresbysund",
			"Shiprock",
			"Sitka",
			"St_Barthelemy",
			"St_Johns",
			"St_Kitts",
			"St_Lucia",
			"St_Thomas",
			"St_Vincent",
			"Swift_Current",
			"Tegucigalpa",
			"Thule",
			"Thunder_Bay",
			"Tijuana",
			"Toronto",
			"Tortola",
			"Vancouver",
			"Virgin",
			"Whitehorse",
			"Winnipeg",
			"Yakutat",
			"Yellowknife"
		],
		[
			"Antarctica",
			"Casey",
			"Davis",
			"DumontDUrville",
			"Macquarie",
			"Mawson",
			"McMurdo",
			"Palmer",
			"Rothera",
			"South_Pole",
			"Syowa",
			"Troll",
			"Vostok"
		],
		[
			"Arctic",
			"Longyearbyen"
		],
		[
			"Asia",
			"Aden",
			"Almaty",
			"Amman",
			"Anadyr",
			"Aqtau",
			"Aqtobe",
			"Ashgabat",
			"Ashkhabad",
			"Atyrau",
			"Baghdad",
			"Bahrain",
			"Baku",
			"Bangkok",
			"Barnaul",
			"Beirut",
			"Bishkek",
			"Brunei",
			"Calcutta",
			"Chita",
			"Choibalsan",
			"Chongqing",
			"Chungking",
			"Colombo",
			"Dacca",
			"Damascus",
			"Dhaka",
			"Dili",
			"Dubai",
			"Dushanbe",
			"Famagusta",
			"Gaza",
			"Harbin",
			"Hebron",
			"Ho_Chi_Minh",
			"Hong_Kong",
			"Hovd",
			"Irkutsk",
			"Istanbul",
			"Jakarta",
			"Jayapura",
			"Jerusalem",
			"Kabul",
			"Kamchatka",
			"Karachi",
			"Kashgar",
			"Kathmandu",
			"Katmandu",
			"Khandyga",
			"Kolkata",
			"Krasnoyarsk",
			"Kuala_Lumpur",
			"Kuching",
			"Kuwait",
			"Macao",
			"Macau",
			"Magadan",
			"Makassar",
			"Manila",
			"Muscat",
			"Nicosia",
			"Novokuznetsk",
			"Novosibirsk",
			"Omsk",
			"Oral",
			"Phnom_Penh",
			"Pontianak",
			"Pyongyang",
			"Qatar",
			"Qostanay",
			"Qyzylorda",
			"Rangoon",
			"Riyadh",
			"Saigon",
			"Sakhalin",
			"Samarkand",
			"Seoul",
			"Shanghai",
			"Singapore",
			"Srednekolymsk",
			"Taipei",
			"Tashkent",
			"Tbilisi",
			"Tehran",
			"Tel_Aviv",
			"Thimbu",
			"Thimphu",
			"Tokyo",
			"Tomsk",
			"Ujung_Pandang",
			"Ulaanbaatar",
			"Ulan_Bator",
			"Urumqi",
			"Ust-Nera",
			"Vientiane",
			"Vladivostok",
			"Yakutsk",
			"Yangon",
			"Yekaterinburg",
			"Yerevan"
		],
		[
			"Atlantic",
			"Azores",
			"Bermuda",
			"Canary",
			"Cape_Verde",
			"Faeroe",
			"Faroe",
			"Jan_Mayen",
			"Madeira",
			"Reykjavik",
			"South_Georgia",
			"St_Helena",
			"Stanley"
		],
		[
			"Australia",
			"ACT",
			"Adelaide",
			"Brisbane",
			"Broken_Hill",
			"Canberra",
			"Currie",
			"Darwin",
			"Eucla",
			"Hobart",
			"LHI",
			"Lindeman",
			"Lord_Howe",
			"Melbourne",
			"NSW",
			"North",
			"Perth",
			"Queensland",
			"South",
			"Sydney",
			"Tasmania",
			"Victoria",
			"West",
			"Yancowinna"
		],
		[
			"Brazil",
			"Acre",
			"DeNoronha",
			"East",
			"West"
		],
		[
			"Canada",
			"Atlantic",
			"Central",
			"Eastern",
			"Mountain",
			"Newfoundland",
			"Pacific",
			"Saskatchewan",
			"Yukon"
		],
		[ "CET" ],
		[
			"Chile",
			"Continental",
			"EasterIsland"
		],
		[ "CST6CDT" ],
		[ "Cuba" ],
		[ "EET" ],
		[ "Egypt" ],
		[ "Eire" ],
		[ "EST" ],
		[ "EST5EDT" ],
		[
			"Etc",
			"GMT",
			"GMT+0",
			"GMT+1",
			"GMT+10",
			"GMT+11",
			"GMT+12",
			"GMT+2",
			"GMT+3",
			"GMT+4",
			"GMT+5",
			"GMT+6",
			"GMT+7",
			"GMT+8",
			"GMT+9",
			"GMT-0",
			"GMT-1",
			"GMT-10",
			"GMT-11",
			"GMT-12",
			"GMT-13",
			"GMT-14",
			"GMT-2",
			"GMT-3",
			"GMT-4",
			"GMT-5",
			"GMT-6",
			"GMT-7",
			"GMT-8",
			"GMT-9",
			"GMT0",
			"Greenwich",
			"UCT",
			"UTC",
			"Universal",
			"Zulu"
		],
		[
			"Europe",
			"Amsterdam",
			"Andorra",
			"Astrakhan",
			"Athens",
			"Belfast",
			"Belgrade",
			"Berlin",
			"Bratislava",
			"Brussels",
			"Bucharest",
			"Budapest",
			"Busingen",
			"Chisinau",
			"Copenhagen",
			"Dublin",
			"Gibraltar",
			"Guernsey",
			"Helsinki",
			"Isle_of_Man",
			"Istanbul",
			"Jersey",
			"Kaliningrad",
			"Kiev",
			"Kirov",
			"Kyiv",
			"Lisbon",
			"Ljubljana",
			"London",
			"Luxembourg",
			"Madrid",
			"Malta",
			"Mariehamn",
			"Minsk",
			"Monaco",
			"Moscow",
			"Nicosia",
			"Oslo",
			"Paris",
			"Podgorica",
			"Prague",
			"Riga",
			"Rome",
			"Samara",
			"San_Marino",
			"Sarajevo",
			"Saratov",
			"Simferopol",
			"Skopje",
			"Sofia",
			"Stockholm",
			"Tallinn",
			"Tirane",
			"Tiraspol",
			"Ulyanovsk",
			"Uzhgorod",
			"Vaduz",
			"Vatican",
			"Vienna",
			"Vilnius",
			"Volgograd",
			"Warsaw",
			"Zagreb",
			"Zaporozhye",
			"Zurich"
		],
		[ "GB" ],
		[ "GB-Eire" ],
		[ "GMT" ],
		[ "GMT-0" ],
		[ "GMT+0" ],
		[ "GMT0" ],
		[ "Greenwich" ],
		[ "Hongkong" ],
		[ "HST" ],
		[ "Iceland" ],
		[
			"Indian",
			"Antananarivo",
			"Chagos",
			"Christmas",
			"Cocos",
			"Comoro",
			"Kerguelen",
			"Mahe",
			"Maldives",
			"Mauritius",
			"Mayotte",
			"Reunion"
		],
		[ "Iran" ],
		[ "Israel" ],
		[ "Jamaica" ],
		[ "Japan" ],
		[ "Kwajalein" ],
		[ "Libya" ],
		[ "MET" ],
		[
			"Mexico",
			"BajaNorte",
			"BajaSur",
			"General"
		],
		[ "MST" ],
		[ "MST7MDT" ],
		[ "Navajo" ],
		[ "NZ" ],
		[ "NZ-CHAT" ],
		[
			"Pacific",
			"Apia",
			"Auckland",
			"Bougainville",
			"Chatham",
			"Chuuk",
			"Easter",
			"Efate",
			"Enderbury",
			"Fakaofo",
			"Fiji",
			"Funafuti",
			"Galapagos",
			"Gambier",
			"Guadalcanal",
			"Guam",
			"Honolulu",
			"Johnston",
			"Kanton",
			"Kiritimati",
			"Kosrae",
			"Kwajalein",
			"Majuro",
			"Marquesas",
			"Midway",
			"Nauru",
			"Niue",
			"Norfolk",
			"Noumea",
			"Pago_Pago",
			"Palau",
			"Pitcairn",
			"Pohnpei",
			"Ponape",
			"Port_Moresby",
			"Rarotonga",
			"Saipan",
			"Samoa",
			"Tahiti",
			"Tarawa",
			"Tongatapu",
			"Truk",
			"Wake",
			"Wallis",
			"Yap"
		],
		[ "Poland" ],
		[ "Portugal" ],
		[ "PRC" ],
		[ "PST8PDT" ],
		[ "ROC" ],
		[ "ROK" ],
		[ "Singapore" ],
		[ "Turkey" ],
		[ "UCT" ],
		[ "Universal" ],
		[
			"US",
			"Alaska",
			"Aleutian",
			"Arizona",
			"Central",
			"East-Indiana",
			"Eastern",
			"Hawaii",
			"Indiana-Starke",
			"Michigan",
			"Mountain",
			"Pacific",
			"Samoa"
		],
		[ "UTC" ],
		[ "W-SU" ],
		[ "WET" ],
		[ "Zulu" ]
	];

	const timezoneNames = timezoneData.reduce((accumulator, a) => {
		if (a.length === 1) {
			accumulator.push(a[0]);
		} else {
			a.forEach((b, i) => {
				if (i === 0) {
					return;
				}

				accumulator.push(`${a[0]}/${b}`);
			});
		}

		return accumulator;
	}, [ ]);

	return timezone;
})();