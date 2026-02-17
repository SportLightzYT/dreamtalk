const sdk = require('node-appwrite');

module.exports = async function (context) {
    const user = context.req.body;

    if (!user || !user.$id) {
        context.log("Executing without user body (Testing mode)");
        return context.res.json({ message: "Hello! Body is empty, but function is alive." });
    }

    const client = new sdk.Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_FUNCTION_API_KEY);

    const databases = new sdk.Databases(client);

    try {
        await databases.createDocument(
            '69802ff4003bce776657', //
            'users',
            user.$id,
            {
                userId: user.$id,
                username: user.email ? user.email.split('@')[0] : 'user',
                email: user.email || '',
                firstName: user.name || '',
                lastName: '',
                dateOfBirth: null
            }
        );
        context.log("Success: Profile created!");
        return context.res.json({ status: "success" });
    } catch (err) {
        context.error("Error: " + err.message);
        return context.res.json({ error: err.message }, 500);
    }
};