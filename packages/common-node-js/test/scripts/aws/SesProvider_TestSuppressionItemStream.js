const SesProvider = require('./../../../aws/SesProvider');

const DelegateTransformation = require('./../../../stream/transformations/DelegateTransformation'),
	DelegateWriteStream = require('./../../../stream/DelegateWriteStream'),
	ObjectTransformer = require('./../../../stream/ObjectTransformer');

async function main() {
	const configuration = {
		region: 'us-east-1'
	};

	const sesProvider = new SesProvider(configuration);
	await sesProvider.start();

	return new Promise((resolve, reject) => {
		const counts = { };

		counts.read = 0;

		const reader = sesProvider.getSuppressedItemStream(true);

		const counter = ObjectTransformer.define('Count suppressed items', false)
			.addTransformation(new DelegateTransformation((item) => {
				counts.read = counts.read + 1;

				if (counts.read % 100 === 0) {
					console.log(`Counted [ ${counts.read } ] items`);
				}

				return item;
			}));

		const writer = new DelegateWriteStream((item) => {
			return;
		});

		writer.on('finish', () => {
			console.log(`Stream read complete, [ ${counts.read } ] items`);

			resolve(counts);
		});

		reader
			.pipe(counter)
			.pipe(processor)
			.pipe(writer);
	});
}

main().catch(error => {
	console.error('Error:', error);
});