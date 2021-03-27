import { list } from '@keystone-next/keystone/schema';
import {
    checkbox, integer, float, password, select, text, timestamp,
} from '@keystone-next/fields';

export const Listing = list({
    access: {
        create: true,
        read: true,
        update: true,
        delete: true,
    },
    fields: {
        address1: text({ isRequired: true }),
        address2: text({ isRequired: true }),
        price: integer({ isRequired: true }),
        sold: checkbox({ defaultValue: false, isRequired: true }),
        description: text({
            isRequired: true,
            ui: {
                displayMode: 'textarea',
            },
        }),
        bedrooms: integer({ isRequired: true }),
        bathrooms: integer({ isRequired: true }),
        yearBuilt: integer({ isRequired: true }),
    },
    ui: {
        listView: {
            initialColumns: ['address1', 'price', 'sold'],
        },
    },
});
