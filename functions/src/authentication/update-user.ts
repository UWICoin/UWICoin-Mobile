import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Roles } from './roles.models';

// Updates the user auth when user information is writen to the database on first instance
export const updateUser = functions.database.ref('users/{userID}').onWrite(event => {
    const currentData = event.data.current.val();
    const previousData = event.data.previous.val();

    let full_name = null;

    if (previousData === null || currentData.full_name !== previousData.full_name) {
        full_name = currentData.full_name;
    }

    if (full_name) {
        admin.auth().updateUser('${event.params.userID}', {
            displayName: full_name
        }).then(() => {
            console.log('User name update successfull');
        }).catch((error) => {
            console.log('Error');
        });
    }
});