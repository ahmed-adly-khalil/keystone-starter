import { createAuth } from '@keystone-next/auth';
import { config, createSchema } from '@keystone-next/keystone/schema';
import {
    withItemData,
    statelessSessions,
} from '@keystone-next/keystone/session';
import { permissionsList } from './schemas/fields';
import { Role } from './schemas/Role';
import { Listing } from './schemas/Listing';
import { User } from './schemas/User';
import 'dotenv/config';

function check(name: string) { }

const databaseURL = process.env.DATABASE_URL;

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
        // TODO: Add in inital roles here
    },
    passwordResetLink: {
        async sendToken(args) {
            // send the email
            await sendPasswordResetEmail(args.token, args.identity);
        },
    },
});

export default withAuth(
    config({
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            },
        },
        db: {
            adapter: 'mongoose',
            url: databaseURL,
            async onConnect(keystone) {
                console.log('Connected to the database!');
                if (process.argv.includes('--seed-data')) {
                    await insertSeedData(keystone);
                }
            },
        },
        lists: createSchema({
            // Schema items go in here
            User,
            Role,
            Listing,
        }),

        ui: {
            // Show the UI only for poeple who pass this test
            isAccessAllowed: ({ session }) =>
                // console.log(session);
                !!session?.data,
        },
        session: withItemData(statelessSessions(sessionConfig), {
            // GraphQL Query
            User: `id name email role { ${permissionsList.join(' ')} }`,
        }),
    })
);
