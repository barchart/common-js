const SesProvider = require('./../../../aws/SesProvider');

async function sesProvider_TestSendEmail() {
	const configuration = {
		region: 'us-east-1'
	};

	const sesProvider = new SesProvider(configuration);
	await sesProvider.start();

	const senderAddress = 'luka.sotra@barchart.com';
	const recipientAddress = 'luka.sotra@barchart.com';
	const subject = 'Test Email With Attachment';
	const htmlBody = '<h1>Test</h1><p>This email includes an attachment.</p>';
	const textBody = 'This is a test email with an attachment.';
	const headers = {
		'X-Test-Source': 'SesProvider_TestSendEmail',
		'X-Test-Mode': 'sendEmail'
	};
	const attachments = [
		{
			filename: 'test-attachment.txt',
			content: [
				'This is a test attachment sent from SesProvider_TestSendEmail.js.',
				`Created at: ${new Date().toISOString()}`
			].join('\n'),
			contentType: 'text/plain'
		}
	];

	try {
		await sesProvider.sendEmail(senderAddress, recipientAddress, subject, htmlBody, textBody, attachments, headers);

		console.log('Email sent successfully');
	} catch (error) {
		console.error('Failed to send email', error);
	}
}

sesProvider_TestSendEmail().catch(error => {
	console.error('Error:', error);
});
