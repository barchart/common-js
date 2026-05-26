const SesProvider = require('./../../../aws/SesProvider');

async function main() {
    const configuration = {
        region: 'us-east-1'
    };

    const emailToAdd = 'luka.sotra@barchart.com';

    const sesProvider = new SesProvider(configuration);
    await sesProvider.start();

    const suppressedEmails = await sesProvider.getSuppressedItems();
    console.log('Suppressed Emails:', suppressedEmails);

    await sesProvider.addSuppressedItem(emailToAdd);
    console.log('Email added to suppression list:', emailToAdd);

    const suppressedDestination = await sesProvider.getSuppressedItem(emailToAdd);
    console.log('Suppressed Destination:', suppressedDestination);

    await sesProvider.removeSuppressedItem(emailToAdd);
    console.log('Email removed from suppression list:', emailToAdd);
}

main().catch(error => {
    console.error('Error:', error);
});