import { configureStore } from '@reduxjs/toolkit';
import { getProfile } from './slice/users';



// redux store
export const store = configureStore({
    reducer: { getProfile }
});

