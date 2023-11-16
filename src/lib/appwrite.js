import {Client, Databases, Account} from 'appwrite';

export const client = new Client();

client
	.setEndpoint('https://cloud.appwrite.io/v1')
	.setProject('6536c8646916edc1b8eb');

export const account = new Account(client);
export const databases = new Databases(client);
export {ID} from 'appwrite';
