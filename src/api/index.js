// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PROD_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL;
if (process.env.NODE_ENV == "development")
    console.log("IN development");
if (process.env.NODE_ENV == "production")
    console.log("IN production");   

console.log("api url is", apiUrl);

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user, expand = 0) {
    console.log('Requesting user fragments data...');
    try {
        if (expand) {
            expand = 1
        }
        const res = await fetch(`${apiUrl}/v1/fragments/?expand=${expand}`, {
            // Generate headers with the proper Authorization bearer token to pass
            headers: user.authorizationHeaders(),
            cache: 'no-store'
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Got user fragments data', { data });
        return data;
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', { err });
    }
}


export async function postUserFragment(user, type, data) {
    console.log("inside the function", data);
    try {
        const response = await fetch(`${apiUrl}/v1/fragments/`, {
            method: 'POST',
            headers: {
                ...user.authorizationHeaders(), // Adding authorization headers from the user object
                'Content-Type': type // Setting the content type from the data object
            },
            body: data // Including the text from the data object as the request body
        });

        if (!response.ok) {
            // If the response status is not okay, throw an error with the status text
            throw new Error(`Failed to post fragment: ${response.statusText}`);
        }

        // Parse and return the response JSON (adjust as needed based on the actual response format)
        return await response.json();
    } catch (error) {
        // Log and re-throw the error
        console.error('Error during postUserFragment operation: ', error);
        throw error;
    }
}


export async function getUserFragmentMetaById(user, id) {
    try {

        const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
            // Generate headers with the proper Authorization bearer token to pass
            headers: {
                ...user.authorizationHeaders(),
                'Content-Type': 'text/plain'
            },
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Got user fragments meta data', { data });
        return data.fragment;
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', { err });
    }
}


export async function getUserFragmentDataById(user, id) {
    try {

        const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            // Generate headers with the proper Authorization bearer token to pass
            headers: {
                ...user.authorizationHeaders(),
                'Content-Type': 'text/plain'
            },
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            console.log('Got user fragments data (JSON)', { data });
            return data;
        } else {
            const textData = await res.text();
            console.log('Got user fragments data (Text)', { textData });
            return textData;
        }
    } catch (err) {
        console.error('Unable to call GET /v1/fragment', { err });
    }
}

export async function updateUserFragment(user, id, typeToConvert, newData) {
    try {
        const response = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            method: 'PUT',
            headers: {
                ...user.authorizationHeaders(), // Adding authorization headers from the user object
                'Content-Type': typeToConvert // Setting the content type from the data object
            },
            body: newData // Including the text from the data object as the request body
        });

        if (!response.ok) {
            // If the response status is not okay, throw an error with the status text
            throw new Error(`Failed to update fragment: ${response.statusText}`);
        }

        // Parse and return the response JSON (adjust as needed based on the actual response format)
        return await response.json();
    }
    catch (error) {
        console.error('Error during updateUserFragment operation: ', error);
    }
}


export async function deleteUserFragment(user, id) {
    try {
        const response = await fetch(`${apiUrl}/v1/fragments/${id}`, {
            method: 'DELETE',
            headers: {
                ...user.authorizationHeaders(), // Adding authorization headers from the user object
                'Content-Type': 'text/plain'
            },
        });

        if (!response.ok) {
            // If the response status is not okay, throw an error with the status text
            throw new Error(`Failed to delete fragment: ${response.statusText}`);
        }

        // Parse and return the response JSON (adjust as needed based on the actual response format)
        return await response.json();
    }
    catch (error) {
        console.error('Error during deleteUserFragment operation: ', error);
    }
}